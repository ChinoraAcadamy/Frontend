import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

export const prerender = true;
export const trailingSlash = 'always';

injectAnalytics({ mode: dev ? 'development' : 'production' });