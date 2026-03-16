<script>
	import { Plus } from 'lucide-svelte';
	import { CreditCard, Phone, Send } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	const faqs = [
		{
			question: m.faq_1_question(),
			answer: m.faq_1_answer()
		},
		{
			question: m.faq_2_question(),
			answer: m.faq_2_answer()
		},
		{
			question: m.faq_3_question(),
			answer: m.faq_3_answer()
		}
	];

	let openItem = null;

	function toggle(value) {
		openItem = openItem === value ? null : value;
	}
</script>

<section id="faq" class="py-20 bg-gradient-section">
	<div class="container mx-auto px-6">
		<!-- Title -->
		<div class="mb-16 text-center">
			<h2 class="text-4xl md:text-5xl font-bold mb-6 text-foreground">
				{@html m.faq_title()}
			</h2>
			<p class="text-lg text-muted-foreground max-w-3xl mx-auto">
				{m.faq_subtitle()}
			</p>
		</div>

		<!-- FAQ Accordion -->
		<div class="max-w-4xl mx-auto space-y-4">
			{#each faqs as faq, index (faq.question)}
				<div class="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
					<!-- Trigger -->
					<button
						on:click={() => toggle(`faq-${index}`)}
						class="flex w-full items-center justify-between px-8 py-6 text-left font-semibold text-foreground text-lg hover:bg-muted/50 transition-colors"
					>
						<span>{faq.question}</span>
						
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300
									{openItem === `faq-${index}` ? 'rotate-45 bg-primary text-white' : ''}">
							<Plus class="h-5 w-5" />
						</div>
					</button>

					<!-- Content -->
					{#if openItem === `faq-${index}`}
						<div class="px-8 pb-8 border-t pt-2 text-base leading-relaxed text-muted-foreground">
							{faq.answer}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Payment & Contact Section -->
		<div class="mt-20">
			<div class="mx-auto max-w-4xl text-center">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
					
					<!-- To‘lov usullari -->
					<div class="flex flex-col items-center">
						<div class="flex items-center gap-3 text-primary mb-3">
							<CreditCard class="h-6 w-6" />
							<span class="font-semibold text-lg">{m.faq_payment_methods()}</span>
						</div>
						<p class="text-muted-foreground">
							{m.faq_payment_list()}
						</p>
					</div>

					<!-- Telefon -->
					<a
						href="tel:+998338055505"
						class="flex flex-col items-center group"
					>
						<div class="flex items-center gap-3 text-primary mb-3">
							<Phone class="h-6 w-6" />
							<span class="font-semibold text-lg group-hover:underline">+998 33 805 55 05</span>
						</div>
						<p class="text-sm text-muted-foreground">{m.faq_contact()}</p>
					</a>

					<!-- Telegram -->
					<a
						href="https://t.me/chinora_academy"
						target="_blank"
						class="flex flex-col items-center group"
					>
						<div class="flex items-center gap-3 text-primary mb-3">
							<Send class="h-6 w-6" />
							<span class="font-semibold text-lg group-hover:underline">@chinora_academy</span>
						</div>
						<p class="text-sm text-muted-foreground">{m.faq_telegram()}</p>
					</a>

				</div>
			</div>
		</div>
	</div>
</section>