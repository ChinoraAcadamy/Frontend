import { API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

// load course id from params and get course modules
export const load = async ({ parent, params }) => {
    const { modules } = await parent();

    if (!modules || modules.length === 0) {
        throw redirect(303, `/admin/courses/create/${params.course_id}`);
    }
    return { modules };
};

export const actions = {
    createLesson: async ({ fetch, cookies, request, params }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) throw redirect(303, "/login");

        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const formData = await request.formData();

        const video = formData.get('video_url');
        if (video instanceof File && video.size === 0) {
            formData.delete('video');
        }

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${formData.get('module_pk')}/lessons/`, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.log(`Error: ${errData}`);
                console.log(`Error: ${errData.title}`);
                console.log(`Error: ${errData.detail}`);
                console.log(`Response ${await response.text()}`)
                return fail(400, {
                    error: errData.title?.[0] || errData.detail || "Modulni saqlashda xatolik yuz berdi"
                });
            }

            const result = await response.json();

            return { success: true, lesson: result };
        } catch (err) {
            console.log(err);
            return fail(500, { error: "Server bilan bog'lanishda xatolik" });
        }
    }
}