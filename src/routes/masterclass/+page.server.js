import { redirect } from '@sveltejs/kit';
import * as masterclassService from '$lib/server/masterclassService';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch }) => {
    // Fetch all masterclasses to find the latest active one
    const data = await masterclassService.getMasterclasses(fetch);
    const masterclasses = data.results || [];
    
    // Filter active and pick the first (latest)
    const active = masterclasses.find(m => m.is_active);
    
    if (active) {
        throw redirect(307, `/masterclass/${active.slug}`);
    }
    
    // If none found, we can either show a 404 or just pick the first one anyway
    if (masterclasses.length > 0) {
        throw redirect(307, `/masterclass/${masterclasses[0].slug}`);
    }
    
    // Fallback if absolutely none exist
    return {
        masterclasses: []
    };
};
