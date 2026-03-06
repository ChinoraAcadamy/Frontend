// src/hooks.server.js
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // 1. Cookiedan tokenni olamiz
    const token = event.cookies.get('session_token');

    // 2. Foydalanuvchi ma'lumotlarini (locals) barcha sahifalar uchun tayyorlaymiz
    // Bu ma'lumotlarni keyin +page.server.js ichida ishlata olamiz
    if (token) {
        // Bu yerda Python backendga so'rov yuborib tokenni tekshirish mumkin
        // Hozircha mockup:
        event.locals.user = {
            id: 1,
            role: 'student', // yoki 'admin'
            name: 'Ali Veliyev'
        };
    } else {
        // @ts-ignore
        event.locals.user = null;
    }

    // 3. Himoya (Route Protection)
    // Agar foydalanuvchi (app) yoki (admin) guruhiga kirsa-yu, login qilmagan bo'lsa:
    if (!event.locals.user && (event.url.pathname.startsWith('/courses') || event.url.pathname.startsWith('/admin'))) {
        throw redirect(303, '/login');
    }

    // 4. Admin sahifasiga student kirmoqchi bo'lsa:
    if (event.locals.user?.role !== 'admin' && event.url.pathname.startsWith('/admin')) {
        throw redirect(303, '/courses');
    }

    // So'rovni davom ettirish
    const response = await resolve(event);
    return response;
}