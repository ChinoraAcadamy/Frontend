import { fail, redirect } from '@sveltejs/kit';

// Bu yerga Python API manzilingizni yozasiz
const PYTHON_API_URL = 'https://api.sizning-domeningiz.com'; 

export const actions = {
    login: async ({ request, cookies, fetch }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            return fail(400, { error: "Username va parolni to'ldirish majburiy." });
        }

        try {
            // Python API'ga POST so'rov yuborish
            const response = await fetch(`${PYTHON_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Python odatda JSON qabul qiladi
                body: JSON.stringify({ username, password }) 
            });

            const result = await response.json();

            // Agar API'dan xatolik qaytsa (masalan, parol xato bo'lsa)
            if (!response.ok) {
                return fail(response.status, { 
                    error: result.message || "Username yoki parol noto'g'ri!" 
                });
            }

            // Agar login muvaffaqiyatli bo'lsa va API token qaytarsa:
            // (result.token yoki result.access_token bo'lishi mumkin, APIdan kelayotganiga qaraysiz)
            const token = result.access_token || result.token; 

            if (token) {
                // Tokenni xavfsiz HTTP-Only Cookie ga saqlaymiz
                cookies.set('auth_token', token, {
                    path: '/',
                    httpOnly: true,             // Brauzer JS orqali o'qiy olmaydi (xavfsizlik uchun)
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV === 'production', // Prod'da faqat HTTPS
                    maxAge: 60 * 60 * 24 * 7    // 1 haftagacha yaroqli
                });
            }

        } catch (err) {
            console.error('API bilan bog\'lanishda xatolik:', err);
            return fail(500, { error: "Server bilan ulanishda xatolik yuz berdi." });
        }

        // Hamma narsa joyida bo'lsa, profile sahifasiga yo'naltiramiz
        throw redirect(302, '/profile');
    }
};