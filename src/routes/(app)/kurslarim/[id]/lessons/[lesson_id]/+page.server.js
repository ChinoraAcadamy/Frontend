import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export async function load({ params, cookies, url }) {
    // API URL ni o'zingizning .env yoki o'zgaruvchilaringizdan olasiz
    const token = cookies.get('access_token');
    const moduleId = url.searchParams.get('module_id');

    if (!moduleId) {
        throw error(400, 'Module ID kiritilmadi');
    }

    try {
        // Haqiqiy API so'rovi shunday bo'ladi:
        const res = await fetch(`${API_URL}/courses/${params.id}/modules/${moduleId}/lessons/${params.lesson_id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw error(res.status, 'Dars topilmadi');
        const lessonData = await res.json();

        // Keyingi darsni aniqlash uchun kurs strukturasini yuklaymiz
        let nextLesson = null;
        try {
            const courseRes = await fetch(`${API_URL}/courses/${params.id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (courseRes.ok) {
                const courseData = await courseRes.json();
                const modules = courseData.modules || [];
                
                // Barcha darslarni bitta tekis ro'yxatga yig'amiz
                const allLessons = [];
                modules.forEach(m => {
                    if (m.lessons) {
                        m.lessons.forEach(l => {
                            allLessons.push({ ...l, moduleId: m.id });
                        });
                    }
                });

                // Joriy darsning indeksini topamiz
                const currentIndex = allLessons.findIndex(l => l.id.toString() === params.lesson_id.toString());
                
                // Agar keyingi dars bo'lsa, uni saqlaymiz
                if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
                    nextLesson = allLessons[currentIndex + 1];
                }
            }
        } catch (err) {
            console.error("Keyingi darsni aniqlashda xatolik:", err);
        }

        return {
            lesson: lessonData,
            nextLesson,
            breadcrumbs: {
                course: "Mening kursim",
                lesson: lessonData.title
            }
        };

    } catch (err) {
        console.error("Darsni yuklashda xatolik:", err);
        throw error(404, 'Ma\'lumotni yuklash imkonsiz');
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
                    'Authorization': `Bearer ${token}`
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
