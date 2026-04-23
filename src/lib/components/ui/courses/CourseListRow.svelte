<script lang="ts">
	// @ts-nocheck
	import { Lock, ArrowRight } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		id,
		title,
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
	class="group relative flex flex-col items-stretch gap-4 rounded-2xl border-2 bg-white p-3.5 transition-all duration-300 sm:flex-row sm:items-center sm:gap-6 sm:p-4
    {isLocked
		? 'border-slate-100 bg-slate-50'
		: 'border-slate-100 hover:border-[#9b1c48]/20 bg-white shadow-sm hover:shadow-md'}"
>
	<!-- Image & Basic Info (Mobile Row) -->
	<div class="flex items-center gap-4 sm:contents">
		<div
			class="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:h-20 sm:w-28 {isLocked
				? 'opacity-50 grayscale'
				: ''}"
		>
			<img
				src={displayImage}
				alt={title}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
				width="400"
				height="225"
				loading="lazy"
				onerror={handleImageError}
			/>
			{#if isLocked}
				<div class="absolute inset-0 flex items-center justify-center bg-slate-900/10">
					<Lock size={20} class="text-white" />
				</div>
			{/if}
		</div>

		<div class="flex-1 min-w-0 sm:hidden">
			<h3
				class="line-clamp-2 text-[14px] font-black leading-tight text-slate-800 uppercase tracking-tight transition-colors group-hover:text-[#9b1c48]"
			>
				{title}
			</h3>
			<p class="mt-1 truncate text-[9px] font-black tracking-widest text-slate-400 uppercase">
				{lessons} {m.lessons_label()} • {price} {m.price_label()}
			</p>
		</div>
	</div>

	<!-- Content -->
	<div
		class="flex w-full flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:gap-8 {isLocked
			? 'opacity-50 grayscale'
			: ''}"
	>
		<!-- Title & Subtitle (Desktop only, hidden on mobile as it's moved up) -->
		<div class="hidden flex-1 min-w-0 sm:block">
			<h3
				class="line-clamp-1 text-[15px] font-black text-slate-800 uppercase tracking-tight transition-colors group-hover:text-[#9b1c48]"
			>
				{title}
			</h3>
			<p class="mt-1 truncate text-[11px] font-black tracking-widest text-slate-400 uppercase">
				{lessons} {m.lessons_label()} • {price} {m.price_label()}
			</p>
		</div>

		<!-- Progress -->
		<div class="w-full lg:w-56 shrink-0">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase"
					>{m.course_progress ? m.course_progress() : 'Progress'}</span
				>
				<span class="text-[11px] font-black text-slate-800">{progress}%</span>
			</div>
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-50">
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
				class="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all lg:w-40
					{isLocked
					? 'cursor-not-allowed bg-slate-100 text-slate-300'
					: 'bg-[#9b1c48] text-white hover:bg-[#80163a] hover:shadow-lg hover:shadow-[#9b1c48]/20 active:scale-[0.98]'}"
			>
				{isLocked ? m.course_contact_admin() : m.course_continue()}
				{#if !isLocked}
					<ArrowRight size={14} class="transition-transform group-hover:translate-x-1" />
				{/if}
			</button>
		</div>
	</div>
</div>
