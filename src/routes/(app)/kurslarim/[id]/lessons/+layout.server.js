import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';
import { fetchWithCache, generateCacheKey } from '@/lib/server/cache.js';

export async function load({ params, cookies, url, locals }) {
    const token = cookies.get('access_token');
    const moduleId = url.searchParams.get('module_id');
    /** @type {any} */
    const user = locals.user;

    if (!moduleId) {
        throw error(400, 'Module ID kiritilmadi');
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': getLocale()
    };

    const fetchModuleData = async () => {
        const res = await globalThis.fetch(`${API_URL}/courses/${params.id}/modules/${moduleId}/`, { headers });
        if (!res.ok) return null;
        return res.json();
    };

    const fetchCourseData = async () => {
        const res = await globalThis.fetch(`${API_URL}/courses/${params.id}/`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) return null;
        return res.json();
    };

    return {
        // Asinxron (streaming) qaytaramiz
        lazy: {
            moduleData: fetchWithCache(generateCacheKey('student_module_detail', user?.id, moduleId), fetchModuleData),
            courseData: fetchWithCache(generateCacheKey('student_course_base', user?.id, params.id), fetchCourseData)
        }
    };
}
