import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ cookies, fetch }) => {
        const accessToken = cookies.get('access_token');
        const refreshToken = cookies.get('refresh_token');

        // Backend logoutni parallel boshlaymiz, lekin user kutib qolmasligi uchun 
        // faqat status ok bo'lishini kutamiz (yo'qsa ham davom etamiz)
        if (accessToken) {
            try {
                // Background logout fetch
                fetch(`${API_URL}/auth/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refresh: refreshToken })
                }).catch(e => console.error('[logout] Background API error:', e));
            } catch {
                // Xatolik bo'lsa ham davom etaveramiz
            }
        }

        // Cookielarni darhol tozalaymiz
        const cookieOptions = { path: '/' };
        cookies.delete('access_token', cookieOptions);
        cookies.delete('refresh_token', cookieOptions);
        cookies.delete('user_data', cookieOptions);
        cookies.delete('session_token', cookieOptions);

        // Super fast redirect
        throw redirect(302, '/');
    }
};