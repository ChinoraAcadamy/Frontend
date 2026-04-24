<script lang="ts">
	import { MoreHorizontal, X } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let { children, label = 'Amallar' } = $props();
	let isOpen = $state(false);

	function toggleMenu(e) {
		e.stopPropagation();
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') closeMenu();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative inline-block text-left">
	<button
		type="button"
		onclick={toggleMenu}
		class="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted/10 active:scale-90 lg:hidden"
		aria-label={label}
		aria-expanded={isOpen}
	>
		<MoreHorizontal size={20} class="text-muted" />
	</button>
	<div class="desktop-menu flex items-center gap-1.5 sm:hidden md:hidden lg:flex">
		{@render children()}
	</div>
	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-[1500] bg-black/60 backdrop-blur-sm lg:hidden"
			transition:fade={{ duration: 200 }}
			onclick={closeMenu}
		></div>
		<div
			class="fixed right-0 bottom-0 left-0 z-[1501] rounded-t-[32px] bg-surface p-6 pb-12 shadow-2xl ring-1 ring-border lg:hidden"
			transition:fly={{ y: 300, duration: 300, opacity: 1 }}
		>
			<div class="mb-6 flex items-center justify-between">
				<h4 class="text-lg font-black text-foreground">{label}</h4>
				<button
					onclick={closeMenu}
					class="rounded-xl bg-muted/10 p-2 text-muted transition-all hover:bg-muted/20 active:scale-95"
				>
					<X size={20} strokeWidth={2.5} />
				</button>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="flex flex-col gap-3" onclick={closeMenu}>
				{@render children()}
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.action-menu-item) {
		display: flex;
		align-items: center;
		width: 100%;
		gap: 12px;
		padding: 12px 16px;
		font-size: 14px;
		font-weight: 700;
		color: var(--text-main);
		border-radius: 12px;
		transition: all 0.2s;
		text-align: left;
	}

	:global(.action-menu-item:hover) {
		background-color: var(--bg-main);
		color: var(--primary);
	}

	@media (max-width: 1023px) {
		:global(.action-menu-item) {
			padding: 16px;
			font-size: 16px;
			background-color: var(--bg-main);
		}
		.desktop-menu {
			display: none;
		}
	}

	/* ========== KATTA EKRANLAR UCHUN MAXSUS STIL ========== */
	@media (min-width: 1024px) {
		:global(.action-menu-item) {
			width: 36px;
			height: 36px;
			padding: 0;
			justify-content: center; /* Ikonni o'rtaga joylash */
			border-radius: 50%;
			background-color: transparent;
		}
		:global(.action-menu-item span) {
			display: none; /* Yozuvni yashirish */
		}
		:global(.action-menu-item:hover) {
			background-color: var(--muted-bg, rgba(0,0,0,0.05)); /* Fallback to light hover */
		}
	}
</style>
