<script>
	import LessonDetailView from '@/lib/components/ui/courses/LessonDetailView.svelte';

	let { data } = $props();
</script>

<LessonDetailView lesson={data.lesson} />
