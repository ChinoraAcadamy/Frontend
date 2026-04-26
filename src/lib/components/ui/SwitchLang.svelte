<script lang="ts">
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime.js';
	import { browser } from '$app/environment';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const languageNames = {
		uz: { short: 'UZ', full: "O'zbekcha", flag: '/images/uz.png' },
		ru: { short: 'RU', full: 'Русский', flag: '/images/ru.png' }
	};

	let isOpen = $state(false);

	function switchLang(lang) {
		setLocale(lang);
		isOpen = false;
		if (browser) localStorage.setItem('preferred_lang', lang);
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') isOpen = false;
	}

	let current = $derived(
		languageNames[getLocale()] ?? {
			short: getLocale().toUpperCase(),
			full: getLocale(),
			flag: '🌐'
		}
	);
</script>

<div class="lp-ls" role="none">
	<button
		type="button"
		class="lp-ls-trigger"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		onclick={() => (isOpen = !isOpen)}
		onkeydown={handleKeydown}
	>
		<span class="lp-ls-flag"> <img class="w-6" src={current.flag} alt={current.short} /></span>
		<span class="lp-ls-short">{current.short}</span>
		<svg
			class="lp-ls-chevron {isOpen ? 'lp-ls-chevron--open' : ''}"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			width="12"
			height="12"
			aria-hidden="true"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</button>

	{#if isOpen}
		<div class="lp-ls-backdrop" onclick={() => (isOpen = false)} aria-hidden="true"></div>

		<div
			class="lp-ls-menu"
			role="listbox"
			in:fly={{ y: 6, duration: 200, easing: cubicOut }}
			out:fade={{ duration: 120 }}
		>
			{#each locales as lang (lang)}
				{@const opt = languageNames[lang] ?? { short: lang.toUpperCase(), full: lang, flag: '🌐' }}
				<button
					type="button"
					role="option"
					aria-selected={getLocale() === lang}
					class="lp-ls-item {getLocale() === lang ? 'lp-ls-item--active' : ''}"
					onclick={() => switchLang(lang)}
				>
					<span class="lp-ls-item-full">{opt.full}</span>
					{#if getLocale() === lang}
						<svg
							class="lp-ls-check"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							width="14"
							height="14"
						>
							<path d="M20 6 9 17l-5-5" />
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.lp-ls {
		position: relative;
		display: inline-block;
		flex-shrink: 0;
	}

	/* ── Trigger ─────────────────────────────── */
	.lp-ls-trigger {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 38px;
		padding: 0 12px;
		border-radius: 12px;
		border: 1.5px solid rgba(155, 28, 72, 0.18);
		background: rgba(155, 28, 72, 0.05);
		color: #1a0f0a;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition:
			border-color 0.18s,
			background 0.18s,
			transform 0.12s;
		font-family: inherit;
		white-space: nowrap;
	}

	.lp-ls-trigger:hover {
		border-color: rgba(155, 28, 72, 0.4);
		background: rgba(155, 28, 72, 0.08);
	}

	.lp-ls-trigger:active {
		transform: scale(0.97);
	}

	.lp-ls-flag {
		font-size: 15px;
		line-height: 1;
		display: flex;
		align-items: center;
	}

	.lp-ls-short {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: #9b1c48;
	}

	.lp-ls-chevron {
		color: #9b1c48;
		opacity: 0.6;
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.lp-ls-chevron--open {
		transform: rotate(180deg);
	}

	/* ── Backdrop ────────────────────────────── */
	.lp-ls-backdrop {
		position: fixed;
		inset: 0;
		z-index: 48;
	}

	/* ── Dropdown menu ───────────────────────── */
	.lp-ls-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		z-index: 49;
		min-width: 160px;
		background: #fff;
		border: 1.5px solid rgba(155, 28, 72, 0.12);
		border-radius: 16px;
		padding: 6px;
		box-shadow:
			0 8px 32px rgba(155, 28, 72, 0.12),
			0 2px 8px rgba(0, 0, 0, 0.06);
		overflow: hidden;
	}

	/* ── Menu items ──────────────────────────── */
	.lp-ls-item {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 9px 12px;
		border-radius: 10px;
		border: none;
		background: transparent;
		font-size: 13.5px;
		font-weight: 500;
		color: #4a3028;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
		font-family: inherit;
		text-align: left;
	}

	.lp-ls-item:hover {
		background: rgba(155, 28, 72, 0.06);
		color: #9b1c48;
	}

	.lp-ls-item--active {
		background: rgba(155, 28, 72, 0.07);
		color: #9b1c48;
		font-weight: 700;
	}

	.lp-ls-item-flag {
		font-size: 16px;
		line-height: 1;
		flex-shrink: 0;
	}

	.lp-ls-item-full {
		flex: 1;
	}

	.lp-ls-check {
		color: #9b1c48;
		flex-shrink: 0;
	}
</style>
