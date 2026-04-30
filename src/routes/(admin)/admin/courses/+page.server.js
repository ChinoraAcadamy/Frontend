import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';
import { error } from '@sveltejs/kit';
import { fetchWithCache, generateCacheKey } from '@/lib/server/cache.js';

export const load = async ({ fetch, cookies, setHeaders, locals }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw error(401, 'Avtorizatsiya talab qilinadi');
    const userId = locals.user?.id || 'admin';

    // Optimizatsiya: 10 daqiqalik kesh (Keshlanadi, lekin o'chirishlar reactiv ishlaydi)
    setHeaders({
        'cache-control': 'private, max-age=600'
    });



    const getCourses = async () => {
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Accept-Language': getLocale()
        };
        try {
            const response = await fetch(`${API_URL}/courses/`, { headers });
            if (!response.ok) throw error(400, 'Kurslarni olishda xatolik');

            const data = await response.json();
            return data.results ?? data ?? [];
        } catch (err) {
            console.error('[Admin Courses] Fetch error:', err);
            return [];
        }
    };

    return {
        lazy: {
            courses: fetchWithCache(generateCacheKey('admin_courses', userId, getLocale()), getCourses)
        }
    };
};