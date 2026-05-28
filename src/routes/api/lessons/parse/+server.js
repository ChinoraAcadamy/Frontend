import { GROQ_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	try {
		const { text } = await request.json();
		if (!text || typeof text !== 'string' || text.trim() === '') {
			return json({ error: "Matn yuborilmadi yoki maydon bo'sh" }, { status: 400 });
		}

		const systemPrompt = `You are a structured lesson details parser. The user will provide a raw text describing a lesson in Uzbek. 
Your job is to parse it and return a valid, well-structured JSON object matching the following schema.
If some fields are missing, extract as much as possible, or leave them empty.
You MUST also translate the extracted Uzbek title and Uzbek description to Russian for the respective *_ru fields!

JSON Schema to return:
{
  "title_uz": "Extract or summarize the lesson name in Uzbek",
  "title_ru": "Translate the extracted title_uz to Russian accurately",
  "description_uz": "Extract or summarize the lesson description/tavsif in Uzbek. If not specified, return empty string.",
  "description_ru": "Translate the extracted description_uz to Russian accurately. If not specified, return empty string.",
  "duration": A float or integer representing the duration of the lesson in minutes. Parse human expressions (e.g. '15 daqiqa' -> 15, 'yarim soat' -> 30, 'bir soat' -> 60). If not found, return 0.
}

Return ONLY valid raw JSON. Do not include any markdown backticks, frontmatter, or introductory conversational text. Example output:
{"title_uz": "Dars nomi", "title_ru": "Название урока", "description_uz": "Tavsif", "description_ru": "Описание", "duration": 15}`;

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
						content: systemPrompt
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
			console.error('Groq lesson parsing api error:', errText);
			return json({ error: 'AI parsing xizmatida xatolik' }, { status: 500 });
		}

		const data = await res.json();
		let rawContent = data.choices?.[0]?.message?.content?.trim() || '';

		// Har qanday markdown kod bloklarini tozalash
		rawContent = rawContent.replace(/```json|```/g, '').trim();

		try {
			const parsedData = JSON.parse(rawContent);
			return json(parsedData);
		} catch (parseErr) {
			console.error('Failed to parse JSON response from LLM:', rawContent, parseErr);
			return json({ error: 'AI tushunarsiz javob qaytardi' }, { status: 500 });
		}
	} catch (err) {
		console.error('Lessons parse API handler error:', err);
		return json({ error: 'Server ichki xatoligi' }, { status: 500 });
	}
};
