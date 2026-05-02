<!-- src/lib/components/WhoIsThisFor.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';
    import * as m from '$lib/paraglide/messages.js';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { Users, Heart, PenTool, SwatchBook, Scissors, Banknote } from 'lucide-svelte';

	gsap.registerPlugin(ScrollTrigger);

	let section;
	let scrollContainer;

	const targetAudience = [
		{
			icon: PenTool,
			title: m.who_for_audience_1_title(),
			description: m.who_for_audience_1_desc()
		},
		{
			icon: Scissors,
			title: m.who_for_audience_2_title(),
			description: m.who_for_audience_2_desc()
		},
		{
			icon: SwatchBook,
			title: m.who_for_audience_3_title(),
			description: m.who_for_audience_3_desc()
		},
		{
			icon: Banknote,
			title: m.who_for_audience_4_title(),
			description: m.who_for_audience_4_desc()
		},
		{
			icon: Users,
			title: m.who_for_audience_5_title(),
			description: m.who_for_audience_5_desc()
		},
		{
			icon: Heart,
			title: m.who_for_audience_6_title(),
			description: m.who_for_audience_6_desc()
		}
	];

	onMount(() => {
		if (!section || !scrollContainer) return;

		const ctx = gsap.context(() => {
			const cards = scrollContainer;
			const totalWidth = cards.scrollWidth;
			const windowWidth = window.innerWidth;
			const scrollAmount = Math.max(0, totalWidth - windowWidth + 42); // buffer

			gsap.to(cards, {
				x: -scrollAmount,
				ease: 'none',
				scrollTrigger: {
					trigger: section,
					pin: true,
					scrub: 1,
					start: 'top top',
					end: () => `+=${scrollAmount}`,
					invalidateOnRefresh: true
					// markers: true, // test uchun yoqing
				}
			});
		}, section); // scope → section

		return () => ctx.revert();
	});

	onDestroy(() => {
		ScrollTrigger.getAll().forEach((t) => t.kill());
	});
</script>

<section
	bind:this={section}
	id="who-for"
	class="bg-background relative overflow-hidden py-32 lg:py-24"
>
	<div class="container mx-auto px-6 text-center">
		<h2
			class="text-foreground font-tarsk gradient-text mb-4 text-3xl font-bold md:mb-6 md:text-4xl"
		>
			{@html m.who_for_title()}
		</h2>

		<p class="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg">
			{@html m.who_for_subtitle()}
		</p>
	</div>

	<!-- Desktop (va katta ekranlarda) horizontal scroll + pin -->
	<div class="relative max-w-full overflow-x-hidden lg:block">
		<div bind:this={scrollContainer} class="flex gap-6 px-6 will-change-transform">
			{#each targetAudience as item (item.title)}
				<div
					class="luxury-card group min-w-[300px] max-w-xs shrink-0 cursor-pointer p-4 transition-all duration-300 hover:bg-muted"
				>
					<div class="flex h-full flex-col justify-between pb-2">
						<div class="space-y-4">
							<div
								class="bg-primary/10 mt-4 ml-4 flex h-10 w-10 items-center justify-center rounded-full"
							>
								<svelte:component this={item.icon} class="text-primary h-6 w-6" />
							</div>
							<div class="pl-4">
								<h3 class="text-foreground font-tarsk text-xl leading-tight font-bold">
									{item.title}
								</h3>
							</div>
						</div>
						<div class="pb-0 pl-4 mt-4">
							<p class="text-muted-foreground text-base leading-relaxed">
								{item.description}
							</p>
						</div>
					</div>
				</div>
			{/each}

		</div>
	</div>

	<!-- 
    Agar mobil uchun alohida versiya kerak bo'lsa (masalan oddiy vertical stack),
    shu yerga @media (max-width: 1023px) ichida yoki alohida div qo'shishingiz mumkin
  -->
</section>

<style>
	/* Agar qo'shimcha stil kerak bo'lsa shu yerga */
	/* .gradient-text { background: linear-gradient(...); -webkit-background-clip: text; } */
</style>
