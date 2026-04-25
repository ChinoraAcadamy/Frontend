/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	// Bu yerda backend API dan landing page ma'lumotlarini olish kerak
	// Hozircha dummy data qaytaramiz
	return {
		lp: {
			is_active: true,
			title_line1: '3 kunda',
			title_accent: 'professional',
			title_line2: 'tikuvchilik',
			title_sub: 'sirlarini oching',
			lead_text: '',
			banner_text: 'BEPUL MASTERKLASS — Tikuvchilikda professional yondashuv',
			seats_total: 50,
			seats_left: 50,
			event_days: '28–29–30 Noyabr',
			event_time: '20:30',
			event_timezone: 'Toshkent',
			original_price: 999000,
			is_free: true,
			countdown_days: [28, 29, 30],
			countdown_hour: 20,
			countdown_minute: 30,
			instructor_name: 'Ibodullayeva Chinora',
			instructor_role: 'Chinora Academy asoschisi & Master Dizayner',
			instructor_bio: '',
			instructor_image: '/images/hero_compressed.jpg',
			stat_students: '5000+',
			stat_experience: '10 yil',
			stat_practical: '100%',
			why_title: 'Nazariya emas — tayyor tizim',
			why_desc: '',
			telegram_link: 'https://t.me/+ZlMsl6Ool8k4Zjdi',
			eyebrow_text: 'Eksklyuziv masterklass',
			benefits_title: "Masterklassda nimalarni o'rganasiz?",
			benefits: [
				'Myuller metodikasi — asos andazani 0 dan professional qurish',
				'Avtorlik "Anor" assimetriya fasonini boshidan oxirigacha modellashtirish',
				"Daromadingizni 5x gacha oshirish: narx qo'yish va mijozlar jalb qilish",
				"Raqobatchilardan 10 qadam oldinga o'tadigan konstruksiya sirlari",
				"Brend uslubida libos tikish va o'z imzovingizni yaratish"
			]
		},
		lazy: {
			registrations: Promise.resolve([]) // Hozircha bo'sh ro'yxat
		}
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	saveLanding: async ({ request }) => {
		try {
			const formData = await request.formData();
			const lpDataString = formData.get('lp_data');
			const benefitsString = formData.get('benefits');

			if (!lpDataString || !benefitsString) {
				return { success: false, error: "Ma'lumotlar yetarli emas" };
			}

			const lpData = JSON.parse(lpDataString.toString());
			const benefits = JSON.parse(benefitsString.toString());

			console.log('Saving LP Data:', lpData);
			console.log('Benefits:', benefits);

			// TODO: API ga saqlash logikasini yozish kerak
			// await fetch(...)

			return {
				success: true,
				message: 'Muvaffaqiyatli saqlandi!'
			};
		} catch (e) {
			console.error('Save error:', e);
			return { success: false, error: 'Saqlashda xatolik yuz berdi' };
		}
	},
	exportCsv: async () => {
		// CSV eksport logikasi
		return { success: true };
	}
};
