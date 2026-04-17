<script>
	// @ts-nocheck

	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import LessonsRow from '@/lib/components/ui/courses/LessonsRow.svelte';
	import ModuleAccordion from '@/lib/components/ui/courses/ModuleAccordion.svelte';
	import { Lock } from 'lucide-svelte';

	let {
		course,
		modules,
		adminHeaderActions = undefined,
		adminFooterActions = undefined,
		adminModuleActions = undefined,
		adminLessonActions = undefined,
		getLessonHref = undefined,
		isStudentView = false
	} = $props();

	let isStudentBlocked = $derived(isStudentView && course.is_blocked);

	function handleImageError(e) {
		e.currentTarget.src = `https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`;
	}

	function getLessonStatus(lesson) {
		if (!isStudentView) return 'available';
		if (lesson.is_completed) return 'completed';
		if (lesson.can_access === false) return 'locked';
		return 'available';
	}
</script>

<div class="relative mx-auto min-h-[calc(100vh-80px)] max-w-5xl bg-[#f8fafc] p-4 font-sans md:p-8">
	{#if isStudentBlocked}
		<div
			class="mb-6 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm sm:p-6"
		>
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
				<Lock size={20} class="text-red-600" />
			</div>
			<div>
				<h3 class="mb-1 text-lg font-bold text-red-800">Kurs bloklangan</h3>
				<p class="text-sm leading-relaxed font-medium text-red-600">
					Ushbu kursga kirish huquqingiz cheklangan. Darslarni ko'rish va davom ettirish uchun
					ma'muriyat bilan bog'laning yoki to'lovni amalga oshiring.
				</p>
			</div>
		</div>
	{/if}

	<div
		class="{isStudentBlocked
			? 'pointer-events-none opacity-50 grayscale-30'
			: ''} transition-all duration-300"
	>
		<!-- Header -->
		<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
			<div>
				<p class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
					<Breadcrumb />
				</p>
				<h1 class="text-2xl font-bold text-slate-800 sm:text-3xl">{course.title}</h1>
			</div>

			<!-- ADMIN BUTTONS OR OTHER ACTIONS -->
			{#if adminHeaderActions}
				{@render adminHeaderActions()}
			{/if}
		</div>

		<!-- Course Info Card -->
		<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div
				class="flex flex-col items-start gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-6 lg:col-span-2"
			>
				<div
					class="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-36"
				>
					<img
						src={course.img ||
							`https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`}
						alt="Course cover"
						class="absolute inset-0 h-full w-full object-cover"
						width="144"
						height="96"
						onerror={handleImageError}
					/>
				</div>

				<div class="w-full flex-1">
					<h2 class="mb-2 text-xl font-bold text-slate-800">{course.title}</h2>
					<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
						{course.description}
					</p>

					<div class="flex items-center gap-4">
						<div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
							<div
								class="h-full rounded-full bg-[#9b1c48] transition-all duration-700 ease-out"
								style="width: {course.progress || 0}%"
							></div>
						</div>
						<span class="text-sm font-semibold text-slate-700">{course.progress || 0}%</span>
					</div>
				</div>
			</div>

			<div
				class="flex flex-col justify-center rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
			>
				<h3 class="mb-4 text-lg font-bold text-slate-800">Progress</h3>
				<div class="space-y-3">
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium text-slate-500">Jami darslar</span>
						<span class="font-bold text-slate-800">{course.lessons_count || 0}</span>
					</div>
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium text-slate-500">Ko'rilgan</span>
						<span class="font-bold text-slate-800">{course.completed_lessons || 0}</span>
					</div>
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium text-slate-500">Qolgan</span>
						<span class="font-bold text-slate-800"
							>{course.lessons_count - course.completed_lessons || 0}</span
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Modules & Lessons -->
		<div class="space-y-4">
			{#each modules as mod (mod.title)}
				<ModuleAccordion title={mod.title}>
					{#snippet adminActions()}
						{#if adminModuleActions}
							{@render adminModuleActions(mod)}
						{/if}
					{/snippet}

					{#if mod.lessons && mod.lessons.length > 0}
						<div class="flex flex-col gap-2">
							{#each mod.lessons as lesson (lesson.id)}
								<LessonsRow
									index={lesson.order_index}
									title={lesson.title}
									duration={lesson.duration}
									status={getLessonStatus(lesson)}
									href={getLessonHref &&
									!isStudentBlocked &&
									(!isStudentView || lesson.can_access !== false)
										? getLessonHref(lesson.id, mod.id)
										: undefined}
								>
									{#snippet adminActions()}
										{#if adminLessonActions}
											{@render adminLessonActions(lesson, mod)}
										{/if}
									{/snippet}
								</LessonsRow>
							{/each}
						</div>
					{:else}
						<p class="py-2 text-sm text-slate-500 italic">Hozircha darslar mavjud emas.</p>
					{/if}
				</ModuleAccordion>
			{:else}
				<div
					class="flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-slate-100 text-center"
				>
					<p class="text-slate-500 font-medium">Bu kursga hali modullar qo'shilmagan.</p>
				</div>
			{/each}
		</div>

		<!-- DANGER ZONE -->
		{#if adminFooterActions}
			{@render adminFooterActions()}
		{/if}
	</div>
</div>
