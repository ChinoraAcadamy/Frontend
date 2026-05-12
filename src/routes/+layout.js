import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

export const prerender = false; // Hammasini prerender qilmaslik
export const ssr = false;      // SPA (Single Page App) rejimida ishlash
export const trailingSlash = 'always';

injectAnalytics({ mode: dev ? 'development' : 'production' });