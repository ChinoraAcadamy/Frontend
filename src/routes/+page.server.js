// src/routes/+page.server.js
import { API_URL } from '$env/static/private';

export const load = async () => {
    try {
        const response = await fetch(`${API_URL}/courses/`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!response.ok) {
            return { courses: [] };
        }

        const data = await response.json();
        return { courses: data.results ?? [] };

    } catch (err) {
        console.error('Courses fetch xatosi:', err);
        return { courses: [] };
    }
};