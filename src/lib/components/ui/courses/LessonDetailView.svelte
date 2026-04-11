<script>
	import { enhance } from '$app/forms';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import { Upload, File as FileIcon } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import 'plyr/dist/plyr.css';

	/**
	 * @typedef {Object} Props
	 * @property {any} lesson
	 */

	/** @type {Props} */
	let { lesson } = $props();

	// State'lar
	let selectedFile = $state(null);
	let isDragging = $state(false);
	let isSubmitting = $state(false);
	let isSubmittingComplete = $state(false);

	// Video player state
	/** @type {HTMLVideoElement} */
	let videoElement = $state(null);
	/** @type {any} */
	let player = $state(null);

	// Xavfsizlik qoidalari
	function handleKeydown(e) {
		// F12 (123), Ctrl+Shift+I (73), Ctrl+Shift+J (74), Ctrl+U (85)
		if (
			e.keyCode === 123 ||
			(e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
			(e.ctrlKey && e.keyCode === 85) ||
			(e.ctrlKey && e.keyCode === 83) // Ctrl+S (Save page)
		) {
			e.preventDefault();
			return false;
		}
	}

	onMount(async () => {
		// Bloklash funksiyalari
		document.addEventListener('keydown', handleKeydown);

		// Plyr initsializatsiya
		if (videoElement) {
			const Plyr = (await import('plyr')).default;
			player = new Plyr(videoElement, {
				controls: [
					'play-large',
					'play',
					'progress',
					'current-time',
					'mute',
					'volume',
					'fullscreen'
				],
				disableContextMenu: true, // Custom menyuni olib tashlash
				hideControls: true,
				keyboard: { focused: false, global: false } // Klaviaturadan videoni "otish" xavfi
			});

			if (lesson?.id) {
				const storageKey = `chinora_video_progress_${lesson.id}`;

				// Yuklash (resume)
				player.once('canplay', () => {
					const savedProgress = localStorage.getItem(storageKey);
					if (savedProgress && !isNaN(Number(savedProgress))) {
						player.currentTime = parseFloat(savedProgress);
					}
				});

				// Saqlash
				player.on('timeupdate', () => {
					if (player.currentTime > 0 && player.duration > 0) {
						localStorage.setItem(storageKey, player.currentTime.toString());
					}
				});
			}
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('keydown', handleKeydown);
		}
		if (player) {
			player.destroy();
		}
	});

	// Darsni yakunlash
	async function markComplete() {
		if (!lesson || !lesson.id) return;
		isSubmittingComplete = true;

		const watched_seconds = player ? Math.floor(player.currentTime) : 0;

		try {
			const res = await fetch('/api/progress/complete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lesson_id: lesson.id, watched_seconds })
			});
			if (!res.ok) {
				console.log(await res.json());
				throw new Error('Xatolik yuz berdi');
			}
			toast.success('Dars muvaffaqiyatli yakunlandi!');
			// Agar muvaffaqiyatli bo'lsa, dars saqlangan progressini faqatgina o'chirish / o'chirmaslikni hal qilish
			// localStorage.removeItem(`chinora_video_progress_${lesson.id}`);
		} catch (e) {
			console.error(e);
			toast.error('Darsni yakunlashda xatolik yuz berdi.');
		} finally {
			isSubmittingComplete = false;
		}
	}

	// Fayl yuklash mantig'i
	/** @param {DragEvent} e */
	function handleFileDrop(e) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files?.length) {
			// @ts-ignore
			selectedFile = e.dataTransfer.files[0];
		}
	}

	/** @param {Event} e */
	function handleFileSelect(e) {
		const input = /** @type {HTMLInputElement} */ (e.target);
		if (input.files?.length) {
			// @ts-ignore
			selectedFile = input.files[0];
		}
	}

	/** @param {DragEvent} e */
	function handleDragOver(e) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	// Topshiriqni yuborish
	function submitAssignment() {
		isSubmitting = true;
		return async ({ update }) => {
			isSubmitting = false;
			selectedFile = null; // Muvaffaqiyatli bo'lsa tozalaymiz
			await update();
		};
	}
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

