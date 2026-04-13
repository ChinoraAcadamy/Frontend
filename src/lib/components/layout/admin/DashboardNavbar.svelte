<script>
	import { Search, Bell, Menu, Accessibility, Plus, Minus, Palette, Contrast, Type, EyeOff } from 'lucide-svelte';
	import LanguageSwitcher from '@/lib/components/ui/LanguageSwitcher.svelte';
	// import { onMount } from 'svelte';

	let { user = null, notificationCount = 0, mobileOpen = $bindable(false) } = $props();

	let searchQuery = $state('');

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
		root.style.setProperty('--line-height', lineHeight);

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

	function toggleDarkMode() {
		isDark = !isDark;
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
		applyAllA11y();
	}

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
	class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#f0f0f0] bg-white px-4 lg:px-7"
>
	<div class="flex items-center gap-4">
		<button
			class="cursor-pointer border-none bg-transparent p-1 text-[#1a0e13] lg:hidden"
			onclick={() => (mobileOpen = true)}
			aria-label="Menyuni ochish"
		>
			<Menu size={24} />
		</button>

		<div class="relative hidden items-center lg:flex">
			<Search size={16} class="pointer-events-none absolute left-3.5 text-gray-400" />
			<input
				type="text"
				placeholder="Qidirish..."
				bind:value={searchQuery}
				class="w-70 rounded-xl border border-[#f0f0f0] bg-gray-50 py-2.25 pr-4 pl-10 text-sm text-[#1a0e13] transition-all duration-150 outline-none focus:border-[#C43C66] focus:bg-white focus:ring-[3px] focus:ring-[#C43C66]/10"
			/>
		</div>
	</div>

	<div class="relative flex items-center gap-3">
		<LanguageSwitcher variant="minimal" />
		
		<button
			class="relative flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-[#f0f0f0] bg-gray-50 text-gray-500 transition-all duration-150 hover:border-[#f5c0cf] hover:bg-[#fdf2f6] hover:text-[#9B1C48] lg:hidden"
			aria-label="Qidirish"
		>
			<Search size={18} />
		</button>

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
				class="relative flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-[#f0f0f0] bg-gray-50 text-gray-500 transition-all duration-150 hover:border-[#f5c0cf] hover:bg-[#fdf2f6] hover:text-[#9B1C48] {isA11yOpen
					? 'border-[#f5c0cf] bg-[#fdf2f6] text-[#9B1C48]'
					: ''}"
				onclick={() => (isA11yOpen = !isA11yOpen)}
				aria-label="Maxsus imkoniyatlar"
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
					class="absolute top-12 right-0 z-50 w-72 rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl"
				>
					<div class="flex items-center justify-between border-b pb-3">
						<h3 class="text-sm font-bold text-gray-800">Maxsus imkoniyatlar</h3>
						<button onclick={resetA11y} class="text-xs text-red-500 hover:underline">Reset</button>
					</div>

					<div class="mt-4 space-y-5">
						<!-- Matn o'lchami -->
						<div>
							<span class="text-xs font-semibold text-gray-500">Matn o'lchami</span>
							<div class="mt-2 flex items-center justify-between rounded-2xl border bg-gray-50 p-1">
								<button
									onclick={() => changeZoom(-0.1)}
									class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white"
								>
									<Minus size={18} />
								</button>
								<span class="font-bold text-[#9B1C48]">{Math.round(zoomLevel * 100)}%</span>
								<button
									onclick={() => changeZoom(0.1)}
									class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white"
								>
									<Plus size={18} />
								</button>
							</div>
						</div>

						<!-- Qator orasidagi masofa -->
						<div>
							<span class="text-xs font-semibold text-gray-500">Qatorlar orasidagi masofa</span>
							<div class="mt-2 flex items-center justify-between rounded-2xl border bg-gray-50 p-1">
								<button
									onclick={() => changeLineHeight(-0.1)}
									class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white"
								>
									<Minus size={18} />
								</button>
								<span class="font-bold text-[#9B1C48]">{lineHeight.toFixed(1)}</span>
								<button
									onclick={() => changeLineHeight(0.1)}
									class="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white"
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
									? 'border-[#9B1C48] bg-[#fdf2f6]'
									: 'border-gray-100 hover:bg-gray-50'}"
							>
								<div class="flex items-center gap-3">
									<Palette size={18} />
									<span class="text-sm">Oq-qora rejim</span>
								</div>
								<div class="toggle-switch {isGrayscale ? 'active' : ''}"></div>
							</button>

							<button
								onclick={toggleHighContrast}
								class="flex w-full items-center justify-between rounded-2xl border p-3 {isHighContrast
									? 'border-[#9B1C48] bg-[#fdf2f6]'
									: 'border-gray-100 hover:bg-gray-50'}"
							>
								<div class="flex items-center gap-3">
									<Contrast size={18} />
									<span class="text-sm">Yuqori kontrast</span>
								</div>
								<div class="toggle-switch {isHighContrast ? 'active' : ''}"></div>
							</button>

							<button
								onclick={toggleReducedMotion}
								class="flex w-full items-center justify-between rounded-2xl border p-3 {isReducedMotion
									? 'border-[#9B1C48] bg-[#fdf2f6]'
									: 'border-gray-100 hover:bg-gray-50'}"
							>
								<div class="flex items-center gap-3">
									<EyeOff size={18} />
									<span class="text-sm">Animatsiyalarni o'chirish</span>
								</div>
								<div class="toggle-switch {isReducedMotion ? 'active' : ''}"></div>
							</button>

							<button
								onclick={toggleDyslexiaFont}
								class="flex w-full items-center justify-between rounded-2xl border p-3 {isDyslexiaFont
									? 'border-[#9B1C48] bg-[#fdf2f6]'
									: 'border-gray-100 hover:bg-gray-50'}"
							>
								<div class="flex items-center gap-3">
									<Type size={18} />
									<span class="text-sm">Dyslexia-friendly shrift</span>
								</div>
								<div class="toggle-switch {isDyslexiaFont ? 'active' : ''}"></div>
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<button
			class="relative flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border border-[#f0f0f0] bg-gray-50 text-gray-500 transition-all duration-150 hover:border-[#f5c0cf] hover:bg-[#fdf2f6] hover:text-[#9B1C48]"
			aria-label="Bildirishnomalar"
		>
			<Bell size={18} />
			{#if notificationCount > 0}
				<span
					class="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-[#9B1C48] text-[10px] font-bold text-white"
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
				class="flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-full border-2 border-[#f0f0f0] bg-linear-to-br from-[#C7A27C] to-[#9B1C48] font-bold text-white"
			>
				{(user?.first_name?.[0] || user?.username?.[0] || 'A').toUpperCase()}
			</div>
		{/if}
	</div>
</header>

