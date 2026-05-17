import { API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { invalidateCache } from '@/lib/server/cache.js';

export const load = async ({ parent, params, cookies }) => {
    await parent();
    const accessToken = cookies.get('access_token');
    
    try {
        const response = await globalThis.fetch(`${API_URL}/courses/${params.course_id}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw redirect(303, `/admin/courses/create/${params.course_id}`);
        }
        
        const course = await response.json();
        const modules = course.modules || [];
        
        if (modules.length === 0) {
            throw redirect(303, `/admin/courses/create/${params.course_id}`);
        }
        
        return {
            modules,
            accessToken,
            apiUrl: API_URL,
            courseId: params.course_id
        };
    } catch (e) {
        console.error("Failed to load fresh modules in lesson step:", e);
        throw redirect(303, `/admin/courses/create/${params.course_id}`);
    }
};

export const actions = {
    createLesson: async ({ fetch, cookies, request, params }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) throw redirect(303, "/login");

        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const formData = await request.formData();

        const video = formData.get('video_file');
        if (video instanceof File && video.size === 0) {
            formData.delete('video_file');
        }

        const img = formData.get('image_file');
        if (img instanceof File && img.size === 0) {
            formData.delete('image_file');
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

            invalidateCache();
            return { success: true, lesson: result };
        } catch (err) {
            console.log(err);
            return fail(500, { error: "Server bilan bog'lanishda xatolik" });
        }
    }
}