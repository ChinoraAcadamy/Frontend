<script lang="ts">
	import { UploadCloud, Video, X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { getVideoDuration } from '$lib/utils/lessonForm';
	import * as m from '$lib/paraglide/messages.js';

	let {
		videoFile = $bindable(null),
		uploadProgress = $bindable(0),
		autoDuration = $bindable(0),
		// isSubmitting = false
	} = $props();

	let isDragging = $state(false);

	function handleFile(file) {
		if (file && file.type.startsWith('video/')) {
			videoFile = file;
			getVideoDuration(file).then((duration) => {
				autoDuration = duration;
			});
		}
	}

	function handleDrop(e) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files?.[0];
		handleFile(file);
	}

	function handleSelect(e) {
		const file = e.target.files?.[0];
		handleFile(file);
	}
</script>

<div class="flex flex-col gap-3">
	<div
		class="relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-lg border transition-colors
               {isDragging
			? 'border-[#fa2e69] bg-slate-50'
			: 'border-slate-200 bg-white hover:border-slate-300'}
               {videoFile ? 'min-h-0 border-none p-0' : 'cursor-pointer'}"
		ondragenter={(e) => {
			e.preventDefault();
			isDragging = true;
		}}
		ondragleave={(e) => {
			e.preventDefault();
			isDragging = false;
		}}
		ondragover={(e) => e.preventDefault()}
		ondrop={handleDrop}
		role="presentation"
	>
		<input type="file" id="les_video" accept="video/*" class="hidden" onchange={handleSelect} />

		{#if videoFile}
			<div
				class="flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
				in:fade
			>
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-slate-400"
				>
					<Video size={20} />
				</div>
				<div class="min-w-0 flex-1">
					<span class="mb-1 block truncate text-sm font-bold text-slate-700">{videoFile.name}</span>
					<div class="flex gap-2">
						<span class="text-[10px] font-bold tracking-tight text-slate-400 uppercase">
							{(videoFile.size / (1024 * 1024)).toFixed(1)} MB
						</span>
						<span class="text-[10px] font-bold tracking-tight text-[#fa2e69] uppercase">
							{autoDuration} min
						</span>
					</div>
				</div>
				<button
					type="button"
					class="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-300 transition-colors hover:text-red-500"
					onclick={() => {
						videoFile = null;
						autoDuration = 0;
					}}
					title={m.admin_students_delete ? m.admin_students_delete() : 'O\'chirish'}
				>
					<X size={14} />
				</button>
			</div>
		{:else}
			<label
				for="les_video"
				class="group flex w-full cursor-pointer flex-col items-center px-5 py-8"
			>
				<div class="mb-4 text-slate-300 transition-colors group-hover:text-slate-400">
					<UploadCloud size={32} />
				</div>
				<div class="mb-4 text-center">
					<span class="mb-0.5 block text-sm font-bold text-slate-600">
						{m.text_upload_video ? m.text_upload_video() : 'Video yuklash'}
					</span>
					<span class="text-[11px] font-medium text-slate-400">
						{m.text_file_types_hint ? m.text_file_types_hint() : 'MP4, MOV, WEBM (Maks: 2GB)'}
					</span>
				</div>
				<span
					class="rounded border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase shadow-sm transition-colors hover:border-slate-300"
				>
					{m.btn_select_file ? m.btn_select_file() : 'Faylni tanlash'}
				</span>
			</label>
		{/if}

		{#if uploadProgress > 0}
			<div
				class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 p-6"
				in:fade
			>
				<div class="mb-4 flex flex-col items-center">
					<span class="text-2xl leading-none font-black text-slate-700">{uploadProgress}%</span>
					<span class="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
						{m.text_uploading ? m.text_uploading() : 'Yuklanmoqda'}
					</span>
				</div>
				<div class="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-slate-100">
					<div
						class="h-full bg-[#fa2e69] transition-all duration-300"
						style="width: {uploadProgress}%"
					></div>
				</div>
			</div>
		{/if}
	</div>

	{#if !videoFile}
		<div class="flex items-center gap-2 px-1">
			<div
				class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black text-white"
			>
				!
			</div>
			<p class="text-[11px] font-medium text-slate-400 italic">
				{m.text_duration_auto_hint ? m.text_duration_auto_hint() : 'Video davomiyligi avtomatik hisoblanadi'}
			</p>
		</div>
	{/if}
</div>
