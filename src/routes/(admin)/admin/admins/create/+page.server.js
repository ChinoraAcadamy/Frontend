import { API_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies }) => {
    const accessToken = cookies.get('access_token');
    if (!accessToken) throw redirect(302, '/login');

    return {};
};

/** @type {import('./$types').Actions} */
export const actions = {
    createAdmin: async ({ request, cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const formData = await request.formData();

        const payload = {
            username:     formData.get('username')?.toString() || '',
            password:     formData.get('password')?.toString() || '',
            first_name:   formData.get('first_name')?.toString() || '',
            last_name:    formData.get('last_name')?.toString() || '',
            phone_number: formData.get('phone_number')?.toString() || ''
        };

        // Basic validation
        if (!payload.username) return fail(400, { error: 'Username kiritilishi shart' });
        if (!payload.password) return fail(400, { error: 'Parol kiritilishi shart' });

        try {
            const response = await fetch(`${API_URL}/auth/admin/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.detail || Object.values(errorData).flat().join(' ') || 'Admin yaratishda xatolik yuz berdi';
                return fail(response.status, { error: message });
            }

            return { success: true };
        } catch (err) {
            console.error('[Create Admin Action Error]:', err);
            return fail(500, { error: 'Serverda xatolik yuz berdi' });
        }
    }
};
