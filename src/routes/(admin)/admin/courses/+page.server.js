import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';
import { error } from '@sveltejs/kit';


export const load = async ({ fetch, cookies, setHeaders }) => {
    setHeaders({
        'cache-control': 'public, max-age=120'
    });
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw error(401, 'Avtorizatsiya talab qilinadi');
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true',
        'Accept-Language': getLocale()
    };
    try {
        const response = await fetch(`${API_URL}/courses/`, { headers });
        if (!response.ok) throw error(400, 'Kurslarni olishda xatolik');

        const data = await response.json();
        // console.log(data)
        return { courses: data.results ?? data ?? [] };
    } catch (err) {
        throw error(500, err.message || "Server bilan ulanishda xatolik.");
    }
}