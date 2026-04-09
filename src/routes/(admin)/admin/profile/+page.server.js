import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const load = async ({ parent }) => {
    // `layout.server.js` da foydalanuvchi qilib yuklangan ma'lumotlarni olamiz
    const { user } = await parent();
    return { user };
};

export const actions = {
    updateProfile: async ({ request, fetch, cookies }) => {
        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        const formData = await request.formData();
        const payload = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            phone_number: formData.get('phone_number')
        };

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        try {
            // Faraz qilamiz, /users/me/ yoki /auth/profile/ endpoint orqali yangilanadi
            const response = await fetch(`${API_URL}/users/me/`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                return fail(400, { error: errData.detail || "Profilni saqlashda xatolik yuz berdi." });
            }
            
            const updatedUser = await response.json();
            return { success: true, user: updatedUser };

        } catch (err) {
            console.error(err);
            return fail(500, { error: "Server bilan ulanishda xatolik." });
        }
    }
};
