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
                    // SvelteKit fetch o'rniga global fetch ishlatamiz.
                    const headers = { 'Accept-Language': lang };
                    
                    // 1-urinish: Kurs detallari (modules bilan)
                    const res = await globalThis.fetch(`${API_URL}/courses/${course.id}/`, { headers });
                    if (res.ok) {
                        return await res.json();
                    }

                    // 2-urinish: Agar detail 500/404 bersa, faqat modullarni o'zini olamiz (curriculum uchun)
                    const modulesRes = await globalThis.fetch(`${API_URL}/courses/${course.id}/modules/`, { headers });
                    if (modulesRes.ok) {
                        const modulesData = await modulesRes.json();
                        // Backend list yoki results formatida qaytarishi mumkin
                        course.modules = modulesData.results || modulesData;
                        return course;
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


