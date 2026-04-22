// src/routes/+page.server.js
import { API_URL } from '$env/static/private';
import { getLocale } from '$lib/paraglide/runtime.js';
// import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch, setHeaders }) => {
    setHeaders({
        'Cache-Control': 'public, max-age=3600'
    });

    // Kurslar ro'yxatini darhol olamiz (bu tez va SvelteKit dependency tracking uchun kerak)
    const fetchCoursesList = async () => {
        try {
            const response = await fetch(`${API_URL}/courses/`, {
                headers: {
                    'Accept-Language': getLocale()
                }
            });
            if (!response.ok) return [];
            const data = await response.json();
            return (data.results ?? []).filter((c) => c.is_published);
        } catch (err) {
            console.error('Courses list fetch error:', err);
            return [];
        }
    };

    const courseListPromise = fetchCoursesList();

    // Modullarni (details) lazy load qilamiz
    const getCoursesWithDetails = async () => {
        const courseList = await courseListPromise;
        if (courseList.length === 0) return [];

        return await Promise.all(
            courseList.map(async (course) => {
                try {
                    // SvelteKit fetch o'rniga global fetch ishlatamiz (warning'ni oldini olish uchun)
                    // Chunki bu joyda dependency tracking bizga kerak emas
                    const res = await globalThis.fetch(`${API_URL}/courses/${course.id}/`, {
                        headers: {
                            'Accept-Language': getLocale()
                        }
                    });
                    if (res.ok) {
                        return await res.json();
                    }
                } catch (e) {
                    console.error(`Course ${course.id} detail fetch error:`, e);
                }
                return course;
            })
        );
    };

    return {
        lazy: {
            courses: getCoursesWithDetails()
        }
    };
};

