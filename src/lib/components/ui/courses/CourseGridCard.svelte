<script lang="ts">
	// @ts-nocheck

	import { Lock } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	// Props: qatiy tiplar va default qiymatlar
	let {
		id,
		title,
		subtitle,
		image,
		progress = 0,
		price = 0,
		lessons = 0,
		status = 'active', // 'active' | 'completed' | 'locked'
		onContinue // Tugma bosilganda ishlaydigan funksiya
	} = $props();

	// Holatlarni hisoblash (Derived states)
	let isLocked = $derived(status === 'locked');
	let isCompleted = $derived(status === 'completed');

	// Statusga qarab progress bar rangini belgilash
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
	class="relative flex h-76 flex-col rounded-xl border-2 bg-white p-5 transition-all duration-300
    {isLocked
		? 'border-slate-100 bg-slate-50'
		: 'border-slate-100 hover:border-[#9b1c48]/20 bg-white'}"
>
	{#if isLocked}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<Lock size={48} class="-mt-8 text-slate-300 drop-shadow-sm" strokeWidth={2} />
		</div>
		<div
			class="absolute top-4 right-4 z-20 rounded bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"
		>
			{m.course_locked()}
		</div>
	{/if}

	<div class="relative z-10 flex flex-1 flex-col {isLocked ? 'opacity-50 grayscale' : ''}">
		<div class="mb-4 flex items-start gap-4">
			<div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
				<img
					src={displayImage}
					alt={title}
					class="h-full w-full object-cover"
					width="80"
					height="80"
					loading="lazy"
					onerror={handleImageError}
				/>
			</div>
			<div class="mt-1 flex-1">
				<h3 class="line-clamp-3 text-[16px] leading-tight font-black text-slate-800 uppercase tracking-tight">
					{title}
				</h3>
			</div>
		</div>

		<div class="mt-auto mb-4">
			<h4 class="mb-2 truncate text-[11px] font-black text-slate-400 uppercase tracking-widest">{subtitle}</h4>
			<div class="flex items-center gap-3">
				<div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-50">
					<div
						class="h-full rounded-full {progressColor} transition-all duration-1000 ease-out"
						style="width: {progress}%"
					></div>
				</div>
				<span class="w-8 shrink-0 text-right text-[11px] font-black text-slate-800">
					{progress}%
				</span>
			</div>
		</div>

		<div class="mb-5 flex items-center justify-between text-[11px] font-black text-slate-300 uppercase tracking-[0.15em]">
			<span>{price} {m.price_label()}</span>
			<span>{lessons} {m.lessons_label()}</span>
		</div>
	</div>

	<button
		onclick={() => onContinue(id)}
		disabled={isLocked}
		class="relative z-30 flex h-12 w-full shrink-0 items-center justify-center rounded-lg font-black text-[12px] uppercase tracking-[0.2em] transition-all
            {isLocked
			? 'cursor-not-allowed bg-slate-100 text-slate-300'
			: 'bg-[#9b1c48] text-white hover:bg-[#80163a] active:scale-[0.98]'}"
	>
		{isLocked ? m.course_locked() : m.course_continue()}
	</button>
</div>
