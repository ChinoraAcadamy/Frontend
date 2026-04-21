import { API_URL } from '$env/static/private';
import { getRanking } from '@/lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
    const { cookies, fetch, setHeaders } = event;
    // 10 daqiqa kesh (600 soniya)
    setHeaders({
        'cache-control': 'private, max-age=600'
    });

    const accessToken = cookies.get('access_token');
    const headers = { 'Authorization': `Bearer ${accessToken}` };

    const fetchStats = async () => {
        const [studentsRes, coursesRes] = await Promise.all([
            fetch(`${API_URL}/auth/students/?page_size=1`, { headers }),
            fetch(`${API_URL}/courses/`, { headers })
        ]);

        let totalCount = 0;
        let coursesCount = 0;
        let courses = [];

        if (studentsRes.ok) {
            const data = await studentsRes.json();
            totalCount = data.count ?? 0;
        }

        if (coursesRes.ok) {
            const data = await coursesRes.json();
            courses = data.results ?? data ?? [];
            coursesCount = courses.length;
        }

        return { totalCount, coursesCount, courses };
    };

    const fetchNewStudents = async () => {
        const res = await fetch(`${API_URL}/auth/students/?page_size=5&ordering=-id`, { headers });
        if (res.ok) {
            const data = await res.json();
            return data.results ?? data ?? [];
        }
        return [];
    };

    // Await ranking upfront to avoid lifecycle issues and provide instant data
    const rankingData = await getRanking(event);

    return {
        user: event.locals.user,
        // Bular promise ko'rinishida qaytadi (streaming)
        lazy: {
            stats: fetchStats(),
            ranking: rankingData.results,
            newStudents: fetchNewStudents()
        }
    };
};
