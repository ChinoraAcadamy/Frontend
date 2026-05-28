<script>
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { CheckCircle, Award, Users, Globe, GraduationCap } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let section = $state(null);

	// Achievements (5 ta)
	const achievements = [
		{ icon: Users, text: m.about_achievement_1() },
		{ icon: Globe, text: m.about_achievement_2() },
		{ icon: Award, text: m.about_achievement_3() },
		{ icon: CheckCircle, text: m.about_achievement_4() },
		{ icon: GraduationCap, text: m.about_achievement_5() }
	];

	// Stats (6 ta)
	const stats = [
		{ number: m.about_stats_1_number(), label: m.about_stats_1_label() },
		{ number: m.about_stats_2_number(), label: m.about_stats_2_label() },
		{ number: m.about_stats_3_number(), label: m.about_stats_3_label() },
		{ number: m.about_stats_4_number(), label: m.about_stats_4_label() },
		{ number: m.about_stats_5_number(), label: m.about_stats_5_label() },
		{ number: m.about_stats_6_number(), label: m.about_stats_6_label() }
	];

	const instructorImage = '/images/hero_compressed.jpg';

	$effect(() => {
		if (!section) return;

		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: 'top 80%'
				}
			});

			tl.from('.instructor-image', { x: -50, opacity: 0, duration: 1, ease: 'power3.out' })
				.from(
					'.instructor-heading',
					{ y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' },
					'-=0.6'
				)
				.from(
					'.achievement-item',
					{ y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
					'-=0.4'
				)
				.from('.stats-card', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
		}, section);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<link rel="preload" as="image" href={instructorImage} fetchpriority="high" />
</svelte:head>

<section bind:this={section} id="about" class="overflow-hidden bg-background py-20">
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-6xl">
			<div class="mb-12 text-center">
				<h2 class="instructor-heading mb-6 text-4xl font-bold text-foreground md:text-5xl">
					{@html m.about_title()}
				</h2>
				<p class="text-muted-foreground mx-auto max-w-3xl text-lg">
					{m.about_subtitle()}
				</p>
			</div>

			<div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
				<!-- Rasm tarafi -->
				<div class="instructor-image relative">
					<div
						class="group relative aspect-4/5 overflow-hidden rounded-2xl bg-muted/30 md:aspect-3/4"
					>
						<img
							src={instructorImage}
							alt="Ibodullayeva Chinora"
							class="h-full w-full scale-100 object-cover opacity-100 transition-all duration-700 ease-out"
							loading="lazy"
						/>
						<div
							class="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80"
						></div>
					</div>

					<div
						class="absolute -right-4 -bottom-6 z-20 rounded-full bg-primary p-4 text-white shadow-xl transition-transform hover:scale-110 md:-right-6"
					>
						<Award class="h-8 w-8" />
					</div>
				</div>

				<!-- Matn va stats tarafi -->
				<div class="space-y-8">
					<div>
						<h3 class="mb-4 text-2xl font-bold text-foreground">
							{m.about_heading()}
						</h3>
						<p class="text-muted-foreground mb-6 leading-relaxed">
							{m.about_description()}
						</p>

						<!-- Achievements -->
						<div class="flex flex-wrap gap-4">
							{#each achievements as achievement (achievement.text)}
								<div class="achievement-item flex w-full items-center gap-3 sm:w-[48%]">
									<div class="rounded-lg bg-primary/10 p-2 text-primary">
										<achievement.icon class="h-5 w-5" />
									</div>
									<span class="text-sm font-medium text-foreground">
										{achievement.text}
									</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Stats Card -->
					<div
						class="stats-card w-full rounded-2xl border border-border/50 bg-gradient-to-br from-background via-muted/40 to-background pt-6 shadow-sm"
					>
						<div class="p-6">
							<h4 class="mb-6 text-center text-lg font-bold text-foreground">
								{m.about_stats_title()}
							</h4>
							<div class="grid grid-cols-2 gap-6 sm:grid-cols-3">
								{#each stats as stat (stat.label)}
									<div class="group text-center">
										<div
											class="mb-1 text-2xl font-black text-primary transition-transform group-hover:scale-105"
										>
											{stat.number}
										</div>
										<div class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
											{stat.label}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
</style>
