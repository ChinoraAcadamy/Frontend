import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

import { API_URL } from '$env/static/private';

/** @type {import('@sveltejs/kit').Handle} */
async function originalHandle({ event, resolve }) {
	// src/hooks.server.js
	const accessToken = event.cookies.get('access_token');

	if (!accessToken) {
		event.locals.isAuthenticated = false;
		event.locals.user = null;
		return resolve(event);
	}

	// Token bor — foydalanuvchini tekshiramiz
	// Oddiy decode (verify emas, server tomonida API ishonchli)
	try {
		// JWT payload'ni decode qilamiz (verify qilmaymiz, API o'zi hal qiladi)
		const payload = JSON.parse(atob(accessToken.split('.')[1]));
		const isExpired = payload.exp * 1000 < Date.now();

		if (isExpired) {
			// Access token muddati o'tgan — refresh qilamiz
			const refreshToken = event.cookies.get('refresh_token');
			if (!refreshToken) {
				event.locals.isAuthenticated = false;
				event.locals.user = null;
				return resolve(event);
			}

			const res = await fetch(`${API_URL}/auth/token/refresh/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh: refreshToken })
			});

			if (!res.ok) {
				// Refresh ham ishlamadi — cookielarni tozalaymiz
				event.cookies.delete('access_token', { path: '/' });
				event.cookies.delete('refresh_token', { path: '/' });
				event.cookies.delete('session_token', { path: '/' });
				event.locals.isAuthenticated = false;
				event.locals.user = null;
				return resolve(event);
			}

			const data = await res.json();
			// Yangi access tokenni saqlaymiz
			event.cookies.set('access_token', data.access, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 // 1 kun
			});
		}

		// User ma'lumotini locals'ga yuklaymiz
		const savedUser = event.cookies.get('user_data');
		event.locals.isAuthenticated = true;
		event.locals.user = savedUser ? JSON.parse(savedUser) : null;

	} catch (e) {
		event.locals.isAuthenticated = false;
		event.locals.user = null;
		console.error('Tokenni tekshirishda xatolik:', e);
	}

	return resolve(event);
};

/** @type {import('@sveltejs/kit').Handle} */ const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

export const handle = sequence(originalHandle, handleParaglide);