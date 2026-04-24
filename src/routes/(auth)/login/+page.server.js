// @ts-nocheck
// src/routes/(auth)/login/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import * as m from '$lib/paraglide/messages.js';
import { translateServerMessage } from '$lib/utils/server-messages.js';
import DeviceDetector from 'device-detector-js';
import { getFriendlyDeviceName } from '$lib/utils/device-names.js';

const detector = new DeviceDetector();

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
            return fail(400, {
                error: m.login_error_required ? m.login_error_required() : "Username va parolni to'ldiring."
            });
        }

        const clientDeviceName = formData.get('device_name');

        let result;
        try {
            const ua = request.headers.get('user-agent') || '';
            const detection = detector.parse(ua);

            // Build a smart, dynamic name
            const deviceType = detection.device?.type || 'desktop';
            const osName = detection.os?.name || '';
            const clientName = detection.client?.name || '';
            
            let finalDeviceName = '';

            if (deviceType === 'desktop') {
                // For PCs, we show OS and Browser (e.g., "Windows PC (Chrome)")
                finalDeviceName = `${osName} PC (${clientName})`;
            } else {
                // Build a default name from server-side detection
                const serverDetectedName = [
                    detection.device?.vendor,
                    detection.device?.model,
                    detection.os?.name ? `${detection.os.name} ${detection.os.version || ''}` : null,
                    detection.client?.name
                ].filter(Boolean).join(', ') || 'Unknown Device';

                // For Mobile/Tablets, we prefer the client-sent model name if available
                let modelName = serverDetectedName;
                if (
                    clientDeviceName &&
                    typeof clientDeviceName === 'string' &&
                    clientDeviceName.trim() !== '' &&
                    !clientDeviceName.includes('Mozilla/')
                ) {
                    modelName = getFriendlyDeviceName(clientDeviceName, detection.device?.vendor);
                }

                if (deviceType === 'tablet') {
                    finalDeviceName = `${modelName} (Tablet)`;
                } else {
                    finalDeviceName = modelName;
                }
            }

            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    device_name: finalDeviceName
                })
            });

            result = await response.json();

            if (!response.ok) {
                // Handle device limit error using the new API format
                if (result.code?.includes('device_limit_exceeded') || response.status === 403) {
                    // Normalize devices: backend might send "True"/"False" strings
                    // Also, since we are NOT logged in yet, NO device should be "current"
                    const devices = (result.devices || []).map(d => ({
                        ...d,
                        is_current: false // This device is not logged in yet
                    }));

                    return fail(response.status, {
                        error: m.login_error_device_limit ? m.login_error_device_limit() : "Siz bir vaqtning o'zida faqat 2 ta qurilmada tizimga kirishingiz mumkin.",
                        devices,
                        username,
                        password,
                        isLimitError: true
                    });
                }

                return fail(response.status, {
                    error: translateServerMessage(result, m)
                });
            }
        } catch (err) {
            console.error('API xatosi:', err);
            return fail(500, {
                error: m.error_occurred ? m.error_occurred() : 'Server bilan ulanishda xatolik.'
            });
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
    },
    logoutDevice: async ({ request, fetch }) => {
        const formData = await request.formData();
        const sessionId = formData.get('session_id');
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const res = await fetch(`${API_URL}/auth/logout-device/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    username,
                    password
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                return fail(400, {
                    error: errData.detail || "Qurilmani o'chirishda xatolik yuz berdi."
                });
            }

            return {
                success: true,
                message: "Qurilma o'chirildi. Endi kirishingiz mumkin."
            };
        } catch (err) {
            console.error('[Login Device Logout] Error:', err);
            return fail(500, { error: 'Server bilan ulanishda xatolik.' });
        }
    }
};