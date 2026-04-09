import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const load = async ({ url, params }) => {
    const moduleId = url.searchParams.get('module_id');
    if (!moduleId) {
        throw redirect(303, `/admin/courses/${params.course_id}`);
    }
    return { moduleId };
};

export const actions = {
    createAssignment: async ({ request, fetch, cookies, params }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return redirect(302, '/login');

        const formData = await request.formData();
        const moduleId = formData.get('module_pk');

        const payload = {
            title_uz: formData.get('title_uz'),
            title_ru: formData.get('title_ru'),
            description_uz: formData.get('description_uz') || '',
            description_ru: formData.get('description_ru') || '',
            type: formData.get('type').toString().toLowerCase() || 'file',  // The enum from UI
            max_attempts: Number(formData.get('max_attempts')) || 1
        };

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/lessons/${params.lesson_id}/assignments/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server javobi:', errorText);
                return fail(400, { error: "Topshiriqni saqlashda xatolik yuz berdi." });
            }

            // await response.json();
        } catch (err) {
            console.error(err);
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }

        return { success: true };
    },
};
