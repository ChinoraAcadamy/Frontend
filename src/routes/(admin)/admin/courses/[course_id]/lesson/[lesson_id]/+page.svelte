<script>
	import LessonDetailView from '$lib/components/courses/LessonDetailView.svelte';

	let { data } = $props();
</script>

<LessonDetailView lesson={data.lesson} nextLesson={data.nextLesson} />
