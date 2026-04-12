import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import { enrichCourseWithProgress } from '@/lib/server/courseService.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params, cookies }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');

    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        const res = await fetch(`${API_URL}/courses/${params.id}/`, { headers });

        if (!res.ok) {
            throw error(res.status === 404 ? 404 : 400, 'Kurs topilmadi yoki ulanishda xatolik');
        }

        let course = await res.json();
        
        // Markazlashgan servis orqali progressni biriktiramiz
        course = await enrichCourseWithProgress(accessToken, course, fetch);

        return { course, modules: course.modules || [] };
    } catch (err) {
        if (err.status) throw err; // re-throw SvelteKit errors
        console.error('Kurs detalini olishda xatolik: ', err);
        throw error(500, 'Server xatoligi');
    }
}
