import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';
import * as m from '$lib/paraglide/messages.js';
import { translateServerMessage } from '$lib/utils/server-messages.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies, fetch, setHeaders }) => {
    // Cache the profile page securely for this user for 60 seconds
    setHeaders({
        'Cache-Control': 'private, max-age=60'
    });

    const token = cookies.get('access_token');
    
    try {
        const res = await fetch(`${API_URL}/auth/students/me/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept-Language': getLocale()
            }
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw error(res.status, translateServerMessage(errData, m));
        }

        const profile = await res.json();
        return { profile };
    } catch (err) {
        console.error("[Profile Load] Error:", err);
        if (err.status) throw err;
        throw error(500, m.error_occurred ? m.error_occurred() : "Xatolik yuz berdi");
    }
};

/** @type {import('./$types').Actions} */
export const actions = {
    updateProfile: async ({ request, cookies, fetch }) => {
        const token = cookies.get('access_token');
        if (!token) return { success: false, error: m.err_auth_required ? m.err_auth_required() : 'Avtorizatsiya talab qilinadi' };
        
        const formData = await request.formData();
        const data = {
            first_name: formData.get('first_name') || '',
            last_name: formData.get('last_name') || '',
            phone_number: formData.get('phone_number') || '',
        };

        try {
            const res = await fetch(`${API_URL}/auth/profile/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept-Language': getLocale()
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                return { success: false, error: translateServerMessage(errData, m) };
            }

            const updatedProfile = await res.json();

            // ✅ Yangi: Profilni to'liq qaytadan yuklaymiz (fresh fetch)
            // Bu sessionda role va boshqa ma'lumotlarni yo'qotib qo'ymaslik uchun muhim
            const profileRes = await fetch(`${API_URL}/auth/profile/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const fullUserData = profileRes.ok ? await profileRes.json() : updatedProfile;

            // ✅ user_data kuki-ni to'liq ma'lumot bilan yangilaymiz, shunda header/sidebar ham o'zgaradi
            cookies.set('user_data', JSON.stringify(fullUserData), {
                path: '/',
                httpOnly: false,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 20 // 20 minut
            });

            return { success: true, profile: fullUserData };
        } catch (err) {
            console.error("[Profile Update] Error:", err);
            return { success: false, error: m.error_occurred ? m.error_occurred() : 'Server bilan ulanishda xatolik.' };
        }
    }

};
