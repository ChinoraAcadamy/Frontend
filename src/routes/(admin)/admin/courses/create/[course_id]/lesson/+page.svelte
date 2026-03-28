<script lang="ts">
	import { enhance } from '$app/forms';
	import { CheckCircle2 } from 'lucide-svelte';

	// Svelte 5 State'lar
	let step = $state(3);
	let modulePk = $state(null);
	let isSubmitting = $state(false);
	// Form submit qilinayotganda ushlab turish va keyingi bosqichga o'tkazish
	function submitStep() {
		isSubmitting = true;
		return async ({ result, update }) => {
			isSubmitting = false;

			if (result.type === 'success') {
				if (step === 1) {
					step = 2;
				} else if (step === 2) {
					step = 3;
				}
				// Step 3 success bo'lsa, serverni o'zi redirect qiladi
			} else if (result.type === 'failure') {
				alert(result.data?.error || 'Xatolik yuz berdi');
				await update();
			}
		};
	}

	const { data } = $props();
	// console.log(data);
</script>

<div class="page-container">
	<div class="header">
		<h1 class="title">Yangi kurs qo'shish</h1>
		<p class="subtitle">Platformaga yangi o'quv dasturini kiritish paneli</p>
	</div>

	<div class="progress-tracker">
		<div class="step {step >= 1 ? 'active' : ''}">
			<div class="step-circle">
				{step > 1 ? '' : '1'}
				{#if step > 1}
					<CheckCircle2 size={18} />
				{/if}
			</div>
			<span class="step-label">Kurs</span>
		</div>
		<div class="step-line {step >= 2 ? 'active-line' : ''}"></div>
		<div class="step {step >= 2 ? 'active' : ''}">
			<div class="step-circle">
				{step > 2 ? '' : '2'}
				{#if step > 2}
					<CheckCircle2 size={18} />
				{/if}
			</div>
			<span class="step-label">Modul</span>
		</div>
		<div class="step-line {step === 3 ? 'active-line' : ''}"></div>
		<div class="step {step === 3 ? 'active' : ''}">
			<div class="step-circle">3</div>
			<span class="step-label">Dars</span>
		</div>
	</div>

	<div class="form-card">
		<form method="POST" action="?/createLesson" use:enhance={submitStep}>
			<!-- <input type="hidden" name="module_pk" value={modulePk} /> -->

			<div class="grid-form">
				<div class="form-group">
					<label for="module_select">Modulni tanlang</label>
					<select id="module_select" class="input" name="module_pk" bind:value={modulePk} required>
						<option value="" disabled selected>Modul tanlang</option>

						{#each data.modules.modules as module (module.id)}
							<option value={module.id}>
								{module.title} ({module.lessons_count} ta dars)
							</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label for="les_title_uz">Dars nomi (UZ)</label>
					<input
						type="text"
						id="les_title_uz"
						name="title_uz"
						class="input"
						required
						minlength="1"
					/>
				</div>
				<div class="form-group">
					<label for="les_title_ru">Dars nomi (RU)</label>
					<input
						type="text"
						id="les_title_ru"
						name="title_ru"
						class="input"
						required
						minlength="1"
					/>
				</div>

				<div class="form-group full-width">
					<label for="les_desc_uz">Dars haqida (UZ)</label>
					<textarea id="les_desc_uz" name="description_uz" class="input textarea" rows="2"
					></textarea>
				</div>
				<div class="form-group full-width">
					<label for="les_desc_ru">Dars haqida (RU)</label>
					<textarea id="les_desc_ru" name="description_ru" class="input textarea" rows="2"
					></textarea>
				</div>

				<div class="form-group">
					<label for="les_duration">Davomiyligi (minut)</label>
					<input type="number" id="les_duration" name="duration" class="input" />
				</div>
				<div class="form-group">
					<label for="les_order">Tartib raqami</label>
					<input type="number" id="les_order" name="order_index" class="input" value="1" />
				</div>
			</div>

			<div class="actions">
				<button type="submit" class="btn btn-success" disabled={isSubmitting}>
					{isSubmitting ? 'Nashr qilinmoqda...' : 'Publish'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
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

	/* Forms */
	.form-card {
		background: var(--card-bg);
		border-radius: var(--radius-lg);
		padding: 24px;
		border: 1px solid var(--border-color);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
	}

	.grid-form {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-main);
	}

	.input {
		width: 100%;
		padding: 12px 16px;
		border: 1.5px solid var(--border-color);
		border-radius: var(--radius-md);
		font-size: 14px;
		color: var(--text-main);
		background: var(--bg-color);
		font-family: inherit;
		transition: all 0.2s ease;
	}

	.input:focus {
		border-color: var(--primary);
		background: var(--card-bg);
		outline: none;
		box-shadow: 0 0 0 3px rgba(250, 46, 105, 0.1);
	}

	.textarea {
		resize: vertical;
		min-height: 80px;
	}

	/* Buttons */
	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--border-color);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 28px;
		border-radius: var(--radius-md);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: 0.2s ease;
		font-family: inherit;
	}

	.btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.btn-success {
		background: var(--success);
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: var(--success-hover);
	}

	/* Desktop yondashuvi */
	@media (min-width: 640px) {
		.grid-form {
			grid-template-columns: 1fr 1fr;
		}
		.full-width {
			grid-column: span 2;
		}
		.form-card {
			padding: 32px;
		}
	}
</style>
