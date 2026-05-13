// src/routes/+page.server.js
import { API_URL } from '$env/static/private';
import { getOrSet } from '$lib/server/cache';

export const load = async ({ fetch, locals }) => {
    const lang = locals.lang || 'uz';

    const getCoursesData = async () => {
        return getOrSet(`homepage_courses_${lang}`, async () => {
            console.log(`[Cache Miss] Fetching courses for lang: ${lang}`);
            try {
                // 1. Kurslar ro'yxatini olamiz
                const response = await fetch(`${API_URL}/courses/`);
                if (!response.ok) return [];
                const data = await response.json();
                const courseList = (data.results ?? []).filter((c) => c.is_published);

                if (courseList.length === 0) return [];

                // 2. Har bir kursning detallarini (modullarini) parallel olamiz
                return await Promise.all(
                    courseList.map(async (course) => {
                        try {
                            const headers = { 'Accept-Language': lang };
                            const res = await fetch(`${API_URL}/courses/${course.id}/`, { headers });
                            if (res.ok) {
                                return await res.json();
                            }
                            // Fallback: faqat modullarni o'zini olish
                            const modulesRes = await fetch(`${API_URL}/courses/${course.id}/modules/`, { headers });
                            if (modulesRes.ok) {
                                const modulesData = await modulesRes.json();
                                course.modules = modulesData.results || modulesData;
                            }
                        } catch (e) {
                            console.error(`Course ${course.id} detail fetch error:`, e);
                        }
                        return course;
                    })
                );
            } catch (err) {
                console.error('Homepage courses fetch error:', err);
                return [];
            }
        }, 600); // 10 daqiqa kesh
    };

    return {
        courses: getCoursesData()
    };
};



