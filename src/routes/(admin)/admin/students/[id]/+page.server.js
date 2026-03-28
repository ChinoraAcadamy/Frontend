import { API_URL } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const load = async ({ fetch, params, cookies, setHeaders }) => {
    setHeaders({
        'cache-control': 'public, max-age=60'
    });
    const accessToken = cookies.get('access_token');
    
    const res = await fetch(`${API_URL}/auth/students/${Number(params.id)}/`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        }
    });
    
    if (!res.ok) {
        throw new Error("Student topilmadi");
    }
    const student = await res.json();
    return {
        student
    };
};

// Parolni o'zgartirish uchun Form Action
export const actions = {
    changePassword: async ({ request, params, cookies, fetch }) => {
        const data = await request.formData();
        const new_password = data.get('new_password');
        const confirm_password = data.get('confirm_password');
        const accessToken = cookies.get('access_token');

        // Formani server tomondan validatsiya qilish
        if (new_password !== confirm_password) {
            return fail(400, { error: "Parollar mos tushmadi", incorrect: true });
        }
        if (new_password.toString().length < 8) {
            return fail(400, { error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak", incorrect: true });
        }

        // API ga PATCH so'rovini yuborish
        const res = await fetch(`${API_URL}/auth/students/${params.id}/change-password/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                new_password,
                confirm_password
            })
        });

        if (!res.ok) {
            // Backend'dan kelgan xatolikni o'qish (agar mavjud bo'lsa)
            const errorData = await res.json().catch(() => ({}));
            return fail(res.status, { 
                error: errorData.detail || errorData.message || "Parolni o'zgartirishda xatolik yuz berdi", 
                incorrect: true 
            });
        }

        // 200 OK: Muvaffaqiyatli
        return { success: true, message: "Parol muvaffaqiyatli o'zgartirildi!" };
    }
};