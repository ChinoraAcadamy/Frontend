<script lang="ts">
	// @ts-nocheck

	import { Lock } from 'lucide-svelte';

	// Props: qatiy tiplar va default qiymatlar
	let {
		id,
		title,
		subtitle,
		image,
		progress = 0,
		modules = 0,
		lessons = 0,
		status = 'active', // 'active' | 'completed' | 'locked'
		onContinue // Tugma bosilganda ishlaydigan funksiya
	} = $props();

	// Holatlarni hisoblash (Derived states)
	let isLocked = $derived(status === 'locked');
	let isCompleted = $derived(status === 'completed');

	// Statusga qarab progress bar rangini belgilash
	let progressColor = $derived(isCompleted ? 'bg-[#10b981]' : 'bg-[#ed4b72]');

	/** @param {Event} e */
	function handleImageError(e) {
		const target = e.currentTarget;
		target.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
	}
</script>

<div
	class="relative flex h-70 flex-col rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300
    {isLocked
		? 'border-slate-200 bg-slate-400/10'
		: 'border-slate-100 hover:-translate-y-1 hover:shadow-md'}"
>
	{#if isLocked}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<Lock size={56} class="-mt-8 text-white drop-shadow-lg" strokeWidth={2} />
		</div>
		<div
			class="absolute top-4 right-4 z-20 rounded-lg bg-slate-400/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm"
		>
			Bloklangan
		</div>
	{/if}

	<div class="relative z-10 flex flex-1 flex-col {isLocked ? 'opacity-40 grayscale' : ''}">
		<div class="mb-4 flex items-start gap-4">
			<div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
				<img
					src={image}
					alt={title}
					class="h-full w-full object-cover"
					width="80"
					height="80"
					loading="lazy"
					onerror={handleImageError}
				/>
			</div>
			<div class="mt-1 flex-1">
				<h3 class="line-clamp-3 text-[17px] leading-tight font-bold text-slate-800">
					{title}
				</h3>
			</div>
		</div>

		<div class="mt-auto mb-4">
			<h4 class="mb-2 truncate text-[15px] font-bold text-slate-800">{subtitle}</h4>
			<div class="flex items-center gap-3">
				<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
					<div
						class="h-full rounded-full {progressColor} transition-all duration-1000 ease-out"
						style="width: {progress}%"
					></div>
				</div>
				<span class="w-8 shrink-0 text-right text-[13px] font-bold text-slate-700">
					{progress}%
				</span>
			</div>
		</div>

		<div class="mb-5 flex items-center justify-between text-[13px] font-semibold text-slate-500">
			<span>{modules} Modules</span>
			<span>{lessons} Lessons</span>
		</div>
	</div>

	<button
		onclick={() => onContinue(id)}
		disabled={isLocked}
		class="relative z-30 flex h-11 w-full shrink-0 items-center justify-center rounded-xl font-bold transition-colors
            {isLocked
			? 'cursor-not-allowed bg-slate-300 text-slate-500'
			: 'bg-[#ed4b72] text-white shadow-sm shadow-rose-200 hover:bg-[#de3c61]'}"
	>
		{isLocked ? 'Bloklangan' : 'Davom etish'}
	</button>
</div>
