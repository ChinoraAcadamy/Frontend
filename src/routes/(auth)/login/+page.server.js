// @ts-nocheck
// src/routes/(auth)/login/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import * as m from '$lib/paraglide/messages.js';
import { translateServerMessage } from '$lib/utils/server-messages.js';

export const load = async ({ locals }) => {
    if (locals.isAuthenticated && locals.user) {
        if (locals.user.role === 'admin' || locals.user.role === 'superadmin') {
            throw redirect(302, '/admin/dashboard');
        } else {
            throw redirect(302, '/dashboard');
        }
    }
    return {};
};

export const actions = {
    login: async ({ request, cookies, fetch }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            return fail(400, { error: m.login_error_required ? m.login_error_required() : "Username va parolni to'ldiring." });
        }

        let result;
        try {
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    username, 
                    password,
                    device_name: formData.get('device_name') || 'Unknown Device'
                })
            });

            result = await response.json();

            if (!response.ok) {
                return fail(response.status, {
                    error: translateServerMessage(result, m)
                });
            }
        } catch (err) {
            console.error('API xatosi:', err);
            return fail(500, { error: m.error_occurred ? m.error_occurred() : "Server bilan ulanishda xatolik." });
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

        // User ma'lumotlari — 20 minut kesh (freshness uchun)
        cookies.set('user_data', JSON.stringify(result.user), {
            ...cookieOptions,
            httpOnly: false, // navbar va boshqa componentlar o'qishi uchun
            maxAge: 60 * 20 // 20 minut
        });

        if (result.user.role === 'admin' || result.user.role === 'superadmin') {
            throw redirect(302, '/admin/dashboard');
        } else {
            throw redirect(302, '/dashboard');
        }
    }
};