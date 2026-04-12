import { API_URL } from '$env/static/private';

/**
 * Bitta kursga progress ma'lumotlarini biriktiradi (Enrichment)
 * @param {typeof fetch} fetch - SvelteKit fetch
 * @param {string} accessToken - JWT Token
 * @param {any} course - Kurs obyekti
 * @returns {Promise<any>} - Progress bilan boyitilgan kurs
 */
export async function enrichCourseWithProgress(fetch, accessToken, course) {
    if (!course || !course.id) return course;

    try {
        const res = await fetch(`${API_URL}/progress/courses/${course.id}/`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
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
 * @param {typeof fetch} fetch - SvelteKit fetch
 * @param {string} accessToken - JWT Token
 * @param {any[]} courses - Kurslar ro'yxati
 * @returns {Promise<any[]>} - Progress bilan boyitilgan ro'yxat
 */
export async function enrichCoursesList(fetch, accessToken, courses) {
    if (!courses || courses.length === 0) return [];
    
    // Parallel ravishda barcha progress so'rovlarini yuboramiz (Best Practice)
    return await Promise.all(
        courses.map(course => enrichCourseWithProgress(fetch, accessToken, course))
    );
}
