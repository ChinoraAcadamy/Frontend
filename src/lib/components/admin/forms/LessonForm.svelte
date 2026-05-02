<script lang="ts">
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { CheckCircle2, Save, Video } from 'lucide-svelte';
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
	let uploadProgress = $state(0);
	let autoDuration = $state(lessonTarget.duration || 0);

	function resetForm(form) {
		form.reset();
		videoFile = null;
		uploadProgress = 0;
		autoDuration = 0;
		modulePk = null;
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
	<div class="flex flex-col gap-5">
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
						class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-primary"
						value={lessonTarget.order_index ?? 1}
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
							value={lessonTarget.title_uz || lessonTarget.title || ''}
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
							>{lessonTarget.description_uz || lessonTarget.description || ''}</textarea
						>
					</div>
				</div>

				<!-- RU Content -->
				<div class="space-y-4 {activeTab !== 'ru' ? 'hidden' : ''}" in:fade={{ duration: 150 }}>
					<div class="flex flex-col gap-1.5">
						<label
							for="les_title_ru"
							class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
							>{m.label_lesson_title_ru ? m.label_lesson_title_ru() : 'Название урока (RU)'}</label
						>
						<input
							type="text"
							id="les_title_ru"
							name="title_ru"
							placeholder={m.placeholder_lesson_title_ru
								? m.placeholder_lesson_title_ru()
								: 'Например: Введение'}
							class="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-primary"
							required
							value={lessonTarget.title_ru || lessonTarget.title || ''}
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<label
							for="les_desc_ru"
							class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase"
							>{m.label_lesson_desc_ru ? m.label_lesson_desc_ru() : 'Описание (RU)'}</label
						>
						<textarea
							id="les_desc_ru"
							name="description_ru"
							class="min-h-[100px] w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-primary"
							rows="3"
							placeholder={m.placeholder_lesson_desc_ru
								? m.placeholder_lesson_desc_ru()
								: 'Краткое описание урока...'}
							>{lessonTarget.description_ru || lessonTarget.description || ''}</textarea
						>
					</div>
				</div>
			</div>
		</FormSection>

		<!-- Section: Media & Footer -->
		<FormSection
			title={m.section_media_duration ? m.section_media_duration() : 'Video va Davomiylik'}
			icon={Video}
		>
			<VideoUploadZone
				bind:videoFile
				bind:uploadProgress
				bind:autoDuration
				{isSubmitting}
				currentVideoUrl={lessonTarget.video_url}
			/>

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
</style>
