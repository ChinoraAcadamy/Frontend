import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const load = async ({ fetch, cookies, params }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');

    const headers = { 'Authorization': `Bearer ${accessToken}` };

    // Get parent modules to allow module selection in the form
    const modulesRes = await fetch(`${API_URL}/courses/${params.course_id}/`, { headers });
    const courseData = await modulesRes.json();
    const modules = courseData.modules || [];

    // O'sha darsni qidirib topamiz (modulni aniqlash uchun)
    let parentModulePk = null;
    for (const mod of modules) {
        if (mod.lessons) {
            const l = mod.lessons.find((les) => les.id.toString() === params.lesson_id);
            if (l) {
                parentModulePk = mod.id;
                break;
            }
        }
    }

    // Dars ma'lumotlarini aniq olish (full detail uchun)
    try {
        const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${parentModulePk}/lessons/${params.lesson_id}/`, { headers });
        if (!response.ok) throw redirect(303, `/admin/courses/${params.course_id}`);
        
        const lessonTarget = await response.json();
        return { modules, lessonTarget, parentModulePk, course: courseData };
    } catch {
        throw redirect(303, `/admin/courses/${params.course_id}`);
    }
};

export const actions = {
    updateLesson: async ({ fetch, cookies, request, params }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) throw redirect(303, "/login");

        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const formData = await request.formData();
        const moduleId = formData.get('module_pk');

        const video = formData.get('video_file');
        if (video instanceof File && video.size === 0) {
            formData.delete('video_file');
        }

        const img = formData.get('image_file');
        if (img instanceof File && img.size === 0) {
            formData.delete('image_file');
        }

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/lessons/${params.lesson_id}/`, {
                method: 'PATCH',
                headers,
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                return fail(400, { 
                    error: errData.title_uz?.[0] || errData.detail || "Darsni tahrirlashda xatolik yuz berdi" 
                });
            }

            return { success: true };
        } catch (err) {
            console.log(err);
            return fail(500, { error: "Server bilan bog'lanishda xatolik" });
        }
    }
}
