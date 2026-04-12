import { API_URL } from "$env/static/private";

export async function getRanking({ cookies, fetch = globalThis.fetch }) {
	const accessToken = cookies.get('access_token');

	const res = await fetch(`${API_URL}/auth/students/ranking/`, {
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	});

	if (!res.ok) return { ranking: [] };
	const data = await res.json();
	return { ranking: data.results ?? data ?? [] };
}