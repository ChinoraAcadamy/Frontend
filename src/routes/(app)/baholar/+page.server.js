// src/routes/(app)/dashboard/baholar/+page.server.js
import { API_URL } from '$env/static/private';

export const load = async ({ cookies, fetch, url }) => {
    const accessToken = cookies.get('access_token');

    // URL'dan parametrlarni o'qiymiz
    const search   = url.searchParams.get('search')   ?? '';
    const ordering = url.searchParams.get('ordering') ?? '';
    const status   = url.searchParams.get('status')   ?? 'all'; 
    const page     = url.searchParams.get('page')     ?? '1';

    // API uchun parametrlarni tayyorlaymiz
    const params = new URLSearchParams();
    if (search)   params.set('search', search);
    if (ordering) params.set('ordering', ordering);
    if (page)     params.set('page', page);
    
    // Agar status 'all' bo'lmasa, uni ham backendga filter uchun jo'natamiz
    // Backend qabul qilishiga ishonch hosil qiling (masalan: ?status=pending)
    if (status !== 'all') {
        params.set('status', status);
    }

    // XATO SHU YERDA EDI: params ni fetch URL'ga qo'shmagansiz
    const res = await fetch(`${API_URL}/progress/submissions/?${params.toString()}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        return { 
            submissions: [], 
            totalCount: 0, 
            nextPage: null, 
            prevPage: null, 
            currentPage: parseInt(page), 
            filters: { search, status } 
        };
    }

    const data = await res.json();

    return {
        submissions: data.results ?? [],
        totalCount:  data.count    ?? 0,
        nextPage:    data.next     ?? null,
        prevPage:    data.previous ?? null,
        currentPage: parseInt(page),
        filters: { search, status }
    };
};