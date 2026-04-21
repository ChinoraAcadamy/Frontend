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
		console.log(element);

		// 2. Debugger Trap (Anti-debug loop)
		const start = performance.now();
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
	<!-- Breadcrumb is handled by the main Navbar -->
	<div class="mb-4 h-2"></div>

	<!-- Mobile Sidebar Toggle -->
	<div class="mb-4 block lg:hidden">
		<button
			onclick={() => (showMobileSidebar = !showMobileSidebar)}
			class="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
		>
			<div class="flex items-center gap-2.5">
				<div class="flex items-center justify-center rounded-lg bg-rose-50 p-1.5 text-[#ed4b72]">
					<List size={18} />
				</div>
				<span>{m.lesson_module_lessons ? m.lesson_module_lessons() : 'Modul darslari'}</span>
			</div>
			<ChevronDown
				size={18}
				class="text-slate-400 transition-transform duration-200 {showMobileSidebar
					? 'rotate-180'
					: ''}"
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
					class="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white shadow-sm"
				>
					<div
						class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#ed4b72]"
					></div>
				</div>
			{:then module}
				{#if module}
					<div
						class="flex max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
					>
						<!-- Sidebar Header -->
						<div class="border-b border-slate-100 bg-slate-50/50 p-5">
							<h3 class="line-clamp-2 text-base font-black text-slate-800">{module.title}</h3>

							{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
								<div class="mt-3 flex flex-col gap-1.5">
									<div
										class="flex items-center justify-between text-[11px] font-bold text-slate-400"
									>
										<span class="tracking-wider uppercase">{m.progress()}</span>
										<span class="text-[#ed4b72]"
											>{Math.round(
												(module.lessons.filter((l) => l.is_completed).length /
													module.lessons.length) *
													100
											) || 0}%</span
										>
									</div>
									<div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
										<div
											class="h-full bg-[#ed4b72] transition-all duration-500"
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
											class="flex cursor-not-allowed items-center justify-between gap-3 rounded-2xl border border-slate-100/50 bg-slate-50 p-3 opacity-60"
										>
											<div class="flex min-w-0 items-start gap-3">
												<div class="mt-0.5 shrink-0">
													<Lock size={18} class="text-slate-400" />
												</div>
												<div class="flex min-w-0 flex-col">
													<span class="line-clamp-2 text-sm font-bold text-slate-500">
														{l.title}
													</span>
													<span class="mt-0.5 text-xs font-semibold text-slate-400"
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
												<div class="h-2 w-2 rounded-full bg-slate-200"></div>
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
												? 'bg-rose-50/80 shadow-sm ring-1 shadow-rose-100/50 ring-rose-100'
												: 'hover:bg-slate-50'}"
										>
											<div class="flex min-w-0 items-start gap-3">
												<div class="mt-0.5 shrink-0">
													{#if l.id === lesson.id}
														<PlayCircle size={18} class="fill-[#ed4b72] text-rose-100" />
													{:else}
														<PlayCircle
															size={18}
															class="text-slate-300 transition-colors group-hover:text-slate-400"
														/>
													{/if}
												</div>
												<div class="flex min-w-0 flex-col">
													<span
														class="line-clamp-2 text-sm font-bold {l.id === lesson.id
															? 'text-[#9b1c48]'
															: 'text-slate-700'}"
													>
														{l.title}
													</span>
													<span class="mt-0.5 text-xs font-semibold text-slate-400"
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
														class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100"
													>
														<CheckCircle2 size={12} class="text-emerald-600" />
													</div>
												{:else if l.id === lesson.id}
													<div
														class="h-2 w-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"
													></div>
												{:else if isAdmin}
													<div
														class="h-2 w-2 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300"
													></div>
												{:else}
													<div
														class="h-2 w-2 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300"
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
				class="relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-sm"
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
				<span class="text-[11px] font-black tracking-widest text-[#ed4b72] uppercase"
					>{m.lesson_info_title()}</span
				>
				<h1 class="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
					{lesson.title}
				</h1>
				<p class="mt-2 text-sm leading-relaxed text-slate-600">{lesson.description}</p>
			</div>

			<!-- Completion Action -->
			{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
				<div class="flex flex-col gap-3">
					{#if !isVideoFinished}
						<div
							class="flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4 text-sm font-bold text-amber-700"
							transition:slide
						>
							<div class="flex items-center justify-center rounded-xl bg-amber-100 p-2">
								<Lock size={16} class="text-amber-600" />
							</div>
							<span>{m.lesson_video_lock()}</span>
						</div>
					{:else}
						<div
							class="flex items-center gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4 text-sm font-bold text-emerald-700"
							transition:slide
						>
							<div class="flex items-center justify-center rounded-xl bg-emerald-100 p-2">
								<CheckCircle2 size={16} class="text-emerald-600" />
							</div>
							<span>{m.lesson_video_watched()}</span>
						</div>
					{/if}

					<button
						onclick={markComplete}
						disabled={isSubmittingComplete || !isVideoFinished}
						class="flex w-full items-center justify-center gap-2 rounded-2xl border py-4 text-sm font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 {isVideoFinished
							? 'border-[#FA2E69] bg-[#FA2E69] text-white shadow-md hover:bg-[#D81B53] hover:shadow-[#fa2e69]/20'
							: 'border-slate-200 bg-white text-slate-400'}"
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
					class="mt-4 flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
				>
					{#key currentAssignmentIndex}
						<div in:fly={{ x: 20, duration: 400 }} class="flex flex-col">
							<!-- Assignment Header -->
							<div class="bg-white p-5 pb-2 sm:p-6">
								<div class="mb-4 flex items-center justify-between">
									<span
										class="rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-bold tracking-wider text-slate-600 uppercase"
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
									<Upload size={18} class="text-slate-400" />
								</div>
								<h2 class="s-idpCsxdjyqUy text-xl font-bold tracking-tight text-slate-900">
									{assignment.title}
								</h2>
								<p class="mt-2 text-sm text-slate-600">{assignment.description}</p>

								<div class="mt-4 flex items-center gap-6 border-t border-slate-100 pt-4">
									<div class="flex flex-col">
										<span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase"
											>{m.assignment_max_score()}</span
										>
										<span class="text-base font-black text-slate-900">{assignment.max_score}</span>
									</div>
									<div class="h-8 w-px bg-slate-200"></div>
									<div class="flex flex-col">
										<span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase"
											>{m.assignment_attempts()}</span
										>
										<span class="text-base font-black text-slate-900"
											>{assignment.max_attempts}</span
										>
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
											<span class="text-sm font-bold text-slate-800"
												>{m.assignment_upload_file()}</span
											>
											<span class="text-xs text-slate-500">{m.assignment_drop_file()}</span>
										{/if}
									</label>
								{:else if assignment.type === 'text'}
									<div class="flex flex-col gap-1.5">
										<label
											for="text_answer"
											class="text-xs font-bold tracking-wider text-slate-600 uppercase"
											>{m.assignment_type_text()}</label
										>
										<textarea
											id="text_answer"
											name="text_answer"
											rows="5"
											placeholder={m.assignment_placeholder_text
												? m.assignment_placeholder_text()
												: 'Topshiriq yuzasidan batafsilroq yozing...'}
											class="w-full rounded-2xl border-none bg-slate-100 p-4 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-4 focus:ring-rose-50"
											required
										></textarea>
									</div>
								{:else if assignment.type === 'link'}
									<div class="flex flex-col gap-1.5">
										<label
											for="text_answer"
											class="text-xs font-bold tracking-wider text-slate-600 uppercase"
											>{m.assignment_type_link()}</label
										>
										<input
											type="url"
											id="text_answer"
											name="text_answer"
											placeholder="https://example.com/your-work"
											class="w-full rounded-2xl border-none bg-slate-100 p-4 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-4 focus:ring-rose-50"
											required
										/>
									</div>
								{/if}

								{#if assignment.type !== 'text'}
									<div class="flex flex-col gap-1.5">
										<label
											for="desc_answer"
											class="text-xs font-bold tracking-wider text-slate-600 uppercase"
											>{m.assignment_desc_label()}</label
										>
										<textarea
											id="desc_answer"
											name="desc_answer"
											rows="2"
											placeholder={m.assignment_desc_placeholder()}
											class="w-full rounded-2xl border-none bg-slate-100 p-4 text-sm font-bold transition-all outline-none focus:bg-white focus:ring-4 focus:ring-rose-50"
										></textarea>
									</div>
								{/if}

								<button
									type="submit"
									disabled={isSubmitting || (assignment.type === 'file' && !selectedFile)}
									class="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 py-4 text-sm font-bold text-[#ed4b72] transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
								>
									{#if isSubmitting}
										<div
											class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#ed4b72]"
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
								<div class="flex flex-col border-t border-slate-200 bg-slate-50 p-5 sm:p-6">
									<h3 class="mb-4 text-sm font-bold text-slate-900">
										{m.assignment_prev_attempts()}
									</h3>
									<div class="flex flex-col gap-3">
										{#each assignment.submissions as sub (sub.id)}
											<div
												class="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4"
												transition:slide
											>
												<div class="flex items-center justify-between">
													<div
														class="flex items-center gap-2 text-[11px] font-medium text-slate-500"
													>
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
													{#if sub.status === 'Graded' || sub.status === 'graded'}
														<span
															class="rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-600 uppercase"
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
														<span class="text-sm font-bold text-slate-400"
															>/ {assignment.max_score}</span
														>
													</div>
												{/if}

												{#if sub.feedback}
													<div class="mt-1 border-l-2 border-[#FA2E69] bg-slate-50/80 p-3">
														<span
															class="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase"
															>{m.assignment_mentor()}</span
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
								<span>{m.pagination_prev_short()}</span>
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
		class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 px-6 text-center text-white backdrop-blur-xl"
		transition:fade
	>
		<div
			class="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-pink-500/20 text-pink-500 shadow-2xl shadow-pink-500/20"
		>
			<Lock size={48} strokeWidth={2.5} />
		</div>

		<h2 class="mb-3 text-3xl font-black tracking-tight md:text-4xl">
			{m.security_lock_title ? m.security_lock_title() : 'Xavfsizlik tizimi faollashdi'}
		</h2>

		<p class="mx-auto max-w-lg text-lg font-medium text-slate-400">
			{m.security_lock_desc
				? m.security_lock_desc()
				: "Dars materiallarini ko'rish uchun DevTools (inspektor) panelini yoping va sahifani yangilang."}
		</p>

		<div class="mt-10 flex flex-col items-center gap-4">
			<button
				onclick={() => window.location.reload()}
				class="rounded-2xl bg-white px-8 py-3.5 text-sm font-black tracking-widest text-slate-900 uppercase transition-all hover:scale-105 active:scale-95"
			>
				{m.refresh_page ? m.refresh_page() : 'Sahifani yangilash'}
			</button>

			<div
				class="flex items-center gap-3 text-xs font-bold tracking-widest text-slate-500 uppercase"
			>
				<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-500"></span>
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
