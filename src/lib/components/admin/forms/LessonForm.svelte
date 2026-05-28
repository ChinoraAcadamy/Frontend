<script lang="ts">
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { CheckCircle2, Save, Video, Sparkles } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	// Parts
	import FormSection from './parts/FormSection.svelte';
	import LanguageTabs from './parts/LanguageTabs.svelte';
	import ModuleSelector from './parts/ModuleSelector.svelte';
	import VideoUploadZone from './parts/VideoUploadZone.svelte';

	// Utils
	import { parseBackendError } from '$lib/utils/lessonForm';

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

	// UI State
	let activeTab = $state('uz');
	let videoFile = $state(null);
	// eslint-disable-next-line svelte/prefer-writable-derived
	let imgPreview = $state(null);
	let uploadProgress = $state(0);

	// Svelte 5 Form state variables
	// svelte-ignore state_referenced_locally
	let titleUz = $state(lessonTarget.title_uz || lessonTarget.title || '');
	// svelte-ignore state_referenced_locally
	let titleRu = $state(lessonTarget.title_ru || lessonTarget.title || '');
	// svelte-ignore state_referenced_locally
	let descriptionUz = $state(lessonTarget.description_uz || lessonTarget.description || '');
	// svelte-ignore state_referenced_locally
	let descriptionRu = $state(lessonTarget.description_ru || lessonTarget.description || '');
	// svelte-ignore state_referenced_locally
	let autoDuration = $state(lessonTarget.duration || 0);

	// AI Creator tab states
	let creatorTab = $state('manual'); // 'manual' | 'ai'
	let aiInputText = $state('');
	let isParsingAi = $state(false);

	// AI Translating states
	let isTranslatingTitle = $state(false);
	let isTranslatingDesc = $state(false);

	$effect.pre(() => {
		imgPreview = lessonTarget?.image || null;
	});

	function handleImageChange(e) {
		const file = e.target.files?.[0];
		if (file) {
			imgPreview = URL.createObjectURL(file);
		}
	}

	function resetForm(form) {
		form.reset();
		videoFile = null;
		imgPreview = null;
		uploadProgress = 0;
		autoDuration = 0;
		modulePk = null;
		titleUz = '';
		titleRu = '';
		descriptionUz = '';
		descriptionRu = '';
		aiInputText = '';
	}

	// AI Parsing function
	async function handleAiParse() {
		if (!aiInputText || aiInputText.trim() === '') {
			toast.error("Maydon bo'sh! Iltimos, avval dars ma'lumotlarini matn shaklida yozing.");
			return;
		}

		isParsingAi = true;
		try {
			const res = await fetch('/api/lessons/parse', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: aiInputText })
			});

			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error || 'AI tahlilda xatolik yuz berdi');
				return;
			}

			// Fill state variables
			titleUz = data.title_uz || '';
			titleRu = data.title_ru || '';
			descriptionUz = data.description_uz || '';
			descriptionRu = data.description_ru || '';
			if (data.duration) {
				autoDuration = data.duration;
			}

			toast.success("Dars ma'lumotlari AI yordamida to'ldirildi va rus tiliga tarjima qilindi! ✨");
			// Switch back to fields form tab
			creatorTab = 'manual';
		} catch (err) {
			console.error(err);
			toast.error("AI tahlil xizmati bilan bog'lanib bo'lmadi");
		} finally {
			isParsingAi = false;
		}
	}

	// AI translation handler
	async function handleTranslate(sourceText, targetKey) {
		if (!sourceText || sourceText.trim() === '') {
			toast.error("O'zbekcha maydon bo'sh! Avval uni to'ldiring.");
			return;
		}

		if (targetKey === 'title') isTranslatingTitle = true;
		if (targetKey === 'desc') isTranslatingDesc = true;

		try {
			const res = await fetch('/api/translate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: sourceText })
			});

			const data = await res.json();
			if (data.translation) {
				if (targetKey === 'title') titleRu = data.translation;
				if (targetKey === 'desc') descriptionRu = data.translation;
				toast.success('Tarjima muvaffaqiyatli bajarildi! ✨');
			} else {
				toast.error(data.error || 'Tarjimada xatolik yuz berdi');
			}
		} catch (err) {
			console.error(err);
			toast.error("Tarjima xizmati bilan bog'lanib bo'lmadi");
		} finally {
			if (targetKey === 'title') isTranslatingTitle = false;
			if (targetKey === 'desc') isTranslatingDesc = false;
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
			formData.set('video_file', videoFile);
		} else {
			formData.delete('video_file');
		}

		const imgFile = formData.get('image_file');
		if (imgFile instanceof File && imgFile.size === 0) {
			formData.delete('image_file');
		}

		const xhr = new XMLHttpRequest();

		xhr.upload.addEventListener('progress', (event) => {
			if (event.lengthComputable) {
				uploadProgress = Math.round((event.loaded * 100) / event.total);
			}
		});

		xhr.addEventListener('load', async () => {
			setTimeout(() => (uploadProgress = 0), 1000);
			try {
				let result;
				if (apiContext) {
					if (xhr.status >= 200 && xhr.status < 300) {
						const json = JSON.parse(xhr.responseText);
						result = { type: 'success', status: xhr.status, data: { success: true, lesson: json } };
					} else {
						let errData = {};
						try {
							errData = JSON.parse(xhr.responseText);
						} catch {
							console.log(xhr.responseText);
						}

						const errorMessage = parseBackendError(errData);
						toast.error(errorMessage);

						result = {
							type: 'failure',
							status: xhr.status > 0 ? xhr.status : 400,
							data: { error: errorMessage }
						};
					}
				} else {
					result = deserialize(xhr.responseText);
				}

				await applyAction(result);
				if (updateFn) await updateFn({ update: invalidateAll, result });

				if (result.type === 'success' && action.includes('create')) {
					resetForm(form);
				}
			} catch (err) {
				console.error(err);
			} finally {
				if (!updateFn) isSubmitting = false;
			}
		});

		xhr.addEventListener('error', () => {
			uploadProgress = 0;
			if (!updateFn) isSubmitting = false;
			toast.error('Xatolik yuz berdi');
		});

		if (apiContext) {
			const directUrl = `${apiContext.apiUrl}/courses/${apiContext.courseId}/modules/${formData.get('module_pk')}/lessons/`;
			xhr.open('POST', directUrl);
			xhr.setRequestHeader('Authorization', `Bearer ${apiContext.accessToken}`);
		} else {
			xhr.open('POST', form.action);
		}

		xhr.send(formData);
	}
