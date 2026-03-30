<!-- src/routes/dashboard/admin/courses/[id]/+page.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import LessonsRow from '@/lib/components/ui/courses/LessonsRow.svelte';
	import ModuleAccordion from '@/lib/components/ui/courses/ModuleAccordion.svelte';
	import { BookPlus, Plus } from 'lucide-svelte';
	import { page } from '$app/stores';

	const { data } = $props();

	// Admin tekshiruvi
	const isAdmin = $derived(data.user?.role === 'admin');

	const checkNotEmptyModule = $derived(data.modules.length);
</script>

<div class="mx-auto min-h-screen max-w-5xl bg-[#f8fafc] p-4 font-sans md:p-8">
	<!-- Header -->
	<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
		<div>
			<p class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Kurs haqida</p>
			<h1 class="text-2xl font-bold text-slate-800 sm:text-3xl">{data.course.title}</h1>
		</div>

		<!-- ADMIN BUTTONS -->
		{#if isAdmin}
			<div class="flex gap-3">
				<a
					href={resolve(`/admin/courses/create/${$page.params.course_id}`)}
					class="flex items-center gap-2 rounded-2xl bg-[#ed4b72] px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-[#d93a5f]"
				>
					<Plus size={18} />
					Yangi modul qo‘shish
				</a>
				{#if checkNotEmptyModule !== 0}
					<a
						href={resolve(`/admin/courses/create/${$page.params.course_id}/lesson`)}
						class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 shadow-sm transition-all hover:border-[#ed4b72] hover:text-[#ed4b72]"
					>
						<BookPlus size={18} />
						Yangi dars qo'shish
					</a>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Qolgan kod o'zgarmadi -->
	<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div
			class="flex flex-col items-start gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-6 lg:col-span-2"
		>
			<div
				class="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-36"
			>
				<img
					src={data.course.img ||
						`https://placehold.co/600x400?text=${encodeURIComponent(data.course.title)}`}
					alt="Course cover"
					class="absolute inset-0 h-full w-full object-cover"
					width="144"
					height="96"
				/>
			</div>

			<div class="w-full flex-1">
				<h2 class="mb-2 text-xl font-bold text-slate-800">{data.course.title}</h2>
				<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
					{data.course.description}
				</p>

				<div class="flex items-center gap-4">
					<div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
						<div
							class="h-full rounded-full bg-[#ed4b72] transition-all duration-700 ease-out"
							style="width: {data.course.progress || 50}%"
						></div>
					</div>
					<span class="text-sm font-semibold text-slate-700">{data.course.progress || 50}%</span>
				</div>
			</div>
		</div>

		<div
			class="flex flex-col justify-center rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
		>
			<h3 class="mb-4 text-lg font-bold text-slate-800">Progress</h3>
			<div class="space-y-3">
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-slate-500">Total lessons</span>
					<span class="font-bold text-slate-800">{data.course.lessons_count}</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-slate-500">Watched</span>
					<span class="font-bold text-slate-800">10</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-slate-500">Remaining</span>
					<span class="font-bold text-slate-800">15</span>
				</div>
			</div>
		</div>
	</div>

	<div class="space-y-2">
		{#each data.modules as mod (mod.title)}
			<ModuleAccordion title={mod.title}>
				{#each mod.lessons as lesson (lesson.id)}
					<LessonsRow
						index={lesson.id}
						title={lesson.title}
						duration={lesson.duration}
						status={lesson.status}
					/>
				{/each}
			</ModuleAccordion>
		{/each}
	</div>
</div>
