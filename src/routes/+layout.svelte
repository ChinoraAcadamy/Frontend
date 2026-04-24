<script>
// @ts-nocheck

	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';

	import TopLoader from '@/lib/components/TopLoader.svelte';
	import ToastProvider from '@/lib/components/ui/ToastProvider.svelte';

	let { children } = $props();
	
	// Home page'da dark theme'ni o'chirib qo'yish
	$effect(() => {
		const isHomePage = page.url.pathname === '/' || 
		                   page.url.pathname === '/uz' || 
						   page.url.pathname === '/ru' ||
						   page.url.pathname === '/uz/' ||
						   page.url.pathname === '/ru/';
		
		if (isHomePage) {
			document.documentElement.removeAttribute('data-theme');
			document.documentElement.classList.remove('dark');
		} else {
			// Boshqa sahifalarda store'dagi theme'ni qayta tiklaymiz
			const savedTheme = localStorage.getItem('theme') || 'light';
			if (savedTheme === 'dark') {
				document.documentElement.setAttribute('data-theme', 'dark');
				document.documentElement.classList.add('dark');
			}
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<TopLoader />
<ToastProvider />
<main>
	{@render children()}
</main>

<!-- <ThemeCustomizer /> -->

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }))}>{locale}</a>
	{/each}
</div>
