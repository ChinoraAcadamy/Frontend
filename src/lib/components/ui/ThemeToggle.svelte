<script>
	import { Sun, Moon } from 'lucide-svelte';
	import { theme } from '$lib/stores/theme';
	import { scale } from 'svelte/transition';

	function toggleTheme() {
		theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
	}
</script>

<button
	class="theme-toggle"
	onclick={toggleTheme}
	aria-label="Mavzuni o'zgartirish"
	title={$theme === 'dark' ? 'Yorug\' rejim' : 'Tungi rejim'}
>
	<div class="icon-container">
		{#if $theme === 'dark'}
			<div in:scale={{ duration: 400, start: 0.5 }} out:scale={{ duration: 200 }}>
				<Sun size={18} strokeWidth={2.5} />
			</div>
		{:else}
			<div in:scale={{ duration: 400, start: 0.5 }} out:scale={{ duration: 200 }}>
				<Moon size={18} strokeWidth={2.5} />
			</div>
		{/if}
	</div>
</button>

<style>
	.theme-toggle {
		width: 38px;
		height: 38px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-card);
		border: 1px solid var(--border-main);
		color: var(--text-main);
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		box-shadow: var(--shadow-main);
	}

	.theme-toggle:hover {
		border-color: var(--primary);
		color: var(--primary);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(155, 28, 72, 0.15);
	}

	.theme-toggle:active {
		transform: translateY(0) scale(0.95);
	}

	.icon-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Dark mode specific tweaks for the toggle itself if needed */
	:global([data-theme='dark']) .theme-toggle {
		background: rgba(255, 255, 255, 0.03);
	}
</style>
