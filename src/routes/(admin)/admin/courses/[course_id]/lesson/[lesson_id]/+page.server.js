import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export async function load({ params, cookies, url, locals }) {
    const token = cookies.get('access_token');
    const moduleId = url.searchParams.get('module_id');
    const lessonId = params.lesson_id; // Use path parameter

    if (!moduleId || !lessonId) {
        throw error(400, 'Module ID va Lesson ID kiritilmadi');
    }

    try {
        const res = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/lessons/${lessonId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': locals.lang
            }
        });

        if (!res.ok) throw error(res.status, 'Dars topilmadi');
        const lessonData = await res.json();

        // Modul darslarini fetching (Sidebar uchun)
        const moduleRes = await fetch(`${API_URL}/courses/${params.course_id}/modules/${moduleId}/`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept-Language': locals.lang }
        });
        const moduleData = moduleRes.ok ? await moduleRes.json() : null;

        // Keyingi darsni aniqlash (preview uchun)
        let nextLesson = null;
        try {
            const courseRes = await fetch(`${API_URL}/courses/${params.course_id}/`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept-Language': locals.lang }
            });
            if (courseRes.ok) {
                const courseData = await courseRes.json();
                const modules = courseData.modules || [];

                const allLessons = [];
                modules.forEach(m => {
                    if (m.lessons) {
                        m.lessons.forEach(l => {
                            allLessons.push({ ...l, moduleId: m.id });
                        });
                    }
                });

                const currentIndex = allLessons.findIndex(l => l.id.toString() === lessonId.toString());
                if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
                    nextLesson = allLessons[currentIndex + 1];
                }
            }
        } catch (err) {
            console.error("Keyingi darsni aniqlashda xatolik:", err);
        }

        return {
            lesson: lessonData,
            moduleData,
            nextLesson,
            breadcrumbs: {
                course: "Kursni ko'rish",
                lesson: lessonData.title
            }
        };

    } catch (err) {
        console.error("Darsni yuklashda xatolik:", err);
        throw error(404, 'Ma\'lumotni yuklash imkonsiz');
    }
}
