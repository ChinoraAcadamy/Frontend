<script>
	/* eslint-disable no-unused-vars */

	import { Plus, Copy, BookOpen, Layers, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '@/lib/paraglide/runtime';

	// +page.server.js dan keladi
	let { courses = [] } = $props();

	// Har bir kursga qo'shimcha UI meta (backend'da yo'q narsalar)
	const courseMeta = [
		{
			popular: false,
			cardNumber: '5614 6814 2795 9931'
		},
		{
			popular: true,
			cardNumber: '8600 5704 0753 9039'
		},
		{
			popular: false,
			cardNumber: '8600 5704 0753 9039'
		}
	];

	// Narxni formatlash
	function formatPrice(price) {
		const num = Math.round(parseFloat(price));
		const locale = getLocale() === 'ru' ? 'ru-RU' : 'uz-UZ';
		const currency = getLocale() === 'ru' ? ' сум' : " so'm";
		return num.toLocaleString(locale) + currency;
	}

	let pricingPlans = $derived((resolvedCourses) =>
		resolvedCourses.map((course, i) => ({
			...course,
			...(courseMeta[i] ?? { popular: false, cardNumber: '8600 5704 0753 9039' })
		}))
	);

	let showAll = $state(false);
	const getDisplayedPlans = (plans) => (showAll ? plans : plans.slice(0, 3));

	let isModalOpen = $state(false);
	let chosenCardNumber = $state('');
	let chosenCourseTitle = $state('');

	function handleRegisterClick(cardNumber, title) {
		chosenCardNumber = cardNumber;
		chosenCourseTitle = title;
		isModalOpen = true;
	}

	function handleCloseModal() {
		isModalOpen = false;
	}

	async function handleCopyCardNumber() {
		try {
			await navigator.clipboard.writeText(chosenCardNumber);
			toast.success(m.modal_copy_success());
		} catch {
			toast.error(m.modal_copy_error());
		}
	}
</script>

<section id="pricing" class="bg-white py-24 md:py-32">
	<div class="container mx-auto px-6">
		<div class="mb-20 text-center">
			<div
				class="mb-4 inline-flex items-center rounded-lg bg-[#ed4b72]/10 px-4 py-1.5 text-[10px] font-black tracking-widest text-[#ed4b72] uppercase"
			>
				{m.nav_courses()}
			</div>
			<h2 class="mb-6 text-4xl font-black tracking-tighter text-slate-900 md:text-6xl">
				{@html m.pricing_title()}
			</h2>
			<p class="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-500 md:text-xl">
				{m.pricing_subtitle()}
			</p>
		</div>

		{#await courses}
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _, i (i)}
					<div
						class="h-[500px] animate-pulse rounded-3xl border border-slate-100 bg-slate-50"
					></div>
				{/each}
			</div>
		{:then resolvedCourses}
			{#if resolvedCourses.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-center">
					<div
						class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-slate-300"
					>
						<BookOpen size={40} />
					</div>
					<p class="text-xl font-bold text-slate-400">
						{m.no_data_found ? m.no_data_found() : 'Kurslar hozircha mavjud emas.'}
					</p>
				</div>
			{:else}
				{@const plans = pricingPlans(resolvedCourses)}
				{@const displayedPlans = getDisplayedPlans(plans)}
				<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each displayedPlans as plan (plan.id)}
						<div
							class="group relative flex flex-col rounded-3xl border border-transparent p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg {plan.popular
								? 'bg-linear-to-br from-primary to-primary-light text-white shadow-xl shadow-primary/20'
								: 'border-border/50 bg-white text-foreground'}"
						>
							{#if plan.popular}
								<div class="absolute -top-4 left-1/2 -translate-x-1/2">
									<span
										class="flex items-center gap-1.5 rounded-full bg-white px-6 py-1.5 text-[10px] font-black tracking-widest text-primary uppercase shadow-lg"
									>
										{m.pricing_popular()}
									</span>
								</div>
							{/if}

							<!-- Top Content Area -->
							<div class="flex flex-1 flex-col">
								<div class="mb-6">
									<span
										class="inline-flex rounded-lg px-3 py-1 text-[10px] font-black tracking-widest uppercase {plan.popular
											? 'bg-white/30 text-white'
											: 'bg-primary/10 text-primary'}"
									>
										{plan.level || 'Boshlang‘ich'}
									</span>
								</div>

								<h3
									class="mb-3 line-clamp-2 min-h-14 text-2xl leading-none font-black tracking-tight md:text-3xl {plan.popular
										? 'text-white'
										: 'text-slate-900'}"
								>
									{plan.title}
								</h3>

								<p
									class="mb-8 line-clamp-4 text-sm leading-relaxed {plan.popular
										? 'text-white/90'
										: 'text-slate-600'}"
								>
									{plan.description}
								</p>
							</div>

							<!-- Bottom Content Area (Sticks to bottom) -->
							<div
								class="mt-auto border-t pt-8 {plan.popular
									? 'border-white/20'
									: 'border-slate-100'}"
							>
								<div class="flex flex-col gap-1">
									{#if plan.old_price}
										<span
											class="text-sm font-bold line-through {plan.popular
												? 'text-white/80'
												: 'text-slate-500'}"
										>
											{formatPrice(plan.old_price)}
										</span>
									{/if}
									<div
										class="text-4xl font-black tracking-tighter md:text-5xl {plan.popular
											? 'text-white'
											: 'text-slate-900'}"
									>
										{formatPrice(plan.price)}
									</div>
								</div>

								<div class="mt-8 space-y-4">
									<div class="group/item flex items-center gap-4">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-xl transition-colors {plan.popular
												? 'bg-white/30 text-white'
												: 'bg-slate-50 text-primary group-hover/item:bg-primary group-hover/item:text-white'}"
										>
											<Layers size={18} strokeWidth={2.5} />
										</div>
										<span
											class="text-sm font-bold transition-colors {plan.popular
												? 'text-white/90'
												: 'text-slate-600 group-hover/item:text-slate-900'}"
										>
											{plan.modules_count}
											{m.admin_courses_modules ? m.admin_courses_modules() : 'ta modul'}
										</span>
									</div>
									<div class="group/item flex items-center gap-4">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-xl transition-colors {plan.popular
												? 'bg-white/30 text-white'
												: 'bg-slate-50 text-primary group-hover/item:bg-primary group-hover/item:text-white'}"
										>
											<BookOpen size={18} strokeWidth={2.5} />
										</div>
										<span
											class="text-sm font-bold transition-colors {plan.popular
												? 'text-white/90'
												: 'text-slate-600 group-hover/item:text-slate-900'}"
										>
											{plan.lessons_count}
											{m.lesson_all_lessons
												? m.lesson_all_lessons({ count: plan.lessons_count })
												: 'ta dars'}
										</span>
									</div>
								</div>

								<button
									onclick={() => handleRegisterClick(plan.cardNumber, plan.title)}
									class="mt-10 flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-8 text-lg font-black tracking-tight shadow-lg transition-all active:scale-[0.98] {plan.popular
										? 'bg-white text-primary shadow-white/10 hover:bg-slate-100'
										: 'bg-primary text-white shadow-primary/10 hover:bg-primary-light'}"
								>
									{m.pricing_button()}
									<Plus size={20} strokeWidth={3} />
								</button>
							</div>
						</div>
					{/each}
				</div>

				{#if plans.length > 3}
					<div class="mt-20 flex justify-center">
						<button
							onclick={() => (showAll = !showAll)}
							class="group flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-10 py-5 text-lg font-black tracking-tight text-slate-900 transition-all hover:border-[#ed4b72] hover:text-[#ed4b72] active:scale-95"
						>
							{#if showAll}
								<ChevronUp size={24} strokeWidth={3} />
								{m.pricing_show_less ? m.pricing_show_less() : "Kamroq ko'rish"}
							{:else}
								<ChevronDown
									size={24}
									strokeWidth={3}
									class="transition-transform group-hover:translate-y-1"
								/>
								{m.pricing_show_more ? m.pricing_show_more() : "Ko'proq ko'rish"}
							{/if}
						</button>
					</div>
				{/if}
			{/if}
		{/await}
	</div>

	<!-- Payment Modal -->
	{#if isModalOpen}
		<div
			transition:fade={{ duration: 300 }}
			class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
			onclick={handleCloseModal}
			role="button"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Escape') handleCloseModal();
			}}
		>
			<div
				transition:fly={{ y: 50, duration: 400, easing: (t) => t * t * (3 - 2 * t) }}
				class="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-900/20 md:p-12"
				onclick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						handleCopyCardNumber();
					}
				}}
			>
				<!-- Decoration -->
				<div
					class="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#ed4b72]/10 blur-2xl"
				></div>

				<div class="mb-6 flex items-center justify-between">
					<div>
						<h2 class="text-xl font-black tracking-tight text-slate-800 md:text-2xl">
							{m.modal_title()}
						</h2>
						<p class="mt-1 font-semibold text-[#ed4b72]">{chosenCourseTitle}</p>
					</div>
				</div>

				<div class="space-y-6">
					<div class="group relative">
						<div
							class="absolute -inset-1 rounded-4xl bg-linear-to-r from-[#ed4b72] to-[#de3c61] opacity-25 blur transition duration-300 group-hover:opacity-40"
						></div>
						<div
							class="relative flex cursor-pointer items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-white"
							onclick={handleCopyCardNumber}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter') handleCopyCardNumber();
							}}
						>
							<div class="font-mono text-xl font-bold tracking-widest text-slate-800 md:text-2xl">
								{chosenCardNumber}
							</div>
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#ed4b72] shadow-sm transition-transform hover:scale-110 active:scale-95"
							>
								<Copy size={20} />
							</div>
						</div>
					</div>

					<div class="flex items-center gap-3 px-2">
						<div class="h-1.5 w-1.5 rounded-full bg-[#ed4b72]"></div>
						<div class="text-[10px] font-black tracking-wider text-slate-500 uppercase">
							{m.modal_card_owner()}
						</div>
					</div>

					<div class="rounded-3xl border border-blue-100 bg-blue-50/50 p-5">
						<p class="text-xs leading-relaxed font-medium text-slate-600 sm:text-sm">
							{m.modal_instruction()}
							<a
								href="https://t.me/chinora_academy"
								target="_blank"
								class="font-bold text-[#ed4b72] hover:underline"
							>
								{m.modal_tg_link()}
							</a>
							{m.modal_instruction2()}
						</p>
					</div>

					<button
						onclick={handleCloseModal}
						class="mt-2 flex w-full items-center justify-center rounded-2xl bg-slate-900 py-4 text-base font-black tracking-tight text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
					>
						{m.modal_close()}
					</button>
				</div>
			</div>
		</div>
	{/if}
</section>
