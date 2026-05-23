<script>
	import LessonDetailView from '$lib/components/courses/LessonDetailView.svelte';
	import { Loader2 } from 'lucide-svelte';

	let { data } = $props();
	let pageTitle = $state('Dars - Chinora Academy');

	$effect(() => {
		data.lazy.lesson.then((lesson) => {
			if (lesson?.title) {
				pageTitle = lesson.title;
			}
		}).catch(() => {
			pageTitle = 'Xatolik - Chinora Academy';
		});
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#await data.lazy.lesson}
	<div class="flex min-h-[50vh] items-center justify-center">
		<Loader2 class="h-8 w-8 animate-spin text-primary" />
	</div>
{:then lesson}
	{#key lesson.id}
		<LessonDetailView {lesson} nextLesson={data.lazy.nextLesson} />
	{/key}
{:catch error}
	<div class="flex min-h-[50vh] items-center justify-center">
		<p class="text-muted">{error.message || 'Xatolik yuz berdi'}</p>
	</div>
{/await}
