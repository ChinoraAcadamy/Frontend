import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ fetch, params, cookies }) => {
    // setHeaders({
    //     'cache-control': 'public, max-age=120'
    // });

    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');
    
    if (!params.course_id) return;

    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        const [resUz, resRu] = await Promise.all([
            fetch(`${API_URL}/courses/${params.course_id}/`, {
                headers: {
                    ...headers,
                    'Accept-Language': 'uz'
                }
            }),
            fetch(`${API_URL}/courses/${params.course_id}/`, {
                headers: {
                    ...headers,
                    'Accept-Language': 'ru'
                }
            })
        ]);

        if (!resUz.ok) throw error(404, 'Kurs topilmadi');
        const courseUz = await resUz.json();
        
        let courseRu = {};
        if (resRu.ok) {
            try {
                courseRu = await resRu.json();
            } catch (e) {
                console.error('Failed to parse Russian course details:', e);
            }
        }

        // Barcha ma'lumotlarni birlashtiramiz va tahrirlash oynasiga to'liq uzatamiz
        const course = {
            ...courseUz,
            title_uz: courseUz.title || '',
            description_uz: courseUz.description || '',
            level_uz: courseUz.level || '',
            
            title_ru: courseRu.title || '',
            description_ru: courseRu.description || '',
            level_ru: courseRu.level || '',
            
            duration: courseUz.duration ?? courseRu.duration ?? 0,
            level: courseUz.level ?? courseRu.level ?? ''
        };

        return { course, modules: course.modules ?? [] };
    } catch (err) {
        console.error('Modulelarni olishda xatolik: ', err);
        throw error(500, 'Server bilan ulanishda xatolik yuz berdi');
    }
}