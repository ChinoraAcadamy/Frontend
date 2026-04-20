<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '@/lib/paraglide/messages';
	import { Play } from 'lucide-svelte';

	let { title, price, modules, status, image, link } = $props();

	const isPublished = $derived(status === 'published' || status === 'active');

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
	class="group relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-slate-100 bg-white transition-all duration-300 hover:border-[#9b1c48]/20"
>
	<!-- Image Section -->
	<div class="relative aspect-video w-full overflow-hidden border-b border-slate-100 bg-slate-50">
		<img
			src={displayImage}
			alt={title}
			class="h-full w-full object-cover transition-transform duration-500"
			width="400"
			height="225"
			loading="lazy"
			onerror={handleImageError}
		/>

		<!-- Subtle overlay + play icon on hover -->
		<div
			class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100"
		></div>

		<a
			href={resolve(`/admin/courses/${link}`)}
			onclick={() => sessionStorage.setItem('admin_course_detail_tab', 'content')}
			class="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-3 py-1.5 text-[10px] font-black tracking-widest text-[#9b1c48] uppercase opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100"
		>
			<Play size={10} class="fill-current" />
			{m.admin_courses_preview ? m.admin_courses_preview() : "Ko'rish"}
		</a>

		<!-- Status badge on image -->
		<div
			class="absolute top-3 left-3 rounded bg-white/90 px-2 py-1 text-[9px] font-black tracking-widest uppercase shadow-sm backdrop-blur-sm
            {isPublished ? 'text-emerald-600' : 'text-amber-600'}"
		>
			{status}
		</div>
	</div>

	<!-- Content -->
	<div class="flex flex-1 flex-col p-5">
		<h3
			class="mb-1.5 line-clamp-2 text-[15px] leading-tight font-black tracking-tight text-slate-800 uppercase transition-colors group-hover:text-[#9b1c48]"
		>
			{title}
		</h3>

		<p class="mb-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
			{modules}
			{m.admin_courses_modules ? m.admin_courses_modules() : 'Modullar'}
		</p>

		<!-- Price + Button -->
		<div class="mt-auto flex flex-row items-end justify-between border-t border-slate-50 pt-3">
			<div>
				<span class="text-[18px] font-black text-slate-900"
					>{price} {m.price_label().toLowerCase()}</span
				>
			</div>

			<a
				href={resolve(`/admin/courses/${link}`)}
				onclick={() => sessionStorage.setItem('admin_course_detail_tab', 'settings')}
				class="inline-flex items-center gap-2 rounded-lg bg-[#9b1c48] px-4 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-sm transition-all hover:bg-[#80163a] active:scale-95"
			>
				{m.admin_courses_edit ? m.admin_courses_edit() : 'Tahrirlash'}
				<span class="text-sm leading-none">→</span>
			</a>
		</div>
	</div>
</div>
