<script lang="ts">
	// @ts-nocheck
	import { Lock, ArrowRight } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		id,
		title,
		subtitle,
		image,
		progress = 0,
		price = 0,
		lessons = 0,
		status = 'active',
		onContinue
	} = $props();

	let isLocked = $derived(status === 'locked');
	let isCompleted = $derived(status === 'completed');
	let progressColor = $derived(isCompleted ? 'bg-[#10b981]' : 'bg-[#9b1c48]');

	/** @param {Event} e */
	function handleImageError(e) {
		const target = e.currentTarget;
		target.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
	}

	// Image source fallback
	let displayImage = $derived(image || `https://placehold.co/600x400?text=${encodeURIComponent(title)}`);
</script>

<div
	class="group relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-xl border-2 bg-white p-4 transition-all duration-300
    {isLocked
		? 'border-slate-100 bg-slate-50'
		: 'border-slate-100 hover:border-[#9b1c48]/20 bg-white'}"
>
	<!-- Image -->
	<div class="relative h-20 w-full sm:w-28 shrink-0 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 {isLocked ? 'opacity-50 grayscale' : ''}">
		<img
			src={displayImage}
			alt={title}
			class="h-full w-full object-cover"
			loading="lazy"
			onerror={handleImageError}
		/>
		{#if isLocked}
			<div class="absolute inset-0 flex items-center justify-center bg-slate-900/10">
				<Lock size={24} class="text-white" />
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="flex flex-1 flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 w-full {isLocked ? 'opacity-50 grayscale' : ''}">
		<!-- Title & Subtitle -->
		<div class="flex-1 min-w-0 w-full">
			<h3 class="line-clamp-1 text-[15px] font-black text-slate-800 uppercase tracking-tight group-hover:text-[#9b1c48] transition-colors">
				{title}
			</h3>
			<p class="mt-1 truncate text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
				{lessons} {m.lessons_label()} • {price} {m.price_label()}
			</p>
		</div>

		<!-- Progress -->
		<div class="w-full lg:w-48 shrink-0">
			<div class="flex items-center justify-between mb-1.5">
				<span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.course_progress || 'Progress'}</span>
				<span class="text-[11px] font-black text-slate-800">{progress}%</span>
			</div>
			<div class="h-2 w-full overflow-hidden rounded-full bg-slate-50">
				<div
					class="h-full rounded-full {progressColor} transition-all duration-1000 ease-out"
					style="width: {progress}%"
				></div>
			</div>
		</div>

		<!-- Action -->
		<div class="w-full lg:w-auto shrink-0">
			<button
				onclick={() => onContinue(id)}
				disabled={isLocked}
				class="flex h-11 w-full lg:w-36 items-center justify-center gap-2 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all
					{isLocked
					? 'cursor-not-allowed bg-slate-100 text-slate-300'
					: 'bg-[#9b1c48] text-white hover:bg-[#80163a] active:scale-[0.98]'}"
			>
				{isLocked ? m.course_locked() : m.course_continue()}
				{#if !isLocked}
					<ArrowRight size={14} />
				{/if}
			</button>
		</div>
	</div>
</div>
