<script>
	import LessonDetailView from '$lib/components/courses/LessonDetailView.svelte';

	let { data } = $props();
</script>

{#key data.lesson.id}
	<LessonDetailView lesson={data.lesson} />
{/key}
