<script>
	/* eslint-disable no-unused-vars */

	import { Plus, Copy, CheckCircle, BookOpen, Layers, ChevronDown, ChevronUp } from 'lucide-svelte';
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
			cardNumber: '5614 6814 2795 9931',
			features: [
				"Bolalar va kattalar ssos andazasi va uni qo'llash",
				'Chok turlari',
				'Yeng moduli',
				'Yoqalar moduli',
				"Modellashtirish va amaliy mashg'ulotlar",
				'Murakkab bichimli liboslar bichish'
			]
		},
		{
			popular: true,
			cardNumber: '8600 5704 0753 9039',
			features: [
				'Jahon standartidagi bazaviy asoslar konstruksiyasi va ulardan texnikas',
				'Jahon standartida tikish texnologiyalari',
				"Modellashtirish (ayollar ko'ylagi va bluzkalar)",
				'Yeng mavzusi',
				'Nostandarst qomatlar bilan ishlash',
				'Oqshom liboslari. Drapirovka',
				'Dizaynerlik. Eskiz chizish',
				'Psixologik darslar',
				'Marketing va brending asoslari'
			]
		},
		{
			popular: false,
			cardNumber: '8600 5704 0753 9039',
			features: [
				'Myuller metodikasida ustki kiyimlar asosi moduli',
				'Myuller metodikasida yubka va shim moduli',
				'Yubka va shim amaliyotlari',
				'Ustki kiyimlar uchun yeng moduli',
				'Kostyum modellashtirish moduli',
				'Palto modellashtirish moduli',
				'Yoqalar konstruksiyalari va amaliyoti moduli',
				'Astarli liboslarda nostandart figuralar bilan ishlash',
				'Klassik astarli kostyumlar bichish tikish texnologiyalari'
			]
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
			...(courseMeta[i] ?? {
				popular: false,
				cardNumber: '8600 5704 0753 9039',
				features: []
			})
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
	<div class="container mx-auto px-2">
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
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _, i (i)}
					<div
						class="relative flex h-[580px] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
						in:fade={{ duration: 300, delay: i * 100 }}
					>
						<!-- Shimmer effect -->
						<div class="shimmer absolute inset-0 z-10"></div>

						<!-- Header Area Skeleton -->
						<div class="p-8 pt-10 text-center">
							<div class="mx-auto mb-4 h-6 w-24 rounded-lg bg-slate-100"></div>
							<div class="mx-auto h-8 w-3/4 rounded-xl bg-slate-200"></div>

							<div class="mt-6 space-y-2">
								<div class="mx-auto h-4 w-20 rounded bg-slate-100"></div>
								<div class="mx-auto h-12 w-1/2 rounded-2xl bg-slate-200"></div>
								<div class="mx-auto h-4 w-32 rounded bg-slate-100"></div>
							</div>
						</div>

						<!-- Features Area Skeleton -->
						<div class="flex-1 space-y-4 p-8 pt-0">
							{#each Array(5) as _, i (i)}
								<div class="flex items-start gap-4">
									<div class="h-5 w-5 shrink-0 rounded-full bg-slate-100"></div>
									<div class="h-4 w-full rounded-lg bg-slate-50"></div>
								</div>
							{/each}

							<div class="mt-auto pt-8">
								<div class="h-14 w-full rounded-2xl bg-slate-200"></div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<style>
				.shimmer {
					background: linear-gradient(
						90deg,
						rgba(255, 255, 255, 0) 0%,
						rgba(255, 255, 255, 0.6) 50%,
						rgba(255, 255, 255, 0) 100%
					);
					background-size: 200% 100%;
					animation: shimmer-anim 2s infinite linear;
				}

				@keyframes shimmer-anim {
					0% {
						background-position: -200% 0;
					}
					100% {
						background-position: 200% 0;
					}
				}
			</style>
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
				<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each displayedPlans as plan (plan.id)}
						<div
							class="group relative flex transform flex-col rounded-3xl border border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl {plan.popular
								? 'bg-primary text-white shadow-xl shadow-primary/20'
								: 'border-slate-100 bg-white text-slate-900 shadow-sm'}"
						>
							{#if plan.popular}
								<div class="absolute -top-4 left-1/2 -translate-x-1/2 transform">
									<span
										class="rounded-full bg-white px-6 py-2 text-[10px] font-black tracking-widest text-primary uppercase shadow-md"
									>
										{m.pricing_popular()}
									</span>
								</div>
							{/if}

							<!-- Top Content Area -->
							<div class="p-8 pt-8 pb-4 text-center">
								<div
									class="mx-auto mb-4 w-fit rounded-lg border px-4 py-1.5 text-[10px] font-black tracking-widest uppercase {plan.popular
										? 'border-white/30 bg-black/20 text-white'
										: 'border-primary/20 bg-primary/10 text-primary'}"
								>
									{plan.level || 'Boshlang‘ich'}
								</div>
								<h3 class="mb-4 text-2xl font-black tracking-tight">{plan.title}</h3>

								<div class="mb-6 space-y-1">
									{#if plan.old_price}
										<div
											class="text-sm font-bold line-through opacity-60 {plan.popular
												? 'text-white'
												: 'text-slate-500'}"
										>
											{formatPrice(plan.old_price)}
										</div>
									{/if}
									<div
										class="text-4xl font-black tracking-tighter md:text-5xl {plan.popular
											? 'text-white'
											: 'text-slate-900'}"
									>
										{formatPrice(plan.price)}
									</div>
									<div
										class="mt-2 text-[11px] font-black tracking-widest uppercase {plan.popular
											? 'text-white/80'
											: 'text-slate-400'}"
									>
										{plan.duration}
										{m.weeks_label ? m.weeks_label() : 'hafta'} davomida
									</div>
								</div>
							</div>

							<!-- Features -->
							<div class="flex flex-1 flex-col space-y-4 p-8 pt-0">
								{#if plan.features && plan.features.length > 0}
									<div class="flex-1 space-y-4">
										{#each plan.features as feature (feature)}
											<div class="flex items-start gap-4">
												<CheckCircle
													class="mt-0.5 h-5 w-5 shrink-0 {plan.popular
														? 'text-white'
														: 'text-primary'}"
													strokeWidth={2.5}
												/>
												<span
													class="text-[14px] leading-tight font-medium {plan.popular
														? 'text-white/90'
														: 'text-slate-600'}"
												>
													{feature}
												</span>
											</div>
										{/each}
									</div>
								{/if}

								<button
									onclick={() => handleRegisterClick(plan.cardNumber, plan.title)}
									class="relative mt-8 flex w-full items-center justify-center gap-4 rounded-xl px-8 py-4 text-sm font-black tracking-widest uppercase shadow-lg transition-all duration-300 active:scale-[0.98]
                                    {plan.popular
										? 'bg-white text-primary hover:bg-slate-50'
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
			transition:fade={{ duration: 150 }}
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
			onclick={handleCloseModal}
			role="button"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Escape') handleCloseModal();
			}}
		>
			<div
				transition:fly={{ y: 20, duration: 200 }}
				class="relative w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-2xl md:p-10"
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
				<h2
					class="mb-8 text-left text-2xl leading-snug font-bold tracking-tight text-slate-800 md:text-3xl"
				>
					{m.modal_title()}
				</h2>

				<div class="mb-4 flex items-center gap-4">
					<div
						class="flex-1 rounded-xl border border-[#e5e7eb] bg-white p-4 font-medium tracking-normal text-slate-700 shadow-sm"
					>
						<span class="block truncate text-base sm:text-lg md:text-xl">
							{chosenCardNumber}
						</span>
					</div>
					<button
						onclick={handleCopyCardNumber}
						class="shrink-0 text-primary transition-all hover:scale-110 active:scale-90"
						title="Nusxa olish"
					>
						<Copy size={28} strokeWidth={1.5} />
					</button>
				</div>

				<div class="mb-4 text-left text-[15px] font-medium text-slate-500">
					{m.modal_card_owner()}
				</div>

				<div class="mb-6 h-px w-full bg-[#f3f4f6]"></div>

				<p
					class="mb-10 text-left text-[15px] leading-relaxed font-medium text-slate-600 md:text-base"
				>
					{m.modal_instruction()}
					<a
						href="https://t.me/chinora_academy"
						target="_blank"
						class="font-semibold text-[#9b1c48] hover:underline"
					>
						{m.modal_tg_link()}
					</a>
					{m.modal_instruction2()}
				</p>

				<button
					onclick={handleCloseModal}
					class="flex w-full items-center justify-center rounded-xl bg-[#9b1c48] py-4 text-xl font-medium text-white transition-all hover:bg-[#80163a] active:scale-[0.98]"
				>
					{m.modal_close()}
				</button>
			</div>
		</div>
	{/if}
</section>
