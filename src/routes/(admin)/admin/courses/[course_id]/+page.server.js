import { API_URL } from "$env/static/private";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ parent }) => {
    const { modules } = await parent();

    return { modules };
};

export const actions = {
    deleteCourse: async ({ params, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        try {
            // params.id fayl yo'lidan ([id]) avtomatik keladi
            const response = await fetch(`${API_URL}/courses/${params.course_id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                return fail(400, { error: "Kursni o'chirishda xatolik yuz berdi." });
            }
        } catch (err) {
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }

        // Muvaffaqiyatli o'chirilsa, kurslar ro'yxatiga qaytarib yuboramiz. 
        // Manzilni o'zingizning admin kurslar sahifangizga moslang.
        throw redirect(303, '/admin/courses');
    }
};