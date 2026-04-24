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
	class="relative flex min-w-[280px] shrink-0 flex-col justify-between gap-4 rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300
    {is_blocked
		? 'cursor-not-allowed border-main bg-muted/5'
		: 'cursor-pointer border-main hover:-translate-y-1 hover:shadow-md hover:border-primary/20'}"
>
	{#if is_blocked}
		<div class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
			<div class="mb-3 rounded-full bg-card/80 p-3 shadow-sm backdrop-blur-sm">
				<Lock size={24} class="text-muted" strokeWidth={2.5} />
			</div>
			<p class="max-w-[140px] text-[9px] font-black leading-relaxed tracking-widest text-muted uppercase">
				{m.course_contact_admin()}
			</p>
		</div>
	{/if}

	<div class="flex items-center gap-4 {is_blocked ? 'opacity-40 grayscale' : ''}">
		<div
			class="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/10 border border-main"
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
		<h3 class="line-clamp-2 text-[15px] leading-tight font-bold text-main">{title}</h3>
	</div>

	<div class="mt-2 {is_blocked ? 'opacity-40 grayscale' : ''}">
		<div class="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/10">
			<div
				class="h-1.5 rounded-full bg-primary transition-all duration-1000 ease-out"
				style="width: {progress}%"
			></div>
		</div>
		<div class="flex justify-between text-[13px] font-bold text-muted">
			<span>{progress}%</span>
			<span class="opacity-70">{lessons} {m.lessons_label()}</span>
		</div>
	</div>
</div>
