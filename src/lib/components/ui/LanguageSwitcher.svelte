<script lang="ts">
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime.js';
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { Globe, ChevronDown } from 'lucide-svelte';

	let { variant = 'glass' } = $props<{ variant?: 'glass' | 'minimal' }>();

	const languageNames = {
		uz: "O'zbekcha",
		ru: 'Русский'
	};

	let isOpen = $state(false);

	function switchLang(lang: any) {
		setLocale(lang);
		isOpen = false;
		if (browser) {
			localStorage.setItem('preferred_lang', lang);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') isOpen = false;
	}
</script>

<div class="relative inline-block text-left" role="none">
	<button
		type="button"
		class="switcher-trigger {variant}"
		aria-haspopup="true"
		aria-expanded={isOpen}
		onclick={() => (isOpen = !isOpen)}
		onkeydown={handleKeydown}
	>
		<Globe size={18} class="text-current opacity-70" />
		<span class="switcher-label">
			{languageNames[getLocale()] || getLocale().toUpperCase()}
		</span>
		<ChevronDown size={14} class="opacity-50 transition-transform {isOpen ? 'rotate-180' : ''}" />
	</button>

	{#if isOpen}
		<!-- Backdrop for closing -->
		<div 
			class="fixed inset-0 z-40 bg-transparent" 
			onclick={() => (isOpen = false)}
			aria-hidden="true"
		></div>

		<div
			class="switcher-menu {variant}"
			in:fly={{ y: 8, duration: 200 }}
			out:fade={{ duration: 150 }}
		>
			{#each locales as lang (lang)}
				<button
					type="button"
					onclick={() => switchLang(lang)}
					class="switcher-item"
					class:active={getLocale() === lang}
				>
					<span class="lang-flag">{lang === 'uz' ? '🇺🇿' : '🇷🇺'}</span>
					{languageNames[lang] || lang.toUpperCase()}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.switcher-trigger {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		font-weight: 600;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid transparent;
		outline: none;
	}

	.switcher-trigger.glass {
		background: transparent;
		color: rgba(255, 255, 255, 0.9);
		padding: 6px 10px;
		border-radius: 12px;
	}
	.switcher-trigger.glass:hover {
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	.switcher-trigger.minimal {
		background: #f8fafc;
		border-color: #f1f5f9;
		color: #475569;
		padding: 8px 14px;
		border-radius: 12px;
	}
	.switcher-trigger.minimal:hover {
		border-color: #f5c0cf;
		background: #fdf2f6;
		color: #9b1c48;
	}

	.switcher-menu {
		position: absolute;
		right: 0;
		z-index: 50;
		margin-top: 8px;
		width: 160px;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
	}

	.switcher-menu.glass {
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.switcher-menu.minimal {
		background: white;
		border: 1px solid #f1f5f9;
	}

	.switcher-item {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 16px;
		text-align: left;
		font-size: 14px;
		font-weight: 500;
		transition: all 0.2s ease;
		border: none;
		cursor: pointer;
		background: transparent;
	}

	.glass .switcher-item {
		color: rgba(255, 255, 255, 0.7);
	}
	.glass .switcher-item:hover {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}
	.glass .switcher-item.active {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		font-weight: 700;
	}

	.minimal .switcher-item {
		color: #64748b;
	}
	.minimal .switcher-item:hover {
		background: #fdf2f6;
		color: #9b1c48;
	}
	.minimal .switcher-item.active {
		background: #fdf2f6;
		color: #9b1c48;
		font-weight: 700;
	}

	.lang-flag {
		font-size: 16px;
	}

	.switcher-label {
		line-height: 1;
	}

	@media (max-width: 640px) {
		.switcher-label {
			display: none;
		}
	}
</style>
