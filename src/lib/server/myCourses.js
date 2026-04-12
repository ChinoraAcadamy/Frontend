import { API_URL } from '$env/static/private';
import { enrichCoursesList } from './courseService.js';

export async function getMyCourses({ cookies, url, fetch = globalThis.fetch }) {
    const accessToken = cookies.get('access_token');

    const search = url.searchParams.get('search') || '';
    const page = url.searchParams.get('page') || 1;
    const ordering = url.searchParams.get('ordering') || '';

    let endpoint = `${API_URL}/enrollments/my-courses/?page=${page}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    if (ordering) endpoint += `&ordering=${encodeURIComponent(ordering)}`;

    try {
        const res = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch my courses:', await res.text());
            return {
                courses: [],
                totalCount: 0,
                next: null,
                previous: null,
                search
            };
        }

        const data = await res.json();
        let courses = data.results || [];

        // Progressni parallel yuklaymiz. 
        // MUHIM: SvelteKit warning bermasligi uchun background qismida global fetch ishlatamiz.
        courses = await enrichCoursesList(accessToken, courses, globalThis.fetch);

        return {
            courses,
            totalCount: data.count || 0,
            next: data.next,
            previous: data.previous,
            search
        };
    } catch (err) {
        console.error('Error fetching my courses:', err);
        return {
            courses: [],
            totalCount: 0,
            next: null,
            previous: null,
            search
        };
    }
}