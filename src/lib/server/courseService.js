import { API_URL } from '$env/static/private';

/**
 * @param {string} accessToken - JWT Token
 * @param {any} course - Kurs obyekti
 * @param {typeof fetch} [fetch] - SvelteKit fetch (optional, defaults to global fetch)
 * @param {string} [lang] - Language code (optional)
 * @returns {Promise<any>} - Progress bilan boyitilgan kurs
 */
export async function enrichCourseWithProgress(accessToken, course, fetch, lang = 'uz') {

    if (!course || !course.id) return course;

    // SvelteKit event.fetch load funksiyasidan tashqarida ishlatilsa warning beradi.
    // Shuning uchun ixtiyoriy fetch'ni qabul qilamiz yoki global fetch ishlatamiz.
    const fetcher = fetch || globalThis.fetch;

    try {
        const res = await fetcher(`${API_URL}/progress/courses/${course.id}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept-Language': lang
            }
        });


        if (res.ok) {
            const data = await res.json();
            // User bergan JSON strukturasiga asosan keylarni xaritlaymiz
            course.progress = Math.round(Number(data.progress_percent) || 0);
            course.completed_lessons = data.watched_lessons || 0;
            course.total_lessons = data.total_lessons || course.lessons_count || 0;

            // Dashboard va CourseCard uchun qo'shimcha mapping
            course.lessons = course.total_lessons;
        } else {
            course.progress = 0;
            course.completed_lessons = 0;
        }
    } catch (err) {
        console.error(`Error enriching course ${course.id}:`, err);
        course.progress = 0;
        course.completed_lessons = 0;
    }

    return course;
}

/**
 * Kurslar ro'yxatini oladi va har biri uchun progressni parallel yuklaydi
 * @param {string} accessToken - JWT Token
 * @param {any[]} courses - Kurslar ro'yxati
 * @param {typeof fetch} [fetch] - SvelteKit fetch (optional)
 * @param {string} [lang] - Language code (optional)
 * @returns {Promise<any[]>} - Progress bilan boyitilgan ro'yxat
 */
export async function enrichCoursesList(accessToken, courses, fetch, lang = 'uz') {

    if (!courses || courses.length === 0) return [];

    // Parallel ravishda barcha progress so'rovlarini yuboramiz (Best Practice)
    return await Promise.all(
        courses.map(course => enrichCourseWithProgress(accessToken, course, fetch, lang))
    );

}
