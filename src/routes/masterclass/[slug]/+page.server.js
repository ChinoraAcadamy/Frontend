import { error } from '@sveltejs/kit';
import * as masterclassService from '$lib/server/masterclassService';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, fetch }) => {
    const { slug } = params;
    
    // Public fetch doesn't need accessToken if API is public
    // If it needs auth, we'd need a service account or similar, but detail is usually public.
    const mc = await masterclassService.getMasterclass(slug, fetch);
    
    if (!mc) {
        throw error(404, 'Masterklass topilmadi');
    }
    
    return {
        masterclass: mc
    };
};
