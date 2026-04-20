import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const load = async ({ fetch, cookies }) => {
    const accessToken = cookies.get('access_token');
    
    // Lazy loading: profile ma'lumotlarini promise ko'rinishida qaytaramiz
    // Bu sahifaning qobig'ini (shell) tezroq yuklanishini ta'minlaydi
    const fetchProfile = async () => {
        if (!accessToken) return null;
        try {
            const response = await fetch(`${API_URL}/auth/profile/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('[Admin Profile Load] Error:', err);
            return null;
        }
    };

    return {
        lazy: {
            profile: fetchProfile()
        }
    };
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
            const response = await fetch(`${API_URL}/auth/profile/`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                return fail(400, { error: errData.detail || "Profilni saqlashda xatolik yuz berdi." });
            }
            
            const updatedUser = await response.json();

            // ✅ Yangi: Profilni to'liq qaytadan yuklaymiz (fresh fetch)
            // Bu sessionda role va boshqa ma'lumotlarni yo'qotib qo'ymaslik uchun muhim
            const profileRes = await fetch(`${API_URL}/auth/profile/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            
            const fullUserData = profileRes.ok ? await profileRes.json() : updatedUser;

            // ✅ user_data kuki-ni to'liq ma'lumot bilan yangilaymiz, shunda header/sidebar ham o'zgaradi
            cookies.set('user_data', JSON.stringify(fullUserData), {
                path: '/',
                httpOnly: false,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 20 // 20 minut
            });

            return { success: true, user: fullUserData };

        } catch (err) {

            console.error(err);
            return fail(500, { error: "Server bilan ulanishda xatolik." });
        }
    }
};


