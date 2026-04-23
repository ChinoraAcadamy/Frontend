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
	let displayImage = $derived(
		image || `https://placehold.co/600x400?text=${encodeURIComponent(title)}`
	);
</script>

<div
	class="group relative flex h-auto min-h-80 flex-col rounded-2xl border-2 bg-white p-5 transition-all duration-300
    {isLocked
		? 'border-slate-100 bg-slate-50'
		: 'border-slate-100 bg-white shadow-sm hover:border-[#9b1c48]/30 hover:shadow-xl hover:shadow-[#9b1c48]/5'}"
>
	{#if isLocked}
		<div
			class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center"
		>
			<Lock size={40} class="-mt-8 mb-4 text-slate-300/50 drop-shadow-sm" strokeWidth={2.5} />
			<p
				class="max-w-[140px] text-[9px] leading-relaxed font-black tracking-widest text-slate-400 uppercase"
			>
				{m.course_contact_admin()}
			</p>
		</div>
		<div
			class="absolute top-4 right-4 z-20 rounded-lg bg-slate-100 px-3 py-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase"
		>
			{m.course_locked()}
		</div>
	{/if}

	<div class="relative z-10 flex flex-1 flex-col {isLocked ? 'opacity-50 grayscale' : ''}">
		<div class="mb-5 flex items-start gap-4">
			<div
				class="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-inner sm:h-20 sm:w-20"
			>
				<img
					src={displayImage}
					alt={title}
					class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
					width="400"
					height="225"
					loading="lazy"
					onerror={handleImageError}
				/>
			</div>
			<div class="mt-1 min-w-0 flex-1">
				<h3
					class="line-clamp-3 text-[14px] leading-tight font-black tracking-tight text-slate-800 uppercase sm:text-[15px]"
				>
					{title}
				</h3>
			</div>
		</div>

		<div class="mt-auto mb-5">
			<h4
				class="mb-3 truncate text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase opacity-80"
			>
				{subtitle}
			</h4>
			<div class="flex items-center gap-4">
				<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-50">
					<div
						class="h-full rounded-full {progressColor} transition-all duration-1000 ease-out"
						style="width: {progress}%"
					></div>
				</div>
				<span class="shrink-0 text-[11px] font-black text-slate-900 tabular-nums">
					{progress}%
				</span>
			</div>
		</div>

		<div
			class="mb-6 flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase"
		>
			<span class="flex items-center gap-1.5">{price} {m.price_label()}</span>
			<span class="flex items-center gap-1.5">{lessons} {m.lessons_label()}</span>
		</div>
	</div>

	<button
		onclick={() => onContinue(id)}
		disabled={isLocked}
		class="relative z-30 flex h-12 w-full shrink-0 items-center justify-center rounded-xl text-[11px] font-black tracking-[0.25em] uppercase transition-all
            {isLocked
			? 'cursor-not-allowed bg-slate-100 text-slate-300'
			: 'bg-[#9b1c48] text-white hover:bg-[#80163a] hover:shadow-lg hover:shadow-[#9b1c48]/20 active:scale-[0.97]'}"
	>
		{isLocked ? m.course_contact_admin() : m.course_continue()}
	</button>
</div>
