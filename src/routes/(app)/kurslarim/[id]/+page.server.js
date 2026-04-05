import { API_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params, cookies }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(303, '/login');

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true'
    };

    try {
        const [courseResponse, progressResponse] = await Promise.all([
            fetch(`${API_URL}/courses/${params.id}/`, { headers }),
            fetch(`${API_URL}/progress/courses/${params.id}/`, { headers })
        ]);

        if (!courseResponse.ok) {
            throw error(courseResponse.status === 404 ? 404 : 400, 'Kurs topilmadi yoki ulanishda xatolik');
        }

        const course = await courseResponse.json();

        // Progress'ni dinamik shaklda olamiz
        let progressVal = 0;
        let completedLessons = 0;

        if (progressResponse.ok) {
            const progressData = await progressResponse.json();

            // Xavfsiz tarzda obyekt yoki to'g'ridan-to'g'ri raqam ekanligini tekshiramiz
            if (typeof progressData === 'number') {
                progressVal = progressData;
            } else if (typeof progressData === 'object' && progressData !== null) {
                // API qaytarishi mumkin bo'lgan ehtimolli kalitlarni tekshiramiz
                progressVal = progressData.progress ?? progressData.percentage ?? progressData.progress_percentage ?? 0;
                completedLessons = progressData.completed_lessons ?? 0;
            }
        }

        course.progress = Math.round(Number(progressVal) || 0);
        course.completed_lessons = completedLessons || Math.round((course.progress / 100) * (course.lessons_count || 0));
        console.log(course.progress, course.completed_lessons)

        return { course, modules: course.modules || [] };
    } catch (err) {
        console.error('Kurs detalini olishda xatolik: ', err);
        throw error(500, 'Server xatoligi');
    }
}
