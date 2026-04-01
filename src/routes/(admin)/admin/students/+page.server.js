// src/routes/(admin)/dashboard/admin/students/+page.server.js
import { API_URL } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const load = async ({ parent }) => {
    const { students, totalCount, nextPage, prevPage, currentPage, filters } = await parent();
    return { students, totalCount, nextPage, prevPage, currentPage, filters };
};

export const actions = {
    createStudent: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const data = await request.formData();

        const payload = {
            first_name: data.get('firstName') || '',
            last_name:  data.get('lastName')  || '',
            username:   data.get('username')  || '',
            password:   data.get('password')  || '',
            phone_number:      data.get('phone_number')     || '',
            course_ids:     data.getAll('courseIds[]').map(Number)
        };

        // console.log(data.getAll('courseIds[]').map(Number))

        if (!payload.first_name) return fail(400, { createError: "Ism majburiy maydon." });
        if (!payload.username)   return fail(400, { createError: "Username majburiy maydon." });

        const res = await fetch(`${API_URL}/auth/students/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const errorMsg = Object.values(err).flat().join(' ') || "Student yaratishda xatolik.";
            return fail(res.status, { createError: errorMsg });
        }

        return { createSuccess: true };
    },

    updateStudent: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const data = await request.formData();

        const studentId = data.get('studentId');
        if (!studentId) return fail(400, { updateError: "Student ID topilmadi." });

        // Faqat API qabul qiladigan maydonlar: first_name, last_name, phone_number, is_active
        const payload = {};
        const firstName   = data.get('firstName');
        const lastName    = data.get('lastName');
        const phoneNumber = data.get('phoneNumber');
        const isActive    = data.get('isActive');

        if (firstName   !== null) payload.first_name    = firstName;
        if (lastName    !== null) payload.last_name     = lastName;
        if (phoneNumber !== null) payload.phone_number  = phoneNumber;
        if (isActive    !== null) payload.is_active     = isActive === 'true';

        const res = await fetch(`${API_URL}/auth/students/${studentId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const errorMsg = Object.values(err).flat().join(' ') || "O'zgartirishda xatolik.";
            return fail(res.status, { updateError: errorMsg });
        }

        return { updateSuccess: true };
    },

    deleteStudent: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const data = await request.formData();
        const studentId = data.get('studentId');

        if (!studentId) return fail(400, { deleteError: "Student ID topilmadi." });

        const res = await fetch(`${API_URL}/auth/students/${studentId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!res.ok && res.status !== 204) {
            return fail(res.status, { deleteError: "O'chirishda xatolik yuz berdi." });
        }

        return { deleteSuccess: true };
    }
};
