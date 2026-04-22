<script lang="ts">
	import { CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	let { courses } = $props();

	const courseStyles = [
		{ color: 'bg-primary', textColor: 'text-white' },
		{ color: 'bg-primary/90', textColor: 'text-white' },
		{ color: 'bg-primary/80', textColor: 'text-white' }
	];

	let openAccordions = $state({});
	let showAll = $state(false);

	function toggleAccordion(courseIndex, moduleIndex) {
		const key = `${courseIndex}-${moduleIndex}`;
		openAccordions[key] = openAccordions[key] ? null : true;
	}

	function isAccordionOpen(courseIndex, moduleIndex) {
		return !!openAccordions[`${courseIndex}-${moduleIndex}`];
	}

	const calculateDuration = (course) => {
		const moduleCount = course.modules?.length || course.modules_count || 0;
		if (moduleCount === 0) return '—';
		return `${moduleCount} ${m.weeks_label()}`;
	};
</script>

<section id="course-content" class="min-h-screen bg-muted/30 py-24">
	<div class="container mx-auto px-6">
		<div class="mb-16 text-center">
			<h2 class="mb-6 text-3xl font-bold text-foreground md:text-5xl">
				{@html m.course_title()}
			</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-base md:text-xl">
				{m.course_subtitle()}
			</p>
		</div>

		{#await courses}
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _, i (i)}
					<div
						class="h-[400px] animate-pulse rounded-[32px] border border-border bg-white/50"
					></div>
				{/each}
			</div>
		{:then resolvedCourses}
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each showAll ? resolvedCourses : resolvedCourses.slice(0, 3) as course, i (course.id)}
					{@const style = courseStyles[i % courseStyles.length]}
					<div
						class="bg-card text-card-foreground flex w-full flex-col overflow-hidden rounded-xl border border-border shadow-none transition-all duration-300 hover:shadow-sm"
						in:fade={{ duration: 400, delay: i * 50 }}
					>
						<div class="{style.color} {style.textColor} p-6">
							<div class="mb-3 flex items-center justify-between">
								<span
									class="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white"
								>
									{course.level || m.level_beginner()}
								</span>
								<div class="flex items-center gap-1 text-sm font-medium">
									<Clock class="h-4 w-4" />
									{calculateDuration(course)}
								</div>
							</div>
							<h3 class="text-xl leading-tight font-bold">{course.title}</h3>
						</div>

						<div class="grow space-y-4 bg-background p-4 sm:p-6">
							{#if course.modules && course.modules.length > 0}
								{#each course.modules as module, moduleIndex (module.id)}
									{#if module.lessons && module.lessons.length > 0}
										<div class="border-b border-border/50 pb-2 last:border-0">
											<button
												onclick={() => toggleAccordion(i, moduleIndex)}
												class="flex w-full items-center justify-between py-2 text-left text-sm font-medium transition-all hover:text-primary"
											>
												<div class="flex items-center gap-3">
													<CheckCircle class="h-5 w-5 shrink-0 text-primary" />
													<span class="text-sm text-foreground">{module.title}</span>
												</div>
												<ChevronDown
													class="text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-300 {isAccordionOpen(
														i,
														moduleIndex
													)
														? 'rotate-180'
														: ''}"
												/>
											</button>

											{#if isAccordionOpen(i, moduleIndex)}
												<div transition:slide={{ duration: 250 }} class="overflow-hidden">
													<div class="pt-1 pb-4">
														<ul
															class="text-muted-foreground list-disc space-y-2 pr-2 pl-10 text-sm"
														>
															{#each module.lessons as lesson (lesson.id)}
																<li>{lesson.title}</li>
															{/each}
														</ul>
													</div>
												</div>
											{/if}
										</div>
									{:else}
										<div
											class="flex items-start gap-3 border-b border-border/50 py-2 last:border-0"
										>
											<CheckCircle class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
											<span class="text-sm font-medium text-foreground">{module.title}</span>
										</div>
									{/if}
								{/each}
							{:else}
								<div class="flex flex-col items-center justify-center py-12 text-slate-400 italic">
									<p class="text-sm">{m.text_no_modules()}</p>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			{#if resolvedCourses.length > 3}
				<div class="mt-16 flex justify-center">
					<button
						onclick={() => (showAll = !showAll)}
						class="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 py-4 font-bold text-slate-700 shadow-sm transition-all hover:border-primary hover:text-primary active:scale-95"
					>
						{#if showAll}
							<ChevronUp class="h-5 w-5 transition-transform group-hover:-translate-y-1" />
							{m.pricing_show_less ? m.pricing_show_less() : "Kamroq ko'rish"}
						{:else}
							{m.btn_show_all()}
							<ChevronDown class="h-5 w-5 transition-transform group-hover:translate-y-1" />
						{/if}
					</button>
				</div>
			{/if}
		{/await}
	</div>
</section>
