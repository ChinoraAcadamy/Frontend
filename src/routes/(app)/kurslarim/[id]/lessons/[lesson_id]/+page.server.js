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


        // Hozir API spec yo'qligi sababli, mock obyekt ishlatamiz.
        // const lessonData = {
        //     id: params.lesson_id || "123",
        //     title: "Yangi dars",
        //     description: "Ushbu darsda SvelteKit va zamonaviy interfeyslar yaratishni o'rganamiz.",
        //     video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
        //     image: "https://images.unsplash.com/photo-1607706189992-eae578626c86?q=80&w=1000&auto=format&fit=crop",
        //     duration: 15,
        //     order_index: 1,
        //     created_at: "2026-03-28T10:00:00Z",
        //     assignments: [
        //         {
        //             id: 1,
        //             title: "Birinchi vazifa: Fayl yuklash",
        //             max_attempts: 3,
        //             submissions: []
        //         }
        //     ]
        // };

        return {
            lesson: lessonData,
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
    uploadAssignment: async () => {
        // const formData = await request.formData();
        // const file = formData.get('file');

        // Bu joyda faylni haqiqiy serveringizga yuborasiz
        return { success: true };
    }
};
