import { API_URL } from "$env/static/private";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ fetch, locals, cookies }) => {
    if (!locals.isAuthenticated) {
        throw redirect(302, '/login');
    }

    try {
        const accessToken = cookies.get('access_token');
        const response = await fetch(`${API_URL}/auth/students/me/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!response.ok) {
            return {
                student: null,
                error: "Profil ma'lumotlarini yuklashda xatolik yuz berdi."
            };
        }

        const student = await response.json();
        return {
            student
        };
    } catch (err) {
        console.error("Profile load error:", err);
        return {
            student: null,
            error: "Server bilan ulanishda xatolik."
        };
    }
};

export const actions = {
    updateProfile: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const phoneNumber = formData.get('phoneNumber');

        const accessToken = cookies.get('access_token');
        if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

        try {
            const response = await fetch(`${API_URL}/auth/students/me/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return fail(400, { 
                    error: errorData.detail || "Ma'lumotlarni saqlashda xatolik yuz berdi.",
                    success: false 
                });
            }

            const updatedStudent = await response.json();
            return {
                success: true,
                student: updatedStudent
            };
        } catch (err) {
            return fail(500, { error: err, success: false });
        }
    }
};
