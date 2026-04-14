<script>
	/* eslint-disable no-unused-vars */
	import { enhance } from '$app/forms';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import {
		Upload,
		File as FileIcon,
		ArrowRight,
		Lock,
		CheckCircle2,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte';
	import { fade, slide, fly } from 'svelte/transition';
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
	let isVideoFinished = $state(false);
	const completionThreshold = 0.95;

	// --- Pagination ---
	let currentAssignmentIndex = $state(0);
	const hasAssignments = $derived(lesson.assignments?.length > 0);
	const assignment = $derived(hasAssignments ? lesson.assignments[currentAssignmentIndex] : null);

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

			const checkProgress = () => {
				if (player.duration > 0 && player.currentTime / player.duration >= completionThreshold) {
					isVideoFinished = true;
				}
			};

			const resumePlayback = () => {
				if (!isRestored && expectedTime > 2) {
					if (player.duration > 0 || player.media?.duration > 0) {
						player.currentTime = expectedTime;
						isRestored = true;
						checkProgress();
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

			const onEnded = () => {
				isVideoFinished = true;
				stopAutoSave();
			};

			player.on('playing', startAutoSave);
			player.on('pause', stopAutoSave);
			player.on('ended', onEnded);
			player.on('timeupdate', checkProgress);

			return () => {
				stopAutoSave();
				player.off('loadedmetadata', resumePlayback);
				player.off('canplay', resumePlayback);
				player.off('playing', resumePlayback);
				player.off('playing', startAutoSave);
				player.off('pause', stopAutoSave);
				player.off('ended', onEnded);
				player.off('timeupdate', checkProgress);
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
			const resolvedNextLesson = await nextLesson;
			if (resolvedNextLesson) {
				setTimeout(() => {
					const url = `/kurslarim/${$page.params.id}/lessons/${resolvedNextLesson.id}?module_id=${resolvedNextLesson.moduleId || $page.url.searchParams.get('module_id')}`;
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

	// --- Multi-type Assignment UI Logic ---
	const getScoreColor = (score, maxScore) => {
		if (!maxScore) return 'text-slate-400';
		const percentage = (score / maxScore) * 100;
		if (percentage >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
		if (percentage >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
		return 'text-rose-600 bg-rose-50 border-rose-100';
	};
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

<!-- Flat Design & Mobile First Layout -->
<div class="mx-auto max-w-7xl px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
	<nav class="mb-6 flex items-center text-sm font-medium text-slate-500">
		<Breadcrumb />
	</nav>

	<div
		class="grid grid-cols-1 gap-6 {hasAssignments ? 'lg:grid-cols-[2fr_1fr]' : 'mx-auto max-w-4xl'}"
	>
		<!-- Left Col: Video & Info -->
		<div class="flex flex-col gap-6">
			<!-- Video Player -->
			<div
				class="relative aspect-video w-full overflow-hidden rounded-md border border-slate-200 bg-slate-900"
			>
				{#if !player}
					<div
						class="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
						transition:fade
					>
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-[#ed4b72] border-t-transparent"
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
					Brauzeringiz videoni qo'llab-quvvatlamaydi.
				</video>

				<!-- Security Overlays -->
				<div
					role="application"
					class="pointer-events-none absolute inset-0 z-5"
					oncontextmenu={(e) => e.preventDefault()}
				></div>
				{#if showWatermark}
					<div
						class="pointer-events-none absolute z-10 text-xs font-bold text-white/20 transition-all duration-1000 select-none"
						style="top: {watermarkPos.top}%; left: {watermarkPos.left}%;"
					>
						{userIdent}
					</div>
				{/if}
			</div>

			<!-- Lesson Metadata -->
			<div class="flex flex-col gap-2">
				<span class="text-xs font-bold tracking-wider text-slate-500 uppercase"
					>Dars ma'lumotlari</span
				>
				<h1 class="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
					{lesson.title}
				</h1>
				<p class="text-sm leading-relaxed text-slate-600">{lesson.description}</p>
			</div>

			<!-- Completion Action -->
			{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
				<div class="mt-4 flex flex-col gap-3">
					{#if !isVideoFinished}
						<div
							class="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-700"
							transition:slide
						>
							<Lock size={16} />
							<span>Tugmachani ochish uchun videoni oxirigacha ko'ring</span>
						</div>
					{:else}
						<div
							class="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700"
							transition:slide
						>
							<CheckCircle2 size={16} />
							<span>Video ko'rildi! Endi darsni yakunlashingiz mumkin</span>
						</div>
					{/if}

					<button
						onclick={markComplete}
						disabled={isSubmittingComplete || !isVideoFinished}
						class="flex w-full items-center justify-center gap-2 rounded-md border py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 {isVideoFinished
							? 'border-[#FA2E69] bg-[#FA2E69] text-white hover:bg-[#D81B53]'
							: 'border-slate-200 bg-slate-50 text-slate-400'}"
					>
						{#if isSubmittingComplete}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
							></div>
							<span>Yuborilmoqda...</span>
						{:else}
							{#if !isVideoFinished}
								<Lock size={16} />
							{:else}
								<CheckCircle2 size={16} />
							{/if}
							<span>Darsni yakunlash</span>
						{/if}
					</button>
				</div>
			{/if}
		</div>

		<!-- Right Col: Assignments -->
		{#if hasAssignments}
			<div
				class="sticky top-6 flex h-fit flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
			>
				{#key currentAssignmentIndex}
					<div in:fly={{ x: 20, duration: 400 }} class="flex flex-col">
						<!-- Assignment Header -->
						<div class="bg-white p-5 pb-2 sm:p-6">
							<div class="mb-4 flex items-center justify-between">
								<span
									class="rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-bold tracking-wider text-slate-600 uppercase"
								>
									{lesson.assignments.length > 1 ? `${currentAssignmentIndex + 1}-topshiriq` : ''}
									{assignment.type === 'text'
										? 'Matn'
										: assignment.type === 'link'
											? 'Havola'
											: 'Fayl'}
								</span>
								<Upload size={18} class="text-slate-400" />
							</div>
							<h2 class="s-idpCsxdjyqUy text-xl font-bold tracking-tight text-slate-900">
								{assignment.title}
							</h2>
							<p class="mt-2 text-sm text-slate-600">{assignment.description}</p>

							<div class="mt-4 flex items-center gap-6 border-t border-slate-100 pt-4">
								<div class="flex flex-col">
									<span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase"
										>Maks Ball</span
									>
									<span class="text-base font-black text-slate-900">{assignment.max_score}</span>
								</div>
								<div class="h-8 w-px bg-slate-200"></div>
								<div class="flex flex-col">
									<span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase"
										>Urinishlar</span
									>
									<span class="text-base font-black text-slate-900">{assignment.max_attempts}</span>
								</div>
							</div>
						</div>

						<!-- Assignment Form -->
						<form
							method="POST"
							action="?/uploadAssignment"
							use:enhance={submitAssignment}
							enctype="multipart/form-data"
							class="flex flex-col gap-5 bg-white p-5 sm:p-6"
						>
							<input type="hidden" name="assignment" value={assignment.id} />

							{#if assignment.type === 'file'}
								<label
									class="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors {isDragging
										? 'border-[#FA2E69] bg-[#FA2E69]/5'
										: 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'}"
									ondragover={handleDragOver}
									ondragleave={handleDragLeave}
									ondrop={handleFileDrop}
									role="presentation"
								>
									<input
										type="file"
										name="file"
										class="hidden"
										onchange={handleFileSelect}
										required
									/>
									{#if selectedFile}
										<FileIcon size={24} class="mb-2 text-[#FA2E69]" />
										<span class="line-clamp-1 text-center text-sm font-bold text-slate-800"
											>{selectedFile.name}</span
										>
										<span class="text-xs text-slate-500"
											>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span
										>
									{:else}
										<Upload size={24} class="mb-2 text-slate-400" />
										<span class="text-sm font-bold text-slate-800">Faylni yuklash</span>
										<span class="text-xs text-slate-500">Bu yerga tashlang yoki bosing</span>
									{/if}
								</label>
							{:else if assignment.type === 'text'}
								<div class="flex flex-col gap-1.5">
									<label
										for="text_answer"
										class="text-xs font-bold tracking-wider text-slate-600 uppercase">Javob</label
									>
									<textarea
										id="text_answer"
										name="text_answer"
										rows="5"
										placeholder="Topshiriq yuzasidan batafsilroq yozing..."
										class="w-full rounded-md border border-slate-300 p-3 text-sm transition-colors outline-none focus:border-[#FA2E69] focus:ring-1 focus:ring-[#FA2E69]"
										required
									></textarea>
								</div>
							{:else if assignment.type === 'link'}
								<div class="flex flex-col gap-1.5">
									<label
										for="text_answer"
										class="text-xs font-bold tracking-wider text-slate-600 uppercase">Havola</label
									>
									<input
										type="url"
										id="text_answer"
										name="text_answer"
										placeholder="https://example.com/your-work"
										class="w-full rounded-md border border-slate-300 p-3 text-sm transition-colors outline-none focus:border-[#FA2E69] focus:ring-1 focus:ring-[#FA2E69]"
										required
									/>
								</div>
							{/if}

							{#if assignment.type !== 'text'}
								<div class="flex flex-col gap-1.5">
									<label
										for="desc_answer"
										class="text-xs font-bold tracking-wider text-slate-600 uppercase"
										>Izoh (ixtiyoriy)</label
									>
									<textarea
										id="desc_answer"
										name="desc_answer"
										rows="2"
										placeholder="Topshiriq yuzasidan izoh qoldiring..."
										class="w-full rounded-md border border-slate-300 p-3 text-sm transition-colors outline-none focus:border-[#FA2E69] focus:ring-1 focus:ring-[#FA2E69]"
									></textarea>
								</div>
							{/if}

							<button
								type="submit"
								disabled={isSubmitting || (assignment.type === 'file' && !selectedFile)}
								class="flex w-full items-center justify-center gap-2 rounded-md border border-slate-900 bg-slate-900 py-3.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{#if isSubmitting}
									<div
										class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
									></div>
									<span>Yuborilmoqda...</span>
								{:else}
									<span>Topshiriqni yuborish</span>
									<ArrowRight size={16} />
								{/if}
							</button>
						</form>

						<!-- Submissions History -->
						{#if assignment.submissions && assignment.submissions.length > 0}
							<div class="flex flex-col border-t border-slate-200 bg-slate-50 p-5 sm:p-6">
								<h3 class="mb-4 text-sm font-bold text-slate-900">Oldingi urinishlar</h3>
								<div class="flex flex-col gap-3">
									{#each assignment.submissions as sub (sub.id)}
										<div
											class="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4"
											transition:slide
										>
											<div class="flex items-center justify-between">
												<div class="flex items-center gap-2 text-[11px] font-medium text-slate-500">
													<span
														>{new Date(sub.submitted_at || Date.now()).toLocaleDateString(
															'uz'
														)}</span
													>
													<span class="h-1 w-1 rounded-full bg-slate-300"></span>
													<span
														>{new Date(sub.submitted_at || Date.now()).toLocaleTimeString(
															'uz'
														)}</span
													>
												</div>
												{#if sub.status === 'Graded'}
													<span
														class="rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-600 uppercase"
														>Baholandi</span
													>
												{:else}
													<div
														class="flex items-center gap-1.5 rounded border border-sky-100 bg-sky-50 px-2 py-1"
													>
														<span
															class="text-[10px] font-bold tracking-wider text-sky-600 uppercase"
															>Kutilmoqda</span
														>
														<div class="flex gap-0.5">
															<div class="h-1 w-1 animate-ping rounded-full bg-sky-400"></div>
														</div>
													</div>
												{/if}
											</div>

											{#if sub.status === 'Graded'}
												<div class="flex items-center gap-1.5">
													<span
														class="text-xl font-black {getScoreColor(
															sub.score,
															assignment.max_score
														).split(' ')[0]}">{sub.score}</span
													>
													<span class="text-sm font-bold text-slate-400"
														>/ {assignment.max_score}</span
													>
												</div>
											{/if}

											{#if sub.feedback}
												<div class="mt-1 border-l-2 border-[#FA2E69] bg-slate-50/80 p-3">
													<span
														class="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase"
														>Mentor:</span
													>
													<p class="text-[13px] font-medium text-slate-700 italic">
														"{sub.feedback}"
													</p>
												</div>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/key}

				<!-- Pagination Controls -->
				{#if lesson.assignments.length > 1}
					<div class="flex items-center justify-between border-t border-slate-200 bg-white p-4">
						<button
							onclick={() => (currentAssignmentIndex = Math.max(0, currentAssignmentIndex - 1))}
							disabled={currentAssignmentIndex === 0}
							class="flex items-center gap-1 text-xs font-bold transition-colors hover:text-[#FA2E69] disabled:opacity-30"
						>
							<ChevronLeft size={16} />
							<span>Oldingi</span>
						</button>

						<div class="flex gap-1.5">
							{#each lesson.assignments as _, i (i)}
								<div
									class="h-1.5 w-1.5 rounded-full transition-colors {i === currentAssignmentIndex
										? 'bg-[#FA2E69]'
										: 'bg-slate-200'}"
								></div>
							{/each}
						</div>

						<button
							onclick={() =>
								(currentAssignmentIndex = Math.min(
									lesson.assignments.length - 1,
									currentAssignmentIndex + 1
								))}
							disabled={currentAssignmentIndex === lesson.assignments.length - 1}
							class="flex items-center gap-1 text-xs font-bold transition-colors hover:text-[#FA2E69] disabled:opacity-30"
						>
							<span>Keyingi</span>
							<ChevronRight size={16} />
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* ... existing styles ... */
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
