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
