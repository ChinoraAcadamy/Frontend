// src/routes/(admin)/admin/students/[id]/+page.server.js
import { API_URL } from '$env/static/private';
import { error, fail } from '@sveltejs/kit';

const HEADERS = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
});

export const load = async ({ fetch, params, cookies }) => {
    const accessToken = cookies.get('access_token');

    const res = await fetch(`${API_URL}/auth/students/${params.id}/`, {
        headers: HEADERS(accessToken)
    });

    if (!res.ok) {
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
    // Parol o'zgartirish
    changePassword: async ({ request, params, cookies, fetch }) => {
        const formData     = await request.formData();
        const new_password     = formData.get('new_password');
        const confirm_password = formData.get('confirm_password');
        const accessToken      = cookies.get('access_token');

        if (new_password !== confirm_password)
            return fail(400, { passwordError: "Parollar mos tushmadi" });
        if (new_password.toString().length < 8)
            return fail(400, { passwordError: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" });

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
            return fail(res.status, { passwordError: message });
        }

        return { passwordSuccess: true };
    },

    // Kursdan o'chirish: DELETE /enrollments/{enrollment_id}/
    removeEnrollment: async ({ request, cookies, fetch }) => {
        const formData     = await request.formData();
        const enrollmentId = formData.get('enrollmentId');
        const accessToken  = cookies.get('access_token');

        if (!enrollmentId) return fail(400, { enrollError: "Enrollment ID topilmadi" });

        const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/`, {
            method: 'DELETE',
            headers: HEADERS(accessToken)
        });

        // 204 No Content — muvaffaqiyatli
        if (!res.ok && res.status !== 204) {
            return fail(res.status, { enrollError: "Kursdan o'chirishda xatolik" });
        }

        return { removeSuccess: true };
    },

    // Kursni bloklash: PATCH /enrollments/{enrollment_id}/block/
    blockEnrollment: async ({ request, cookies, fetch }) => {
        const formData     = await request.formData();
        const enrollmentId = formData.get('enrollmentId');
        const accessToken  = cookies.get('access_token');

        if (!enrollmentId) return fail(400, { enrollError: "Enrollment ID topilmadi" });

        const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/block/`, {
            method: 'PATCH',
            headers: HEADERS(accessToken)
        });
        console.log(await res.json())



        if (!res.ok) {
            return fail(res.status, { enrollError: "Bloklashda xatolik" });
        }

        return { blockSuccess: true };
    },

    // Kursni blokdan chiqarish: PATCH /enrollments/{enrollment_id}/unblock/
    unblockEnrollment: async ({ request, cookies, fetch }) => {
        const formData     = await request.formData();
        const enrollmentId = formData.get('enrollmentId');
        const accessToken  = cookies.get('access_token');

        if (!enrollmentId) return fail(400, { enrollError: "Enrollment ID topilmadi" });
        console.log(enrollmentId)

        const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/unblock/`, {
            method: 'PATCH',
            headers: HEADERS(accessToken)
        });

        console.log(await res.json())

        if (!res.ok) {
            return fail(res.status, { enrollError: "Blokdan chiqarishda xatolik" });
        }


        return { unblockSuccess: true };
    }
};
