// src/routes/(admin)/admin/submissions/+page.server.js
import { API_URL } from '$env/static/private';

export const load = async ({ cookies, fetch, url }) => {
    const accessToken = cookies.get('access_token');

    // URL parametrlarini o'qish
    const search = url.searchParams.get('search') ?? '';
    const ordering = url.searchParams.get('ordering') ?? '';
    const status = url.searchParams.get('status') ?? 'all';
    const page = url.searchParams.get('page') ?? '1';

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (ordering) params.set('ordering', ordering);
    if (page) params.set('page', page);

    // Status filtri
    if (status !== 'all') {
        params.set('status', status);
    }

    // URL'ni standart va xavfsiz ko'rinishda shakllantiramiz
    const apiUrl = new URL(`${API_URL}/progress/submissions/`);
    if (params.toString()) {
        apiUrl.search = params.toString();
    }

    // Lazy Loading (Streaming) uchun Promise 
    const getSubmissions = async () => {
        try {
            const res = await fetch(apiUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.error(`[admin-submissions] Backend error: ${res.status}`, await res.text());
                return { results: [], count: 0, next: null, previous: null };
            }

            const data = await res.json();

            // Diagnostika uchun loglar (faqat results bo'sh bo'lganda yoki muammo bo'lganda)
            if (!data.results || data.results.length === 0) {
                console.log(`[admin-submissions] Ma'lumot topilmadi. URL: ${apiUrl.toString()}`);
                console.log(`[admin-submissions] Javob strukturasi:`, Object.keys(data));
            }

            return data;
        } catch (err) {
            console.error('[admin-submissions] Fetch error:', err);
            return { results: [], count: 0, next: null, previous: null };
        }
    };

    return {
        streamed: {
            submissionsData: getSubmissions()
        },
        currentPage: parseInt(page),
        filters: { search, status }
    };
};
