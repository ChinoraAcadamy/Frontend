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
        const response = await fetch(`${API_URL}/progress/lessons/${lesson_id}/complete/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ watched_seconds: watched_seconds || 0 })
        });

        if (!response.ok) {
            throw error(response.status, 'Xatolik yuz berdi');
        }

        console.log(await response.json())

        return json({ success: true });
    } catch (err) {
        console.error('Error completing lesson:', err);
        throw error(500, 'Server xatoligi');
    }
}
