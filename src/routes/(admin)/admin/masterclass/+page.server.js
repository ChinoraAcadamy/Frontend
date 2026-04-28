import { error } from '@sveltejs/kit';
import * as masterclassService from '$lib/server/masterclassService';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies }) => {
	const accessToken = cookies.get('access_token');
	if (!accessToken) throw error(401, 'Avtorizatsiya talab qilinadi');

	const masterclasses = await masterclassService.getMasterclasses(fetch, accessToken);
	const results = masterclasses.results || [];

	return {
		masterclasses: results,
		// If there's at least one, we can default to it, otherwise return null
		lp: results.length > 0 ? results[0] : null,
		lazy: {
			registrations: Promise.resolve([]) // TODO: Fetch registrations if endpoint exists
		}
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	saveLanding: async ({ request, fetch, cookies }) => {
		const accessToken = cookies.get('access_token');
		if (!accessToken) throw error(401, 'Avtorizatsiya talab qilinadi');

		try {
			const formData = await request.formData();
			const lpDataString = formData.get('lp_data');
			const benefitsString = formData.get('benefits');
			const instructorPhoto = formData.get('instructor_photo');

			if (!lpDataString || !benefitsString) {
				return { success: false, error: "Ma'lumotlar yetarli emas" };
			}

			const lpData = JSON.parse(lpDataString.toString());
			const benefitsList = JSON.parse(benefitsString.toString());

			// Map benefits to API format [ { order, text } ]
			const benefits = benefitsList.map((text, index) => ({
				order: index + 1,
				text: text
			}));

			// Construct FormData for the API call to support file upload
			const apiFormData = new FormData();
			
			// Main fields
			apiFormData.append('is_active', String(lpData.is_active));
			apiFormData.append('title_line1', lpData.title_line1);
			apiFormData.append('title_line1_italic', lpData.title_accent || '');
			apiFormData.append('title_line2', lpData.title_line2);
			apiFormData.append('title_subtitle', lpData.title_sub || '');
			apiFormData.append('lead_text', lpData.lead_text || '');
			apiFormData.append('banner_top', lpData.banner_text || '');
			apiFormData.append('total_seats', String(lpData.seats_total || 0));
			apiFormData.append('remaining_seats', String(lpData.seats_left || 0));
			apiFormData.append('dates', lpData.event_days || '');
			apiFormData.append('time', lpData.event_time || '');
			apiFormData.append('timezone', lpData.event_timezone || '');
			apiFormData.append('original_price', String(lpData.original_price || 0));
			apiFormData.append('is_free', String(lpData.is_free));
			apiFormData.append('countdown_hour', String(lpData.countdown_hour || 0));
			apiFormData.append('countdown_minute', String(lpData.countdown_minute || 0));
			apiFormData.append('countdown_month', String(lpData.countdown_month || (new Date().getMonth() + 1)));
			apiFormData.append('countdown_year', String(lpData.countdown_year || new Date().getFullYear()));
			apiFormData.append('countdown_days', Array.isArray(lpData.countdown_days) ? lpData.countdown_days.join(', ') : String(lpData.countdown_days || ''));
			apiFormData.append('instructor_name', lpData.instructor_name || '');
			apiFormData.append('instructor_title', lpData.instructor_role || '');
			apiFormData.append('instructor_bio', lpData.instructor_bio || '');
			apiFormData.append('benefits_section_title', lpData.benefits_title || '');
			apiFormData.append('why_title', lpData.why_title || '');
			apiFormData.append('why_description', lpData.why_desc || '');
			apiFormData.append('telegram_invite_link', lpData.telegram_link || '');
			apiFormData.append('eyebrow_badge', lpData.eyebrow_text || '');
			apiFormData.append('slug', lpData.slug || 'masterclass-' + Date.now());
			
			// Benefits as JSON string (most DRF setups accept this for nested data in multipart)
			apiFormData.append('benefits', JSON.stringify(benefits));

			// File upload
			if (instructorPhoto instanceof File && instructorPhoto.size > 0) {
				apiFormData.append('instructor_photo', instructorPhoto);
			}

			let response;
			if (lpData.id) {
				// Update
				response = await masterclassService.updateMasterclass(lpData.slug, apiFormData, fetch, accessToken);
			} else {
				// Create
				response = await masterclassService.createMasterclass(apiFormData, fetch, accessToken);
			}

			if (!response.ok) {
				const errData = await response.json();
				console.error('API Error:', errData);
				return { success: false, error: errData.detail || "Saqlashda xatolik yuz berdi" };
			}

			return {
				success: true,
				message: 'Muvaffaqiyatli saqlandi!'
			};
		} catch (e) {
			console.error('Save error:', e);
			return { success: false, error: 'Saqlashda xatolik yuz berdi' };
		}
	},
	deleteMasterclass: async ({ request, fetch, cookies }) => {
		const accessToken = cookies.get('access_token');
		if (!accessToken) throw error(401, 'Avtorizatsiya talab qilinadi');

		const formData = await request.formData();
		const slug = formData.get('slug');

		if (!slug) return { success: false, error: 'Slug topilmadi' };

		const res = await masterclassService.deleteMasterclass(slug, fetch, accessToken);
		if (res.ok) {
			return { success: true, message: "O'chirildi" };
		}
		return { success: false, error: "O'chirishda xatolik" };
	}
};
