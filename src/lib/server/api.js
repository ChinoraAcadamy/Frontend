import { API_URL } from "$env/static/private";

export async function getRanking({ cookies, fetch = globalThis.fetch }) {
	const accessToken = cookies.get('access_token');
	
	try {
		// 1. Fetch Page 1 first to get the total count
		const firstRes = await fetch(`${API_URL}/auth/students/ranking/?page=1`, {
			headers: { 'Authorization': `Bearer ${accessToken}` }
		});

		if (!firstRes.ok) return [];
		const firstData = await firstRes.json();
		
		const results = firstData.results || firstData || [];
		const count = firstData.count || results.length;
		
		// If there are no more pages, return immediately
		if (!firstData.next || results.length >= count) {
			return results;
		}

		// 2. Calculate remaining pages (Backend default is 20)
		const pageSize = 20; 
		const totalPages = Math.ceil(count / pageSize);
		const remainingPageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

		// 3. Fetch all other pages in parallel (up to a safety limit of 200 total students)
		const otherPagesPromises = remainingPageNumbers.slice(0, 10).map(page => 
			fetch(`${API_URL}/auth/students/ranking/?page=${page}`, {
				headers: { 'Authorization': `Bearer ${accessToken}` }
			}).then(res => res.ok ? res.json() : { results: [] })
		);

		const otherPagesData = await Promise.all(otherPagesPromises);
		
		// 4. Combine all results
		let allResults = [...results];
		otherPagesData.forEach(data => {
			const pageResults = data.results || data || [];
			allResults = [...allResults, ...pageResults];
		});

		return allResults;
	} catch (e) {
		console.error("[getRanking] Parallel fetch error:", e);
		return [];
	}
}

export async function getMyRank({ ranking, myId }) {
	if (!ranking || !myId) return null;
	const index = ranking.findIndex(u => String(u.id) === String(myId));
	return index !== -1 ? index + 1 : null;
}