import { GROQ_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	try {
		const { text } = await request.json();
		if (!text || typeof text !== 'string' || text.trim() === '') {
			return json({ error: "Matn yuborilmadi yoki maydon bo'sh" }, { status: 400 });
		}

		const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${GROQ_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'llama-3.3-70b-versatile',
				messages: [
					{
						role: 'system',
						content:
							'You are a professional Uzbek to Russian translator. Translate the text from Uzbek to Russian accurately, professionally, and naturally. Return ONLY the translated Russian text. Do not include any explanations, introductory text, quotes, or markdown unless they are in the original text.'
					},
					{
						role: 'user',
						content: text.trim()
					}
				],
				temperature: 0.1
			})
		});

		if (!res.ok) {
			const errText = await res.text();
			console.error('Groq translation api error:', errText);
			return json({ error: 'AI tarjimada xatolik yuz berdi' }, { status: 500 });
		}

		const data = await res.json();
		const translation = data.choices?.[0]?.message?.content?.trim() || '';

		return json({ translation });
	} catch (err) {
		console.error('Translation API handler error:', err);
		return json({ error: 'Server ichki xatoligi' }, { status: 500 });
	}
};
