<script>
	import { enhance } from '$app/forms';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import { Upload, File as FileIcon } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import 'plyr/dist/plyr.css';

	let { lesson, nextLesson = null } = $props();

	// --- Helpers ---
	const getProxiedUrl = (url) =>
		url?.startsWith('http') ? `/api/video?url=${encodeURIComponent(url)}` : url || '';

	const getProgressKey = (id) => `chinora_video_progress_${id}`;

	// --- Derived State ---
	const userIdent = $derived(
		$page.data.user?.username || $page.data.user?.phone_number || 'Chinora Student'
	);

	const videoSources = $derived(() => {
		if (lesson.video_qualities?.length > 0) {
			return lesson.video_qualities.map((q) => ({
				src: getProxiedUrl(q.url),
				type: 'video/mp4',
				size: q.size
			}));
		}
		return [{ src: getProxiedUrl(lesson.video_url), type: 'video/mp4', size: 720 }];
	});

	const videoTracks = $derived(() => {
		if (lesson.subtitle_url) {
			return [
				{
					kind: 'captions',
					label: "O'zbekcha",
					srclang: 'uz',
					src: lesson.subtitle_url,
					default: true
				}
			];
		}
		return [];
	});

	// --- Video Player State ---
	let videoElement = $state(null);
	let player = $state(null);

	// --- Security & UI State ---
	let watermarkPos = $state({ top: 10, left: 10 });
	let showWatermark = $state(true);
	let watermarkInterval = $state(null);

	// --- Assignment & Progress State ---
	let selectedFile = $state(null);
	let isDragging = $state(false);
	let isSubmitting = $state(false);
	let isSubmittingComplete = $state(false);

	// --- Security Handlers ---
	function handleKeydown(e) {
		const forbidden = [123, 44]; // F12, PrintScreen
		const ctrlCombinations = [73, 74, 85, 83]; // I, J, U, S
		if (
			forbidden.includes(e.keyCode) ||
			(e.ctrlKey && e.shiftKey && ctrlCombinations.slice(0, 2).includes(e.keyCode)) ||
			(e.ctrlKey && ctrlCombinations.slice(2).includes(e.keyCode))
		) {
			e.preventDefault();
			if (e.keyCode === 44) toast.error('Screenshot taqiqlangan!');
			return false;
		}
	}

	function handleOrientation() {
		if (!player || !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return;
		if (window.innerHeight < window.innerWidth && !player.fullscreen.active) {
			player.fullscreen.enter()?.catch?.(() => {});
		}
	}

	function handleVisibility() {
		if (document.hidden && player?.playing) player.pause();
	}

	function moveWatermark() {
		watermarkPos = { top: Math.random() * 80 + 5, left: Math.random() * 80 + 5 };
		showWatermark = false;
		setTimeout(() => (showWatermark = true), 100);
	}

	// --- Lifecycle & Effects ---
	onMount(async () => {
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('visibilitychange', handleVisibility);
		window.addEventListener('blur', () => player?.pause());
		window.addEventListener('resize', handleOrientation);
		window.addEventListener('orientationchange', handleOrientation);
		watermarkInterval = setInterval(moveWatermark, 10000);

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
					'captions',
					'settings',
					'pip',
					'airplay',
					'fullscreen'
				],
				settings: lesson.video_qualities?.length > 0 ? ['quality', 'speed'] : ['speed'],
				quality: {
					default: 720,
					options:
						lesson.video_qualities?.length > 0 ? lesson.video_qualities.map((q) => q.size) : [720],
					forced: true
				},
				captions: { active: true, update: true, language: 'uz' },
				speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
				keyboard: { focused: false, global: false }
			});
			document.documentElement.style.setProperty('--plyr-color-main', '#ed4b72');
		}
	});

	let lastLoadedLessonId = null;

	$effect(() => {
		if (player && lesson.id && lastLoadedLessonId !== lesson.id) {
			lastLoadedLessonId = lesson.id;

			const storageKey = getProgressKey(lesson.id);
			const saved = localStorage.getItem(storageKey);

			let isRestored = false;
			let expectedTime = 0;

			if (saved && !isNaN(Number(saved))) {
				expectedTime = parseFloat(saved);
			} else {
				isRestored = true;
			}

			// Yagona manba (Single source of truth) qilib video manbasini belgilaymiz
			player.source = {
				type: 'video',
				title: lesson.title,
				sources: videoSources(),
				poster: lesson.image,
				tracks: videoTracks()
			};

			const resumePlayback = () => {
				if (!isRestored && expectedTime > 2) {
					if (player.duration > 0 || player.media?.duration > 0) {
						player.currentTime = expectedTime;
						isRestored = true;
					}
				} else {
					isRestored = true;
				}
			};

			player.on('loadedmetadata', resumePlayback);
			player.on('canplay', resumePlayback);
			player.on('playing', resumePlayback);

			let saveInterval;

			const startAutoSave = () => {
				if (saveInterval) clearInterval(saveInterval);
				saveInterval = setInterval(() => {
					if (isRestored && player.currentTime > 0) {
						localStorage.setItem(storageKey, player.currentTime.toString());
					}
				}, 3000); // Har 3 soniyada yoziladi
			};

			const stopAutoSave = () => {
				if (saveInterval) clearInterval(saveInterval);
				if (isRestored && player.currentTime > 0) {
					localStorage.setItem(storageKey, player.currentTime.toString());
				}
			};

			player.on('playing', startAutoSave);
			player.on('pause', stopAutoSave);
			player.on('ended', stopAutoSave);

			return () => {
				stopAutoSave();
				player.off('loadedmetadata', resumePlayback);
				player.off('canplay', resumePlayback);
				player.off('playing', resumePlayback);
				player.off('playing', startAutoSave);
				player.off('pause', stopAutoSave);
				player.off('ended', stopAutoSave);
			};
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('visibilitychange', handleVisibility);
			window.removeEventListener('blur', () => player?.pause());
			window.removeEventListener('resize', handleOrientation);
			window.removeEventListener('orientationchange', handleOrientation);
		}
		if (watermarkInterval) clearInterval(watermarkInterval);
		player?.destroy();
	});

	// --- Actions ---
	async function markComplete() {
		if (!lesson?.id) return;
		isSubmittingComplete = true;
		try {
			const res = await fetch('/api/progress/complete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					lesson_id: lesson.id,
					watched_seconds: Math.floor(player?.currentTime || 0)
				})
			});
			if (!res.ok) throw new Error('Xatolik');
			toast.success('Dars muvaffaqiyatli yakunlandi!');
			if (nextLesson) {
				setTimeout(() => {
					const url = `/kurslarim/${$page.params.id}/lessons/${nextLesson.id}?module_id=${nextLesson.moduleId || $page.url.searchParams.get('module_id')}`;
					/** @type {any} */
					const route = url;
					goto(resolve(route));
				}, 1000);
			}
		} catch (e) {
			toast.error(`Xatolik yuz berdi: ${e}`);
		} finally {
			isSubmittingComplete = false;
		}
	}

	const handleFileSelect = (e) => {
		selectedFile = e.target.files?.[0] || null;
	};
	const handleFileDrop = (e) => {
		e.preventDefault();
		isDragging = false;
		selectedFile = e.dataTransfer.files?.[0] || null;
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		isDragging = true;
	};
	const handleDragLeave = () => {
		isDragging = false;
	};
	const submitAssignment = () => {
		isSubmitting = true;
		return async ({ result, update }) => {
			isSubmitting = false;
			if (result.type === 'success') {
				toast.success('Topshiriq muvaffaqiyatli yuborildi!');
				selectedFile = null;
				// Formani tozalash
				const form = document.querySelector('form[action="?/uploadAssignment"]');
				if (form) /** @type {HTMLFormElement} */ (form).reset();
			} else if (result.type === 'failure' || (result.type === 'data' && result.data?.error)) {
				const errorMsg = result.data?.error || 'Xatolik yuz berdi';
				toast.error(errorMsg);
			}
			await update();
		};
	};
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
					class="group relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-2xl transition-all duration-500"
				>
					{#if !player}
						<div
							class="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
							transition:fade
						>
							<div
								class="h-10 w-10 animate-spin rounded-full border-4 border-[#ed4b72] border-t-transparent"
							></div>
						</div>
					{/if}

					<video
						bind:this={videoElement}
						class="plyr-video h-full w-full opacity-0 transition-opacity duration-300 {player
							? 'opacity-100'
							: ''}"
						poster={lesson.image}
						playsinline
						crossorigin="anonymous"
					>
						<!-- Source va track ma'lumotlari to'liq Plyr (JS) orqali boshqariladi -->
						Brauzeringiz videoni qo'llab-quvvatlamaydi.
					</video>

					<!-- Qo'shimcha xavfsizlik: Videoning aniq ustidagi ko'rinmas qatlam -->
					<div
						role="application"
						class="pointer-events-none absolute inset-0 z-5"
						oncontextmenu={(e) => e.preventDefault()}
					></div>

					<!-- Watermark -->
					{#if showWatermark}
						<div
							class="pointer-events-none absolute z-10 text-[10px] font-bold text-white/20 transition-all duration-1000 select-none"
							style="top: {watermarkPos.top}%; left: {watermarkPos.left}%;"
						>
							{userIdent}
						</div>
					{/if}
				</div>
			</div>

			<!-- Student only or both? Both can mark as complete but admin doesn't need to -->
			{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
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
						<span>Darsni yakunlash</span>
					{/if}
				</button>
			{/if}

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
					class="space-y-4"
				>
					<input type="hidden" name="assignment" value={lesson.assignments[0].id} />

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

					<div class="space-y-2">
						<label for="text_answer" class="text-sm font-semibold text-slate-700"
							>Qo'shimcha izoh (ixtiyoriy)</label
						>
						<textarea
							id="text_answer"
							name="text_answer"
							rows="3"
							placeholder="Topshiriq yuzasidan izoh qoldiring..."
							class="w-full rounded-xl border border-slate-200 p-3 text-sm transition-all outline-none focus:border-[#FA2E69] focus:ring-1 focus:ring-[#FA2E69]"
						></textarea>
					</div>

					<button
						type="submit"
						disabled={!selectedFile || isSubmitting}
						class="w-full rounded-[12px] bg-[#FA2E69] px-6 py-3 font-semibold text-white shadow-[0_6px_16px_-4px_rgba(250,46,105,0.3)] transition-all duration-200 hover:bg-[#D81B53] disabled:cursor-not-allowed disabled:opacity-50"
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
												>{new Date(sub.submitted_at || Date.now()).toLocaleDateString(
													'uz-UZ'
												)}</span
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

<style>
	/* Plyr Custom Styles */
	:global(.plyr) {
		--plyr-color-main: #ed4b72;
		--plyr-video-background: #0f172a;
		--plyr-font-family: inherit;
		height: 100% !important;
		width: 100% !important;
		border-radius: 12px;
	}

	:global(.plyr--full-ui.plyr--video .plyr__control--overlaid) {
		background: rgba(237, 75, 114, 0.9);
		padding: 24px;
	}

	:global(.plyr--video .plyr__controls) {
		background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
		padding: 20px 15px 10px;
	}

	:global(.plyr__settings__menu) {
		border-radius: 12px;
		overflow: hidden;
		background: rgba(15, 23, 42, 0.95);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1) !important;
	}

	:global(.plyr__settings__menu [role='menuitem']:hover) {
		background: rgba(237, 75, 114, 0.2);
	}

	/* Prevent native controls */
	video::-webkit-media-controls-enclosure {
		display: none !important;
	}
</style>
