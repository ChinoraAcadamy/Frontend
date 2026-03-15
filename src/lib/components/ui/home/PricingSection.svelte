<script>
	import { CheckCircle, Plus, Copy } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner'; // Agar o'rnatmagan bo'lsangiz, npm i svelte-sonner

	const pricingPlans = [
		{
			level: 'Starter Pack',
			title: 'Asosiy tikuvchilik ko‘nikmalari',
			originalPrice: '2,900,000',
			currentPrice: '499,000',
			duration: '8 hafta',
			color: 'border-primary',
			popular: false,
			cardNumber: '5614 6814 2795 9931',
			features: [
				"Bolalar va kattalar ssos andazasi va uni qo'llash",
				'Chok turlari',
				'Yeng moduli',
				'Yoqalar moduli',
				"Modellashtirish va amaliy mashg'ulotlar",
				'Murakkab bichimli liboslar bichish'
			],
			bonus: "Bonus: Maqsad qo'yish va rivojlanish seminari!"
		},
		{
			level: 'Fashion Designer',
			title: 'Murakkab fason va dizayn',
			originalPrice: '6,500,000',
			currentPrice: '4,999,000',
			duration: '16 hafta',
			color: 'border-primary',
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
			],
			bonus: 'Bonus modul: Shaxsiy brending va ijtimoiy tarmoqlarda marketing'
		},
		{
			level: 'Pro Master',
			title: 'Professional darajaga chiqish',
			originalPrice: '6,500,000',
			currentPrice: '5,000,000',
			duration: '10 hafta',
			color: 'border-primary',
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
			],
			bonus: 'Palto bichish tikish texnologiyalari'
		}
	];

	// Svelte 5 Reactive States
	let isModalOpen = $state(false);
	let chosenCourse = $state('');

	function handleRegisterClick(cardNumber) {
		chosenCourse = cardNumber;
		isModalOpen = true;
	}

	function handleCloseModal() {
		isModalOpen = false;
	}

	async function handleCopyCardNumber() {
		try {
			await navigator.clipboard.writeText(chosenCourse);
			toast.success('Karta raqami nusxalandi!');
		} catch (err) {
			console.error('Nusxalashda xatolik yuz berdi:', err);
			toast.error('Nusxalash imkonsiz!');
		}
	}
</script>

<section id="pricing" class="bg-background py-20">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<h2 class="mb-6 text-4xl font-bold text-foreground md:text-5xl">
				Sizning <span class="text-primary">investment</span>
			</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Har bir daraja o'z narxi va maxsus bonuslari bilan. Hoziroq boshlang va kelajagingizga
				sarmoya kiriting!
			</p>
		</div>

		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
			{#each pricingPlans as plan (plan.title)}
				<div
					class="group relative flex transform flex-col rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg
          {plan.popular
						? 'to-accent bg-linear-to-br from-primary text-white shadow-md'
						: 'bg-card text-card-foreground border-border'}"
				>
					{#if plan.popular}
						<div class="absolute -top-4 left-1/2 -translate-x-1/2 transform">
							<span
								class="text-primary-foreground inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold tracking-wide shadow-md"
								style="box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);"
							>
								Eng mashhur
							</span>
						</div>
					{/if}

					<div class="px-6 pt-8 pb-4 text-center">
						<span
							class="mx-auto mb-4 inline-flex w-fit cursor-pointer items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors
              {plan.popular
								? 'border-white/50 bg-black/30 text-white'
								: 'border-primary/50 bg-primary/10 text-primary'}"
						>
							{plan.level}
						</span>
						<h3 class="mb-3 text-2xl leading-none font-bold tracking-tight">{plan.title}</h3>

						<div class="mt-4 space-y-2">
							<div
								class="text-sm line-through opacity-70 {plan.popular
									? 'text-white/70'
									: 'text-muted-foreground'}"
							>
								{plan.originalPrice} so'm
							</div>
							<div
								class="text-4xl font-extrabold {plan.popular
									? 'text-[#FFE4E4]'
									: 'text-foreground'}"
							>
								{plan.currentPrice} so'm
							</div>
							<div
								class="text-sm font-medium {plan.popular
									? 'text-white/80'
									: 'text-muted-foreground'}"
							>
								{plan.duration} davomida
							</div>
						</div>
					</div>

					<div class="flex grow flex-col justify-between space-y-6 p-6">
						<div class="space-y-4">
							{#each plan.features as feature (feature)}
								<div class="flex items-start gap-4">
									<CheckCircle
										class="h-5 w-5 {plan.popular
											? 'text-white'
											: 'text-primary'} mt-0.5 shrink-0"
									/>
									<span
										class="text-base {plan.popular ? 'text-white/90' : 'text-muted-foreground'}"
									>
										{feature}
									</span>
								</div>
							{/each}
						</div>

						<button
							onclick={() => handleRegisterClick(plan.cardNumber)}
							class="group relative mt-auto flex w-full items-center justify-center gap-4 rounded-lg px-6 py-3 text-lg leading-tight font-bold shadow-md transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-primary/50 focus:outline-none
              {plan.popular
								? 'bg-gradient-section text-secondary-foreground border border-[#C7A27C]/20 hover:border-[#C7A27C] hover:bg-[#C7A27C]/90'
								: 'to-accent text-primary-foreground bg-linear-to-r from-primary hover:opacity-90'}"
						>
							Kursni tanlash
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
	</div>

	{#if isModalOpen}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-4 backdrop-blur-sm"
			onclick={handleCloseModal}
			role="button"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					handleCloseModal();
				}
			}}>
			<div
				transition:fly={{ y: 50, duration: 300 }}
				class="bg-card border-border w-full max-w-md rounded-2xl border p-6 shadow-2xl"
				onclick={(e) => e.stopPropagation()}
                role="button"
                tabindex="0"
                onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                    }
                 }}
			>
				<h2 class="mb-4 text-2xl leading-tight font-bold text-foreground">
					To'lovni amalga oshirish uchun karta raqamidan foydalaning:
				</h2>

				<div
					class="border-border group mb-6 flex cursor-pointer items-center justify-between gap-2 rounded-xl border bg-muted/50 p-3 transition-colors hover:bg-muted"
					onclick={handleCopyCardNumber}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleCopyCardNumber();
                        }
                     }}
				>
					<div class="font-mono text-lg font-semibold tracking-wider text-foreground">
						{chosenCourse}
					</div>
					<button
						class="rounded-md p-2 text-primary transition-transform group-hover:scale-110 hover:bg-primary/10"
					>
						<Copy class="h-5 w-5" />
					</button>
				</div>

				<div class="mb-4 text-sm font-medium text-foreground">Ibodullayeva Chinora</div>
				<hr class="border-border mb-4 border-t" />

				<p class="text-muted-foreground mb-6 text-sm leading-relaxed">
					To'lov chekini telegram orqali
					<a
						href="https://t.me/chinora_academy"
						target="_blank"
						class="font-semibold text-primary hover:underline"
					>
						@chinora_academy
					</a> ga yuboring. To'lov o'tgandan so'ng 24 soat ichida telegram profilingizga bog'lanamiz.
				</p>

				<button
					onclick={handleCloseModal}
					class="text-primary-foreground w-full rounded-lg bg-primary px-4 py-3 font-semibold transition-opacity hover:opacity-90"
				>
					Tushunarli, yopish
				</button>
			</div>
		</div>
	{/if}
</section>
