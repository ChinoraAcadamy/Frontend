<script>
	import { page } from '$app/stores';
	import CourseDetailView from '@/lib/components/ui/courses/CourseDetailView.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.course.title} - Mening kursim</title>
</svelte:head>

<CourseDetailView
	course={data.course}
	modules={data.modules}
	isStudentView={true}
	getLessonHref={(lessonId, moduleId) =>
		`/kurslarim/${$page.params.id}/lessons/${lessonId}?module_id=${moduleId}`}
/>
