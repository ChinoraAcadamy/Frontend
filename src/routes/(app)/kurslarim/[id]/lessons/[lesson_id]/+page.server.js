import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';
import * as m from '$lib/paraglide/messages.js';
import { translateServerMessage } from '$lib/utils/server-messages.js';


export async function load({ params, cookies, url, fetch, setHeaders }) {
    const token = cookies.get('access_token');
    const moduleId = url.searchParams.get('module_id');

    if (!moduleId) {
        throw error(400, m.error_occurred ? m.error_occurred() : 'Module ID kiritilmadi');
    }

    // Prefetching tezlik bersa-da, HTTP cache ham yuklamani kamaytiradi (ayniqsa video orasida navigate qilganda)
    setHeaders({
        'cache-control': 'private, max-age=60'
    });

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': getLocale()
    };

    try {
        // Parallelizing the fetches
        const lessonPromise = fetch(`${API_URL}/courses/${params.id}/modules/${moduleId}/lessons/${params.lesson_id}/`, { headers })
            .then(async (res) => {
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw error(res.status, translateServerMessage(errData, m));
                }
                return res.json();
            });

        const coursePromise = fetch(`${API_URL}/courses/${params.id}/`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(async (res) => (res.ok ? res.json() : null))
            .catch(() => null);

        // Await only the primary content (Lesson) to ensure it renders ASAP
        const lessonData = await lessonPromise;

        const nextLessonPromise = coursePromise.then(courseData => {
            if (!courseData) return null;
            const modules = courseData.modules || [];
            const allLessons = [];
            modules.forEach(m => {
                if (m.lessons) {
                    m.lessons.forEach(l => {
                        allLessons.push({ ...l, moduleId: m.id });
                    });
                }
            });

            const currentIndex = allLessons.findIndex(l => l.id.toString() === params.lesson_id.toString());
            return (currentIndex !== -1 && currentIndex < allLessons.length - 1) ? allLessons[currentIndex + 1] : null;
        });

        // Modulni alohida fetch qilamiz, chunki backendda faqat modul/lesson API'si user_progress va can_access beradi
        const moduleDataPromise = fetch(`${API_URL}/courses/${params.id}/modules/${moduleId}/`, { headers })
            .then(res => res.ok ? res.json() : null);

        return {
            lesson: lessonData,
            lazy: {
                nextLesson: nextLessonPromise,
                moduleData: moduleDataPromise
            },
            breadcrumbs: {
                course: "Mening kursim",
                lesson: lessonData.title
            }
        };

    } catch (err) {
        console.error("Darsni yuklashda xatolik:", err);
        if (err.status) throw err;
        throw error(500, m.error_occurred ? m.error_occurred() : 'Ma\'lumotni yuklash imkonsiz');
    }
}

export const actions = {
    uploadAssignment: async ({ request, cookies, fetch }) => {
        const token = cookies.get('access_token');
        const formData = await request.formData();

        const assignmentId = formData.get('assignment');
        const file = formData.get('file');
        const textAnswer = formData.get('text_answer') || '';

        if (!assignmentId) {
            return { success: false, error: m.error_occurred ? m.error_occurred() : 'Topshiriq ID topilmadi.' };
        }

        // Backendga formData sifatida yuboramiz
        const apiFormData = new FormData();
        apiFormData.append('assignment', assignmentId);
        if (file) apiFormData.append('file', file);
        if (textAnswer) apiFormData.append('text_answer', textAnswer);

        try {
            const res = await fetch(`${API_URL}/progress/submissions/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: apiFormData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("[uploadAssignment] API error:", errorData);
                return { success: false, error: translateServerMessage(errorData, m) };
            }

            const result = await res.json();
            return { success: true, result };
        } catch (err) {
            console.error("[uploadAssignment] System error:", err);
            return { success: false, error: m.error_occurred ? m.error_occurred() : 'Server bilan ulanishda xatolik.' };
        }
    }
};
