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

<div class="page-container">
	<div class="header">
		<h1 class="title">Kursni tahrirlash</h1>
		<p class="subtitle">Mavjud o'quv dasturi ma'lumotlarini yangilash</p>
	</div>

	<div class="form-card">
		<CourseForm
			action="?/updateCourse"
			course={data.course}
			bind:isSubmitting={isSubmitting}
			onSubmit={handleSubmit}
		/>
	</div>
</div>

<style>
	.page-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 40px 20px;
	}

	.header {
		margin-bottom: 32px;
		text-align: center;
	}

	.title {
		font-size: 32px;
		font-weight: 900;
		letter-spacing: -0.02em;
		color: var(--text-main);
		margin: 0 0 8px 0;
	}

	.subtitle {
		font-size: 15px;
		font-weight: 500;
		color: var(--text-muted);
		margin: 0;
	}

	.form-card {
		background: var(--bg-card);
		border-radius: 32px;
		padding: 24px;
		border: 1px solid var(--border-main);
		box-shadow: var(--shadow-sm);
	}

	@media (min-width: 640px) {
		.form-card {
			padding: 32px;
		}
	}
</style>
