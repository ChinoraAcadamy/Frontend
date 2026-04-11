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

        // Prepare FormData for the backend API to support file uploads
        const apiFormData = new FormData();
        apiFormData.append('title_uz', formData.get('title_uz') || '');
        apiFormData.append('title_ru', formData.get('title_ru') || '');
        apiFormData.append('description_uz', formData.get('description_uz') || '');
        apiFormData.append('description_ru', formData.get('description_ru') || '');
        apiFormData.append('type', type);
        apiFormData.append('max_attempts', formData.get('max_attempts') || '1');

        // Add dynamic content based on type
        if (type === 'file') {
            const file = formData.get('file');
            if (file && file instanceof File && file.size > 0) {
                apiFormData.append('file', file);
            }
        } else if (type === 'text') {
            apiFormData.append('content_text', formData.get('content_text') || '');
        } else if (type === 'link') {
            apiFormData.append('content_link', formData.get('content_link') || '');
        }

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/lessons/${params.lesson_id}/assignments/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                    // Do NOT set Content-Type, fetch will set it with the correct boundary for FormData
                },
                body: apiFormData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Server error response:', errorData);
                const errorMessage = errorData.detail || Object.values(errorData).flat().join(' ') || "Topshiriqni saqlashda xatolik yuz berdi.";
                return fail(400, { error: errorMessage });
            }

            return { success: true };
        } catch (err) {
            console.error('Fetch error:', err);
            return fail(500, { error: "Server bilan ulanishda xatolik yuz berdi." });
        }
    },
};
