<script>
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import LanguageSwitcher from '@/lib/components/ui/LanguageSwitcher.svelte';

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
			<LanguageSwitcher variant="glass" />

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
