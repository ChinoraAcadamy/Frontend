// src/routes/+page.server.js
import { API_URL } from '$env/static/private';
// import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch, locals }) => {
    const lang = locals.lang || 'uz';

    // Kurslar ro'yxatini darhol olamiz (bu tez va SvelteKit dependency tracking uchun kerak)
    const fetchCoursesList = async () => {
        try {
            const response = await fetch(`${API_URL}/courses/`);
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
                    // MUHIM: SvelteKit fetch o'rniga global fetch ishlatamiz.
                    // Chunki bu load funksiyasi qaytganidan keyin ishlashi mumkin (streaming).
                    // SvelteKit lifecycle warning'ini oldini olish uchun global fetch kerak.
                    // Lekin handleFetch hook ishlamasligi sababli tilni qo'lda beramiz.
                    const res = await globalThis.fetch(`${API_URL}/courses/${course.id}/`, {
                        headers: { 'Accept-Language': lang }
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
        courses: getCoursesWithDetails()
    };
};


