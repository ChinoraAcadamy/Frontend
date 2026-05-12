import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

export const prerender = false; // Hammasini prerender qilmaslik
export const ssr = true;      // SEO uchun SSR yoqilgan
export const trailingSlash = 'always';

injectAnalytics({ mode: dev ? 'development' : 'production' });