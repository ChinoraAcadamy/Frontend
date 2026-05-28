import { getSubmissions } from '@/lib/server/submissions.js';
import { fetchWithCache, generateCacheKey } from '@/lib/server/cache.js';

export const load = async (event) => {
	const { url, locals } = event;
	const user = locals.user;

	// URL'dan parametrlarni o'qiymiz
	const search = url.searchParams.get('search') ?? '';
	const status = url.searchParams.get('status') ?? 'all';
	const page = url.searchParams.get('page') ?? '1';
	const ordering = url.searchParams.get('ordering') ?? '';

	// Streaming (Lazy Loading) uchun promise ni await qilinmasdan qaytaramiz
	return {
		streamed: {
			submissionsData: fetchWithCache(
				generateCacheKey(
					'student_submissions',
					user.id,
					`page=${page}&search=${search}&o=${ordering}&s=${status}`
				),
				() => getSubmissions(event, { search, page, ordering })
			)
		},
		currentPage: parseInt(page),
		filters: { search, status }
	};
};
