import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');
    
    if (!params.course_id) return;

    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        const timestamp = Date.now();
        const [resUz, resRu, resListUz, resListRu] = await Promise.all([
            globalThis.fetch(`${API_URL}/courses/${params.course_id}/?_cb=${timestamp}`, {
                headers: {
                    ...headers,
                    'Accept-Language': 'uz'
                }
            }),
            globalThis.fetch(`${API_URL}/courses/${params.course_id}/?_cb=${timestamp}`, {
                headers: {
                    ...headers,
                    'Accept-Language': 'ru'
                }
            }),
            globalThis.fetch(`${API_URL}/courses/?_cb=${timestamp}`, {
                headers: {
                    ...headers,
                    'Accept-Language': 'uz'
                }
            }),
            globalThis.fetch(`${API_URL}/courses/?_cb=${timestamp}`, {
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

        let listUz = [];
        if (resListUz.ok) {
            try {
                const data = await resListUz.json();
                listUz = Array.isArray(data) ? data : (data.results || []);
            } catch (e) {
                console.error('Failed to parse Uzbek courses list:', e);
            }
        }

        let listRu = [];
        if (resListRu.ok) {
            try {
                const data = await resListRu.json();
                listRu = Array.isArray(data) ? data : (data.results || []);
            } catch (e) {
                console.error('Failed to parse Russian courses list:', e);
            }
        }

        const courseListUz = listUz.find(c => Number(c.id) === Number(params.course_id)) || {};
        const courseListRu = listRu.find(c => Number(c.id) === Number(params.course_id)) || {};

        // Barcha ma'lumotlarni birlashtiramiz va tahrirlash oynasiga to'liq uzatamiz
        const course = {
            ...courseUz,
            title_uz: courseUz.title || '',
            description_uz: courseUz.description || '',
            level_uz: courseListUz.level || courseUz.level || '',
            
            title_ru: courseRu.title || '',
            description_ru: courseRu.description || '',
            level_ru: courseListRu.level || courseRu.level || '',
            
            duration: courseListUz.duration ?? courseUz.duration ?? courseRu.duration ?? 0,
            level: courseListUz.level ?? courseUz.level ?? courseRu.level ?? ''
        };

        return { course, modules: course.modules ?? [] };
    } catch (err) {
        console.error('Modulelarni olishda xatolik: ', err);
        throw error(500, 'Server bilan ulanishda xatolik yuz berdi');
    }
}