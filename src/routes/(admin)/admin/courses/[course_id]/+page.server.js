import { API_URL } from "$env/static/private";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ parent }) => {
    const { modules } = await parent();

    return { modules };
};

export const actions = {
    deleteCourse: async ({ params, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!response.ok) return fail(400, { error: "Kursni o'chirishda xatolik yuz berdi." });
        } catch (err) {
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }

        throw redirect(303, `/admin/courses?deleted_course=${params.course_id}`);
    },

    updateCourse: async ({ request, params, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const rawFormData = await request.formData();
        const cleanFormData = new FormData();

        for (const [key, value] of rawFormData.entries()) {
            if (key === 'img') {
                // Rasm yuborilganini tekshirish (agar bo'sh bo'lsa yoki fayl bo'lmasa e'tibor bermaydi, joriy rasm o'zgarmas qoladi)
                if (value instanceof File && value.size > 0) {
                    cleanFormData.append(key, value);
                }
            } else if (['duration', 'price', 'old_price'].includes(key)) {
                // Raqamli maydonlar bo'sh qolsa ularni ignore qilamiz, backend'ga noto'g'ri string bormasligi uchun
                if (value && value.toString().trim() !== '') {
                    cleanFormData.append(key, value);
                }
            } else if (key === 'is_published') {
                cleanFormData.append(key, value === 'true' ? 'true' : 'false');
            } else {
                cleanFormData.append(key, value);
            }
        }

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                    // 'Content-Type' yo'q qilinadi, chunki formData avtomat qo'shadi (multipart/form-data; boundary=...)
                },
                body: cleanFormData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return fail(400, { error: errorData.detail || "Kursni yangilashda xatolik yuz berdi." });
            }
        } catch (err) {
            return fail(500, { error: `Server bilan ulanishda xatolik | ${err}` });
        }

        return { success: true };
    },

    deleteModule: async ({ request, params, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const moduleId = formData.get('module_id');

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!response.ok) return fail(400, { error: "Modulni o'chirishda xatolik yuz berdi." });
        } catch (err) {
            return fail(500, { error: `Server bilan ulanishda xatolik | ${err}` });
        }
        
        return { success: true };
    },

    editModule: async ({ request, params, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const moduleId = formData.get('module_pk');
        
        const modulePayload = {
            title_uz: formData.get('title_uz'),
            title_ru: formData.get('title_ru'),
            description_uz: formData.get('description_uz') || '',
            description_ru: formData.get('description_ru') || '',
            order: Number(formData.get('order_index')) || 0
        };

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(modulePayload)
            });

            if (!response.ok) return fail(400, { error: "Modulni tahrirlashda xatolik yuz berdi." });
        } catch (err) {
            return fail(500, { error: `Server bilan ulanishda xatolik | ${err}` });
        }

        return { success: true };
    },

    deleteLesson: async ({ request, params, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const moduleId = formData.get('module_id');
        const lessonId = formData.get('lesson_id');

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/lessons/${lessonId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!response.ok) return fail(400, { error: "Darsni o'chirishda xatolik yuz berdi." });
        } catch (err) {
            return fail(500, { error: `Server bilan ulanishda xatolik | ${err}` });
        }

        return { success: true };
    }
};