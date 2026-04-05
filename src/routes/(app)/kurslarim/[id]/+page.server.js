import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params, cookies }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');
    
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true'
    };

    try {
        const response = await fetch(`${API_URL}/courses/${params.id}/`, { headers });
        
        if (!response.ok) {
            throw error(response.status === 404 ? 404 : 400, 'Kurs topilmadi yoki ulanishda xatolik');
        }
        
        const course = await response.json();
        return { course, modules: course.modules || [] };
    } catch (err) {
        console.error('Kurs detalini olishda xatolik: ', err);
        throw error(500, 'Server xatoligi');
    }
}