</script>

<form
	method="POST"
	{action}
	onsubmit={handleCustomSubmit}
	enctype="multipart/form-data"
	class="mx-auto w-full max-w-[900px] font-sans"
>
	<!-- Creator Type Tab Panel (AI and Manual) -->
	<div class="creator-tabs">
		<button
			type="button"
			class="creator-tab {creatorTab === 'manual' ? 'active' : ''}"
			onclick={() => (creatorTab = 'manual')}
		>
			✍️ Standart Forma
		</button>
		<button
			type="button"
			class="creator-tab {creatorTab === 'ai' ? 'active' : ''}"
			onclick={() => (creatorTab = 'ai')}
		>
			⚡️ Tezkor AI Yaratuvchi
		</button>
	</div>

	<!-- AI Parsing Textarea block -->
	{#if creatorTab === 'ai'}
		<div class="ai-creator-container" in:fade={{ duration: 150 }}>
			<div class="ai-header">
				<div class="ai-sparkle-circle">
					<Sparkles size={20} class="text-primary" />
				</div>
				<div>
					<h3 class="ai-title">⚡️ Tezkor AI Dars Yaratuvchi</h3>
					<p class="ai-subtitle">
						Dars ma'lumotlarini matn shaklida yozing, AI avtomatik parsing qiladi, davomiylikni
						o'qiydi va rus tiliga o'giradi.
					</p>
				</div>
			</div>

			<textarea
				class="ai-textarea"
				bind:value={aiInputText}
				placeholder="Matn kiriting, masalan:&#10;Dars nomi: TailwindCSS utility sinflari&#10;Davomiyligi: 25.5 daqiqa&#10;Tavsif: Ushbu darsda biz TailwindCSS frameworkining asosiy sinflari bilan amaliy tanishamiz."
				rows="6"
			></textarea>

			<div class="mt-4 flex justify-end">
				<button type="button" class="ai-parse-btn" onclick={handleAiParse} disabled={isParsingAi}>
					{#if isParsingAi}
						<div class="spinner"></div>
						<span>AI tahlil qilmoqda...</span>
					{:else}
						<Sparkles size={14} />
						<span>AI yordamida to'ldirish</span>
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<div class="flex flex-col gap-5 {creatorTab !== 'manual' ? 'hidden' : ''}">
		<!-- Section: General Info -->
		<FormSection
			title={m.section_general_info ? m.section_general_info() : "Umumiy ma'lumotlar"}
			icon={Save}
		>
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-[1.5fr_1fr]">
				<ModuleSelector {modules} bind:modulePk />

				<div class="flex flex-col gap-1.5">
					<label
						for="les_order"
						class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
						>{m.label_order_index ? m.label_order_index() : 'Tartib raqami'}</label
					>
					<input
						type="number"
						id="les_order"
						name="order_index"
						disabled
						class="w-full cursor-not-allowed rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-muted disabled:opacity-60"
						value={modules.find((m) => m.id === modulePk)?.lessons_count + 1}
					/>
				</div>
			</div>
		</FormSection>

		<!-- Section: Multilingual Content -->
		<FormSection
			title={m.section_lesson_content ? m.section_lesson_content() : 'Dars mazmuni'}
			icon={CheckCircle2}
		>
			{#snippet extra()}
				<LanguageTabs bind:activeTab />
			{/snippet}

			<div class="mt-1">
				<!-- UZ Content -->
				<div class="space-y-4 {activeTab !== 'uz' ? 'hidden' : ''}" in:fade={{ duration: 150 }}>
					<div class="flex flex-col gap-1.5">
						<label
							for="les_title_uz"
							class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
							>{m.label_lesson_title_uz
								? m.label_lesson_title_uz()
								: "Dars nomi (O'zbekcha)"}</label
						>
						<input
							type="text"
							id="les_title_uz"
							name="title_uz"
							placeholder={m.placeholder_lesson_title_uz
								? m.placeholder_lesson_title_uz()
								: 'Masalan: Kirish qismi'}
							class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-primary"
							required
							bind:value={titleUz}
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<label
							for="les_desc_uz"
							class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
							>{m.label_lesson_desc_uz ? m.label_lesson_desc_uz() : "Tavsif (O'zbekcha)"}</label
						>
						<textarea
							id="les_desc_uz"
							name="description_uz"
							class="min-h-[100px] w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-primary"
							rows="3"
							placeholder={m.placeholder_lesson_desc_uz
								? m.placeholder_lesson_desc_uz()
								: "Dars haqida qisqacha ma'lumot..."}
							bind:value={descriptionUz}
						></textarea>
					</div>
				</div>

				<!-- RU Content -->
				<div class="space-y-4 {activeTab !== 'ru' ? 'hidden' : ''}" in:fade={{ duration: 150 }}>
					<div class="flex flex-col gap-1.5">
						<div class="label-container flex w-full items-center justify-between">
							<label
								for="les_title_ru"
								class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
								>{m.label_lesson_title_ru
									? m.label_lesson_title_ru()
									: 'Название урока (RU)'}</label
							>
							<button
								type="button"
								class="ai-translate-btn"
								onclick={() => handleTranslate(titleUz, 'title')}
								disabled={isTranslatingTitle}
							>
								{#if isTranslatingTitle}
									<div class="spinner spinner-white"></div>
								{:else}
									<Sparkles size={11} />
									<span>AI Tarjima</span>
								{/if}
							</button>
						</div>
						<input
							type="text"
							id="les_title_ru"
							name="title_ru"
							placeholder={m.placeholder_lesson_title_ru
								? m.placeholder_lesson_title_ru()
								: 'Например: Введение'}
							class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-primary"
							required
							bind:value={titleRu}
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<div class="label-container flex w-full items-center justify-between">
							<label
								for="les_desc_ru"
								class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
								>{m.label_lesson_desc_ru ? m.label_lesson_desc_ru() : 'Описание (RU)'}</label
							>
							<button
								type="button"
								class="ai-translate-btn"
								onclick={() => handleTranslate(descriptionUz, 'desc')}
								disabled={isTranslatingDesc}
							>
								{#if isTranslatingDesc}
									<div class="spinner spinner-white"></div>
								{:else}
									<Sparkles size={11} />
									<span>AI Tarjima</span>
								{/if}
							</button>
						</div>
						<textarea
							id="les_desc_ru"
							name="description_ru"
							class="min-h-[100px] w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-primary"
							rows="3"
							placeholder={m.placeholder_lesson_desc_ru
								? m.placeholder_lesson_desc_ru()
								: 'Краткое описание урока...'}
							bind:value={descriptionRu}
						></textarea>
					</div>
				</div>
			</div>
		</FormSection>

		<!-- Section: Media & Footer -->
		<FormSection
			title={m.section_media_duration ? m.section_media_duration() : 'Video va Davomiylik'}
			icon={Video}
		>
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<div class="flex flex-col gap-3">
					<span class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase">
						Dars videosi
					</span>
					<VideoUploadZone
						bind:videoFile
						bind:uploadProgress
						bind:autoDuration
						{isSubmitting}
						currentVideoUrl={lessonTarget.video_url}
					/>
				</div>

				<div class="flex flex-col gap-3">
					<label
						for="les_image"
						class="cursor-pointer pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
					>
						Dars muqovasi (Rasm)
					</label>
					<div
						class="relative flex min-h-[160px] flex-col items-center justify-center overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-primary/30
							   {imgPreview ? 'border-none p-0' : 'cursor-pointer p-6'}
							   {isSubmitting ? 'pointer-events-none opacity-80' : ''}"
					>
						<input
							type="file"
							id="les_image"
							name="image_file"
							accept="image/*"
							class="hidden"
							onchange={handleImageChange}
						/>

						{#if imgPreview}
							<div class="group relative h-full min-h-[160px] w-full overflow-hidden rounded-lg">
								<img
									src={imgPreview}
									alt="Lesson cover"
									class="h-full max-h-[160px] min-h-[160px] w-full object-cover"
								/>
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<label
										for="les_image"
										class="cursor-pointer rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-800 transition-all hover:scale-105"
									>
										O'zgartirish
									</label>
								</div>
							</div>
						{:else}
							<label
								for="les_image"
								class="flex w-full cursor-pointer flex-col items-center justify-center text-center"
							>
								<div class="mb-3 text-muted/30">
									<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<span class="mb-1 block text-sm font-bold text-foreground"> Rasm yuklash </span>
								<span class="text-[10px] font-medium text-muted"> PNG, JPG, WEBP (Maks: 5MB) </span>
							</label>
						{/if}
					</div>
				</div>
			</div>

			<div class="mt-4 flex flex-col gap-1.5">
				<label
					for="les_duration"
					class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
					>{m.label_duration_minutes ? m.label_duration_minutes() : 'Davomiyligi (Daqiqa)'}</label
				>
				<div class="relative">
					<input
						type="number"
						id="les_duration"
						name="duration"
						step="0.1"
						min="0"
						bind:value={autoDuration}
						class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm font-bold text-foreground transition-colors outline-none focus:border-primary"
					/>
					<div class="pointer-events-none absolute inset-y-0 right-4 flex items-center">
						<span class="text-xs font-bold text-muted uppercase">min</span>
					</div>
				</div>
			</div>

			<!-- Integrated Action Bar -->
			<div class="mt-6 flex items-center justify-end border-t border-slate-50 pt-6">
				<button
					type="submit"
					class="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-8 py-3 text-sm font-bold tracking-tight text-primary transition-all hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
						></div>
						<span>{m.text_publishing ? m.text_publishing() : 'Nashr qilinmoqda...'}</span>
					{:else}
						<span>
							{action.includes('create')
								? m.btn_add_lesson
									? m.btn_add_lesson()
									: "Darsni qo'shish"
								: m.profile_save
									? m.profile_save()
									: 'Saqlash'}
						</span>
						{#if action.includes('create')}
							<CheckCircle2 size={16} />
						{:else}
							<Save size={16} />
						{/if}
					{/if}
				</button>
			</div>
		</FormSection>
	</div>
</form>

<style>
	/* AI Creator Tabs */
	.creator-tabs {
		display: flex;
		background: var(--bg-surface);
		border: 1px solid var(--border-main);
		padding: 4px;
		border-radius: 18px;
		margin-bottom: 20px;
		gap: 4px;
	}

	.creator-tab {
		flex: 1;
		text-align: center;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 800;
		color: var(--text-muted);
		border-radius: 14px;
		cursor: pointer;
		border: none;
		background: transparent;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: inherit;
	}

	.creator-tab.active {
		background: var(--primary);
		color: white;
		box-shadow: 0 4px 12px rgba(155, 28, 72, 0.2);
	}

	/* AI Creator Section */
	.ai-creator-container {
		background: var(--bg-card);
		border: 1px solid rgba(155, 28, 72, 0.2);
		border-radius: 28px;
		padding: 24px;
		box-shadow: 0 10px 30px -10px rgba(155, 28, 72, 0.08);
		margin-bottom: 20px;
	}

	.ai-header {
		display: flex;
		gap: 16px;
		align-items: center;
		margin-bottom: 20px;
	}

	.ai-sparkle-circle {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		background: linear-gradient(135deg, rgba(155, 28, 72, 0.1) 0%, rgba(244, 63, 94, 0.1) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(155, 28, 72, 0.2);
	}

	.ai-title {
		font-size: 16px;
		font-weight: 900;
		color: var(--text-main);
		margin: 0 0 2px 0;
	}

	.ai-subtitle {
		font-size: 12px;
		font-weight: 500;
		color: var(--text-muted);
		margin: 0;
	}

	.ai-textarea {
		width: 100%;
		border: 1.5px solid var(--border-main);
		background: var(--bg-surface);
		border-radius: 18px;
		padding: 16px;
		font-size: 13.5px;
		color: var(--text-main);
		resize: vertical;
		outline: none;
		font-family: inherit;
		transition: border-color 0.2s ease;
	}

	.ai-textarea:focus {
		border-color: var(--primary);
	}

	.ai-parse-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--primary);
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 16px;
		font-size: 13px;
		font-weight: 800;
		cursor: pointer;
		box-shadow: 0 8px 16px -4px rgba(155, 28, 72, 0.3);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: inherit;
	}

	.ai-parse-btn:hover:not(:disabled) {
		background: var(--primary-hover);
		transform: translateY(-1.5px);
		box-shadow: 0 10px 20px -4px rgba(155, 28, 72, 0.4);
	}

	.ai-parse-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	/* AI Translation inside Fields */
	.label-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 2px;
	}

	.ai-translate-btn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		background: linear-gradient(135deg, rgba(155, 28, 72, 0.08) 0%, rgba(244, 63, 94, 0.08) 100%);
		border: 1px solid rgba(155, 28, 72, 0.2);
		color: var(--primary);
		padding: 4px 10px;
		border-radius: 10px;
		font-size: 10.5px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: inherit;
	}

	.ai-translate-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, rgba(155, 28, 72, 0.16) 0%, rgba(244, 63, 94, 0.16) 100%);
		transform: translateY(-1px);
	}

	.ai-translate-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		width: 11px;
		height: 11px;
		border: 2px solid var(--primary);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.spinner-white {
		border-color: var(--primary);
		border-top-color: transparent;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
