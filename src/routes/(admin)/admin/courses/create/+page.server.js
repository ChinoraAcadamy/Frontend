// /routes/(admin)/admin/courses/create/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const actions = {
    // 1-bosqich: Kurs yaratish
    createCourse: async ({ request, fetch, cookies }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        };
        const coursePayload = {
            title_uz: formData.get('title_uz'),
            title_ru: formData.get('title_ru'),
            description_uz: formData.get('description_uz') || '',
            description_ru: formData.get('description_ru') || '',
            level_uz: formData.get('level_uz') || '',
            level_ru: formData.get('level_ru') || '',
            duration: Number(formData.get('duration')) || 0,
            price: Number(formData.get('price')) || 0,
            old_price: Number(formData.get('old_price')) || 0,
            is_published: formData.get('is_published') === 'true'
        };
        // console.log('Form Data:', Object.fromEntries(data.entries()));
        try {
            const response = await fetch(`${API_URL}/courses/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(coursePayload)
            });

            if (!response.ok) {
                console.log('Server javobi:', await response.text()); // Xatolikni aniqlash uchun server javobini konsolga chiqarish
                return fail(400, { error: "Kursni saqlashda xatolik yuz berdi. Ma'lumotlarni tekshiring." });
            }

            const result = await response.json();
            console.log('Yaratilgan kurs:', result);
            // Natijadan course_pk ni qaytaramiz (backend ID ni qanday qaytarishiga qarab 'id' ni o'zgartiring)
            throw redirect(303, `/admin/courses/create/${result.id}`);
        } catch (err) {
            console.log(err)
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }
    },
};