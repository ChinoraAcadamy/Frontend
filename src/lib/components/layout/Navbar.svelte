<script>
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref, getLocale, locales, setLocale } from '$lib/paraglide/runtime.js';
	import { page } from '$app/stores';

	const languageNames = {
		uz: "O'zbekcha",
		ru: 'Русский',
		// agar en qo'shmoqchi bo'lsang: en: 'English'
	};

	let openLang = false;

	function switchLang(lang) {
		setLocale(lang);
	}

	import { onMount } from 'svelte';
	onMount(() => {
		if ($page.url.pathname.startsWith('/ru')) {
			setLocale('ru');
		} 
	});
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="fixed top-6 right-0 left-0 z-50 flex w-full justify-center px-4 text-white">
	<nav
		class="flex w-full max-w-5xl items-center justify-between rounded-full border border-white/20 bg-black/20 px-6 py-3 shadow-lg backdrop-blur-md transition-all"
	>
		<div class="flex items-center gap-3">
			<svg class="h-8 w-8" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" /></svg>
			<div class="flex flex-col">
				<span class="text-sm leading-tight font-bold tracking-widest uppercase">Chinora</span>
				<span class="text-[10px] tracking-widest uppercase opacity-70">Academy</span>
			</div>
		</div>

		<div class="hidden gap-8 md:flex">
			<a
				href="/courses"
				class="border-b-2 border-transparent pb-0.5 text-sm font-medium text-white/80 transition-colors hover:border-white hover:text-white"
			>
				{m.nav_courses()}
			</a>
			<a
				href="/profile"
				class="border-b-2 border-transparent pb-0.5 text-sm font-medium text-white/80 transition-colors hover:border-white hover:text-white"
			>
				{m.nav_profile()}
			</a>
		</div>
		<div class="flex items-center gap-6">
			<div class="relative" role="button" tabindex="0" on:keydown|self={(e) => { if (e.key === 'Escape') openLang = false; }}>
				<button
					class="flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-white"
					on:click={() => openLang = !openLang}
					aria-haspopup="listbox"
					aria-expanded={openLang}
				>
					{languageNames[getLocale()] || getLocale().toUpperCase()}
					<svg class="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
						class="absolute right-0 mt-4 w-32 overflow-hidden rounded-xl border border-white/20 bg-black/80 shadow-2xl backdrop-blur-md z-50"
						tabindex="-1"
					>
						{#each locales as lang (lang)}
							<a
								href={localizeHref($page.url.pathname, { locale: lang })}
								data-sveltekit-reload
								on:click={() => { switchLang(lang); openLang = false; }}
								class="block px-4 py-2 text-sm transition-colors hover:bg-white/20 {getLocale() === lang ? 'font-bold text-white' : 'text-white/70'}"
							>
								{languageNames[lang] || lang.toUpperCase()}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<a
				href="/login"
				class="rounded-full bg-white px-5 py-2.5 text-xs font-bold tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
			>
				   {m.nav_login().toUpperCase()}
			   </a>
		   </div>
	</nav>
</div>
