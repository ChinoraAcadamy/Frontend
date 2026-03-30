// /routes/(admin)/admin/courses/create/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const actions = {
    // 1-bosqich: Kurs yaratish
    createCourse: async ({ request, fetch, cookies }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return redirect(302, '/login');

        // Formani qabul qilib olamiz
        const formData = await request.formData();

        // Agar foydalanuvchi rasm tanlamagan bo'lsa (bo'sh fayl kelsa), 
        // backend xato bermasligi uchun uni o'chirib tashlaymiz
        const img = formData.get('img');
        if (img instanceof File && img.size === 0) {
            formData.delete('img');
        }

        // MUHIM: 'Content-Type' ni qo'lda yozmaymiz! 
        // fetch() ga formData berilganda, u o'zi to'g'ri 'multipart/form-data' 
        // va kerakli 'boundary' larni qo'yib beradi.
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': 'true'
        };

        let resultId; // Redirect uchun ID ni saqlab turamiz

        try {
            const response = await fetch(`${API_URL}/courses/`, {
                method: 'POST',
                headers,
                body: formData // coursePayload (JSON) o'rniga to'g'ridan-to'g'ri formData beramiz
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server javobi:', errorText);
                return fail(400, { error: "Kursni saqlashda xatolik yuz berdi. Ma'lumotlarni tekshiring." });
            }

            const result = await response.json();
            resultId = result.id; // Yaratilgan kurs ID sini olamiz
            console.log(result)
            
        } catch (err) {
            console.error(err);
            return fail(500, { error: err.message || "Server bilan ulanishda xatolik." });
        }

        // SvelteKit'da 'redirect' doim try-catch bloki tashqarisida bo'lishi kerak.
        // Aks holda catch() xatodek ushlab oladi va 500 error qaytaradi.
        if (resultId) {
            throw redirect(303, `/admin/courses/create/${resultId}`);
        }
    },
};