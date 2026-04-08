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
		// JWT payload decode safely
		let payload;
		try {
			payload = JSON.parse(atob(accessToken.split('.')[1]));
		} catch (e) {
			console.error('[auth hook] Token decode xatosi:', e);
			clearAuthCookies(event.cookies);
			event.locals.isAuthenticated = false;
			event.locals.user = null;
			return resolve(event);
		}

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
				headers: { 'Content-Type': 'application/json' },
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

		// ✅ Optimallashtirilgan foydalanuvchi ma'lumotlarini olish
		// Har request'da API'ga bormaymiz, kuki'dan olamiz
		let user = null;
		const userDataCookie = event.cookies.get('user_data');

		if (userDataCookie) {
			try {
				user = JSON.parse(userDataCookie);
			} catch {
				user = null;
			}
		}

		// Kuki yo'q bo'lsa yoki token yangilangan bo'lsa (yoki 20 minut o'tgan bo'lsa kuki o'zi o'chadi)
		if (!user || isExpired) {
			const profileRes = await fetch(`${API_URL}/auth/profile/`, {
				headers: { 'Authorization': `Bearer ${validToken}` }
			});

			if (profileRes.ok) {
				user = await profileRes.json();
				// Foydalanuvchi ma'lumotlarini 20 minutga saqlaymiz
				event.cookies.set('user_data', JSON.stringify(user), {
					path: '/',
					httpOnly: false, // frontend o'qishi uchun
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 20 // 20 minut
				});
			} else if (profileRes.status === 401) {
				clearAuthCookies(event.cookies);
				event.locals.isAuthenticated = false;
				event.locals.user = null;
				return resolve(event);
			}
		}

		event.locals.isAuthenticated = !!user;
		event.locals.user = user;

	} catch {
		console.error('[auth hook] Xatolik');
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
	cookies.delete('user_data', opts);
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