<!-- src/routes/dashboard/admin/courses/lesson/+page.svelte -->
<script>
	import { CheckCircle2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages.js';

	let { data, form } = $props();

	import LessonForm from '@/lib/components/ui/admin/forms/LessonForm.svelte';

	let isSubmitting = $state(false);
	let modulePk = $state(null);

	// if lesson is created, make toast message and clear all inputs
	$effect(() => {
		if (form?.success) {
			toast.success(m.msg_lesson_created ? m.msg_lesson_created({ title: form.lesson.title_uz }) : `${form.lesson.title_uz} darsi muvaffaqiyatli yaratildi!`, {
				description: m.label_duration_param ? m.label_duration_param({ minutes: form.lesson.duration }) : `Davomiyligi: ${form.lesson.duration} minut`
			});
			// Formani tozalash
			modulePk = null;
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
		<h1 class="title">
			<b class="text-primary">{data.course.title}</b> 
			{m.text_create_lesson_for ? m.text_create_lesson_for({ course: '' }).replace(': ', '').trim() : "kursi uchun yangi dars qo'shish"}
		</h1>
		<p class="subtitle">{m.admin_course_create_subtitle ? m.admin_course_create_subtitle() : "Platformaga yangi o'quv dasturini kiritish paneli"}</p>
	</div>

	<div class="progress-tracker">
		<div class="step active">
			<div class="step-circle"><CheckCircle2 size={18} /></div>
			<span class="step-label">{m.admin_course_create_step_course ? m.admin_course_create_step_course() : "Kurs"}</span>
		</div>
		<div class="step-line active-line"></div>
		<div class="step active">
			<div class="step-circle"><CheckCircle2 size={18} /></div>
			<span class="step-label">{m.admin_course_create_step_module ? m.admin_course_create_step_module() : "Modul"}</span>
		</div>
		<div class="step-line active-line"></div>
		<div class="step active">
			<div class="step-circle"><CheckCircle2 size={18} /></div>
			<span class="step-label">{m.admin_course_create_step_lesson ? m.admin_course_create_step_lesson() : "Dars"}</span>
		</div>
	</div>

	<div class="form-card">
		<LessonForm 
			action="?/createLesson" 
			modules={data.modules} 
			apiContext={{ apiUrl: data.apiUrl, accessToken: data.accessToken, courseId: data.courseId }}
			bind:modulePk={modulePk} 
			bind:isSubmitting={isSubmitting} 
			onSubmit={handleSubmit} 
		/>
	</div>
</div>

<style>
	@reference "tailwindcss";
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

	/* Progress Tracker (Wizard) */
	.progress-tracker {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32px;
		padding: 0 20px;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		position: relative;
		z-index: 2;
	}

	.step-circle {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		background: var(--bg-surface);
		border: 2px solid var(--border-main);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		color: var(--text-muted);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.step.active .step-circle {
		border-color: var(--primary);
		background: var(--primary);
		color: white;
		box-shadow: 0 8px 16px -4px var(--primary/30);
		transform: translateY(-2px);
	}

	.step-label {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-muted);
	}

	.step.active .step-label {
		color: var(--text-main);
		font-weight: 600;
	}

	.step-line {
		flex: 1;
		height: 2px;
		background: var(--border-main);
		margin: 0 16px;
		transform: translateY(-12px);
		transition: all 0.3s ease;
	}

	.active-line {
		background: var(--primary);
	}

	/* Forms Container */
	.form-card {
		background: var(--bg-card);
		border-radius: 32px;
		padding: 24px;
		border: 1px solid var(--border-main);
		box-shadow: var(--shadow-sm);
	}
</style>