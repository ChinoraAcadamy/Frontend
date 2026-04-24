<script>
	/* eslint-disable no-unused-vars */
	import { enhance } from '$app/forms';
	import {
		Upload,
		File as FileIcon,
		ArrowRight,
		Lock,
		CheckCircle2,
		ChevronLeft,
		ChevronRight,
		List,
		ChevronDown,
		PlayCircle
	} from 'lucide-svelte';
	import { fade, slide, fly } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';
	import 'plyr/dist/plyr.css';
	import { getLocale } from '@/lib/paraglide/runtime';

	let { lesson, nextLesson = null, moduleData = null } = $props();

	let showMobileSidebar = $state(false);

	// --- Helpers ---
	const getProxiedUrl = (url) =>
		url?.startsWith('http') ? `/api/video?url=${encodeURIComponent(url)}` : url || '';

	const getProgressKey = (id) => `chinora_video_progress_${id}`;

	// --- Derived State ---
	const userIdent = $derived(
		$page.data.user?.username || $page.data.user?.phone_number || 'Chinora Student'
	);

	const videoSources = $derived.by(() => {
		if (lesson.video_qualities?.length > 0) {
			return lesson.video_qualities.map((q) => ({
				src: getProxiedUrl(q.url),
				type: 'video/mp4',
				size: q.size
			}));
		}
		return [{ src: getProxiedUrl(lesson.video_url), type: 'video/mp4', size: 720 }];
	});

	const videoTracks = $derived.by(() => {
		if (lesson.subtitle_url) {
			return [
				{
					kind: 'captions',
					label: getLocale() === 'uz' ? "O'zbekcha" : 'Русский',
					srclang: getLocale(),
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
	let securityLocked = $state(false);
	let securityViolationCount = $state(0);

	// --- Assignment & Progress State ---
	let selectedFile = $state(null);
	let isDragging = $state(false);
	let isSubmitting = $state(false);
	let isSubmittingComplete = $state(false);
	let isVideoFinished = $state(false);
	let hasNextLesson = $state(false);
	const completionThreshold = 0.95;

	$effect(() => {
		if (nextLesson) {
			Promise.resolve(nextLesson).then((resolved) => {
				hasNextLesson = !!resolved;
			});
		} else {
			hasNextLesson = false;
		}
	});

	// --- Pagination ---
	let currentAssignmentIndex = $state(0);
	const hasAssignments = $derived(lesson.assignments?.length > 0);
	const assignment = $derived(hasAssignments ? lesson.assignments[currentAssignmentIndex] : null);

	// --- Security Handlers ---
	function handleKeydown(e) {
		const forbiddenCodes = [123, 44]; // F12, PrintScreen
		const ctrlCombinations = [
			73, // I (Inspect)
			74, // J (Console)
			85, // U (Source)
			83, // S (Save)
			80, // P (Print)
			67 // C (Copy)
		];

		const isCtrlShift = (e.ctrlKey || e.metaKey) && e.shiftKey;
		const isCtrl = e.ctrlKey || e.metaKey;
		const isF12 = e.keyCode === 123;

		if (
			isF12 ||
			(isCtrl && ctrlCombinations.includes(e.keyCode)) ||
			(isCtrlShift && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))
		) {
			e.preventDefault();
			securityViolationCount++;
			if (e.keyCode === 44) {
				toast.error(m.video_not_supported ? 'Screenshot taqiqlangan!' : 'Screenshot prohibited!');
			}
			return false;
		}
	}

	function detectDevTools() {
		if (typeof window === 'undefined') return;

		// 1. The "Getter" Hack (Detects if console is open)
		let devtoolsOpen = false;
		const element = new Image();
		Object.defineProperty(element, 'id', {
			get: () => {
				devtoolsOpen = true;
				securityLocked = true;
				return 'detector';
			}
		});

		// 2. Debugger Trap (Anti-debug loop)
		const start = performance.now();
		// eslint-disable-next-line no-debugger
		debugger;
		const end = performance.now();
		if (end - start > 100) {
			securityLocked = true;
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;

		const securityLoop = setInterval(() => {
			detectDevTools();
			if (securityLocked) {
				console.clear();
				if (player?.playing) player.pause();
			}
		}, 2000);

		return () => clearInterval(securityLoop);
	});

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

			// --- Reset per-lesson state ---
			isVideoFinished = lesson.is_completed || false;
			isSubmittingComplete = false;
			selectedFile = null;
			currentAssignmentIndex = 0;

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
				sources: videoSources,
				poster: lesson.image,
				tracks: videoTracks
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
			// Yuboriladigan vaqt (soniyalarda)
			let watchedSeconds = Math.floor(player?.currentTime || 0);
			const videoDuration = player?.duration || 0;
			const backendLessonSeconds = (lesson?.duration || 0) * 60;

			// Agar user videoni 90% yoki undan ko'proq ko'rgan bo'lsa va
			// Backenddagi l.duration videoning haqiqiy uzunligidan 10 soniyadan ko'proq farq qilsa(kattaroq bo'lsa)
			if (
				videoDuration > 0 &&
				watchedSeconds / videoDuration >= 0.9 &&
				backendLessonSeconds - videoDuration >= 10
			) {
				watchedSeconds = backendLessonSeconds; // backendga aynan o'zi kutayotgan uzunlikni yuboramiz
			}

			const res = await fetch('/api/progress/complete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept-Language': getLocale()
				},
				body: JSON.stringify({
					lesson_id: lesson.id,
					watched_seconds: watchedSeconds
				})
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(
					data.message ||
						data.detail ||
						(m.error_occurred ? m.error_occurred() : 'Darsni yakunlashda xatolik yuz berdi')
				);
			}

			toast.success(
				m.info_lesson_completed ? m.info_lesson_completed() : 'Dars muvaffaqiyatli yakunlandi!'
			);

			// Orqa fonni zudlik bilan yangilaymiz (Progress bar va Sidebar update uchun)
			invalidateAll();

			const resolvedNextLesson = await nextLesson;
			if (resolvedNextLesson) {
				const url = `/kurslarim/${$page.params.id}/lessons/${resolvedNextLesson.id}?module_id=${resolvedNextLesson.moduleId || $page.url.searchParams.get('module_id')}`;
				/** @type {any} */
				const route = url;
				// 1 soniya kutmasdan darhol keyingi darsga o'tamiz:
				goto(resolve(route));
			} else {
				// Agar keyingi dars bo'lmasa, shunchaki hozirgi darsni yangilaymiz
				// (invalidateAll() chaqirilgani yetarli bo'lishi mumkin)
			}
		} catch (e) {
			console.error('Lesson completion error:', e);
			const errorMsg = e instanceof Error ? e.message : String(e);
			toast.error(errorMsg);
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
				toast.success(m.success_saved ? m.success_saved() : 'Topshiriq muvaffaqiyatli yuborildi!');
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
		if (!maxScore) return 'text-muted';
		const percentage = (score / maxScore) * 100;
		if (percentage >= 80) return 'text-success bg-success/10 border-success/20';
		if (percentage >= 50) return 'text-warning bg-warning/10 border-warning/20';
		return 'text-error bg-error/10 border-error/20';
	};
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

<!-- Flat Design & Mobile First Layout -->
<div class="mx-auto max-w-7xl px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
	<!-- Breadcrumb is handled by the main Navbar -->
	<div class="mb-4 h-2"></div>

	<!-- Mobile Sidebar Toggle -->
	<div class="mb-4 block lg:hidden">
		<button
			onclick={() => (showMobileSidebar = !showMobileSidebar)}
			class="border-main bg-card text-main flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-bold shadow-sm transition-colors hover:bg-muted/5"
		>
			<div class="flex items-center gap-2.5">
				<div class="flex items-center justify-center rounded-lg bg-primary/10 p-1.5 text-primary">
					<List size={18} />
				</div>
				<span>{m.lesson_module_lessons ? m.lesson_module_lessons() : 'Modul darslari'}</span>
			</div>
			<ChevronDown
				size={18}
				class="text-muted transition-transform duration-200 {showMobileSidebar ? 'rotate-180' : ''}"
			/>
		</button>
	</div>

	<div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr]">
		<!-- Left Sidebar: Lessons List -->
		<div
			class="flex flex-col gap-4 lg:sticky lg:top-6 {showMobileSidebar ? '' : 'mobile-drawer-hide'}"
		>
			{#await moduleData}
				<div
					class="border-main bg-card flex h-64 flex-col items-center justify-center rounded-3xl border shadow-sm"
				>
					<div
						class="h-8 w-8 animate-spin rounded-full border-2 border-muted/20 border-t-primary"
					></div>
				</div>
			{:then module}
				{#if module}
					<div
						class="border-main bg-card flex max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-3xl border shadow-sm"
					>
						<!-- Sidebar Header -->
						<div class="border-main border-b bg-muted/5 p-5">
							<h3 class="line-clamp-2 text-base font-black text-foreground">{module.title}</h3>

							{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
								<div class="mt-3 flex flex-col gap-1.5">
									<div class="flex items-center justify-between text-[11px] font-bold text-muted">
										<span class="tracking-wider uppercase">{m.progress()}</span>
										<span class="text-primary"
											>{Math.round(
												(module.lessons.filter((l) => l.is_completed).length /
													module.lessons.length) *
													100
											) || 0}%</span
										>
									</div>
									<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted/20">
										<div
											class="h-full bg-primary transition-all duration-500"
											style="width: {(module.lessons.filter((l) => l.is_completed).length /
												module.lessons.length) *
												100}%"
										></div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Sidebar List -->
						<div class="scrollbar-hide flex-1 overflow-y-auto p-3">
							<div class="flex flex-col gap-1.5">
								{#each module.lessons as l (l.id)}
									{@const isAdmin =
										$page.data.user?.role === 'admin' || $page.data.user?.role === 'superadmin'}
									{#if l.can_access === false && !isAdmin}
										<div
											class="border-main/50 flex cursor-not-allowed items-center justify-between gap-3 rounded-2xl border bg-muted/5 p-3 opacity-60"
										>
											<div class="flex min-w-0 items-start gap-3">
												<div class="mt-0.5 shrink-0">
													<Lock size={18} class="text-muted" />
												</div>
												<div class="flex min-w-0 flex-col">
													<span class="line-clamp-2 text-sm font-bold text-muted">
														{l.title}
													</span>
													<span class="mt-0.5 text-xs font-semibold text-muted"
														>{l.duration || 0}
														{m.assignment_type_text
															? getLocale() === 'uz'
																? 'daqiqa'
																: 'минут'
															: 'min'}</span
													>
												</div>
											</div>

											<div class="shrink-0 pl-2">
												<div class="h-2 w-2 rounded-full bg-muted/20"></div>
											</div>
										</div>
									{:else}
										<a
											href={resolve(
												isAdmin
													? `/admin/courses/${$page.params.course_id}/lesson/${l.id}?module_id=${module.id}`
													: `/kurslarim/${$page.params.id}/lessons/${l.id}?module_id=${module.id}`
											)}
											class="group flex items-center justify-between gap-3 rounded-2xl p-3 transition-colors {l.id ===
											lesson.id
												? 'bg-primary/10 shadow-sm ring-1 shadow-primary/20 ring-primary/20'
												: 'hover:bg-muted/5'}"
										>
											<div class="flex min-w-0 items-start gap-3">
												<div class="mt-0.5 shrink-0">
													{#if l.id === lesson.id}
														<PlayCircle size={18} class="fill-primary text-primary/10" />
													{:else}
														<PlayCircle
															size={18}
															class="text-muted/40 transition-colors group-hover:text-muted"
														/>
													{/if}
												</div>
												<div class="flex min-w-0 flex-col">
													<span
														class="line-clamp-2 text-sm font-bold {l.id === lesson.id
															? 'text-primary'
															: 'text-muted'}"
													>
														{l.title}
													</span>
													<span class="mt-0.5 text-xs font-semibold text-muted"
														>{l.duration || 0}
														{m.assignment_type_text
															? getLocale() === 'uz'
																? 'daqiqa'
																: 'минут'
															: 'min'}</span
													>
												</div>
											</div>

											<div class="shrink-0 pl-2">
												{#if l.is_completed}
													<div
														class="flex h-5 w-5 items-center justify-center rounded-full bg-success/10"
													>
														<CheckCircle2 size={12} class="text-success" />
													</div>
												{:else if l.id === lesson.id}
													<div
														class="h-2 w-2 rounded-full bg-warning shadow-sm shadow-warning/50"
													></div>
												{:else if isAdmin}
													<div
														class="h-2 w-2 rounded-full bg-muted/20 transition-colors group-hover:bg-muted/30"
													></div>
												{:else}
													<div
														class="h-2 w-2 rounded-full bg-muted/20 transition-colors group-hover:bg-muted/30"
													></div>
												{/if}
											</div>
										</a>
									{/if}
								{/each}
							</div>
						</div>
					</div>
				{/if}
			{/await}
		</div>

		<!-- Right Col/Main Content: Video & Info & Assignments -->
		<div class="flex min-w-0 flex-col gap-6">
			<!-- Video Player -->
			<div
				class="border-main bg-main relative aspect-video w-full overflow-hidden rounded-3xl border shadow-sm"
			>
				{#if !player}
					<div
						class="bg-main/50 absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm"
						transition:fade
					>
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
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
					{m.video_not_supported
						? m.video_not_supported()
						: "Brauzeringiz videoni qo'llab-quvvatlamaydi."}
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
			<div class="flex flex-col gap-2 px-1">
				<span class="text-[11px] font-black tracking-widest text-primary uppercase"
					>{m.lesson_info_title()}</span
				>
				<h1 class="text-2xl font-black tracking-tight text-foreground md:text-3xl">
					{lesson.title}
				</h1>
				<p class="mt-2 text-sm leading-relaxed text-muted">{lesson.description}</p>
			</div>

			<!-- Completion Action -->
			{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
				<div class="flex flex-col gap-3">
					{#if !isVideoFinished}
						<div
							class="flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/5 p-4 text-sm font-bold text-warning"
							transition:slide
						>
							<div class="flex items-center justify-center rounded-xl bg-warning/10 p-2">
								<Lock size={16} class="text-warning" />
							</div>
							<span>{m.lesson_video_lock()}</span>
						</div>
					{:else}
						<div
							class="flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-4 text-sm font-bold text-success"
							transition:slide
						>
							<div class="flex items-center justify-center rounded-xl bg-success/10 p-2">
								<CheckCircle2 size={16} class="text-success" />
							</div>
							<span>{m.lesson_video_watched()}</span>
						</div>
					{/if}

					<button
						onclick={markComplete}
						disabled={isSubmittingComplete || !isVideoFinished}
						class="disabled:border-main flex w-full items-center justify-center gap-2 rounded-2xl border py-4 text-sm font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:cursor-not-allowed disabled:bg-muted/10 disabled:text-muted {isVideoFinished
							? 'hover:bg-primary-hover border-primary bg-primary text-white shadow-md hover:shadow-primary/20'
							: 'border-main bg-card text-muted'}"
					>
						{#if isSubmittingComplete}
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
							></div>
							<span>{m.lesson_submitting()}</span>
						{:else}
							{#if !isVideoFinished}
								<Lock size={18} />
							{:else}
								<CheckCircle2 size={18} />
							{/if}
							<span>{hasNextLesson ? m.lesson_next_lesson() : m.lesson_mark_complete()}</span>
						{/if}
					</button>
				</div>
			{/if}

			<!-- Assignments (Now stacked below) -->
			{#if hasAssignments}
				<div
					class="border-main bg-card mt-4 flex flex-col overflow-hidden rounded-3xl border shadow-sm"
				>
					{#key currentAssignmentIndex}
						<div in:fly={{ x: 20, duration: 400 }} class="flex flex-col">
							<!-- Assignment Header -->
							<div class="bg-card p-5 pb-2 sm:p-6">
								<div class="mb-4 flex items-center justify-between">
									<span
										class="border-main rounded border bg-muted/5 px-2 py-1 text-[11px] font-bold tracking-wider text-muted uppercase"
									>
										{lesson.assignments.length > 1
											? `${currentAssignmentIndex + 1}-${m.assignment_title_n()}`
											: ''}
										{#if assignment.type === 'text'}
											{m.assignment_type_text()}
										{:else if assignment.type === 'link'}
											{m.assignment_type_link()}
										{:else}
											{m.assignment_type_file()}
										{/if}
									</span>
									<Upload size={18} class="text-muted" />
								</div>
								<h2 class="text-main text-xl font-bold tracking-tight">
									{assignment.title}
								</h2>
								<p class="mt-2 text-sm text-muted">{assignment.description}</p>

								<div class="border-main mt-4 flex items-center gap-6 border-t pt-4">
									<div class="flex flex-col">
										<span class="text-[10px] font-bold tracking-wider text-muted uppercase"
											>{m.assignment_max_score()}</span
										>
										<span class="text-main text-base font-black">{assignment.max_score}</span>
									</div>
									<div class="bg-main h-8 w-px"></div>
									<div class="flex flex-col">
										<span class="text-[10px] font-bold tracking-wider text-muted uppercase"
											>{m.assignment_attempts()}</span
										>
										<span class="text-main text-base font-black">{assignment.max_attempts}</span>
									</div>
								</div>
							</div>

							<!-- Assignment Form -->
							<form
								method="POST"
								action="?/uploadAssignment"
								use:enhance={submitAssignment}
								enctype="multipart/form-data"
								class="bg-card flex flex-col gap-5 p-5 sm:p-6"
							>
								<input type="hidden" name="assignment" value={assignment.id} />

								{#if assignment.type === 'file'}
									<label
										class="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors {isDragging
											? 'border-primary bg-primary/5'
											: 'border-main bg-muted/5 hover:border-muted/50 hover:bg-muted/10'}"
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
											<FileIcon size={24} class="mb-2 text-primary" />
											<span class="text-main line-clamp-1 text-center text-sm font-bold"
												>{selectedFile.name}</span
											>
											<span class="text-xs text-muted"
												>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span
											>
										{:else}
											<Upload size={24} class="mb-2 text-muted" />
											<span class="text-main text-sm font-bold">{m.assignment_upload_file()}</span>
											<span class="text-xs text-muted">{m.assignment_drop_file()}</span>
										{/if}
									</label>
								{:else if assignment.type === 'text'}
									<div class="flex flex-col gap-1.5">
										<label
											for="text_answer"
											class="text-xs font-bold tracking-wider text-muted uppercase"
											>{m.assignment_type_text()}</label
										>
										<textarea
											id="text_answer"
											name="text_answer"
											rows="5"
											placeholder={m.assignment_placeholder_text
												? m.assignment_placeholder_text()
												: 'Topshiriq yuzasidan batafsilroq yozing...'}
											class="focus:bg-card w-full rounded-2xl border-none bg-muted/5 p-4 text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-primary/10"
											required
										></textarea>
									</div>
								{:else if assignment.type === 'link'}
									<div class="flex flex-col gap-1.5">
										<label
											for="text_answer"
											class="text-xs font-bold tracking-wider text-muted uppercase"
											>{m.assignment_type_link()}</label
										>
										<input
											type="url"
											id="text_answer"
											name="text_answer"
											placeholder="https://example.com/your-work"
											class="focus:bg-card w-full rounded-2xl border-none bg-muted/5 p-4 text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-primary/10"
											required
										/>
									</div>
								{/if}

								{#if assignment.type !== 'text'}
									<div class="flex flex-col gap-1.5">
										<label
											for="desc_answer"
											class="text-xs font-bold tracking-wider text-muted uppercase"
											>{m.assignment_desc_label()}</label
										>
										<textarea
											id="desc_answer"
											name="desc_answer"
											rows="2"
											placeholder={m.assignment_desc_placeholder()}
											class="focus:bg-card w-full rounded-2xl border-none bg-muted/5 p-4 text-sm font-bold transition-all outline-none focus:ring-4 focus:ring-primary/10"
										></textarea>
									</div>
								{/if}

								<button
									type="submit"
									disabled={isSubmitting || (assignment.type === 'file' && !selectedFile)}
									class="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary/10 py-4 text-sm font-bold text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:bg-muted/5 disabled:text-muted"
								>
									{#if isSubmitting}
										<div
											class="h-5 w-5 animate-spin rounded-full border-2 border-muted/20 border-t-primary"
										></div>
										<span>{m.lesson_submitting()}</span>
									{:else}
										<span>{m.assignment_submit_btn()}</span>
										<ArrowRight size={18} />
									{/if}
								</button>
							</form>

							<!-- Submissions History -->
							{#if assignment.submissions && assignment.submissions.length > 0}
								<div class="border-main flex flex-col border-t bg-muted/5 p-5 sm:p-6">
									<h3 class="text-main mb-4 text-sm font-bold">
										{m.assignment_prev_attempts()}
									</h3>
									<div class="flex flex-col gap-3">
										{#each assignment.submissions as sub (sub.id)}
											<div
												class="border-main bg-card flex flex-col gap-3 rounded-md border p-4"
												transition:slide
											>
												<div class="flex items-center justify-between">
													<div class="flex items-center gap-2 text-[11px] font-medium text-muted">
														<span
															>{new Date(sub.submitted_at || Date.now()).toLocaleDateString(
																'uz'
															)}</span
														>
														<span class="h-1 w-1 rounded-full bg-muted/30"></span>
														<span
															>{new Date(sub.submitted_at || Date.now()).toLocaleTimeString(
																'uz'
															)}</span
														>
													</div>
													{#if sub.status === 'Graded' || sub.status === 'graded'}
														<span
															class="border-main rounded border bg-muted/10 px-2 py-1 text-[10px] font-bold tracking-wider text-muted uppercase"
															>{m.assignment_graded()}</span
														>
													{:else}
														<div
															class="flex items-center gap-1.5 rounded border border-sky-100 bg-sky-50 px-2 py-1"
														>
															<span
																class="text-[10px] font-bold tracking-wider text-sky-600 uppercase"
																>{m.assignment_pending()}</span
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
														<span class="text-sm font-bold text-muted"
															>/ {assignment.max_score}</span
														>
													</div>
												{/if}

												{#if sub.feedback}
													<div class="mt-1 border-l-2 border-primary bg-muted/5 p-3">
														<span
															class="mb-1 block text-[10px] font-bold tracking-wider text-muted uppercase"
															>{m.assignment_mentor()}</span
														>
														<p class="text-main text-[13px] font-medium italic">
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
						<div class="border-main bg-card flex items-center justify-between border-t p-4">
							<button
								onclick={() => (currentAssignmentIndex = Math.max(0, currentAssignmentIndex - 1))}
								disabled={currentAssignmentIndex === 0}
								class="flex items-center gap-1 text-xs font-bold transition-colors hover:text-primary disabled:opacity-30"
							>
								<ChevronLeft size={16} />
								<span>{m.pagination_prev_short()}</span>
							</button>

							<div class="flex gap-1.5">
								{#each lesson.assignments as _, i (i)}
									<div
										class="h-1.5 w-1.5 rounded-full transition-colors {i === currentAssignmentIndex
											? 'bg-primary'
											: 'bg-muted/20'}"
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
								class="flex items-center gap-1 text-xs font-bold transition-colors hover:text-primary disabled:opacity-30"
							>
								<span>{m.pagination_next_short()}</span>
								<ChevronRight size={16} />
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Security Protection Overlay -->
{#if securityLocked}
	<div
		class="bg-main text-main fixed inset-0 z-9999 flex flex-col items-center justify-center px-6 text-center backdrop-blur-xl"
		transition:fade
	>
		<div
			class="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/20 text-primary shadow-2xl shadow-primary/20"
		>
			<Lock size={48} strokeWidth={2.5} />
		</div>

		<h2 class="mb-3 text-3xl font-black tracking-tight md:text-4xl">
			{m.security_lock_title ? m.security_lock_title() : 'Xavfsizlik tizimi faollashdi'}
		</h2>

		<p class="mx-auto max-w-lg text-lg font-medium text-muted">
			{m.security_lock_desc
				? m.security_lock_desc()
				: "Dars materiallarini ko'rish uchun DevTools (inspektor) panelini yoping va sahifani yangilang."}
		</p>

		<div class="mt-10 flex flex-col items-center gap-4">
			<button
				onclick={() => window.location.reload()}
				class="bg-card text-main rounded-2xl px-8 py-3.5 text-sm font-black tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
			>
				{m.refresh_page ? m.refresh_page() : 'Sahifani yangilash'}
			</button>

			<div class="flex items-center gap-3 text-xs font-bold tracking-widest text-muted uppercase">
				<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></span>
				Chinora Academy Security Guard
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	/* ... existing styles ... */

	@media (max-width: 1023px) {
		.mobile-drawer-hide {
			display: none !important;
		}
	}

	/* Plyr Custom Styles */
	:global(.plyr) {
		--plyr-color-main: var(--primary);
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
