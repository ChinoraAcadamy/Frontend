import { API_URL } from '$env/static/private';

export const load = async ({ cookies, fetch, url, setHeaders }) => {
    setHeaders({
        'cache-control': 'public, max-age=120'
    });
    
    const accessToken = cookies.get('access_token');
    const search   = url.searchParams.get('search')    ?? '';
    const isActive = url.searchParams.get('is_active') ?? '';
    const ordering = url.searchParams.get('ordering')  ?? '';
    const page     = url.searchParams.get('page')      ?? '1';

    const params = new URLSearchParams();
    if (search)   params.set('search',    search);
    if (isActive) params.set('is_active', isActive);
    if (ordering) params.set('ordering',  ordering);
    if (page)     params.set('page',      page);

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true'
    };

    // 1️⃣ Ranking uchun uchinchi so'rovni qo'shdik
    const [studentsRes, coursesRes, rankingRes] = await Promise.allSettled([
        fetch(`${API_URL}/auth/students/?${params}`, { headers }),
        fetch(`${API_URL}/courses/`, { headers }),
        fetch(`${API_URL}/auth/students/ranking/`, { headers }) 
    ]);

    let students = [], totalCount = 0, nextPage = null, prevPage = null;
    if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
        const data = await studentsRes.value.json();
        students   = data.results  ?? data ?? [];
        totalCount = data.count    ?? students.length;
        nextPage   = data.next     ?? null;
        prevPage   = data.previous ?? null;
    }

    let courses = [];
    if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
        const data = await coursesRes.value.json();
        courses = data.results ?? data ?? [];
    }

    // 2️⃣ Ranking ma'lumotlarini ajratib olamiz
    let ranking = [];
    if (rankingRes.status === 'fulfilled' && rankingRes.value.ok) {
        const data = await rankingRes.value.json();
        ranking = data.results ?? data ?? [];
    }

    return {
        students, 
        courses, 
        ranking, // Frontendga jo'natamiz
        totalCount,
        nextPage, 
        prevPage,
        currentPage: parseInt(page),
        filters: { search, isActive, ordering }
    };
};