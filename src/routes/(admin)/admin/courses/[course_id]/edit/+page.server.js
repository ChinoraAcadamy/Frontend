import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const load = async ({ parent }) => {
    // Parent `load` function in `[course_id]/+layout.server.js` 
    // already fetches the course and modules
    const { course } = await parent();
    
    if (!course) {
        throw redirect(303, '/admin/courses');
    }

    return { course };
};

export const actions = {
    updateCourse: async ({ request, fetch, cookies, params }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return redirect(302, '/login');

        const formData = await request.formData();

        // Agar foydalanuvchi yangi rasm tanlamagan bo'lsa (bo'sh fayl kelsa)
        const img = formData.get('img');
        if (img instanceof File && img.size === 0) {
            formData.delete('img');
        }

        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            const response = await fetch(`${API_URL}/courses/${params.course_id}/`, {
                method: 'PATCH', // To update only provided fields
                headers,
                body: formData 
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server javobi:', errorText);
                return fail(400, { error: "Kursni tahrirlashda xatolik yuz berdi." });
            }

            // Muvaffaqiyatli tahrirlansa
            // await response.json();
            
        } catch (err) {
            console.error(err);
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }

        // Tahrirlash muvaffaqiyatli yakunlangach, kurs darslari sahifasiga qaytamiz
        return { success: true };
    },
};
