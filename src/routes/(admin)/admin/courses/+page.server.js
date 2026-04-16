import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, cookies, setHeaders }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw error(401, 'Avtorizatsiya talab qilinadi');

    // Admin list sahifasi doimo yangi bo'lishi kerak
    setHeaders({
        'cache-control': 'private, no-cache, must-revalidate'
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
            courses: getCourses()
        }
    };
};