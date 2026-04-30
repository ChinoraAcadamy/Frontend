import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { invalidateCache } from '@/lib/server/cache.js';

export const load = async ({ cookies }) => {
    return {
        accessToken: cookies.get('access_token'),
        apiUrl: API_URL
    };
};

export const actions = {
    createCourse: async ({ request, fetch, cookies }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const img = formData.get('img');
        if (img instanceof File && img.size === 0) formData.delete('img');

        try {
            const response = await fetch(`${API_URL}/courses/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                return fail(400, { error: "Kursni saqlashda xatolik yuz berdi." });
            }

            const result = await response.json();
            invalidateCache('admin_');
            return { success: true, courseId: result.id, title_uz: result.title_uz };
        } catch (err) {
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }
    },
    createModule: async ({ request, fetch, cookies }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const courseId = formData.get('course_pk'); // Formdan keladi
        
        const modulePayload = {
            title_uz: formData.get('title_uz'),
            title_ru: formData.get('title_ru'),
            description_uz: formData.get('description_uz') || '',
            description_ru: formData.get('description_ru') || '',
            order: Number(formData.get('order_index')) || 0
        }

        try {
            const response = await fetch(`${API_URL}/courses/${courseId}/modules/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(modulePayload)
            });

            if (!response.ok) return fail(400, { error: "Modulni saqlashda xatolik yuz berdi." });

            const result = await response.json();
            invalidateCache('admin_');
            return { success: true, module: result };
        } catch (err) {
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }
    },
    createLesson: async ({ fetch, cookies, request }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const courseId = formData.get('course_id');
        const moduleId = formData.get('module_pk');
        
        const video = formData.get('video_url');
        if (video instanceof File && video.size === 0) formData.delete('video_url');

        try {
            const response = await fetch(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: formData
            });

            if (!response.ok) {
                let errData = await response.json().catch(() => ({}));
                return fail(400, { error: errData.title?.[0] || errData.detail || "Darsni saqlashda xatolik yuz berdi" });
            }

            const result = await response.json();
            invalidateCache('admin_');
            return { success: true, lesson: result };
        } catch (err) {
            return fail(500, { error: "Server bilan bog'lanishda xatolik" });
        }
    }
};
