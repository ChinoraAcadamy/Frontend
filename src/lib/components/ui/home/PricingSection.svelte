<script>
	import { Plus, Copy, BookOpen, Layers } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages.js';

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

	// Narxni formatlash: "499000.00" → "499 000 so'm"
	function formatPrice(price) {
		const num = Math.round(parseFloat(price));
		return num.toLocaleString('uz-UZ') + " so'm";
	}

	let pricingPlans = $derived(
		courses.map((course, i) => ({
			...course,
			...(courseMeta[i] ?? { popular: false, cardNumber: '8600 5704 0753 9039' })
		}))
	);

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
		} catch (err) {
			toast.error(m.modal_copy_error());
			console.log('Clipboard API error:', err);
		}
	}
</script>

<section id="pricing" class="bg-background py-20">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<h2 class="mb-6 text-4xl font-bold text-foreground md:text-5xl">
				{@html m.pricing_title()}
			</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				{m.pricing_subtitle()}
			</p>
		</div>

		<!-- Kurslar yo'q yoki load bo'lmagan holat -->
		{#if courses.length === 0}
			<div class="text-muted-foreground py-20 text-center">
				<p>Kurslar hozircha mavjud emas.</p>
			</div>
		{:else}
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
				{#each pricingPlans as plan (plan.id)}
					<div
						class="group relative flex transform flex-col rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg
                        {plan.popular
							? 'bg-linear-to-br from-primary to-accent text-white shadow-md'
							: 'bg-card text-card-foreground border-border'}"
					>
						{#if plan.popular}
							<div class="absolute -top-4 left-1/2 -translate-x-1/2">
								<span
									class="text-primary-foreground inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold tracking-wide shadow-md"
								>
									{m.pricing_popular()}
								</span>
							</div>
						{/if}

						<div class="px-6 pt-8 pb-4 text-center">
							<!-- Level badge (description maydoni: Beginner/Middle/Advance) -->
							<span
								class="mx-auto mb-4 inline-flex w-fit cursor-pointer items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors
                                {plan.popular
									? 'border-white/50 bg-black/30 text-white'
									: 'border-primary/50 bg-primary/10 text-primary'}"
							>
								{plan.description}
							</span>

							<h3 class="mb-3 text-2xl leading-none font-bold tracking-tight">
								{plan.title}
							</h3>

							<div class="mt-4 space-y-2">
								{#if plan.old_price}
									<div
										class="text-sm line-through opacity-70 {plan.popular
											? 'text-white/70'
											: 'text-muted-foreground'}"
									>
										{formatPrice(plan.old_price)}
									</div>
								{/if}
								<div
									class="text-4xl font-extrabold {plan.popular
										? 'text-[#FFE4E4]'
										: 'text-foreground'}"
								>
									{formatPrice(plan.price)}
								</div>
							</div>
						</div>

						<div class="flex grow flex-col justify-between space-y-6 p-6">
							<!-- Modul va darslar soni -->
							<div class="space-y-3">
								<div class="flex items-center gap-3">
									<Layers class="h-5 w-5 shrink-0 {plan.popular ? 'text-white' : 'text-primary'}" />
									<span class={plan.popular ? 'text-white/90' : 'text-muted-foreground'}>
										{plan.modules_count} ta modul
									</span>
								</div>
								<div class="flex items-center gap-3">
									<BookOpen
										class="h-5 w-5 shrink-0 {plan.popular ? 'text-white' : 'text-primary'}"
									/>
									<span class={plan.popular ? 'text-white/90' : 'text-muted-foreground'}>
										{plan.lessons_count} ta dars
									</span>
								</div>
							</div>

							<button
								onclick={() => handleRegisterClick(plan.cardNumber, plan.title)}
								class="group relative mt-auto flex w-full items-center justify-center gap-4 rounded-lg px-6 py-3 text-lg leading-tight font-bold shadow-md transition-all duration-300 hover:shadow-lg
                                {plan.popular
									? 'bg-gradient-section text-secondary-foreground border border-[#C7A27C]/20 hover:border-[#C7A27C] hover:bg-[#C7A27C]/90'
									: 'text-primary-foreground bg-linear-to-r from-primary to-accent hover:opacity-90'}"
							>
								{m.pricing_button()}
								<span
									class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ease-in-out
                                    {plan.popular
										? 'text-secondary-foreground group-hover:bg-black/10'
										: 'text-white group-hover:bg-white/20'}"
								>
									<Plus size={20} strokeWidth={2.5} />
								</span>
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Payment Modal -->
	{#if isModalOpen}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-4 backdrop-blur-sm"
			onclick={handleCloseModal}
			role="button"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Escape') handleCloseModal();
			}}
		>
			<div
				transition:fly={{ y: 50, duration: 300 }}
				class="bg-card border-border w-full max-w-md rounded-2xl border p-6 shadow-2xl"
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
				<h2 class="mb-1 text-2xl leading-tight font-bold text-foreground">
					{m.modal_title()}
				</h2>
				<p class="text-muted-foreground mb-4 text-sm">{chosenCourseTitle}</p>

				<div
					class="border-border group mb-6 flex cursor-pointer items-center justify-between gap-2 rounded-xl border bg-muted/50 p-3 transition-colors hover:bg-muted"
					onclick={handleCopyCardNumber}
					role="button"
					tabindex="0"
					onkeydown={(e) => {
						if (e.key === 'Enter') handleCopyCardNumber();
					}}
				>
					<div class="font-mono text-lg font-semibold tracking-wider text-foreground">
						{chosenCardNumber}
					</div>
					<button
						class="rounded-md p-2 text-primary transition-transform group-hover:scale-110 hover:bg-primary/10"
					>
						<Copy class="h-5 w-5" />
					</button>
				</div>

				<div class="mb-4 text-sm font-medium text-foreground">{m.modal_card_owner()}</div>
				<hr class="border-border mb-4 border-t" />

				<p class="text-muted-foreground mb-6 text-sm leading-relaxed">
					{m.modal_instruction()}
					<a
						href="https://t.me/chinora_academy"
						target="_blank"
						class="font-semibold text-primary hover:underline"
					>
						{m.modal_tg_link()}
					</a>
					{m.modal_instruction2()}
				</p>

				<button
					onclick={handleCloseModal}
					class="text-primary-foreground w-full rounded-lg bg-primary px-4 py-3 font-semibold transition-opacity hover:opacity-90"
				>
					{m.modal_close()}
				</button>
			</div>
		</div>
	{/if}
</section>
