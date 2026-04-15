import { API_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const token = cookies.get('access_token');
    if (!token) {
        throw error(401, 'Unauthorized');
    }

    let body;
    try {
        body = await request.json();
    } catch {
        throw error(400, "Noto'g'ri so'rov");
    }

    const { lesson_id, watched_seconds } = body;

    if (!lesson_id) {
        throw error(400, 'Lesson ID kiritilmadi');
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
            const errorText = await response.text();
            console.error(`Backend error (${response.status}):`, errorText);
            const errorData = JSON.parse(errorText || '{}');
            throw error(response.status, errorData.message || errorData.detail || `Backend error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Lesson completed successfully:', data);
        return json({ success: true, data });
    } catch (err) {
        console.error('Error completing lesson:', err);
        throw error(err.status || 500, err.body?.message || err.body?.detail || err.message || 'Server xatoligi');
    }
}
