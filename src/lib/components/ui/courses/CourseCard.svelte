<script>
	import { Lock } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { title, image, progress = 0, lessons = 0, is_blocked = false } = $props();

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
	class="relative flex min-w-[280px] shrink-0 flex-col justify-between gap-4 rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300
    {is_blocked
		? 'cursor-not-allowed border-slate-100 bg-slate-50'
		: 'cursor-pointer border-slate-100 hover:-translate-y-1 hover:shadow-md hover:border-[#ef4444]/10'}"
>
	{#if is_blocked}
		<div class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
			<div class="mb-3 rounded-full bg-white/80 p-3 shadow-sm backdrop-blur-sm">
				<Lock size={24} class="text-slate-400" strokeWidth={2.5} />
			</div>
			<p class="max-w-[140px] text-[9px] font-black leading-relaxed tracking-widest text-slate-400 uppercase">
				{m.course_contact_admin()}
			</p>
		</div>
	{/if}

	<div class="flex items-center gap-4 {is_blocked ? 'opacity-40 grayscale' : ''}">
		<div
			class="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100"
		>
			<img
				src={displayImage}
				alt={title}
				class="h-full w-full object-cover transition-transform duration-500"
				width="400"
				height="225"
				loading="lazy"
				onerror={handleImageError}
			/>
		</div>
		<h3 class="line-clamp-2 text-[15px] leading-tight font-bold text-slate-800">{title}</h3>
	</div>

	<div class="mt-2 {is_blocked ? 'opacity-40 grayscale' : ''}">
		<div class="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
			<div
				class="h-1.5 rounded-full bg-[#ef4444] transition-all duration-1000 ease-out"
				style="width: {progress}%"
			></div>
		</div>
		<div class="flex justify-between text-[13px] font-bold text-slate-500">
			<span>{progress}%</span>
			<span class="opacity-70">{lessons} {m.lessons_label()}</span>
		</div>
	</div>
</div>
