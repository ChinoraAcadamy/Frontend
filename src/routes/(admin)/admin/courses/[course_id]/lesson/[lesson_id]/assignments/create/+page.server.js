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
        const type = formData.get('type')?.toString().toLowerCase() || 'file';

        // Prepare JSON payload for the backend API
        const payload = {
            title_uz: formData.get('title_uz') || '',
            title_ru: formData.get('title_ru') || '',
            description_uz: formData.get('description_uz') || '',
            description_ru: formData.get('description_ru') || '',
            type: type,
            max_attempts: Number(formData.get('max_attempts') || 1),
            max_score: Number(formData.get('max_score') || 10)
        };

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/lessons/${params.lesson_id}/assignments/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error('Server error response:', data);
                const errorMessage = data.detail || Object.values(data).flat().join(' ') || "Topshiriqni saqlashda xatolik yuz berdi.";
                return fail(400, { error: errorMessage });
            }

            return { success: true };
        } catch (err) {
            console.error('Fetch error:', err);
            return fail(500, { error: "Server bilan ulanishda xatolik yuz berdi." });
        }
    },
};
