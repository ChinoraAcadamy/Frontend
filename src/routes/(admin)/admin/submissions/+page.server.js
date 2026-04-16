// src/routes/(admin)/admin/submissions/+page.server.js
import { API_URL } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies, fetch, url, setHeaders }) => {
    // Optimizatsiya: 1 daqiqalik kesh (submissonlar tez o'zgarishi mumkinligi uchun)
    setHeaders({
        'cache-control': 'private, max-age=60'
    });

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

    // Status filtri backendga yuborilmaydi, chunki biz barcha ma'lumotni keshlab
    // va client-side filter qilishimiz kerak.
    // if (status !== 'all') {
    //     params.set('status', status);
    // }

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

export const actions = {
    gradeSubmission: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const submissionId = formData.get('id');
        const score = formData.get('score');
        const feedback = formData.get('feedback');

        if (!submissionId) return fail(400, { error: 'Topshiriq ID si ko\'rsatilmadi' });
        if (score === null || score === undefined) return fail(400, { error: 'Baho kiritilmadi' });

        try {
            const response = await fetch(`${API_URL}/progress/submissions/${submissionId}/grade/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    score: parseInt(score),
                    feedback: feedback || ''
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return fail(response.status, { 
                    error: errorData.detail || 'Baholashda xatolik yuz berdi' 
                });
            }

            return { success: true, updatedSubmission: await response.json() };
        } catch (err) {
            console.error('[gradeSubmission] Error:', err);
            return fail(500, { error: 'Server bilan ulanishda xatolik' });
        }
    }
};
