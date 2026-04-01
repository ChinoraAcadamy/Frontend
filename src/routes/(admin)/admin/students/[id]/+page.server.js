// src/routes/(admin)/admin/students/[id]/+page.server.js
import { API_URL } from '$env/static/private';
import { error, fail } from '@sveltejs/kit';

const HEADERS = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'   // ← barcha requestlarda bo'lishi kerak
});

export const load = async ({ fetch, params, cookies }) => {
    const accessToken = cookies.get('access_token');

    const res = await fetch(`${API_URL}/auth/students/${params.id}/`, {
        headers: HEADERS(accessToken)
    });

    if (!res.ok) {
        // json() o'rniga text() — HTML kelsa ham crash bo'lmaydi
        const body = await res.text();
        console.error(`[student/${params.id}] ${res.status}:`, body.slice(0, 200));

        if (res.status === 404) throw error(404, "Student topilmadi");
        if (res.status === 401) throw error(401, "Unauthorized");
        throw error(res.status, "Serverda xatolik");
    }

    const data = await res.json();
    return { student: data };
};

export const actions = {
    changePassword: async ({ request, params, cookies, fetch }) => {
        const formData = await request.formData();
        const new_password     = formData.get('new_password');
        const confirm_password = formData.get('confirm_password');
        const accessToken      = cookies.get('access_token');

        if (new_password !== confirm_password) {
            return fail(400, { error: "Parollar mos tushmadi" });
        }
        if (new_password.toString().length < 8) {
            return fail(400, { error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" });
        }

        const res = await fetch(`${API_URL}/auth/students/${params.id}/change-password/`, {
            method: 'PATCH',
            headers: HEADERS(accessToken),
            body: JSON.stringify({ new_password, confirm_password })
        });

        if (!res.ok) {
            const body = await res.text();
            let message = "Parolni o'zgartirishda xatolik";
            try {
                const err = JSON.parse(body);
                message = err.detail || err.message || Object.values(err).flat().join(' ') || message;
            } catch {}
            return fail(res.status, { error: message });
        }

        return { success: true };
    }
};