<div class="mx-auto max-w-7xl px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
	<nav class="mb-6 flex items-center text-sm font-medium text-slate-500">
		<Breadcrumb />
	</nav>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
		<div class="space-y-6">
			<div class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
				<div
					class="group relative aspect-video overflow-hidden rounded-xl bg-slate-900"
					style="--plyr-color-main: #ed4b72;"
				>
					<!-- Svelte ignore removed -> no warn needed now that plyr takes over or we just provide track -->
					<video
						bind:this={videoElement}
						class="plyr-video h-full w-full object-cover"
						poster={lesson.image}
						controlsList="nodownload noplaybackrate"
						disablePictureInPicture
						oncontextmenu={(e) => e.preventDefault()}
						ondragstart={(e) => e.preventDefault()}
						crossorigin="anonymous"
					>
						<!-- Agar lesson.video_url bo'lsa uni proxy orgali o'tkazamiz, yo'qsa shunchaki ko'rsatamiz -->
						<source
							src={`/api/video?url=${encodeURIComponent(lesson.video_url)}`}
							type="video/mp4"
						/>
						<!-- Accessibility uchun empty track -->
						<track kind="captions" />
						Brauzeringiz videoni qo'llab-quvvatlamaydi.
					</video>

					<!-- Qo'shimcha xavfsizlik: Videoning aniq ustidagi ko'rinmas qatlam (faqat plyr blocklaridan tashqari) -->
					<div
						role="application"
						class="pointer-events-none absolute inset-0 z-5"
						oncontextmenu={(e) => e.preventDefault()}
					></div>
				</div>
			</div>

			<!-- Student only or both? Both can mark as complete but admin doesn't need to -->
			<button
				onclick={markComplete}
				disabled={isSubmittingComplete}
				class="flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#FA2E69] px-6 py-4 font-semibold text-white shadow-[0_8px_20px_-6px_rgba(250,46,105,0.4)] transition-all duration-300 hover:bg-[#D81B53] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
			>
				{#if isSubmittingComplete}
					<span
						class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></span>
					<span>Yuborilmoqda...</span>
				{:else}
					<span>Darsni yakunlash (Mark as complete)</span>
				{/if}
			</button>

			<div class="pt-2">
				<span class="mb-1 block text-xs font-bold tracking-wider text-slate-400 uppercase"
					>Dars ma'lumotlari</span
				>
				<h1 class="mb-3 text-2xl font-bold text-slate-900 md:text-3xl">{lesson.title}</h1>
				<p class="text-[15px] leading-relaxed text-slate-600">
					{lesson.description}
				</p>
			</div>
		</div>

		{#if lesson.assignments && lesson.assignments.length > 0}
			<div
				class="sticky top-6 h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
			>
				<div class="mb-2 flex items-center justify-between">
					<h2 class="text-xl font-bold text-slate-900">{lesson.assignments[0].title}</h2>
					<span class="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">VASIFA</span
					>
				</div>
				<p class="mb-6 text-sm text-slate-500">
					Urinishlar: {lesson.assignments[0].max_attempts} marta (fayl yuklash)
				</p>

				<form
					method="POST"
					action="?/uploadAssignment"
					use:enhance={submitAssignment}
					enctype="multipart/form-data"
				>
					<label
						class="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all duration-200
                        {isDragging
							? 'border-[#FA2E69] bg-[#FA2E69]/5'
							: 'border-slate-300 hover:border-[#FA2E69] hover:bg-slate-50'}"
						ondragover={handleDragOver}
						ondragleave={handleDragLeave}
						ondrop={handleFileDrop}
						role="presentation"
					>
						<input type="file" name="file" class="hidden" onchange={handleFileSelect} required />

						{#if selectedFile}
							<div class="flex flex-col items-center text-center" in:fade>
								<div
									class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500"
								>
									<FileIcon size={24} />
								</div>
								<span class="line-clamp-1 text-sm font-semibold text-slate-800"
									>{selectedFile.name}</span
								>
								<span class="mt-1 text-xs text-slate-500"
									>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span
								>
							</div>
						{:else}
							<Upload
								size={32}
								strokeWidth={1.5}
								class="mb-4 text-slate-400 transition-colors group-hover:text-[#FA2E69]"
							/>
							<span class="mb-1 text-[15px] font-medium text-slate-700">Faylni tortib tashlang</span
							>
							<span class="text-xs text-slate-400">yoki tanlash uchun bosing</span>
						{/if}
					</label>

					<button
						type="submit"
						disabled={!selectedFile || isSubmitting}
						class="mt-4 w-full rounded-[12px] bg-[#FA2E69] px-6 py-3 font-semibold text-white shadow-[0_6px_16px_-4px_rgba(250,46,105,0.3)] transition-all duration-200 hover:bg-[#D81B53] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
					</button>
				</form>

				{#if lesson.assignments[0].submissions}
					<div class="mt-8">
						<h3 class="mb-4 text-[15px] font-bold text-slate-900">Oldingi urinishlar</h3>

						<div class="space-y-4">
							{#each lesson.assignments[0].submissions as sub (sub)}
								<div
									class="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
									transition:slide
								>
									<div class="mb-2 flex items-center justify-between text-[13px]">
										<div class="flex items-center gap-4">
											<span class="text-xs font-medium text-slate-800"
												>{new Date().toLocaleDateString('uz-UZ')}</span
											>
										</div>
										<div class="flex items-center gap-4">
											<span class="font-semibold text-slate-900">{sub.score} / 100</span>
											{#if sub.status === 'Pending'}
												<span
													class="rounded-md bg-[#FFF9C4] px-2.5 py-1 text-xs font-bold text-[#F57F17]"
													>Kutilmoqda</span
												>
											{:else if sub.status === 'Graded'}
												<span
													class="flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700"
												>
													Baholandi
												</span>
											{/if}
										</div>
									</div>

									{#if sub.feedback}
										<div class="relative mt-3 rounded-lg bg-slate-50 p-3">
											<span
												class="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase"
												>Fikr:</span
											>
											<div class="flex gap-2">
												<p class="mt-1 text-xs font-medium text-slate-600 italic">
													"{sub.feedback}"
												</p>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
