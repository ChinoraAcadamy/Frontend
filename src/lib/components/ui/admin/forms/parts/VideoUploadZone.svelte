<script lang="ts">
	import { UploadCloud, Video, X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { getVideoDuration } from '$lib/utils/lessonForm';
	import * as m from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';

	let {
		videoFile = $bindable(null),
		uploadProgress = $bindable(0),
		autoDuration = $bindable(0),
		isSubmitting = false,
		currentVideoUrl = null
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
			? 'border-primary bg-muted/5'
			: 'border-border bg-surface hover:border-primary/30'}
                {videoFile ? 'min-h-0 border-none p-0' : 'cursor-pointer'}
                {isSubmitting ? 'pointer-events-none opacity-80' : ''}"
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
				class="flex w-full items-center gap-4 rounded-lg border border-border bg-muted/5 p-4"
				in:fade
			>
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-surface text-muted"
				>
					<Video size={20} />
				</div>
				<div class="min-w-0 flex-1">
					<span class="mb-1 block truncate text-sm font-bold text-foreground">{videoFile.name}</span>
					<div class="flex gap-2">
						<span class="text-[10px] font-bold tracking-tight text-muted uppercase">
							{(videoFile.size / (1024 * 1024)).toFixed(1)} MB
						</span>
						<span class="text-[10px] font-bold tracking-tight text-primary uppercase">
							{autoDuration} min
						</span>
					</div>
				</div>
				<button
					type="button"
					class="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-muted/50 transition-colors hover:text-red-500 disabled:opacity-50"
					onclick={() => {
						if (isSubmitting) return;
						videoFile = null;
						autoDuration = 0;
					}}
					disabled={isSubmitting}
					title={m.admin_students_delete ? m.admin_students_delete() : 'O\'chirish'}
				>
					<X size={14} />
				</button>
			</div>
		{:else if currentVideoUrl}
			<div
				class="flex w-full items-center gap-4 rounded-lg border border-border bg-muted/5 p-4"
				in:fade
			>
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-surface text-primary"
				>
					<Video size={20} />
				</div>
				<div class="min-w-0 flex-1">
					<span class="mb-0.5 block text-[10px] font-black tracking-widest text-muted uppercase">
						{m.label_current_video ? m.label_current_video() : 'Mavjud video'}
					</span>
					<a href={resolve(currentVideoUrl)} target="_blank" class="block truncate text-sm font-bold text-primary hover:underline">
						{currentVideoUrl.split('/').pop()}
					</a>
				</div>
				<label
					for="les_video"
					class="flex h-8 items-center justify-center rounded border border-border bg-surface px-3 text-[11px] font-bold text-muted transition-colors hover:border-primary/30 hover:text-primary cursor-pointer disabled:opacity-50 {isSubmitting ? 'pointer-events-none' : ''}"
				>
					{m.btn_replace_video ? m.btn_replace_video() : 'O\'zgartirish'}
				</label>
			</div>
		{:else}
			<label
				for="les_video"
				class="group flex w-full cursor-pointer flex-col items-center px-5 py-8"
			>
				<div class="mb-4 text-muted/30 transition-colors group-hover:text-muted/50">
					<UploadCloud size={32} />
				</div>
				<div class="mb-4 text-center">
					<span class="mb-0.5 block text-sm font-bold text-foreground">
						{m.text_upload_video ? m.text_upload_video() : 'Video yuklash'}
					</span>
					<span class="text-[11px] font-medium text-muted">
						{m.text_file_types_hint ? m.text_file_types_hint() : 'MP4, MOV, WEBM (Maks: 2GB)'}
					</span>
				</div>
				<span
					class="rounded border border-border bg-surface px-4 py-1.5 text-[11px] font-bold tracking-wider text-muted uppercase shadow-sm transition-colors hover:border-primary/30"
				>
					{m.btn_select_file ? m.btn_select_file() : 'Faylni tanlash'}
				</span>
			</label>
		{/if}

		{#if uploadProgress > 0}
			<div
				class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/95 p-6"
				in:fade
			>
				<div class="mb-4 flex flex-col items-center">
					<span class="text-2xl leading-none font-black text-foreground">{uploadProgress}%</span>
					<span class="mt-1 text-[10px] font-bold tracking-widest text-muted uppercase">
						{m.text_uploading ? m.text_uploading() : 'Yuklanmoqda'}
					</span>
				</div>
				<div class="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-muted/10">
					<div
						class="h-full bg-primary transition-all duration-300"
						style="width: {uploadProgress}%"
					></div>
				</div>
			</div>
		{/if}
	</div>

	{#if !videoFile}
		<div class="flex items-center gap-2 px-1">
			<div
				class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-muted/20 text-[9px] font-black text-foreground"
			>
				!
			</div>
			<p class="text-[11px] font-medium text-muted italic">
				{m.text_duration_auto_hint ? m.text_duration_auto_hint() : 'Video davomiyligi avtomatik hisoblanadi'}
			</p>
		</div>
	{/if}
</div>
