<script lang="ts">
	import { enhance } from '$app/forms';
	import { Save, Plus, FileText, Type, Link, UploadCloud, File, X, Info } from 'lucide-svelte';
	import { fly, fade, scale } from 'svelte/transition';

	let {
		action = '?/createAssignment',
		assignmentTarget = {},
		modulePk = $bindable(null),
		isSubmitting = $bindable(false),
		onSubmit
	} = $props();

	let selectedType = $state(assignmentTarget.type?.toLowerCase() || 'file');
	let assignmentFile = $state(null);
	let isDragging = $state(false);

	function handleFileDrop(e) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) {
			assignmentFile = file;
		}
	}

	function handleFileSelect(e) {
		const file = e.target.files?.[0];
		if (file) {
			assignmentFile = file;
		}
	}

	async function handleEnhancedSubmit(event) {
		const { formData } = event;
		if (assignmentFile && selectedType === 'file') {
			formData.set('file', assignmentFile);
		}

		if (onSubmit) {
			return onSubmit(event);
		}
	}
</script>

<form method="POST" {action} use:enhance={handleEnhancedSubmit} enctype="multipart/form-data">
	{#if modulePk}
		<input type="hidden" name="module_pk" value={modulePk} />
	{/if}

	<div class="grid-form">
		<!-- Main Info -->
		<div class="form-group full-width">
			<div class="mb-2 flex items-center gap-2">
				<div class="rounded-lg bg-rose-50 p-1.5 text-[#ed4b72]">
					<FileText size={16} />
				</div>
				<h3 class="text-sm font-bold tracking-wider text-slate-400 uppercase">
					Umumiy ma'lumotlar
				</h3>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-1.5">
					<label for="ass_title_uz">Topshiriq nomi (UZ) *</label>
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
					<label for="ass_title_ru">Topshiriq nomi (RU) *</label>
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
					<label for="ass_desc_uz">Ta'rif (UZ)</label>
					<textarea
						id="ass_desc_uz"
						name="description_uz"
						class="input textarea"
						rows="3"
						placeholder="Topshiriq haqida qisqacha ma'lumot..."
						>{assignmentTarget.description_uz || ''}</textarea
					>
				</div>
				<div class="space-y-1.5">
					<label for="ass_desc_ru">Ta'rif (RU)</label>
					<textarea
						id="ass_desc_ru"
						name="description_ru"
						class="input textarea"
						rows="3"
						placeholder="Kratkaya informatsiya o zadanii..."
						>{assignmentTarget.description_ru || ''}</textarea
					>
				</div>
			</div>
		</div>

		<!-- Configuration -->
		<div class="form-group">
			<label for="ass_type">Topshiriq Turi *</label>
			<div class="relative">
				<select id="ass_type" name="type" class="input pr-10" required bind:value={selectedType}>
					<option value="file">Fayl yuklash</option>
					<option value="text">Matn kiritish</option>
					<option value="link">Link yuborish</option>
				</select>
				<div class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400">
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
			<label for="max_attempts">Maksimal urinishlar soni *</label>
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

		<!-- Dynamic Content Section -->
		<div class="form-group full-width pt-4" in:fade={{ duration: 200 }}>
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="rounded-lg bg-slate-50 p-1.5 text-slate-500">
						<Info size={16} />
					</div>
					<h3 class="text-sm font-bold tracking-wider text-slate-400 uppercase">
						Topshiriq mazmuni
					</h3>
				</div>
				<span
					class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase"
					>Selected: {selectedType}</span
				>
			</div>

			{#if selectedType === 'file'}
				<div
					class="file-upload-zone {isDragging ? 'dragging' : ''} {assignmentFile ? 'has-file' : ''}"
					ondragenter={(e) => {
						e.preventDefault();
						isDragging = true;
					}}
					ondragleave={(e) => {
						e.preventDefault();
						isDragging = false;
					}}
					ondragover={(e) => e.preventDefault()}
					ondrop={handleFileDrop}
					role="button"
					tabindex="0"
				>
					<input
						type="file"
						id="assignment_file"
						name="file"
						class="hidden"
						onchange={handleFileSelect}
					/>

					{#if assignmentFile}
						<div
							class="file-info relative z-10 flex w-full flex-col items-center justify-center p-6"
							in:scale={{ duration: 200 }}
						>
							<div class="mb-3 rounded-2xl bg-rose-50 p-4 text-[#ed4b72]">
								<File size={40} />
							</div>
							<span class="w-full truncate px-4 text-center font-bold text-slate-800"
								>{assignmentFile.name}</span
							>
							<span class="mt-1 text-xs text-slate-500"
								>{(assignmentFile.size / (1024 * 1024)).toFixed(2)} MB</span
							>
							<button
								type="button"
								class="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 transition-colors hover:text-rose-500"
								onclick={() => (assignmentFile = null)}
							>
								<X size={14} /> Olib tashlash
							</button>
						</div>
					{:else}
						<label
							for="assignment_file"
							class="upload-label group flex w-full cursor-pointer flex-col items-center justify-center p-12 text-center"
						>
							<div
								class="mb-4 rounded-3xl bg-slate-50 p-5 text-slate-400 transition-colors group-hover:bg-rose-50 group-hover:text-[#ed4b72]"
							>
								<UploadCloud size={48} />
							</div>
							<span class="font-bold text-slate-600">Topshiriq faylini yuklang</span>
							<span class="mt-1 text-xs text-slate-400">Har qanday format (Max: 50MB)</span>
						</label>
					{/if}
				</div>
			{:else if selectedType === 'text'}
				<div class="space-y-4" in:fly={{ y: 20, duration: 300 }}>
					<div class="space-y-1.5">
						<label for="content_text">Topshiriq matni *</label>
						<textarea
							id="content_text"
							name="content_text"
							class="input textarea"
							rows="5"
							placeholder="Topshiriq matnini shu yerga yozing..."
							required
						></textarea>
					</div>
				</div>
			{:else if selectedType === 'link'}
				<div class="space-y-4" in:fly={{ y: 20, duration: 300 }}>
					<div class="space-y-1.5">
						<label for="content_link">Havola (URL) *</label>
						<div class="relative">
							<Link size={18} class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
							<input
								type="url"
								id="content_link"
								name="content_link"
								class="input pl-11"
								placeholder="https://example.com/resource"
								required
							/>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="actions">
		<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
			{#if isSubmitting}
				Saqlanmoqda...
			{:else}
				Save Assignment
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
		color: #64748b;
		margin-left: 2px;
	}

	.input {
		width: 100%;
		padding: 14px 18px;
		border: 2px solid #f1f5f9;
		border-radius: 20px;
		font-size: 14px;
		font-weight: 500;
		color: #1e293b;
		background: #f8fafc;
		font-family: inherit;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.input:focus {
		border-color: #ed4b72;
		background: #ffffff;
		outline: none;
		box-shadow: 0 0 0 4px rgba(237, 75, 114, 0.1);
	}

	.textarea {
		resize: vertical;
		min-height: 100px;
	}

	/* File Upload Styles */
	.file-upload-zone {
		position: relative;
		border: 2px dashed #e2e8f0;
		border-radius: 32px;
		background-color: #f8fafc;
		transition: all 0.3s ease;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 240px;
	}

	.file-upload-zone.dragging {
		border-color: #ed4b72;
		background-color: rgba(237, 75, 114, 0.05);
	}

	.file-upload-zone:hover:not(.has-file) {
		border-color: #ed4b72;
		background-color: #fff;
	}

	.file-upload-zone.has-file {
		border-style: solid;
		border-color: #f1f5f9;
		background: #ffffff;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 40px;
		padding-top: 24px;
		border-top: 1px solid #f1f5f9;
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
		background: #ed4b72;
		color: white;
		box-shadow: 0 10px 20px -10px rgba(237, 75, 114, 0.4);
	}

	.btn-primary:hover:not(:disabled) {
		background: #de3c61;
		transform: translateY(-2px);
		box-shadow: 0 12px 24px -10px rgba(237, 75, 114, 0.5);
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
