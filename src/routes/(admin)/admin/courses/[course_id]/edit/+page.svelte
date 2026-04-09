<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import CourseForm from '@/lib/components/ui/admin/forms/CourseForm.svelte';

	let { data, form } = $props();

	let isSubmitting = $state(false);

	$effect(() => {
		if (form?.success) {
			toast.success('Kurs muvaffaqiyatli yangilandi!');
			goto(resolve(`/admin/courses/${$page.params.course_id}`));
		} else if (form?.error) {
			toast.error(form.error);
		}
	});

	function handleSubmit() {
		isSubmitting = true;
		return async ({ update }) => {
			isSubmitting = false;
			await update();
		};
	}
</script>

<div class="mx-auto max-w-3xl p-4 font-sans md:p-8">
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Kursni tahrirlash</h1>
		<p class="mt-2 text-sm text-slate-500">Mavjud o'quv dasturi ma'lumotlarini yangilash</p>
	</div>

	<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
		<CourseForm
			action="?/updateCourse"
			course={data.course}
			bind:isSubmitting={isSubmitting}
			onSubmit={handleSubmit}
		/>
	</div>
</div>

<style>
	:global(body) {
		background-color: #f8fafc;
	}
</style>
