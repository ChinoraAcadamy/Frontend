import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Default to 'light' or system preference
const initialTheme = browser ? (localStorage.getItem('theme') || 'light') : 'light';

export const theme = writable(initialTheme);

if (browser) {
	theme.subscribe((value) => {
		localStorage.setItem('theme', value);
		if (value === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			document.documentElement.removeAttribute('data-theme');
		}
	});
}
