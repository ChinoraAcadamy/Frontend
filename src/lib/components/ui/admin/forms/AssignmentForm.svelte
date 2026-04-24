<script lang="ts">
	import { enhance } from '$app/forms';
	import { Save, Plus, FileText, Type, Link, UploadCloud, Info } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		action = '?/createAssignment',
		assignmentTarget = {},
		modulePk = $bindable(null),
		isSubmitting = $bindable(false),
		onSubmit
	} = $props();

	let selectedType = $state(assignmentTarget.type?.toLowerCase() || 'file');

	async function handleEnhancedSubmit(event) {
		if (onSubmit) {
			return onSubmit(event);
		}
	}
</script>

<form method="POST" {action} use:enhance={handleEnhancedSubmit}>
	{#if modulePk}
		<input type="hidden" name="module_pk" value={modulePk} />
	{/if}

	<div class="grid-form">
		<!-- Main Info -->
		<div class="form-group full-width">
			<div class="mb-2 flex items-center gap-2">
				<div class="rounded-lg bg-primary/10 p-1.5 text-primary">
					<FileText size={16} />
				</div>
				<h3 class="text-sm font-bold tracking-wider text-muted uppercase">
					{m.section_general_info ? m.section_general_info() : 'Umumiy ma\'lumotlar'}
				</h3>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-1.5">
					<label for="ass_title_uz">{m.label_assignment_title_uz_req ? m.label_assignment_title_uz_req() : 'Topshiriq nomi (UZ) *'}</label>
					<input
						type="text"
						id="ass_title_uz"
						name="title_uz"
						class="input"
						required
						minlength="1"
						value={assignmentTarget.title_uz || ''}
					/>
				</div>
				<div class="space-y-1.5">
					<label for="ass_title_ru">{m.label_assignment_title_ru_req ? m.label_assignment_title_ru_req() : 'Topshiriq nomi (RU) *'}</label>
					<input
						type="text"
						id="ass_title_ru"
						name="title_ru"
						class="input"
						required
						minlength="1"
						value={assignmentTarget.title_ru || ''}
					/>
				</div>
			</div>
		</div>

		<div class="form-group full-width">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-1.5">
					<label for="ass_desc_uz">{m.label_course_desc_uz ? m.label_course_desc_uz() : 'Ta\'rif (UZ)'}</label>
					<textarea
						id="ass_desc_uz"
						name="description_uz"
						class="input textarea"
						rows="3"
						placeholder={m.placeholder_lesson_desc_uz ? m.placeholder_lesson_desc_uz() : 'Topshiriq haqida qisqacha ma\'lumot...'}
						>{assignmentTarget.description_uz || ''}</textarea
					>
				</div>
				<div class="space-y-1.5">
					<label for="ass_desc_ru">{m.label_course_desc_ru ? m.label_course_desc_ru() : 'Ta\'rif (RU)'}</label>
					<textarea
						id="ass_desc_ru"
						name="description_ru"
						class="input textarea"
						rows="3"
						placeholder={m.placeholder_lesson_desc_ru ? m.placeholder_lesson_desc_ru() : 'Kratkaya informatsiya o zadanii...'}
						>{assignmentTarget.description_ru || ''}</textarea
					>
				</div>
			</div>
		</div>

		<!-- Configuration -->
		<div class="form-group">
			<label for="ass_type">{m.label_assignment_type ? m.label_assignment_type() : 'Topshiriq Turi *'}</label>
			<div class="relative">
				<select id="ass_type" name="type" class="input pr-10" required bind:value={selectedType}>
					<option value="file">{m.option_type_file ? m.option_type_file() : 'Fayl yuklash'}</option>
					<option value="text">{m.option_type_text ? m.option_type_text() : 'Matn kiritish'}</option>
					<option value="link">{m.option_type_link ? m.option_type_link() : 'Link yuborish'}</option>
				</select>
				<div class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted">
					{#if selectedType === 'file'}
						<UploadCloud size={18} />
					{:else if selectedType === 'text'}
						<Type size={18} />
					{:else}
						<Link size={18} />
					{/if}
				</div>
			</div>
		</div>

		<div class="form-group">
			<label for="max_attempts">{m.label_max_attempts ? m.label_max_attempts() : 'Maksimal urinishlar soni *'}</label>
			<input
				type="number"
				id="max_attempts"
				name="max_attempts"
				class="input"
				value={assignmentTarget.max_attempts ?? 1}
				required
				min="1"
			/>
		</div>

		<div class="form-group">
			<label for="max_score">{m.label_max_score ? m.label_max_score() : 'Maksimal ball *'}</label>
			<input
				type="number"
				id="max_score"
				name="max_score"
				class="input"
				value={assignmentTarget.max_score ?? 10}
				required
				min="1"
				max="100"
			/>
		</div>

		<!-- New Info Section -->
		<div class="form-group full-width pt-2">
			<div
				class="flex items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 text-foreground"
			>
				<div class="mt-0.5 rounded-lg bg-surface p-1.5 text-secondary-dark shadow-sm">
					<Info size={16} />
				</div>
				<div>
					<h4 class="text-sm font-bold tracking-tight">{m.profile_about ? m.profile_about() : 'Eslatma'}</h4>
					<p class="mt-0.5 text-[13px] leading-relaxed font-medium opacity-80">
						{m.text_assignment_hint ? m.text_assignment_hint() : 'Tanlangan topshiriq turi studentlar qanday ko\'rinishda javob yuborishi kerakligini belgilaydi. Admin sifatida siz faqat topshiriq shartlarini belgilaysiz.'}
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="actions">
		<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
			{#if isSubmitting}
				{m.profile_saving ? m.profile_saving() : 'Saqlanmoqda...'}
			{:else}
				{m.btn_save_assignment ? m.btn_save_assignment() : 'Topshiriqni saqlash'}
				{#if action.includes('create')}
					<Plus size={18} />
				{:else}
					<Save size={18} />
				{/if}
			{/if}
		</button>
	</div>
</form>

<style>
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
		font-weight: 700;
		color: var(--text-muted);
		margin-left: 2px;
	}

	.input {
		width: 100%;
		padding: 14px 18px;
		border: 1.5px solid var(--border-main);
		border-radius: 20px;
		font-size: 14px;
		font-weight: 500;
		color: var(--text-main);
		background: var(--bg-main);
		font-family: inherit;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.input:focus {
		border-color: var(--primary);
		background: var(--bg-card);
		outline: none;
		box-shadow: 0 0 0 4px var(--primary/10);
	}

	.textarea {
		resize: vertical;
		min-height: 100px;
	}

	/* File Upload Styles */
	.file-upload-zone {
		position: relative;
		border: 2px dashed var(--border-main);
		border-radius: 32px;
		background-color: var(--bg-main);
		transition: all 0.3s ease;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 240px;
	}

	.file-upload-zone.dragging {
		border-color: var(--primary);
		background-color: var(--primary/5);
	}

	.file-upload-zone:hover:not(.has-file) {
		border-color: var(--primary);
		background-color: var(--bg-card);
	}

	.file-upload-zone.has-file {
		border-style: solid;
		border-color: var(--border-main);
		background: var(--bg-card);
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 40px;
		padding-top: 24px;
		border-top: 1px solid var(--border-main);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 16px 32px;
		border-radius: 20px;
		font-size: 15px;
		font-weight: 800;
		cursor: pointer;
		border: none;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: inherit;
	}

	.btn:active {
		transform: scale(0.97);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
		box-shadow: 0 10px 20px -10px var(--primary/40);
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--primary-hover);
		transform: translateY(-2px);
		box-shadow: 0 12px 24px -10px var(--primary/50);
	}

	@media (min-width: 640px) {
		.grid-form {
			grid-template-columns: 1fr 1fr;
		}
		.full-width {
			grid-column: span 2;
		}
	}
</style>
