<script>
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime.js';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';

	const languageNames = {
		uz: "O'zbekcha",
		ru: 'Русский'
	};

	let openLang = false;

	// URL o'zgarmasligi uchun faqat state'ni yangilaymiz va LocalStorage'ga saqlaymiz
	function switchLang(lang) {
		setLocale(lang);
		openLang = false;
		if (browser) {
			localStorage.setItem('preferred_lang', lang);
		}
	}

	function isValidLocale(lang) {
		return Array.isArray(locales) && locales.includes(lang);
	}
	onMount(() => {
		// Sahifa yuklanganda LocalStorage'dan oxirgi tilni o'qib o'rnatish
		if (browser) {
			const savedLang = localStorage.getItem('preferred_lang');
			if (savedLang && isValidLocale(savedLang)) {
				setLocale(/** @type {"uz"|"ru"} */(savedLang));
			}
		}
	});
</script>

<div class="fixed top-6 right-0 left-0 z-50 flex w-full justify-center px-4 text-white">
	<nav
		class="flex w-full max-w-5xl items-center justify-between rounded-full border border-white/20 bg-primary/20 px-6 py-3 shadow-lg backdrop-blur-md transition-all"
	>
		<a href={resolve('/')} class="flex items-center gap-3 text-secondary/80">
			<svg class="h-8 w-8" fill="bg-accent" viewBox="0 0 24 24"
				><path d="M12 2L2 22h20L12 2z" /></svg
			>
			<div class="flex flex-col">
				<span class="text-sm leading-tight font-bold tracking-widest uppercase">Chinora</span>
				<span class="text-[10px] tracking-widest uppercase opacity-70">Academy</span>
			</div>
		</a>

		<div class="hidden gap-8 md:flex">
			<a
				href={resolve('/')}
				// courses sahifasiga olib boradi
				class="border-b-2 border-transparent pb-0.5 text-sm font-medium text-secondary/80 transition-colors hover:border-white hover:text-white"
			>
				{m.nav_courses()}
			</a>
			{#if $page.data.isAuthenticated}
				<a
					href={resolve('/profil')}
					// profil sahifasiga olib boradi
					class="border-b-2 border-transparent pb-0.5 text-sm font-medium text-secondary/80 transition-colors hover:border-white hover:text-white"
				>
					{m.nav_profile()}
				</a>
			{/if}
		</div>

		<div class="flex items-center gap-6">
			<div
				class="relative"
				role="button"
				tabindex="0"
				on:keydown|self={(e) => {
					if (e.key === 'Escape') openLang = false;
				}}
			>
				<button
					class="flex items-center gap-1 text-sm font-medium text-secondary/90 transition-colors hover:text-secondary"
					on:click={() => (openLang = !openLang)}
					aria-haspopup="listbox"
					aria-expanded={openLang}
				>
					{languageNames[getLocale()] || getLocale().toUpperCase()}
					<svg
						class="h-4 w-4 opacity-70 transition-transform {openLang ? 'rotate-180' : ''}"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>

				{#if openLang}
					<div
						class="absolute right-0 z-50 mt-4 w-32 overflow-hidden rounded-xl border border-white/20 bg-black/80 shadow-2xl backdrop-blur-md"
						tabindex="-1"
					>
						{#each locales as lang (lang)}
							<button
								on:click={() => switchLang(lang)}
								class="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/20 {getLocale() ===
								lang
									? 'bg-white/10 font-bold text-white'
									: 'text-white/70'}"
							>
								{languageNames[lang] || lang.toUpperCase()}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			{#if $page.data.isAuthenticated}
				<a
					href={resolve('/profil')}
					class="rounded-full bg-white px-5 py-2.5 text-xs font-bold tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
				>
					{m.nav_profile().toUpperCase()}
				</a>
			{/if}
			{#if !$page.data.isAuthenticated}
				<a
					href={resolve('/login')}
					class="rounded-full bg-white px-5 py-2.5 text-xs font-bold tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
				>
					{m.nav_login().toUpperCase()}
				</a>
			{/if}
		</div>
	</nav>
</div>
