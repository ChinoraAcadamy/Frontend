<script>
	// @ts-nocheck
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import { a11y } from '$lib/stores/a11y.svelte.js';

	import TopLoader from '$lib/components/layout/TopLoader.svelte';
	import ToastProvider from '@/lib/components/ui/ToastProvider.svelte';

	let { children } = $props();

	// Home page'da dark theme'ni o'chirib qo'yish
	$effect(() => {
		const isHomePage =
			page.url.pathname === '/' ||
			page.url.pathname === '/uz' ||
			page.url.pathname === '/ru' ||
			page.url.pathname === '/uz/' ||
			page.url.pathname === '/ru/';

		if (isHomePage) {
			document.documentElement.removeAttribute('data-theme');
			document.documentElement.classList.remove('dark');
		} else {
			const savedTheme = localStorage.getItem('theme') || 'light';
			if (savedTheme === 'dark') {
				document.documentElement.setAttribute('data-theme', 'dark');
				document.documentElement.classList.add('dark');
			}
		}
	});

	// Global A11y Application
	$effect(() => {
		if (!browser || !a11y.initialized) return;

		const r = document.documentElement;
		const b = document.body;
		const v = a11y.val;

		// Typography
		r.style.fontSize = `${v.zoomLevel * 100}%`;
		r.style.setProperty('--a11y-lh', v.lineHeight.toString());
		b.style.lineHeight = v.lineHeight.toString();
		r.style.setProperty('--a11y-ls', `${v.letterSpacing}em`);
		r.style.setProperty('--a11y-ws', `${v.wordSpacing}em`);
		b.style.letterSpacing = `${v.letterSpacing}em`;
		b.style.wordSpacing = `${v.wordSpacing}em`;
		r.style.setProperty('--a11y-fw', v.fontWeight.toString());
		r.style.setProperty('--a11y-ta', v.textAlign);

		// Classes
		r.classList.toggle('a11y-grayscale', v.isGrayscale);
		r.classList.toggle('a11y-highcontrast', v.isHighContrast);
		r.classList.toggle('a11y-reducedmotion', v.isReducedMotion);
		r.classList.toggle('a11y-dyslexia', v.isDyslexiaFont);
		r.classList.toggle('a11y-link-highlight', v.isLinkHighlight);
		r.classList.toggle('a11y-hide-images', v.isHideImages);
		r.classList.toggle('a11y-focus-highlight', v.isFocusHighlight);

		// Color blind
		r.classList.remove(
			'a11y-cb-protanopia',
			'a11y-cb-deuteranopia',
			'a11y-cb-tritanopia',
			'a11y-cb-achromatopsia'
		);
		if (v.colorBlindMode !== 'none') r.classList.add(`a11y-cb-${v.colorBlindMode}`);

		// Cursor
		r.classList.remove('a11y-cursor-large', 'a11y-cursor-xl');
		if (v.cursorSize !== 'default') r.classList.add(`a11y-cursor-${v.cursorSize}`);

		// Filters (Saturation & Brightness)
		const sat = v.isGrayscale ? 'grayscale(1)' : `saturate(${v.saturation}%)`;
		const bri = `brightness(${v.brightness}%)`;
		const con = v.isHighContrast ? 'contrast(1.4)' : '';
		r.style.setProperty('--a11y-filter', [sat, bri, con].filter(Boolean).join(' '));
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		/* Color Blind Filters */
		.a11y-cb-protanopia {
			filter: url(#cb-protanopia) !important;
		}
		.a11y-cb-deuteranopia {
			filter: url(#cb-deuteranopia) !important;
		}
		.a11y-cb-tritanopia {
			filter: url(#cb-tritanopia) !important;
		}
		.a11y-cb-achromatopsia {
			filter: url(#cb-achromatopsia) !important;
		}

		/* High Contrast */
		.a11y-highcontrast {
			filter: contrast(1.4) !important;
		}

		/* Reduced Motion */
		.a11y-reducedmotion *,
		.a11y-reducedmotion *::before,
		.a11y-reducedmotion *::after {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}

		/* Dyslexia Font */
		.a11y-dyslexia {
			font-family: 'Lexend', system-ui, sans-serif !important;
		}

		/* Link Highlight */
		.a11y-link-highlight a {
			background: #ffe066 !important;
			color: #000 !important;
			padding: 0 2px;
			border-radius: 2px;
			text-decoration: underline !important;
			text-decoration-thickness: 2px !important;
		}

		/* Hide Images */
		.a11y-hide-images img,
		.a11y-hide-images [role='img'],
		.a11y-hide-images picture {
			visibility: hidden !important;
		}

		/* Focus Highlight */
		.a11y-focus-highlight *:focus {
			outline: 4px solid #9b1c48 !important;
			outline-offset: 4px !important;
		}

		/* Custom Cursors */
		.a11y-cursor-large {
			cursor:
				url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M8 2l16 12-8 2-4 10z' fill='white' stroke='black' stroke-width='2'/%3E%3C/svg%3E")
					8 2,
				auto !important;
		}
		.a11y-cursor-xl {
			cursor:
				url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M10 2l24 18-12 3-6 16z' fill='white' stroke='black' stroke-width='2.5'/%3E%3C/svg%3E")
					10 2,
				auto !important;
		}
	</style>
</svelte:head>

<!-- Color Blind SVG Filters (Must be in DOM) -->
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
	<defs>
		<filter id="cb-protanopia"
			><feColorMatrix
				type="matrix"
				values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"
			/></filter
		>
		<filter id="cb-deuteranopia"
			><feColorMatrix
				type="matrix"
				values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"
			/></filter
		>
		<filter id="cb-tritanopia"
			><feColorMatrix
				type="matrix"
				values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"
			/></filter
		>
		<filter id="cb-achromatopsia"><feColorMatrix type="saturate" values="0" /></filter>
	</defs>
</svg>

<!-- Global A11y Overlay (Brightness & Saturation) -->
<div
	id="a11y-filter-overlay"
	style="position: fixed; inset: 0; pointer-events: none; z-index: 999998; backdrop-filter: var(--a11y-filter, none); -webkit-backdrop-filter: var(--a11y-filter, none);"
></div>

<TopLoader />
<ToastProvider />

<main>
	{@render children()}
</main>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }))}>{locale}</a>
	{/each}
</div>
