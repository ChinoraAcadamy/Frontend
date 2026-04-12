<script>
	/* eslint-disable no-unused-vars */

	import { page } from '$app/stores';
	import CourseDetailView from '@/lib/components/ui/courses/CourseDetailView.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<svelte:head>
	<title>Mening kursim - Chinora Academy</title>
</svelte:head>

{#await data.lazy.courseData}
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Sarlavha Qismi Skeleton -->
		<div class="mb-8 flex flex-col gap-6 md:flex-row md:items-end">
			<div class="flex-1 space-y-4">
				<div class="h-6 w-32 animate-pulse rounded-md bg-slate-200"></div>
				<div class="h-10 w-3/4 animate-pulse rounded-xl bg-slate-200"></div>
				<div class="h-4 w-full animate-pulse rounded-md bg-slate-200"></div>
				<div class="h-4 w-2/3 animate-pulse rounded-md bg-slate-200"></div>
			</div>
			<!-- Progress Qismi Skeleton -->
			<div class="w-full shrink-0 md:w-80">
				<div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
					<div class="mb-4 h-5 w-32 animate-pulse rounded-md bg-slate-200"></div>
					<div class="h-2.5 w-full animate-pulse rounded-full bg-slate-100"></div>
					<div class="mt-2 flex justify-between">
						<div class="h-4 w-12 animate-pulse rounded bg-slate-100"></div>
						<div class="h-4 w-12 animate-pulse rounded bg-slate-100"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Modules Skeleton -->
		<div class="space-y-4">
			{#each Array(3) as _, i (i)}
				<div
					class="h-20 w-full animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm"
				></div>
			{/each}
		</div>
	</div>
{:then resolvedData}
	<CourseDetailView
		course={resolvedData.course}
		modules={resolvedData.modules}
		isStudentView={true}
		getLessonHref={(lessonId, moduleId) =>
			`/kurslarim/${$page.params.id}/lessons/${lessonId}?module_id=${moduleId}`}
	/>
{:catch error}
	<div
		class="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center text-slate-500"
	>
		<p class="text-lg font-semibold">{error.message || 'Xatolik yuz berdi'}</p>
	</div>
{/await}
