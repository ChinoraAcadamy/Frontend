import { getSubmissions } from '@/lib/server/submissions.js';

export const load = async (event) => {
    // Optimizatsiya: 1 daqiqalik kesh
    event.setHeaders({
        'cache-control': 'private, max-age=60'
    });

    const { url } = event;

    // URL'dan parametrlarni o'qiymiz
    const search = url.searchParams.get('search') ?? '';
    const status = url.searchParams.get('status') ?? 'all';
    const page = url.searchParams.get('page') ?? '1';
    const ordering = url.searchParams.get('ordering') ?? '';

    // Streaming (Lazy Loading) uchun promise ni await qilinmasdan qaytaramiz
    return {
        streamed: {
            submissionsData: getSubmissions(event, { search, page, ordering })
        },
        currentPage: parseInt(page),
        filters: { search, status }
    };
};