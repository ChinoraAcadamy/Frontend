<script>
	import {
		Bell,
		Menu,
		Accessibility,
		Plus,
		Minus,
		Palette,
		Contrast,
		Type,
		EyeOff
	} from 'lucide-svelte';
	import LanguageSwitcher from '@/lib/components/ui/LanguageSwitcher.svelte';
	import ThemeToggle from '@/lib/components/ui/ThemeToggle.svelte';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	// import { onMount } from 'svelte';

	let { user = null, notificationCount = 0, mobileOpen = $bindable(false) } = $props();

	// --- A11y (Maxsus imkoniyatlar) Holatlari ---
	let isA11yOpen = $state(false);

	let zoomLevel = $state(1); // 0.8 - 1.5
	let isGrayscale = $state(false);
	let isHighContrast = $state(false);
	let isReducedMotion = $state(false);
	let lineHeight = $state(1.5); // 1.2 - 2.0
	let isDyslexiaFont = $state(false);
	let isDark = $state(false);

	// Sahifa yuklanganda saqlangan sozlamalarni tiklash
	$effect(() => {
		zoomLevel = parseFloat(localStorage.getItem('a11y_zoom') || '1');
		isGrayscale = localStorage.getItem('a11y_grayscale') === 'true';
		isHighContrast = localStorage.getItem('a11y_highcontrast') === 'true';
		isReducedMotion = localStorage.getItem('a11y_reducedmotion') === 'true';
		lineHeight = parseFloat(localStorage.getItem('a11y_lineheight') || '1.5');
		isDyslexiaFont = localStorage.getItem('a11y_dyslexia') === 'true';
		isDark =
			localStorage.getItem('theme') === 'dark' ||
			(!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

		applyAllA11y();
	});

	function applyAllA11y() {
		const root = document.documentElement;

		// Zoom
		root.style.fontSize = `${zoomLevel * 100}%`;

		// Grayscale
		isGrayscale ? root.classList.add('grayscale') : root.classList.remove('grayscale');

		// High Contrast
		isHighContrast ? root.classList.add('contrast-125') : root.classList.remove('contrast-125');

		// Reduced Motion
		isReducedMotion ? root.classList.add('reduce-motion') : root.classList.remove('reduce-motion');

		// Line Height
		root.style.setProperty('--line-height', lineHeight.toString());

		// Dyslexia Font
		isDyslexiaFont ? root.classList.add('dyslexia-font') : root.classList.remove('dyslexia-font');

		// Dark mode
		isDark ? root.classList.add('dark') : root.classList.remove('dark');
	}

	function saveA11y(key, value) {
		localStorage.setItem(key, value);
		applyAllA11y();
	}

	// Funksiyalar
	function changeZoom(delta) {
		zoomLevel = Math.max(0.8, Math.min(1.5, zoomLevel + delta));
		saveA11y('a11y_zoom', zoomLevel);
	}

	function toggleGrayscale() {
		isGrayscale = !isGrayscale;
		saveA11y('a11y_grayscale', isGrayscale);
	}

	function toggleHighContrast() {
		isHighContrast = !isHighContrast;
		saveA11y('a11y_highcontrast', isHighContrast);
	}

	function toggleReducedMotion() {
		isReducedMotion = !isReducedMotion;
		saveA11y('a11y_reducedmotion', isReducedMotion);
	}

	function changeLineHeight(delta) {
		lineHeight = Math.max(1.2, Math.min(2.0, lineHeight + delta));
		saveA11y('a11y_lineheight', lineHeight);
	}

	function toggleDyslexiaFont() {
		isDyslexiaFont = !isDyslexiaFont;
		saveA11y('a11y_dyslexia', isDyslexiaFont);
	}

	// function toggleDarkMode() {
	// 	isDark = !isDark;
	// 	localStorage.setItem('theme', isDark ? 'dark' : 'light');
	// 	applyAllA11y();
	// }

	// Reset all
	function resetA11y() {
		localStorage.removeItem('a11y_zoom');
		localStorage.removeItem('a11y_grayscale');
		localStorage.removeItem('a11y_highcontrast');
		localStorage.removeItem('a11y_reducedmotion');
		localStorage.removeItem('a11y_lineheight');
		localStorage.removeItem('a11y_dyslexia');
		location.reload();
	}
</script>

<header
	class="sticky top-0 z-900 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:px-7"
>
	<div class="flex flex-1 items-center gap-4">
		<button
			class="shrink-0 cursor-pointer border-none bg-transparent p-1 text-foreground lg:hidden"
			onclick={() => (mobileOpen = true)}
			aria-label={m.admin_menu_open ? m.admin_menu_open() : 'Menyuni ochish'}
		>
			<Menu size={24} />
		</button>

		{#if page.url.pathname.split('/').filter(Boolean).length > 2}
			<div class="mr-4 flex items-center">
				<Breadcrumb inNavbar={true} />
			</div>
		{/if}
	</div>

	<div class="relative flex shrink-0 items-center gap-3">
		<ThemeToggle />
		<LanguageSwitcher variant="minimal" />

		<!-- <button
			class="relative flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-muted/10 text-muted transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 hover:text-primary lg:hidden"
			aria-label={m.admin_search_label ? m.admin_search_label() : 'Qidirish'}
		>
			<Search size={18} />
		</button> -->

		<!-- <button
			class="relative flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-[#f0f0f0] bg-gray-50 text-gray-500 transition-all duration-150 hover:bg-[#fdf2f6] hover:text-[#9B1C48] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-[#f5c0cf]"
			onclick={toggleTheme}
			aria-label="Mavzuni o'zgartirish"
		>
			{#if isDark}
				<Sun size={18} />
			{:else}
				<Moon size={18} />
			{/if}
		</button> -->

		<div>
			<button
				class="relative flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-muted/10 text-muted transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 hover:text-primary {isA11yOpen
					? 'border-primary/30 bg-primary/5 text-primary'
					: ''}"
				onclick={() => (isA11yOpen = !isA11yOpen)}
				aria-label={m.admin_a11y_label ? m.admin_a11y_label() : 'Maxsus imkoniyatlar'}
			>
				<Accessibility size={18} />
			</button>

			<!-- Accessibility Panel -->
			{#if isA11yOpen}
				<div
					class="fixed inset-0 z-40"
					onclick={() => (isA11yOpen = false)}
					aria-hidden="true"
				></div>

				<div
					class="absolute top-12 right-0 z-50 w-72 rounded-3xl border border-border bg-surface p-5 shadow-2xl"
				>
					<div class="flex items-center justify-between border-b border-border pb-3">
						<h3 class="text-sm font-bold text-foreground">
							{m.admin_a11y_title ? m.admin_a11y_title() : 'Maxsus imkoniyatlar'}
						</h3>
						<button onclick={resetA11y} class="text-xs text-red-500 hover:underline"
							>{m.admin_reset ? m.admin_reset() : 'Reset'}</button
						>
					</div>

					<div class="mt-4 space-y-5">
						<!-- Matn o'lchami -->
						<div>
							<span class="text-xs font-semibold text-muted"
								>{m.admin_a11y_text_size ? m.admin_a11y_text_size() : "Matn o'lchami"}</span
							>
							<div
								class="mt-2 flex items-center justify-between rounded-2xl border border-border bg-background p-1"
							>
								<button
									onclick={() => changeZoom(-0.1)}
									class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface"
								>
									<Minus size={18} />
								</button>
								<span class="font-bold text-primary">{Math.round(zoomLevel * 100)}%</span>
								<button
									onclick={() => changeZoom(0.1)}
									class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface"
								>
									<Plus size={18} />
								</button>
							</div>
						</div>

						<!-- Qator orasidagi masofa -->
						<div>
							<span class="text-xs font-semibold text-muted"
								>{m.admin_a11y_line_height
									? m.admin_a11y_line_height()
									: 'Qatorlar orasidagi masofa'}</span
							>
							<div
								class="mt-2 flex items-center justify-between rounded-2xl border border-border bg-background p-1"
							>
								<button
									onclick={() => changeLineHeight(-0.1)}
									class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface"
								>
									<Minus size={18} />
								</button>
								<span class="font-bold text-primary">{lineHeight.toFixed(1)}</span>
								<button
									onclick={() => changeLineHeight(0.1)}
									class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface"
								>
									<Plus size={18} />
								</button>
							</div>
						</div>

						<!-- Boshqa tugmalar -->
						<div class="space-y-2">
							<button
								onclick={toggleGrayscale}
								class="flex w-full items-center justify-between rounded-2xl border p-3 {isGrayscale
									? 'border-primary bg-primary/5'
									: 'border-border hover:bg-muted/5'}"
							>
								<div class="flex items-center gap-3">
									<Palette size={18} />
									<span class="text-sm text-foreground"
										>{m.admin_a11y_grayscale ? m.admin_a11y_grayscale() : 'Oq-qora rejim'}</span
									>
								</div>
								<div class="toggle-switch {isGrayscale ? 'active' : ''}"></div>
							</button>

							<button
								onclick={toggleHighContrast}
								class="flex w-full items-center justify-between rounded-2xl border p-3 {isHighContrast
									? 'border-primary bg-primary/5'
									: 'border-border hover:bg-muted/5'}"
							>
								<div class="flex items-center gap-3">
									<Contrast size={18} />
									<span class="text-sm text-foreground"
										>{m.admin_a11y_high_contrast
											? m.admin_a11y_high_contrast()
											: 'Yuqori kontrast'}</span
									>
								</div>
								<div class="toggle-switch {isHighContrast ? 'active' : ''}"></div>
							</button>

							<button
								onclick={toggleReducedMotion}
								class="flex w-full items-center justify-between rounded-2xl border p-3 {isReducedMotion
									? 'border-primary bg-primary/5'
									: 'border-border hover:bg-muted/5'}"
							>
								<div class="flex items-center gap-3">
									<EyeOff size={18} />
									<span class="text-sm text-foreground"
										>{m.admin_a11y_reduced_motion
											? m.admin_a11y_reduced_motion()
											: "Animatsiyalarni o'chirish"}</span
									>
								</div>
								<div class="toggle-switch {isReducedMotion ? 'active' : ''}"></div>
							</button>

							<button
								onclick={toggleDyslexiaFont}
								class="flex w-full items-center justify-between rounded-2xl border p-3 {isDyslexiaFont
									? 'border-primary bg-primary/5'
									: 'border-border hover:bg-muted/10'}"
							>
								<div class="flex items-center gap-3">
									<Type size={18} />
									<span class="text-sm text-foreground"
										>{m.admin_a11y_dyslexia_font
											? m.admin_a11y_dyslexia_font()
											: 'Dyslexia-friendly shrift'}</span
									>
								</div>
								<div class="toggle-switch {isDyslexiaFont ? 'active' : ''}"></div>
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<button
			class="relative hidden h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-muted/10 text-muted transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
			aria-label={m.admin_notifications_label ? m.admin_notifications_label() : 'Bildirishnomalar'}
		>
			<Bell size={18} />
			{#if notificationCount > 0}
				<span
					class="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-primary text-[10px] font-bold text-white"
				>
					{notificationCount}
				</span>
			{/if}
		</button>

		{#if user?.picture}
			<img
				src={user.picture}
				alt="avatar"
				class="h-9.5 w-9.5 cursor-pointer rounded-full border-2 border-[#f0f0f0]"
			/>
		{:else}
			<div
				class="hidden h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-linear-to-br from-[#C7A27C] to-primary font-bold text-white"
			>
				{(user?.first_name?.[0] || user?.username?.[0] || 'A').toUpperCase()}
			</div>
		{/if}
	</div>
</header>
