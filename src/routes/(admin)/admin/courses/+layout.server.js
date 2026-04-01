import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ fetch, params, cookies }) => {
    // setHeaders({
    //     'cache-control': 'public, max-age=120'
    // });

    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true'
    };

    if (!params.course_id) return;

    try {
        const response = await fetch(`${API_URL}/courses/${params.course_id}/`, { headers });
        if (!response.ok) throw error(404, 'Kurs topilmadi');
        const course = await response.json();

        return { course, modules: course.modules ?? [] };
    } catch (err) {
        console.log('Modulelarni olishda xatolik: ', err);
    }
}