// /routes/(admin)/admin/courses/create/+page.server.js
import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const actions = {

    // 2-bosqich: Modul yaratish
    createModule: async ({ request, fetch, params, cookies }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        };
        
        const modulePayload = {
            title_uz: formData.get('title_uz'),
            title_ru: formData.get('title_ru'),
            description_uz: formData.get('description_uz') || '',
            description_ru: formData.get('description_ru') || '',
            order: Number(formData.get('order_index')) || 0
        }

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(modulePayload)
            });

            if (!response.ok) return fail(400, { error: "Modulni saqlashda xatolik yuz berdi." });

            const result = await response.json();
            // console.log('Yaratilgan modul:', result);

            return { success: true, module: result };
        } catch (err) {
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }
    }
};