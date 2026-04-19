<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '@/lib/paraglide/messages';
	import { Play, Edit2, LayoutList } from 'lucide-svelte';

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
	class="group flex flex-col items-center gap-4 overflow-hidden rounded-xl border-2 border-slate-100 bg-white p-3 transition-all duration-300 hover:border-[#9b1c48]/20 lg:flex-row"
>
	<!-- Image -->
	<div
		class="relative h-16 w-full shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 lg:w-28"
	>
		<img
			src={displayImage}
			alt={title}
			class="h-full w-full object-cover"
			loading="lazy"
			onerror={handleImageError}
		/>
		<div
			class="absolute top-1.5 left-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase backdrop-blur-sm
            {isPublished ? 'text-emerald-600' : 'text-amber-600'}"
		>
			{status}
		</div>
	</div>

	<!-- Content -->
	<div class="flex w-full flex-1 flex-col items-start gap-4 lg:flex-row lg:items-center">
		<div class="w-full min-w-0 flex-1">
			<h3
				class="line-clamp-1 text-[14px] font-black tracking-tight text-slate-800 uppercase transition-colors group-hover:text-[#9b1c48]"
			>
				{title}
			</h3>
			<div class="mt-1 flex items-center gap-3">
				<span
					class="flex items-center gap-1 text-[9px] font-black tracking-widest text-slate-400 uppercase"
				>
					<LayoutList size={10} />
					{modules} {m.admin_courses_modules ? m.admin_courses_modules() : 'Modullar'}
				</span>
				<span class="text-[10px] font-bold text-slate-200">|</span>
				<span class="text-[14px] font-black text-slate-900"
					>{price} {m.price_label().toLowerCase()}</span
				>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex w-full shrink-0 items-center gap-2 lg:w-auto">
			<a
				href={resolve(`/admin/courses/${link}`)}
				onclick={() => sessionStorage.setItem('admin_course_detail_tab', 'content')}
				class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-100 lg:flex-none"
			>
				<Play size={10} class="fill-current" />
				{m.admin_courses_preview ? m.admin_courses_preview() : "Ko'rish"}
			</a>
			<a
				href={resolve(`/admin/courses/${link}`)}
				onclick={() => sessionStorage.setItem('admin_course_detail_tab', 'settings')}
				class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#9b1c48] px-4 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-sm transition-all hover:bg-[#80163a] active:scale-95 lg:flex-none"
			>
				<Edit2 size={10} />
				{m.admin_courses_edit ? m.admin_courses_edit() : 'Tahrirlash'}
			</a>
		</div>
	</div>
</div>
