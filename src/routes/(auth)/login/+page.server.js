// @ts-nocheck
// src/routes/(auth)/login/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const actions = {
    login: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            return fail(400, { error: "Username va parolni to'ldiring." });
        }

        let result;
        try {
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // ngrok warning page'ni o'tkazib yuborish uchun
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ username, password })
            });

            result = await response.json();

            if (!response.ok) {
                return fail(response.status, {
                    error: result?.detail || result?.message || "Username yoki parol noto'g'ri."
                });
            }
        } catch (err) {
            console.error('API xatosi:', err);
            return fail(500, { error: "Server bilan ulanishda xatolik." });
        }

        const cookieOptions = {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        };

        // Access token — qisqa muddatli (1 kun)
        cookies.set('access_token', result.access, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24
        });

        // Refresh token — uzun muddatli (7 kun)
        cookies.set('refresh_token', result.refresh, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 7
        });

        // Session token
        cookies.set('session_token', result.session_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 7
        });

        // User ma'lumotlari — httpOnly EMAS (frontend o'qishi kerak bo'lishi mumkin)
        // Lekin sensitive emas, shuning uchun JSON sifatida saqlaymiz
        cookies.set('user_data', JSON.stringify(result.user), {
            ...cookieOptions,
            httpOnly: false, // navbar va boshqa componentlar o'qishi uchun
            maxAge: 60 * 60 * 24 * 7
        });

        if (result.user.role === 'admin' || result.user.role === 'superadmin') {
            throw redirect(302, '/admin/dashboard');
        } else {
            redirect(302, '/dashboard');
        }
    }
};