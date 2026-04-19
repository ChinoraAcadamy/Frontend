import { API_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages.js';
import { translateServerMessage } from '$lib/utils/server-messages.js';

export async function POST({ request, cookies }) {
    const token = cookies.get('access_token');
    if (!token) {
        throw error(401, m.err_auth_required ? m.err_auth_required() : 'Unauthorized');
    }

    let body;
    try {
        body = await request.json();
    } catch {
        throw error(400, m.error_occurred ? m.error_occurred() : "Noto'g'ri so'rov");
    }

    const { lesson_id, watched_seconds } = body;

    if (!lesson_id) {
        throw error(400, m.error_occurred ? m.error_occurred() : 'Lesson ID kiritilmadi');
    }

    try {
        console.log(`Sending complete lesson request for ${lesson_id} with watched_seconds: ${watched_seconds}`);
        const response = await fetch(`${API_URL}/progress/lessons/${lesson_id}/complete/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            // if watched seconds lesser than 60, send 60
            body: JSON.stringify({ watched_seconds: watched_seconds < 60 ? 60 : watched_seconds })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`Backend error (${response.status}):`, errorData);
            throw error(response.status, translateServerMessage(errorData, m));
        }

        const data = await response.json();
        console.log('Lesson completed successfully:', data);
        return json({ success: true, data });
    } catch (err) {
        console.error('Error completing lesson:', err);
        if (err.status) throw err;
        throw error(500, m.error_occurred ? m.error_occurred() : 'Server xatoligi');
    }
}
