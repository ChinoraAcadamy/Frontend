import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute = (request) => deLocalizeUrl(request.url).pathname;

// Satisfy SvelteKit 2.50+ build requirement for transport export in hooks.js
export const transport = {};
