	import * as m from '$lib/paraglide/messages.js';
	let { title, image, progress = 0, lessons = 0 } = $props();

	function handleImageError(e) {
		const target = e.currentTarget;
		target.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
	}
</script>

<div
	class="flex min-w-[240px] shrink-0 cursor-pointer flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
>
	<div class="flex items-center gap-3">
		<div class="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
			<img
				src={image}
				alt={title}
				class="h-full w-full object-cover"
				width="64"
				height="48"
				loading="lazy"
				onerror={handleImageError}
			/>
		</div>
		<h3 class="line-clamp-2 text-sm leading-tight font-semibold text-slate-800">{title}</h3>
	</div>

	<div class="mt-2">
		<div class="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
			<div
				class="h-1.5 rounded-full bg-[#ef4444] transition-all duration-500 ease-out"
				style="width: {progress}%"
			></div>
		</div>
		<div class="flex justify-between text-[13px] font-medium text-slate-500">
			<span>{progress}%</span>
			<span>{lessons} {m.lessons_label()}</span>
		</div>
	</div>
</div>
