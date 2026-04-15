import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import { enrichCourseWithProgress } from '@/lib/server/courseService.js';
import { getLocale } from '@/lib/paraglide/runtime';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params, cookies, setHeaders }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');

    // Progress yangilanayotganda kesh muammo tug'dirmasligi uchun load funksiyasida keshni olib tashlaymiz
    /*
    setHeaders({
        'cache-control': 'private, max-age=60'
    });
    */

    const getCourseDetail = async () => {
        const headers = { 'Authorization': `Bearer ${accessToken}`, 'Accept-Language': getLocale() };
        try {
            const res = await fetch(`${API_URL}/courses/${params.id}/`, { headers });

            if (!res.ok) {
                throw error(res.status === 404 ? 404 : 400, 'Kurs topilmadi yoki ulanishda xatolik');
            }

            let course = await res.json();

            // Markazlashgan servis orqali progressni biriktiramiz
            // Global fetch Sveltekit warning bermasligini ta'minlaydi (backgroundda ishlaydi)
            course = await enrichCourseWithProgress(accessToken, course, globalThis.fetch);

            // Fetch accurate lessons mapping with `can_access` and `is_completed`
            if (course.modules && course.modules.length > 0) {
                const modulesPromises = course.modules.map(async (mod) => {
                    try {
                        const lessonsRes = await fetch(`${API_URL}/courses/${course.id}/modules/${mod.id}/lessons/`, { headers });
                        if (lessonsRes.ok) {
                            const lessonsData = await lessonsRes.json();
                            mod.lessons = lessonsData.results || lessonsData;
                        } else {
                            mod.lessons = [];
                        }
                    } catch (e) {
                        console.error(`Modul darslarini olishda xatolik (Module ${mod.id}):`, e);
                        mod.lessons = [];
                    }
                    return mod;
                });
                course.modules = await Promise.all(modulesPromises);
            }

            return { course, modules: course.modules || [] };
        } catch (err) {
            if (err.status) throw err;
            console.error('Kurs detalini olishda xatolik: ', err);
            throw error(500, 'Server xatoligi');
        }
    };

    return {
        lazy: {
            courseData: getCourseDetail()
        }
    };
}
