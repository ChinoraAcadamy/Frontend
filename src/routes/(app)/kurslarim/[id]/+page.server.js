import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import { enrichCourseWithProgress } from '@/lib/server/courseService.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params, cookies, setHeaders }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');

    // Optimizatsiya: 1 daqiqalik kesh
    setHeaders({
        'cache-control': 'private, max-age=60'
    });

    const getCourseDetail = async () => {
        const headers = { 'Authorization': `Bearer ${accessToken}` };
        try {
            const res = await fetch(`${API_URL}/courses/${params.id}/`, { headers });

            if (!res.ok) {
                throw error(res.status === 404 ? 404 : 400, 'Kurs topilmadi yoki ulanishda xatolik');
            }

            let course = await res.json();
            
            // Markazlashgan servis orqali progressni biriktiramiz
            // Global fetch Sveltekit warning bermasligini ta'minlaydi (backgroundda ishlaydi)
            course = await enrichCourseWithProgress(accessToken, course, globalThis.fetch);

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
