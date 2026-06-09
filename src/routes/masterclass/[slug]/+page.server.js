import { error } from '@sveltejs/kit';
import * as masterclassService from '$lib/server/masterclassService';
import { getOrSet } from '$lib/server/cache';

const TELEGRAM_BOT_TOKEN = '6176575449:AAHX7eDxWUZrH1NjCpLD0Ij-f9eJUq6p_FA';
const TELEGRAM_CHAT_ID = '1622899126';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, fetch }) => {
	const { slug } = params;

	// Parallel ravishda API va Telegram ma'lumotlarini olamiz
	const [mc, memberCount] = await Promise.all([
		masterclassService.getMasterclass(slug, fetch),
		getOrSet(
			`telegram_members`,
			async () => {
				try {
					const res = await fetch('https://t.me/+ZlMsl6Ool8k4Zjdi', {
						headers: {
							'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
						}
					});
					const html = await res.text();
					const match = html.match(/([\d\s]+)\s*subscribers/i);
					if (match) {
						const num = parseInt(match[1].replace(/\s/g, ''));
						return num.toLocaleString('uz-UZ') + '+';
					}
				} catch (err) {
					console.error('Telegram fetch error:', err);
				}
				return '3000+'; // Fallback
			},
			3600
		) // 1 soat kesh (Telegram obunachilari tez o'zgarmaydi)
	]);

	if (!mc) {
		throw error(404, 'Masterklass topilmadi');
	}

	return {
		masterclass: mc,
		memberCount
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	register: async ({ request, fetch }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const phone = formData.get('phone')?.toString().trim() ?? '';
		const mcTitle = formData.get('mc_title')?.toString() ?? '';

		if (!name || phone.length < 9) {
			return { success: false, error: "Ma'lumotlar to'liq emas" };
		}

		// Send Telegram notification from the server (no CSP restrictions server-side)
		try {
			const text =
				`🔥 Yangi Masterklass Registratsiyasi!\n` +
				`👤 Ismi: ${name}\n` +
				`📞 Telefon: ${phone}\n` +
				`📘 Masterklass: ${mcTitle}`;

			const res = await fetch(
				`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
				}
			);

			if (!res.ok) {
				const errBody = await res.text();
				console.error('[Telegram] sendMessage failed:', res.status, errBody);
			}
		} catch (err) {
			// Don't fail the registration if Telegram is unreachable
			console.error('[Telegram] sendMessage error:', err);
		}

		return { success: true };
	}
};

