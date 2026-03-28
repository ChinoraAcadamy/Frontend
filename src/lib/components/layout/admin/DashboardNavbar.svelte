<script>
	import {
		Search,
		Bell,
		Menu,
		Accessibility,
		Plus,
		Minus,
		Palette,
		Contrast,
	} from 'lucide-svelte';
	// import { onMount } from 'svelte';

	let { user = null, notificationCount = 0, mobileOpen = $bindable(false) } = $props();

	let searchQuery = $state('');

	// --- A11y (Maxsus imkoniyatlar) Holatlari ---
	let isA11yOpen = $state(false);
	let zoomLevel = $state(1); // 1 = 100%
	let isGrayscale = $state(false);
	let isHighContrast = $state(false);

	// let isDark = $state(false);

	// Sahifa yuklanganda foydalanuvchi tanlovini tekshirish
	// onMount(() => {
	// 	isDark =
	// 		localStorage.getItem('theme') === 'dark' ||
	// 		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

	// 	applyTheme();
	// });

	// function toggleTheme() {
	// 	isDark = !isDark;
	// 	localStorage.setItem('theme', isDark ? 'dark' : 'light');
	// 	applyTheme();
	// }

	// function applyTheme() {
	// 	if (isDark) {
	// 		document.documentElement.classList.add('dark');
	// 	} else {
	// 		document.documentElement.classList.remove('dark');
	// 	}
	// }

	// Matn o'lchamini o'zgartirish (rem orqali ishlaydigan Tailwind klasslari avtomatik moslashadi)
	function changeZoom(delta) {
		// 0.8 (80%) dan 1.5 (150%) gacha cheklaymiz
		zoomLevel = Math.max(0.8, Math.min(1.5, zoomLevel + delta));
		document.documentElement.style.fontSize = `${zoomLevel * 100}%`;
	}

	// Oq-qora rejimni yoqish/o'chirish
	function toggleGrayscale() {
		isGrayscale = !isGrayscale;
		if (isGrayscale) document.documentElement.classList.add('grayscale');
		else document.documentElement.classList.remove('grayscale');
	}

	// Yuqori kontrastni yoqish/o'chirish
	function toggleContrast() {
		isHighContrast = !isHighContrast;
		if (isHighContrast) document.documentElement.classList.add('contrast-125');
		else document.documentElement.classList.remove('contrast-125');
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

			{#if isA11yOpen}
				<div
					class="fixed inset-0 z-40"
					onclick={() => (isA11yOpen = false)}
					aria-hidden="true"
				></div>

				<div
					class="absolute top-12 right-0 z-50 flex w-65 flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
				>
					<h3 class="border-b border-gray-100 pb-2 text-sm font-bold text-gray-800">
						Maxsus imkoniyatlar
					</h3>

					<div class="flex flex-col gap-2">
						<span class="text-xs font-semibold tracking-wider text-gray-500 uppercase"
							>Matn o'lchami</span
						>
						<div
							class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-1"
						>
							<button
								onclick={() => changeZoom(-0.1)}
								class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-white hover:shadow"
							>
								<Minus size={16} />
							</button>
							<span class="text-sm font-bold text-[#9B1C48]">{Math.round(zoomLevel * 100)}%</span>
							<button
								onclick={() => changeZoom(0.1)}
								class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-white hover:shadow"
							>
								<Plus size={16} />
							</button>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<span class="text-xs font-semibold tracking-wider text-gray-500 uppercase"
							>Ko'rinish</span
						>

						<button
							onclick={toggleGrayscale}
							class="flex w-full items-center justify-between rounded-xl border p-2.5 transition-all {isGrayscale
								? 'border-[#9B1C48] bg-[#fdf2f6]'
								: 'border-gray-100 bg-gray-50 hover:bg-gray-100'}"
						>
							<div
								class="flex items-center gap-2 text-sm font-medium {isGrayscale
									? 'text-[#9B1C48]'
									: 'text-gray-700'}"
							>
								<Palette size={16} /> Oq-qora rejim
							</div>
							<div
								class="relative h-5 w-8 rounded-full transition-colors {isGrayscale
									? 'bg-[#9B1C48]'
									: 'bg-gray-300'}"
							>
								<div
									class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform {isGrayscale
										? 'translate-x-3'
										: ''}"
								></div>
							</div>
						</button>

						<button
							onclick={toggleContrast}
							class="flex w-full items-center justify-between rounded-xl border p-2.5 transition-all {isHighContrast
								? 'border-[#9B1C48] bg-[#fdf2f6]'
								: 'border-gray-100 bg-gray-50 hover:bg-gray-100'}"
						>
							<div
								class="flex items-center gap-2 text-sm font-medium {isHighContrast
									? 'text-[#9B1C48]'
									: 'text-gray-700'}"
							>
								<Contrast size={16} /> Yuqori kontrast
							</div>
							<div
								class="relative h-5 w-8 rounded-full transition-colors {isHighContrast
									? 'bg-[#9B1C48]'
									: 'bg-gray-300'}"
							>
								<div
									class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform {isHighContrast
										? 'translate-x-3'
										: ''}"
								></div>
							</div>
						</button>
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
