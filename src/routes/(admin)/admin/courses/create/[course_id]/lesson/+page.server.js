import { API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ parent, params, cookies }) => {
    const { modules } = await parent();

    if (!modules || modules.length === 0) {
        throw redirect(303, `/admin/courses/create/${params.course_id}`);
    }
    return { 
        modules, 
        accessToken: cookies.get('access_token'),
        apiUrl: API_URL,
        courseId: params.course_id 
    };
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
            formData.delete('video_url');
        }

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${formData.get('module_pk')}/lessons/`, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!response.ok) {
                let errData = {};
                let responseText = '';

                try {
                    // Body ni FAQAT BIR marta o‘qiyapmiz
                    responseText = await response.text();
                    console.log('Raw error response:', responseText);

                    errData = JSON.parse(responseText) || {};
                } catch (parseErr) {
                    // JSON bo‘lmasa ham xato bermaydi
                    console.log('Response could not be parsed as JSON');
                    console.log(parseErr)
                }

                // Endi xavfsiz log qilamiz
                console.log('Error object:', errData);
                console.log('Error title:', errData.title);
                console.log('Error detail:', errData.detail);

                return fail(400, {
                    error: errData.title?.[0]
                        || errData.detail
                        || "Modulni saqlashda xatolik yuz berdi"
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