import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies }) => {
        const accessToken = cookies.get('access_token');
        const refreshToken = cookies.get('refresh_token');

        if (accessToken) {
            try {
                const res = await fetch(`${API_URL}/auth/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ refresh: refreshToken })
                });
                
                // ← shu ikki qatorni qo'shing
                console.log('Logout API status:', res.status);
                console.log('Logout API response:', await res.text());
                
            } catch (e) {
                console.error('[logout] API xatosi:', e);
            }
        }

        // Cookie tozalash va redirect — API xato bo'lsa ham bajariladi
        const opts = { path: '/' };
        cookies.delete('access_token', opts);
        cookies.delete('refresh_token', opts);
        cookies.delete('session_token', opts);
        cookies.delete('user_data', opts);

        redirect(302, '/');
    }
};