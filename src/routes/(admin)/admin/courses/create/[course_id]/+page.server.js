// /routes/(admin)/admin/courses/create/+page.server.js
import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

export const actions = {
	// 2-bosqich: Modul yaratish
	createModule: async ({ request, fetch, params, cookies }) => {
		const accessToken = cookies.get('access_token');
		if (!accessToken) return fail(401, { error: 'Avtorizatsiya talab qilinadi' });

		const formData = await request.formData();
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		};

		const modulePayload = {
			title_uz: formData.get('title_uz'),
			title_ru: formData.get('title_ru'),
			description_uz: formData.get('description_uz') || '',
			description_ru: formData.get('description_ru') || '',
			order_index: Number(formData.get('order_index')) || 0
		};

		try {
			const url = `${API_URL}/courses/${params.course_id}/modules/`;
			console.log('Sending POST to:', url, 'Payload:', modulePayload);
			const response = await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(modulePayload)
			});

			if (!response.ok) {
				const errData = await response.json().catch(() => ({}));
				console.error('Backend error creating module:', errData);
				let errMsg = errData.detail || 'Modulni saqlashda xatolik yuz berdi.';
				if (typeof errData === 'object' && !errData.detail) {
					errMsg = Object.entries(errData)
						.map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
						.join(' | ');
				}
				return fail(400, { error: errMsg });
			}

			const result = await response.json();
			return { success: true, module: result };
		} catch (err) {
			console.error('Fetch error creating module:', err);
			return fail(500, { error: err.message || 'Server bilan ulanishda xatolik.' });
		}
	}
};
