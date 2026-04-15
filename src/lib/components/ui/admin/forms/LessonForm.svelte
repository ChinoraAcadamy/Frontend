<script lang="ts">
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Search, ChevronDown, CheckCircle2, Save, UploadCloud, Video, X } from 'lucide-svelte';

	/**
	 * @typedef {Object} Lesson
	 * @property {number|null} [pk]
	 * @property {string} [title_uz]
	 * @property {string} [title_ru]
	 * @property {string} [description_uz]
	 * @property {string} [description_ru]
	 * @property {number} [duration]
	 * @property {number} [order_index]
	 */

	/**
	 * @typedef {Object} Props
	 * @property {string} [action]
	 * @property {any} [lessonTarget]
	 * @property {any[]} [modules]
	 * @property {number|null} [modulePk]
	 * @property {boolean} [isSubmitting]
	 * @property {function} [onSubmit]
	 * @property {{ apiUrl: string, accessToken: string, courseId: string } | null} [apiContext]
	 */

	/** @type {Props} */
	let {
		action = '?/createLesson',
		lessonTarget = {},
		modules = [],
		modulePk = $bindable(null),
		isSubmitting = $bindable(false),
		onSubmit,
		apiContext = null
	} = $props();
	
	// Dropdown and File Upload State
	let searchQuery = $state('');
	let isDropdownOpen = $state(false);

	let isDragging = $state(false);
	let videoFile = $state(null);
	let uploadProgress = $state(0);
	let autoDuration = $state(lessonTarget.duration || 0);

	// Helper to get video duration in minutes (rounded up)
	async function getVideoDuration(file) {
		return new Promise((resolve) => {
			const video = document.createElement('video');
			video.preload = 'metadata';
			video.onloadedmetadata = () => {
				window.URL.revokeObjectURL(video.src);
				// Duration is in seconds, convert to minutes and round up to nearest integer
				resolve(Math.ceil(video.duration / 60));
			};
			video.onerror = () => {
				resolve(0);
			};
			video.src = URL.createObjectURL(file);
		});
	}

	let filteredModules = $derived(
		modules.filter((mod) => mod.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function selectModule(id) {
		modulePk = id;
		isDropdownOpen = false;
		searchQuery = '';
	}

	function handleFileDrop(e) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file && file.type.startsWith('video/')) {
			videoFile = file;
			getVideoDuration(file).then((duration) => {
				autoDuration = duration;
			});
		}
	}

	function handleFileSelect(e) {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith('video/')) {
			videoFile = file;
			getVideoDuration(file).then((duration) => {
				autoDuration = duration;
			});
		}
	}

	async function handleCustomSubmit(e) {
		e.preventDefault();
		const form = e.target;

		let updateFn;
		if (onSubmit) {
			const fakeData = { cancel: false, data: new FormData(form), action: new URL(form.action) };
			updateFn = await onSubmit(fakeData);
			if (fakeData.cancel) return;
		} else {
			isSubmitting = true;
		}

		const formData = new FormData(form);
		if (videoFile) {
			formData.set('video_url', videoFile);
		}

		const xhr = new XMLHttpRequest();

		xhr.upload.addEventListener('progress', (event) => {
			if (event.lengthComputable) {
				uploadProgress = Math.round((event.loaded * 100) / event.total);
			}
		});

		xhr.addEventListener('load', async () => {
			setTimeout(() => (uploadProgress = 0), 1000); // clear after 1s
			try {
				let result;
				if (apiContext) {
					if (xhr.status >= 200 && xhr.status < 300) {
						const json = JSON.parse(xhr.responseText);
						result = { type: 'success', status: xhr.status, data: { success: true, lesson: json } };
					} else {
						/** @type {any} */
						let errData = {};
						try { errData = JSON.parse(xhr.responseText); } catch(e){}
						result = { 
							type: 'failure', 
							status: xhr.status > 0 ? xhr.status : 400, 
							data: { 
								error: errData.title?.[0] || errData.detail || "Xatolik yuz berdi" 
							} 
						};
					}
				} else {
					result = deserialize(xhr.responseText);
				}
				
				await applyAction(result);
				if (updateFn) await updateFn({ update: invalidateAll, result });
			} catch (err) {
				console.error(err);
			} finally {
				if (!updateFn) isSubmitting = false;
			}
		});

		xhr.addEventListener('error', () => {
			uploadProgress = 0;
			if (!updateFn) isSubmitting = false;
			alert('Xatolik yuz berdi');
		});

		if (apiContext) {
			const directUrl = `${apiContext.apiUrl}/courses/${apiContext.courseId}/modules/${formData.get('module_pk')}/lessons/`;
			xhr.open('POST', directUrl);
			xhr.setRequestHeader('Authorization', `Bearer ${apiContext.accessToken}`);
			
			// Note: When sending FormData via XMLHttpRequest, we don't set Content-Type
			// to avoid overriding the browser boundary generated for multipart/form-data
		} else {
			xhr.open('POST', form.action);
		}

		xhr.send(formData);
	}
