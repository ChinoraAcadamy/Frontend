import { API_URL } from '$env/static/private';

/**
 * Umumiy topshiriqlar ro'yxatini olish (Admin va Student uchun)
 * @param {import('@sveltejs/kit').ServerLoadEvent} event 
 * @param {Object} options 
 * @param {string} [options.search='']
 * @param {string} [options.ordering='']
 * @param {string} [options.page='1']
 * @param {string} [options.status='']
 * @param {number} [options.pageSize]
 * @param {typeof fetch} [options.fetcher] - SvelteKit fetch (optional)
 */
export async function getSubmissions(event, { search = '', ordering = '', page = '1', status = '', pageSize, fetcher } = {}) {
    const accessToken = event.cookies.get('access_token');
    
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (ordering) params.set('ordering', ordering);
    if (page) params.set('page', page);
    if (status && status !== 'all') params.set('status', status);
    if (pageSize) params.set('page_size', String(pageSize));

    const apiUrl = new URL(`${API_URL}/progress/submissions/`);
    if (params.toString()) {
        apiUrl.search = params.toString();
    }

    // Streaming uchun global fetch orqali warninglarni oldini olamiz
    const fetchToUse = fetcher || event.fetch || globalThis.fetch;

    try {
        const res = await fetchToUse(apiUrl.toString(), {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error(`[submissionService] API error: ${res.status}`, await res.text());
            return { results: [], count: 0, next: null, previous: null };
        }

        return await res.json();
    } catch (err) {
        console.error('[submissionService] Fetch error:', err);
        return { results: [], count: 0, next: null, previous: null };
    }
}

/**
 * So'nggi topshiriqlarni olish (Dashboard uchun)
 * @param {import('@sveltejs/kit').ServerLoadEvent} event
 * @param {number} limit
 */
export async function getRecentSubmissions(event, limit = 3) {
    // Eng so'nggisini olish uchun teskari tartibda so'raymiz
    const data = await getSubmissions(event, { 
        ordering: '-submitted_at', 
        pageSize: limit 
    });
    
    // Agar backend page_size ni qo'llab-quvvatlamasa, slice qilamiz
    if (data.results && data.results.length > limit) {
        data.results = data.results.slice(0, limit);
    }
    
    return data.results || [];
}
