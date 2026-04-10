<!-- src/routes/dashboard/admin/courses/lesson/+page.svelte -->
<script>
	import { CheckCircle2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let { data, form } = $props();

	import LessonForm from '@/lib/components/ui/admin/forms/LessonForm.svelte';

	let isSubmitting = $state(false);
	let modulePk = $state(null);

	// if lesson is created, make toast message and clear all inputs
	$effect(() => {
		if (form?.success) {
			toast.success(`${form.lesson.title_uz} darsi muvaffaqiyatli yaratildi!`, {
				description: `Davomiyligi: ${form.lesson.duration} minut`
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
			<b class="text-primary">{data.course.title}</b> kursi uchun yangi dars qo'shish
		</h1>
		<p class="subtitle">Platformaga yangi o'quv dasturini kiritish paneli</p>
	</div>

	<div class="progress-tracker">
		<div class="step active">
			<div class="step-circle"><CheckCircle2 size={18} /></div>
			<span class="step-label">Kurs</span>
		</div>
		<div class="step-line active-line"></div>
		<div class="step active">
			<div class="step-circle"><CheckCircle2 size={18} /></div>
			<span class="step-label">Modul</span>
		</div>
		<div class="step-line active-line"></div>
		<div class="step active">
			<div class="step-circle"><CheckCircle2 size={18} /></div>
			<span class="step-label">Dars</span>
		</div>
	</div>

	<div class="form-card">
		<LessonForm 
			action="?/createLesson" 
			modules={data.modules} 
			bind:modulePk={modulePk} 
			bind:isSubmitting={isSubmitting} 
			onSubmit={handleSubmit} 
		/>
	</div>
</div>

<style>
	@reference "tailwindcss";
	/* Premium Aesthetic Variables */
	:root {
		--primary: #fa2e69;
		--primary-hover: #d81b53;
		--success: #10b981;
		--success-hover: #059669;
		--text-main: #111827;
		--text-muted: #6b7280;
		--bg-color: #f9fafb;
		--border-color: #e5e7eb;
		--card-bg: #ffffff;
		--radius-sm: 8px;
		--radius-md: 12px;
		--radius-lg: 16px;
		--font-poppins: 'Poppins', sans-serif;
	}

	.page-container {
		font-family: var(--font-poppins);
		max-width: 800px;
		margin: 0 auto;
		padding: 24px 16px;
	}

	.header {
		margin-bottom: 32px;
		text-align: center;
	}

	.title {
		font-size: 24px;
		font-weight: 700;
		color: var(--text-main);
		margin: 0 0 8px 0;
	}

	.subtitle {
		font-size: 14px;
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
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--card-bg);
		border: 2px solid var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: var(--text-muted);
		transition: all 0.3s ease;
	}

	.step.active .step-circle {
		border-color: var(--primary);
		background: var(--primary);
		color: white;
		box-shadow: 0 4px 12px rgba(250, 46, 105, 0.25);
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
		background: var(--border-color);
		margin: 0 16px;
		transform: translateY(-12px);
		transition: all 0.3s ease;
	}

	.active-line {
		background: var(--primary);
	}

	/* Forms Container */
	.form-card {
		background: var(--card-bg);
		border-radius: var(--radius-lg);
		padding: 24px;
		border: 1px solid var(--border-color);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
	}
</style>