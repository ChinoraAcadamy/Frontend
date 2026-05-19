<script>
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '@/lib/paraglide/runtime';

	import LessonVideoPlayer from './LessonVideoPlayer.svelte';
	import LessonInfo from './LessonInfo.svelte';
	import LessonAssignments from './LessonAssignments.svelte';
	import { resolve } from '$app/paths';

	let { lesson, nextLesson = null } = $props();

	let isVideoFinished = $state(false);
	let isSubmittingComplete = $state(false);
	let hasNextLesson = $state(false);

	$effect(() => {
		if (nextLesson) {
			Promise.resolve(nextLesson).then((resolved) => {
				hasNextLesson = !!resolved;
			});
		} else {
			hasNextLesson = false;
		}
	});

	async function markComplete() {
		if (!lesson?.id) return;
		isSubmittingComplete = true;
		try {
			// Video davomiyligi sekundlarda yoki ba'zi darslarda daqiqadan sekundga xato ko'paytirilgan bo'lishi mumkin.
			// Shuning uchun biz ikkala holatni ham qamrab oladigan maksimal qiymatni yuboramiz.
			const duration = Number(lesson?.duration) || 0;
			const watchedSeconds = Math.max(Math.floor(duration), Math.floor(duration * 60));

			const res = await fetch('/api/progress/complete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept-Language': getLocale()
				},
				body: JSON.stringify({
					lesson_id: lesson.id,
					watched_seconds: watchedSeconds
				})
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(
					data.message ||
						data.detail ||
						(m.error_occurred ? m.error_occurred() : 'Darsni yakunlashda xatolik yuz berdi')
				);
			}

			toast.success(
				m.info_lesson_completed ? m.info_lesson_completed() : 'Dars muvaffaqiyatli yakunlandi!'
			);

			await invalidateAll();

			const resolvedNextLesson = await nextLesson;
			if (resolvedNextLesson) {
				const url = `/kurslarim/${$page.params.id}/lessons/${resolvedNextLesson.id}?module_id=${resolvedNextLesson.moduleId || $page.url.searchParams.get('module_id')}`;
				/** @type {any} */
				const route = url;
				await goto(resolve(route));
			}
		} catch (e) {
			console.error('Lesson completion error:', e);
			const errorMsg = e instanceof Error ? e.message : String(e);
			toast.error(errorMsg);
		} finally {
			isSubmittingComplete = false;
		}
	}
</script>

<div class="flex min-w-0 flex-col gap-6">
	<!-- 1. Video Player & Security & Gestures -->
	<LessonVideoPlayer {lesson} bind:isVideoFinished />

	<!-- 2. Lesson Title, Description & Action -->
	<LessonInfo {lesson} {isVideoFinished} {isSubmittingComplete} {hasNextLesson} {markComplete} />

	<!-- 3. Assignments & History -->
	<LessonAssignments {lesson} />
</div>
