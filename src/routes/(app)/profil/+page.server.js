import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import { getLocale } from '@/lib/paraglide/runtime';

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
            throw error(res.status, 'Profil ma\'lumotlarini yuklab bo\'lmadi.');
        }

        const profile = await res.json();
        return { profile };
    } catch (err) {
        console.error("[Profile Load] Error:", err);
        throw error(err.status || 500, err.body?.message || "Xatolik yuz berdi");
    }
};

/** @type {import('./$types').Actions} */
export const actions = {
    updateProfile: async ({ request, cookies, fetch }) => {
        const token = cookies.get('access_token');
        const formData = await request.formData();
        
        const data = {
            first_name: formData.get('first_name') || '',
            last_name: formData.get('last_name') || '',
            phone_number: formData.get('phone_number') || '',
        };

        try {
            const res = await fetch(`${API_URL}/auth/students/me/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept-Language': getLocale()
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                return { success: false, error: errData.detail || 'Ma\'lumotlarni yangilashda xatolik yuz berdi.' };
            }

            const updatedProfile = await res.json();
            return { success: true, profile: updatedProfile };
        } catch (err) {
            console.error("[Profile Update] Error:", err);
            return { success: false, error: 'Server bilan ulanishda xatolik.' };
        }
    }
};
