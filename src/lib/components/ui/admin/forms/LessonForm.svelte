<script lang="ts">
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { CheckCircle2, Save, Video } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

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
						} catch (e) {
							console.log(e);
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
		<FormSection title="Umumiy ma'lumotlar" icon={Save}>
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-[1.5fr_1fr]">
				<ModuleSelector {modules} bind:modulePk />

				<div class="flex flex-col gap-1.5">
					<label
						for="les_order"
						class="pl-0.5 text-[12px] font-bold tracking-wider text-slate-400 uppercase"
						>Tartib raqami</label
					>
					<input
						type="number"
						id="les_order"
						name="order_index"
						class="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors outline-none focus:border-[#fa2e69]"
						value={lessonTarget.order_index ?? 1}
					/>
				</div>
			</div>
		</FormSection>

		<!-- Section: Multilingual Content -->
		<FormSection title="Dars mazmuni" icon={CheckCircle2}>
			{#snippet extra()}
				<LanguageTabs bind:activeTab />
			{/snippet}

			<div class="mt-1">
				<!-- UZ Content -->
				<div class="space-y-4 {activeTab !== 'uz' ? 'hidden' : ''}" in:fade={{ duration: 150 }}>
					<div class="flex flex-col gap-1.5">
						<label
							for="les_title_uz"
							class="pl-0.5 text-[12px] font-bold tracking-wider text-slate-400 uppercase"
							>Dars nomi (O'zbekcha)</label
						>
						<input
							type="text"
							id="les_title_uz"
							name="title_uz"
							placeholder="Masalan: Kirish qismi"
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-colors outline-none focus:border-[#fa2e69]"
							required
							value={lessonTarget.title_uz || lessonTarget.title || ''}
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<label
							for="les_desc_uz"
							class="pl-0.5 text-[12px] font-bold tracking-wider text-slate-400 uppercase"
							>Tavsif (O'zbekcha)</label
						>
						<textarea
							id="les_desc_uz"
							name="description_uz"
							class="min-h-[100px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#fa2e69]"
							rows="3"
							placeholder="Dars haqida qisqacha ma'lumot..."
							>{lessonTarget.description_uz || lessonTarget.description || ''}</textarea
						>
					</div>
				</div>

				<!-- RU Content -->
				<div class="space-y-4 {activeTab !== 'ru' ? 'hidden' : ''}" in:fade={{ duration: 150 }}>
					<div class="flex flex-col gap-1.5">
						<label
							for="les_title_ru"
							class="pl-0.5 text-[12px] font-bold tracking-wider text-slate-400 uppercase"
							>Название урока (RU)</label
						>
						<input
							type="text"
							id="les_title_ru"
							name="title_ru"
							placeholder="Например: Введение"
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#fa2e69]"
							required
							value={lessonTarget.title_ru || lessonTarget.title || ''}
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<label
							for="les_desc_ru"
							class="pl-0.5 text-[12px] font-bold tracking-wider text-slate-400 uppercase"
							>Описание (RU)</label
						>
						<textarea
							id="les_desc_ru"
							name="description_ru"
							class="min-h-[100px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#fa2e69]"
							rows="3"
							placeholder="Краткое описание урока..."
							>{lessonTarget.description_ru || lessonTarget.description || ''}</textarea
						>
					</div>
				</div>
			</div>
		</FormSection>

		<!-- Section: Media & Footer -->
		<FormSection title="Video va Davomiylik" icon={Video}>
			<VideoUploadZone bind:videoFile bind:uploadProgress bind:autoDuration {isSubmitting} />
			
			<div class="mt-4 flex flex-col gap-1.5">
				<label
					for="les_duration"
					class="pl-0.5 text-[12px] font-bold tracking-wider text-slate-400 uppercase"
					>Davomiyligi (Daqiqa)</label
				>
				<div class="relative">
					<input
						type="number"
						id="les_duration"
						name="duration"
						step="0.1"
						min="0"
						bind:value={autoDuration}
						class="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors outline-none focus:border-[#fa2e69]"
					/>
					<div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
						<span class="text-xs font-bold text-slate-400 uppercase">min</span>
					</div>
				</div>
			</div>

			<!-- Integrated Action Bar -->
			<div class="mt-6 flex items-center justify-end border-t border-slate-50 pt-6">
				<button
					type="submit"
					class="flex items-center justify-center gap-2 rounded-lg bg-rose-50 px-8 py-3 text-sm font-bold tracking-tight text-[#fa2e69] transition-all hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-[#fa2e69]/20 border-t-[#fa2e69]"
						></div>
						<span>Nashr qilinmoqda...</span>
					{:else}
						<span>{action.includes('create') ? "Darsni qo'shish" : 'Saqlash'}</span>
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
