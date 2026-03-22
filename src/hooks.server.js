import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { API_URL } from '$env/static/private';

/** @type {import('@sveltejs/kit').Handle} */
async function authHandle({ event, resolve }) {
	const accessToken = event.cookies.get('access_token');

	// Token yo'q — anonim foydalanuvchi
	if (!accessToken) {
		event.locals.isAuthenticated = false;
		event.locals.user = null;
		return resolve(event);
	}

	try {
		// JWT payload decode (verify emas — API o'zi hal qiladi)
		const payload = JSON.parse(atob(accessToken.split('.')[1]));
		const isExpired = payload.exp * 1000 < Date.now();

		let validToken = accessToken;

		// Token muddati o'tgan — refresh qilamiz
		if (isExpired) {
			const refreshToken = event.cookies.get('refresh_token');

			if (!refreshToken) {
				clearAuthCookies(event.cookies);
				event.locals.isAuthenticated = false;
				event.locals.user = null;
				return resolve(event);
			}

			const refreshRes = await fetch(`${API_URL}/auth/token/refresh/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'ngrok-skip-browser-warning': 'true'
				},
				body: JSON.stringify({ refresh: refreshToken })
			});

			if (!refreshRes.ok) {
				clearAuthCookies(event.cookies);
				event.locals.isAuthenticated = false;
				event.locals.user = null;
				return resolve(event);
			}

			const refreshData = await refreshRes.json();
			validToken = refreshData.access;

			// Yangi access tokenni saqlaymiz
			event.cookies.set('access_token', validToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 // 1 kun
			});
		}

		// ✅ Har request'da /auth/profile/ dan user ma'lumotini olamiz
		// Cookie'da saqlashdan yaxshiroq: har doim fresh, role o'zgarsa darhol aks etadi
		const profileRes = await fetch(`${API_URL}/auth/profile/`, {
			headers: {
				'Authorization': `Bearer ${validToken}`,
				'ngrok-skip-browser-warning': 'true'
			}
		});

		if (!profileRes.ok) {
			// Token invalid (masalan, server tomonida revoke qilingan)
			clearAuthCookies(event.cookies);
			event.locals.isAuthenticated = false;
			event.locals.user = null;
			return resolve(event);
		}

		const user = await profileRes.json();
		event.locals.isAuthenticated = true;
		event.locals.user = user;

	} catch (e) {
		// Network xato, JSON parse xato — foydalanuvchini chiqarmay, token bor deb qabul qilamiz
		// Lekin user null bo'ladi
		console.error('[auth hook] Xatolik:', e);
		event.locals.isAuthenticated = !!event.cookies.get('access_token');
		event.locals.user = null;
	}

	return resolve(event);
}

/** Cookie'larni tozalash yordamchi funksiyasi */
function clearAuthCookies(cookies) {
	const opts = { path: '/' };
	cookies.delete('access_token', opts);
	cookies.delete('refresh_token', opts);
	cookies.delete('session_token', opts);
	cookies.delete('user_data', opts); // eski cookie bo'lsa tozalaymiz
}

/** @type {import('@sveltejs/kit').Handle} */
const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

export const handle = sequence(authHandle, handleParaglide);