// src/routes/(app)/dashboard/baholar/+page.server.js
import { API_URL } from '$env/static/private';

export const load = async ({ cookies, fetch, url, setHeaders }) => {
    // Optimizatsiya: 1 daqiqalik kesh
    setHeaders({
        'cache-control': 'private, max-age=60'
    });

    const accessToken = cookies.get('access_token');

    // URL'dan parametrlarni o'qiymiz
    const search = url.searchParams.get('search') ?? '';
    const ordering = url.searchParams.get('ordering') ?? '';
    const status = url.searchParams.get('status') ?? 'all';
    const page = url.searchParams.get('page') ?? '1';

    // API uchun parametrlarni tayyorlaymiz
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (ordering) params.set('ordering', ordering);
    if (page) params.set('page', page);

    // Agar status 'all' bo'lmasa, uni ham backendga filter uchun jo'natamiz
    // Backend qabul qilishiga ishonch hosil qiling (masalan: ?status=pending)
    if (status !== 'all') {
        params.set('status', status);
    }

    // URL'ni standart va xavfsiz ko'rinishda shakllantiramiz
    const apiUrl = new URL(`${API_URL}/progress/submissions/`);
    if (params.toString()) {
        apiUrl.search = params.toString();
    }

    // Streaming (Lazy Loading) uchun promise ni await qilinmasdan qaytaramiz
    const getSubmissions = async () => {
        try {
            const res = await fetch(apiUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.error(`[baholar] Backend error: ${res.status}`, await res.text());
                return { results: [], count: 0, next: null, previous: null };
            }

            const data = await res.json();

            // Diagnostika uchun loglar (faqat results bo'sh bo'lganda yoki muammo bo'lganda)
            if (!data.results || data.results.length === 0) {
                console.log(`[baholar] Ma'lumot topilmadi. URL: ${apiUrl.toString()}`);
                console.log(`[baholar] Javob strukturasi:`, Object.keys(data));
            }

            return data;
        } catch (err) {
            console.error('[baholar] Fetch error:', err);
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