import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export async function load({ params, cookies }) {
    // API URL ni o'zingizning .env yoki o'zgaruvchilaringizdan olasiz
    const token = cookies.get('access_token');

    try {
        /* // Haqiqiy API so'rovi shunday bo'ladi:
        const res = await fetch(`${API_URL}/courses/${params.course_id}/modules/${params.module_id}/lessons/${params.lesson_id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw error(res.status, 'Dars topilmadi');
        const lessonData = await res.json();
        */

        // Hozircha UI uchun siz bergan Swagger sxemasi asosida MOCK (soxta) data qaytaramiz:
        const lessonData = {
            id: params.lesson_id || "123",
            title: "Yangi dars qo'shish",
            description: "Complete course/heading throwing rufrer callonish, and derelation of yangi dars qo'shish. Ushbu darsda SvelteKit va Tailwind CSS yordamida zamonaviy interfeyslar yaratishni o'rganamiz.",
            video_url: "https://www.w3schools.com/html/mov_bbb.mp4", // Namuna video
            image: "https://images.unsplash.com/photo-1607706189992-eae578626c86?q=80&w=1000&auto=format&fit=crop", // Poster rasm
            duration: 15,
            order_index: 1,
            created_at: "2026-03-28T10:00:00Z",
            // Dizayndagi Assignment ma'lumotlari
            assignments: [
                {
                    id: 1,
                    title: "Assignment 1",
                    max_attempts: 20,
                    submissions: [
                        { id: 101, course_name: "Course 1", score: 50, status: "Pending", feedback: null },
                        { id: 102, course_name: "Yangi Kurs", score: 80, status: "Graded", feedback: "The written documentation is well prepared. Great job!" },
                    ]
                }
            ]
        };

        // UI da ishlatish uchun path nomlarini ham beramiz (Breadcrumbs uchun)
        return {
            lesson: lessonData,
            breadcrumbs: {
                course: "Course Name",
                module: "Module 1",
                lesson: lessonData.title
            }
        };

    } catch (err) {
        console.error("Darsni yuklashda xatolik:", err);
        throw error(404, 'Ma\'lumotni yuklash imkonsiz');
    }
}