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
					start: 'top 80%',
				}
			});

			tl.from('.instructor-image', { x: -50, opacity: 0, duration: 1, ease: 'power3.out' })
				.from('.instructor-heading', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
				.from('.achievement-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, "-=0.4")
				.from('.stats-card', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, "-=0.4");
		}, section);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<link rel="preload" as="image" href={instructorImage} fetchpriority="high" />
</svelte:head>

<section bind:this={section} id="about" class="py-20 bg-background overflow-hidden">
	<div class="container mx-auto px-6">
		<div class="max-w-6xl mx-auto">
			
			<div class="text-center mb-12">
				<h2 class="text-4xl md:text-5xl font-bold mb-6 text-foreground instructor-heading">
					{@html m.about_title()}
				</h2>
				<p class="text-lg text-muted-foreground max-w-3xl mx-auto">
					{m.about_subtitle()}
				</p>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
				
				<!-- Rasm tarafi -->
				<div class="relative instructor-image">
					<div class="relative rounded-2xl overflow-hidden group aspect-4/5 md:aspect-3/4 bg-muted/30">
						<img
							src={instructorImage}
							alt="Ibodullayeva Chinora"
							class="w-full h-full object-cover transition-all duration-700 ease-out opacity-100 scale-100"
							loading="lazy"
						/>
						<div class="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
					</div>

					<div class="absolute -bottom-6 -right-4 md:-right-6 bg-primary text-white p-4 rounded-full shadow-xl z-20 hover:scale-110 transition-transform">
						<Award class="w-8 h-8" />
					</div>
				</div>

				<!-- Matn va stats tarafi -->
				<div class="space-y-8">
					<div>
						<h3 class="text-2xl font-bold mb-4 text-foreground">
							{m.about_heading()}
						</h3>
						<p class="text-muted-foreground leading-relaxed mb-6">
							{m.about_description()}
						</p>

						<!-- Achievements -->
						<div class="flex flex-wrap gap-4">
							{#each achievements as achievement (achievement.text)}
								<div class="flex items-center gap-3 w-full sm:w-[48%] achievement-item">
									<div class="text-primary bg-primary/10 p-2 rounded-lg">
										<achievement.icon class="w-5 h-5" />
									</div>
									<span class="text-foreground font-medium text-sm">
										{achievement.text}
									</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Stats Card -->
					<div class="stats-card w-full border border-border/50 shadow-sm pt-6 bg-linear-to-br from-background via-muted/20 to-muted/40 rounded-2xl">
						<div class="p-6">
							<h4 class="text-lg font-bold mb-6 text-foreground text-center">
								{m.about_stats_title()}
							</h4>
							<div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
								{#each stats as stat (stat.label)}
									<div class="text-center group">
										<div class="text-2xl font-black text-primary mb-1 group-hover:scale-105 transition-transform">
											{stat.number}
										</div>
										<div class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
</style>