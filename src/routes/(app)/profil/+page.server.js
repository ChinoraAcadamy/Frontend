import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';
import * as m from '$lib/paraglide/messages.js';
import { translateServerMessage } from '$lib/utils/server-messages.js';
import { fetchWithCache, generateCacheKey, invalidateCache } from '@/lib/server/cache.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies, fetch, locals }) => {
	const token = cookies.get('access_token');
	const user = locals.user;

	try {
		const fetchProfile = async () => {
			const res = await fetch(`${API_URL}/auth/students/me/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Accept-Language': getLocale()
				}
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw error(res.status, translateServerMessage(errData, m));
			}
			return await res.json();
		};

		const fetchDevices = async () => {
			const res = await fetch(`${API_URL}/auth/devices/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Accept-Language': getLocale()
				}
			});
			const data = await res.json().catch(() => ({ results: [] }));
			return data.results || [];
		};

		const [profile, devices] = await Promise.all([
			fetchWithCache(generateCacheKey('student_profile', user.id), fetchProfile),
			fetchWithCache(generateCacheKey('student_devices', user.id), fetchDevices)
		]);

		return { profile, devices };
	} catch (err) {
		console.error('[Profile Load] Error:', err);
		if (err.status) throw err;
		throw error(500, m.error_occurred ? m.error_occurred() : 'Xatolik yuz berdi');
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	logoutDevice: async ({ request, cookies, fetch }) => {
		const token = cookies.get('access_token');
		if (!token)
			return {
				success: false,
				error: m.err_auth_required ? m.err_auth_required() : 'Avtorizatsiya talab qilinadi'
			};

		const formData = await request.formData();
		const sessionId = formData.get('session_id');

		try {
			const res = await fetch(`${API_URL}/auth/logout-device/`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
					'Accept-Language': getLocale()
				},
				body: JSON.stringify({ session_id: sessionId })
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				return {
					success: false,
					error:
						translateServerMessage(errData, m) ||
						(m.profile_device_logout_error ? m.profile_device_logout_error() : 'Xatolik yuz berdi')
				};
			}

			invalidateCache();

			return {
				success: true,
				message: m.profile_device_logout_success
					? m.profile_device_logout_success()
					: "Qurilma o'chirildi"
			};
		} catch (err) {
			console.error('[Device Logout] Error:', err);
			return {
				success: false,
				error: m.error_occurred ? m.error_occurred() : 'Server bilan ulanishda xatolik.'
			};
		}
	},
	updateProfile: async ({ request, cookies, fetch }) => {
		const token = cookies.get('access_token');
		if (!token)
			return {
				success: false,
				error: m.err_auth_required ? m.err_auth_required() : 'Avtorizatsiya talab qilinadi'
			};

		const formData = await request.formData();
		const data = {
			first_name: formData.get('first_name') || '',
			last_name: formData.get('last_name') || '',
			phone_number: formData.get('phone_number') || ''
		};

		try {
			const res = await fetch(`${API_URL}/auth/profile/`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
					'Accept-Language': getLocale()
				},
				body: JSON.stringify(data)
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				return { success: false, error: translateServerMessage(errData, m) };
			}

			const updatedProfile = await res.json();

			// ✅ Yangi: Profilni to'liq qaytadan yuklaymiz (fresh fetch)
			// Bu sessionda role va boshqa ma'lumotlarni yo'qotib qo'ymaslik uchun muhim
			const profileRes = await fetch(`${API_URL}/auth/profile/`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			const fullUserData = profileRes.ok ? await profileRes.json() : updatedProfile;

			// ✅ user_data kuki-ni to'liq ma'lumot bilan yangilaymiz, shunda header/sidebar ham o'zgaradi
			cookies.set('user_data', JSON.stringify(fullUserData), {
				path: '/',
				httpOnly: false,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 20 // 20 minut
			});

			invalidateCache();

			return { success: true, profile: fullUserData };
		} catch (err) {
			console.error('[Profile Update] Error:', err);
			return {
				success: false,
				error: m.error_occurred ? m.error_occurred() : 'Server bilan ulanishda xatolik.'
			};
		}
	}
};
