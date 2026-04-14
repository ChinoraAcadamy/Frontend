<script>
	import LessonDetailView from '@/lib/components/ui/courses/LessonDetailView.svelte';

	let { data } = $props();
	console.log(data);
</script>

<svelte:head>
	<title>{data.lesson.title}</title>
</svelte:head>

<LessonDetailView lesson={data.lesson} nextLesson={data.nextLesson} />
