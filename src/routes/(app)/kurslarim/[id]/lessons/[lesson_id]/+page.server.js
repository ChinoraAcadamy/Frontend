import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';
import * as m from '$lib/paraglide/messages.js';
import { translateServerMessage } from '$lib/utils/server-messages.js';
import { fetchWithCache, generateCacheKey, invalidateCache } from '@/lib/server/cache.js';

export async function load({ params, cookies, url, locals }) {
    const token = cookies.get('access_token');
    const moduleId = url.searchParams.get('module_id');
    /** @type {any} */
    const user = locals.user;

    if (!moduleId) {
        throw error(400, m.error_occurred ? m.error_occurred() : 'Module ID kiritilmadi');
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': getLocale()
    };

    try {
        const fetchLessonData = async () => {
            const res = await globalThis.fetch(`${API_URL}/courses/${params.id}/modules/${moduleId}/lessons/${params.lesson_id}/`, { headers });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw error(res.status, translateServerMessage(errData, m));
            }
            return res.json();
        };

        const fetchCourseDataForNextLesson = async () => {
            const res = await globalThis.fetch(`${API_URL}/courses/${params.id}/`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) return null;
            return res.json();
        };

        // Dars va CourseData (nextLesson uchun) keshlanadi
        const lessonDataPromise = (async () => {
            const rawLesson = await fetchWithCache(generateCacheKey('student_lesson_detail', user?.id, params.lesson_id), fetchLessonData);
            
            // Fetch module data to get accurate is_completed status
            const fetchModuleData = async () => {
                const res = await globalThis.fetch(`${API_URL}/courses/${params.id}/modules/${moduleId}/`, { headers });
                if (!res.ok) return null;
                const data = await res.json();
                if (data && data.lessons) {
                    data.lessons = data.lessons.map((lesson, index, arr) => {
                        if (index > 0) {
                            const prevLesson = arr[index - 1];
                            if (prevLesson && prevLesson.is_completed) {
                                lesson.can_access = true;
                            }
                        }
                        return lesson;
                    });
                }
                return data;
            };
            const moduleData = await fetchWithCache(generateCacheKey('student_module_detail', user?.id, moduleId), fetchModuleData);
            
            if (moduleData && moduleData.lessons) {
                const moduleLesson = moduleData.lessons.find(l => l.id.toString() === params.lesson_id.toString());
                if (moduleLesson && moduleLesson.is_completed) {
                    rawLesson.is_completed = true;
                }
            }
            return rawLesson;
        })();
        
        const nextLessonPromise = (async () => {
            const courseData = await fetchWithCache(generateCacheKey('student_course_base', user?.id, params.id), fetchCourseDataForNextLesson);
            if (!courseData) return null;
            const modules = courseData.modules || [];
            const allLessons = [];
            modules.forEach(singleModule => {
                if (singleModule.lessons) {
                    singleModule.lessons.forEach(l => {
                        allLessons.push({ ...l, moduleId: singleModule.id });
                    });
                }
            });

            const currentIndex = allLessons.findIndex(l => l.id.toString() === params.lesson_id.toString());
            return (currentIndex !== -1 && currentIndex < allLessons.length - 1) ? allLessons[currentIndex + 1] : null;
        })();

        return {
            lazy: {
                lesson: lessonDataPromise,
                nextLesson: nextLessonPromise
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
            
            // Keshni tozalaymiz (yangi baho qo'shildi, dars progressi va reyting o'zgarishi mumkin)
            invalidateCache();
            
            return { success: true, result };
        } catch (err) {
            console.error("[uploadAssignment] System error:", err);
            return { success: false, error: m.error_occurred ? m.error_occurred() : 'Server bilan ulanishda xatolik.' };
        }
    }
};
