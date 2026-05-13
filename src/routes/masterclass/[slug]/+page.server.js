import { error } from '@sveltejs/kit';
import * as masterclassService from '$lib/server/masterclassService';
import { getOrSet } from '$lib/server/cache';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, fetch }) => {
    const { slug } = params;

    // Parallel ravishda API va Telegram ma'lumotlarini olamiz
    const [mc, memberCount] = await Promise.all([
        masterclassService.getMasterclass(slug, fetch),
        getOrSet(`telegram_members`, async () => {
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
        }, 3600) // 1 soat kesh (Telegram obunachilari tez o'zgarmaydi)
    ]);
    
    if (!mc) {
        throw error(404, 'Masterklass topilmadi');
    }

    return {
        masterclass: mc,
        memberCount
    };
};

