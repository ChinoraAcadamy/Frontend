// src/routes/+page.server.js
import { API_URL } from '$env/static/private';
import { getLocale } from '$lib/paraglide/runtime.js';
// import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch, setHeaders }) => {
    setHeaders({
        'Cache-Control': 'public, max-age=3600'
    });
    try {
        const response = await fetch(`${API_URL}/courses/`, {
            headers: {
                'Accept-Language': getLocale()
            }
        });

        if (!response.ok) {
            return { courses: [] };
        }

        const data = await response.json();
        return { courses: data.results ?? [] };

    } catch (err) {
        console.error('Courses fetch xatosi:', err);
        return { courses: [] };
    }
};