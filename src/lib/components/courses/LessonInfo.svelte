<script>
	import { Lock, CheckCircle2 } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';

	let { 
		lesson, 
		isVideoFinished, 
		isSubmittingComplete, 
		hasNextLesson, 
		markComplete 
	} = $props();
</script>

<div class="flex flex-col gap-2 px-1">
	<span class="text-[11px] font-black tracking-widest text-primary uppercase">
		{m.lesson_info_title()}
	</span>
	<h1 class="text-2xl font-black tracking-tight text-foreground md:text-3xl">
		{lesson.title}
	</h1>
	<p class="mt-2 text-sm leading-relaxed text-muted">{lesson.description}</p>
</div>

<!-- Completion Action -->
{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
	<div class="flex flex-col gap-3">
		{#if !isVideoFinished}
			<div
				class="flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/5 p-4 text-sm font-bold text-warning"
				transition:slide
			>
				<div class="flex items-center justify-center rounded-xl bg-warning/10 p-2">
					<Lock size={16} class="text-warning" />
				</div>
				<span>{m.lesson_video_lock()}</span>
			</div>
		{:else}
			<div
				class="flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-4 text-sm font-bold text-success"
				transition:slide
			>
				<div class="flex items-center justify-center rounded-xl bg-success/10 p-2">
					<CheckCircle2 size={16} class="text-success" />
				</div>
				<span>{m.lesson_video_watched()}</span>
			</div>
		{/if}

		<button
			onclick={markComplete}
			disabled={isSubmittingComplete || !isVideoFinished}
			class="flex w-full items-center justify-center gap-2 rounded-2xl border py-4 text-sm font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:cursor-not-allowed disabled:border-main disabled:bg-muted/10 disabled:text-muted {isVideoFinished
				? 'border-primary bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-primary/20'
				: 'border-main bg-card text-muted'}"
		>
			{#if isSubmittingComplete}
				<div class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
				<span>{m.lesson_submitting()}</span>
			{:else}
				{#if !isVideoFinished}
					<Lock size={18} />
				{:else}
					<CheckCircle2 size={18} />
				{/if}
				<span>{hasNextLesson ? m.lesson_next_lesson() : m.lesson_mark_complete()}</span>
			{/if}
		</button>
	</div>
{/if}
