<script>
	import { Lock, CheckCircle2 } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';

	let { lesson, isVideoFinished, isSubmittingComplete, hasNextLesson, markComplete } = $props();
</script>

<div class="flex flex-col gap-3.5 px-2 sm:px-0">
	<!-- Mini Tag -->
	<div class="flex items-center">
		<span
			class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-primary uppercase"
		>
			{m.lesson_info_title()}
		</span>
	</div>

	<!-- Title & Description -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-black tracking-tight text-foreground md:text-3xl">
			{lesson.title}
		</h1>
		{#if lesson.description}
			<p class="mt-1 text-[13.5px] leading-relaxed font-medium text-muted">
				{lesson.description}
			</p>
		{/if}
	</div>
</div>

<!-- Divider line in flat design -->
<div class="mx-2 my-2 border-b border-main/40 sm:mx-0"></div>

<!-- Completion Action -->
{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
	<div class="mx-2 flex flex-col gap-3 sm:mx-0">
		{#if !isVideoFinished}
			<div
				class="flex items-center gap-3.5 rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-4 text-[13px] font-semibold text-amber-800 dark:text-amber-300"
				transition:slide
			>
				<div
					class="flex shrink-0 items-center justify-center rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400"
				>
					<Lock size={16} strokeWidth={2.5} />
				</div>
				<span class="leading-snug">{m.lesson_video_lock()}</span>
			</div>
		{:else}
			<div
				class="flex items-center gap-3.5 rounded-2xl border border-emerald-500/15 bg-emerald-500/4 p-4 text-[13px] font-semibold text-emerald-800 dark:text-emerald-300"
				transition:slide
			>
				<div
					class="flex shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400"
				>
					<CheckCircle2 size={16} strokeWidth={2.5} />
				</div>
				<span class="leading-snug">{m.lesson_video_watched()}</span>
			</div>
		{/if}

		<button
			onclick={markComplete}
			disabled={isSubmittingComplete || !isVideoFinished}
			class="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-black tracking-wide transition-all duration-200 active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed
			{isVideoFinished
				? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/10'
				: 'border border-main bg-card text-muted opacity-60'}"
		>
			{#if isSubmittingComplete}
				<div
					class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
				></div>
				<span>{m.lesson_submitting()}</span>
			{:else}
				{#if !isVideoFinished}
					<Lock size={17} strokeWidth={2.5} />
				{:else}
					<CheckCircle2 size={17} strokeWidth={2.5} />
				{/if}
				<span>{hasNextLesson ? m.lesson_next_lesson() : m.lesson_mark_complete()}</span>
			{/if}
		</button>
	</div>
	<div class="mb-4 h-2"></div>
{/if}