</script>

<form method="POST" {action} onsubmit={handleCustomSubmit} enctype="multipart/form-data">
	<div class="grid-form">
		<!-- ==================== SEARCHABLE DROPDOWN ==================== -->
		<div class="form-group full-width relative">
			<label for="module" class="text-sm font-semibold text-slate-700">Modulni tanlang</label>

			<!-- Trigger button -->
			<button
				type="button"
				onclick={() => (isDropdownOpen = !isDropdownOpen)}
				class="input flex cursor-pointer items-center justify-between"
			>
				{#if modulePk}
					{@const selected = modules.find((m) => m.id === modulePk)}
					<span class="text-slate-800">{selected?.title}</span>
					<input type="hidden" name="module_pk" value={modulePk} />
				{:else}
					<span class="text-slate-400">Modul tanlang...</span>
				{/if}
				<ChevronDown
					size={18}
					class="text-slate-400 transition-transform {isDropdownOpen ? 'rotate-180' : ''}"
				/>
			</button>

			<!-- Dropdown -->
			{#if isDropdownOpen}
				<div
					class="absolute top-20 z-50 mt-2 max-h-64 w-full overflow-auto rounded-3xl border border-slate-200 bg-white py-2 shadow-xl"
				>
					<!-- Search input inside dropdown -->
					<div class="sticky top-0 z-10 bg-white px-4 pb-2">
						<div class="relative">
							<Search size={18} class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
							<input
								bind:value={searchQuery}
								id="module"
								placeholder="Modul qidirish..."
								class="h-10 w-full rounded-2xl border border-slate-200 pr-4 pl-10 text-sm outline-none focus:border-[#ed4b72]"
								autocomplete="off"
							/>
						</div>
					</div>

					{#if filteredModules.length > 0}
						{#each filteredModules as module (module.id)}
							<button
								type="button"
								onclick={() => selectModule(module.id)}
								class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
							>
								<span class="text-sm">{module.title}</span>
								<span class="ml-auto text-xs text-slate-400"
									>({module.lessons_count || 0} ta dars)</span
								>
							</button>
						{/each}
					{:else}
						<div class="px-4 py-8 text-center text-sm text-slate-400">
							Hech qanday modul topilmadi
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- ==================== QOLGAN INPUTLAR ==================== -->
		<div class="form-group">
			<label for="les_title_uz">Dars nomi (UZ)</label>
			<input
				type="text"
				id="les_title_uz"
				name="title_uz"
				class="input"
				required
				minlength="1"
				value={lessonTarget.title_uz || lessonTarget.title}
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
				value={lessonTarget.title_ru || lessonTarget.title}
			/>
		</div>

		<div class="form-group full-width">
			<label for="les_desc_uz">Dars haqida (UZ)</label>
			<textarea id="les_desc_uz" name="description_uz" class="input textarea" rows="2"
				>{lessonTarget.description_uz || lessonTarget.description}</textarea
			>
		</div>

		<div class="form-group full-width">
			<label for="les_desc_ru">Dars haqida (RU)</label>
			<textarea id="les_desc_ru" name="description_ru" class="input textarea" rows="2"
				>{lessonTarget.description_ru || lessonTarget.description}</textarea
			>
		</div>

		<div class="form-group">
			<label for="les_duration">Davomiyligi (minut)</label>
			<input
				type="number"
				id="les_duration"
				name="duration"
				class="input cursor-not-allowed bg-slate-100"
				bind:value={autoDuration}
				readonly
				placeholder="Video yuklanganda avtomatik aniqlanadi"
			/>
		</div>

		<div class="form-group full-width">
			<label for="les_video">Video Yuklash</label>
			<!-- Existing video text if editing -->
			{#if lessonTarget.video_url}
				<div class="mb-2 text-sm text-slate-500">Hozirgi video: {lessonTarget.video_url}</div>
			{/if}

			<div
				class="file-upload-zone {isDragging ? 'dragging' : ''} {videoFile ? 'has-file' : ''}"
				role="button"
				tabindex="0"
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
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						document.getElementById('les_video')?.click();
					}
				}}
			>
				<input
					type="file"
					id="les_video"
					accept="video/*"
					class="hidden"
					onchange={handleFileSelect}
				/>

				{#if videoFile}
					<div
						class="file-info relative z-10 flex w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-6"
					>
						<Video size={48} class="mb-2 text-primary" />
						<span class="w-full truncate px-4 text-center font-medium text-slate-800"
							>{videoFile.name}</span
						>
						<span class="mt-1 text-xs text-slate-500"
							>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span
						>

						<!-- Prevent default form submission on this button -->
						<button
							type="button"
							class="absolute top-2 right-2 rounded-full bg-slate-100 p-1.5 text-slate-600 transition-colors hover:bg-slate-200"
							onclick={(e) => {
								e.preventDefault();
								videoFile = null;
								autoDuration = 0;
							}}
							title="Olib tashlash"
						>
							<X size={16} />
						</button>
					</div>
				{:else}
					<label
						for="les_video"
						class="upload-label flex w-full cursor-pointer flex-col items-center justify-center p-8 text-center"
					>
						<UploadCloud
							size={48}
							class="mb-3 text-slate-400 transition-colors group-hover:text-primary"
						/>
						<span class="font-medium text-slate-600"
							>Videonini shu yerga tashlang yoki <span class="text-primary hover:underline"
								>tanlang</span
							></span
						>
						<span class="mt-2 text-xs text-slate-400">MP4, WebM (Max: 1GB)</span>
					</label>
				{/if}

				<!-- Progress bar inside the zone -->
				{#if uploadProgress > 0}
					<div
						class="progress-overlay absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[inherit] bg-white/90 px-6"
					>
						<div class="mb-4 text-xl font-bold text-primary">{uploadProgress}% yuklandi</div>
						<div class="h-3 w-full overflow-hidden rounded-full bg-slate-100">
							<div
								class="h-full rounded-full bg-primary transition-all duration-300 ease-out"
								style="width: {uploadProgress}%"
							></div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<div class="form-group">
			<label for="les_order">Tartib raqami</label>
			<input
				type="number"
				id="les_order"
				name="order_index"
				class="input"
				value={lessonTarget.order_index ?? 1}
			/>
		</div>
	</div>

	<div class="actions">
		<button type="submit" class="btn btn-success" disabled={isSubmitting}>
			{#if isSubmitting}
				Nashr qilinmoqda...
			{:else}
				Publish
				{#if action.includes('create')}
					<CheckCircle2 size={18} />
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

	.form-group button.input {
		text-align: left;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-main, #111827);
	}

	.input {
		width: 100%;
		padding: 12px 16px;
		border: 1.5px solid var(--border-color, #e5e7eb);
		border-radius: var(--radius-md, 12px);
		font-size: 14px;
		color: var(--text-main, #111827);
		background: var(--bg-color, #f9fafb);
		font-family: inherit;
		transition: all 0.2s ease;
	}

	.input:focus {
		border-color: var(--primary, #fa2e69);
		background: var(--card-bg, #ffffff);
		outline: none;
		box-shadow: 0 0 0 3px rgba(250, 46, 105, 0.1);
	}

	.textarea {
		resize: vertical;
		min-height: 80px;
	}

	/* File Upload Styles */
	.file-upload-zone {
		position: relative;
		border: 2px dashed var(--border-color, #e5e7eb);
		border-radius: var(--radius-md, 12px);
		background-color: var(--bg-color, #f9fafb);
		transition: all 0.2s ease;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 180px;
	}

	.file-upload-zone:focus-within {
		border-color: var(--primary, #fa2e69);
		box-shadow: 0 0 0 3px rgba(250, 46, 105, 0.1);
	}

	.file-upload-zone.dragging {
		border-color: var(--primary, #fa2e69);
		background-color: rgba(250, 46, 105, 0.03);
	}

	.file-upload-zone:hover:not(.has-file) {
		background-color: var(--card-bg, #ffffff);
		border-color: var(--primary, #fa2e69);
	}

	.file-upload-zone.has-file {
		border-style: solid;
		background: #ffffff;
		padding: 16px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--border-color, #e5e7eb);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 28px;
		border-radius: var(--radius-md, 12px);
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
		background: var(--success, #10b981);
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: var(--success-hover, #059669);
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
