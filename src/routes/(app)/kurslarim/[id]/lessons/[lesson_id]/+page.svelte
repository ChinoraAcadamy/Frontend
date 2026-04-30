<script>
	import LessonDetailView from '@/lib/components/ui/courses/LessonDetailView.svelte';

	let { data } = $props();

</script>

<svelte:head>
	<title>{data.lesson.title}</title>
</svelte:head>

<LessonDetailView lesson={data.lesson} nextLesson={data.lazy.nextLesson} />
