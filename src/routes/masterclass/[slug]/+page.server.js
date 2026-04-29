import { error } from '@sveltejs/kit';
import * as masterclassService from '$lib/server/masterclassService';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, fetch }) => {
    const { slug } = params;
    let memberCount = '3000+';
    
    // Public fetch doesn't need accessToken if API is public
    // If it needs auth, we'd need a service account or similar, but detail is usually public.
    const mc = await masterclassService.getMasterclass(slug, fetch);
    
    if (!mc) {
        throw error(404, 'Masterklass topilmadi');
    }

    try {
        const res = await fetch('https://t.me/+ZlMsl6Ool8k4Zjdi', {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
            }
        });
        const html = await res.text();
        
        // "3 435 subscribers" yoki "3435 subscribers" formatda keladi
        const match = html.match(/([\d\s]+)\s*subscribers/i);
        
        if (match) {
            const num = parseInt(match[1].replace(/\s/g, ''));
            memberCount = num.toLocaleString('uz-UZ') + '+';
        }
    } catch (error) {
        console.log(error);
    }

    console.log(memberCount);
    
    return {
        masterclass: mc,
        memberCount
    };
};
