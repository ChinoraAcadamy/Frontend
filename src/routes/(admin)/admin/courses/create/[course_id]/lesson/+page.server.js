import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

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
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const formData = await request.formData();

        const lessonPayload = {
            title_uz: formData.get('title_uz'),
            title_ru: formData.get('title_ru'),
            description_uz: formData.get('description_uz') || '',
            description_ru: formData.get('description_ru') || '',
            duration: Number(formData.get('duration')) || 0,
            order_index: Number(formData.get('order_index')) || 0,
            video_url: null
        }
        try {
            console.log(lessonPayload, `${API_URL}/courses/${params.course_id}/modules/${formData.get('module_pk')}/lessons/`)
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${formData.get('module_pk')}/lessons/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(lessonPayload)
            });

            console.log(response)

            if (!response.ok) throw error(400, "Modulni saqlashda xatolik yuz berdi. Lessons");

            const result = await response.json();
            console.log('Yaratilgan lesson:', result);

            return { success: true, lesson: result };
        } catch (err) {
            console.log(err);
            throw error(400, err)
        }
    }
}