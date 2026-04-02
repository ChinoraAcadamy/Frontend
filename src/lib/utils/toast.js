import { toast } from 'svelte-sonner';

/**
 * Show a toast notification using svelte-sonner
 * @param {string} message - The message to display
 * @param {object} [options] - Toast options (optional)
 */
export function showToast(message, options = {}) {
	toast(message, options);
}
