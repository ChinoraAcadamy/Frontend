import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';


export async function load({ params, cookies, url, fetch, setHeaders }) {
    const token = cookies.get('access_token');
    const moduleId = url.searchParams.get('module_id');

    if (!moduleId) {
        throw error(400, 'Module ID kiritilmadi');
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
                    let errBody = '';
                    try { errBody = await res.text(); } catch (e) { }
                    console.error("Backend error for lesson:", res.status, errBody);
                    throw error(res.status, `Dars topilmadi student page. Status: ${res.status}, Message: ${errBody}`);
                }
                return res.json();
            });

        const coursePromise = fetch(`${API_URL}/courses/${params.id}/`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(async (res) => (res.ok ? res.json() : null))
            .catch(() => null);

        // Await only the primary content (Lesson) to ensure it renders ASAP
        const lessonData = await lessonPromise;

        // Process nextLesson as a promise that SvelteKit will stream
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

        return {
            lesson: lessonData,
            lazy: {
                nextLesson: nextLessonPromise
            },
            breadcrumbs: {
                course: "Mening kursim",
                lesson: lessonData.title
            }
        };

    } catch (err) {
        console.error("Darsni yuklashda xatolik:", err);
        throw error(err.status || 500, err.body?.message || 'Ma\'lumotni yuklash imkonsiz');
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
            return { success: false, error: 'Topshiriq ID topilmadi.' };
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
                return { success: false, error: errorData.detail || 'Faylni yuklashda xatolik yuz berdi.' };
            }

            const result = await res.json();
            return { success: true, result };
        } catch (err) {
            console.error("[uploadAssignment] System error:", err);
            return { success: false, error: 'Server bilan ulanishda xatolik.' };
        }
    }
};
