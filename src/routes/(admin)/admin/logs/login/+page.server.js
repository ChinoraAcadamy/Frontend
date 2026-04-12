import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies, fetch, url, setHeaders }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');

    // Optimizatsiya: keshlash
    setHeaders({
        'cache-control': 'private, max-age=300'
    });

    const search = url.searchParams.get('search') ?? '';
    const ordering = url.searchParams.get('ordering') ?? '-created_at';
    const page = url.searchParams.get('page') ?? '1';
    
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (ordering) params.set('ordering', ordering);
    if (page) params.set('page', page);

    const apiUrl = new URL(`${API_URL}/logs/login/`);
    if (params.toString()) {
        apiUrl.search = params.toString();
    }

    const getLoginLogs = async () => {
        try {
            const res = await fetch(apiUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.error(`[Admin Login Logs] Backend xatosi: ${res.status}`);
                return { results: [], count: 0, next: null, previous: null };
            }

            return await res.json();
        } catch (err) {
            console.error('[Admin Login Logs] Fetch xatosi:', err);
            return { results: [], count: 0, next: null, previous: null };
        }
    };

    return {
        lazy: {
            loginData: getLoginLogs()
        },
        filters: { search, ordering },
        currentPage: parseInt(page)
    };
};
