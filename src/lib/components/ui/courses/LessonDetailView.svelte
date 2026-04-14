<script>
	import { enhance } from '$app/forms';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import { Upload, File as FileIcon, ArrowRight, Lock, CheckCircle2 } from 'lucide-svelte';
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
	let isVideoFinished = $state(false);
	const completionThreshold = 0.95;

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
				if (
					player.duration > 0 &&
					player.currentTime / player.duration >= completionThreshold
				) {
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

	// --- Multi-type Assignment UI Logic ---
	const getScoreColor = (score, maxScore) => {
		if (!maxScore) return 'text-slate-400';
		const percentage = (score / maxScore) * 100;
		if (percentage >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
		if (percentage >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
		return 'text-rose-600 bg-rose-50 border-rose-100';
	};

	const getScoreGradient = (score, maxScore) => {
		if (!maxScore) return 'bg-slate-500';
		const percentage = (score / maxScore) * 100;
		if (percentage >= 80) return 'bg-linear-to-r from-emerald-500 to-teal-500';
		if (percentage >= 50) return 'bg-linear-to-r from-amber-500 to-orange-500';
		return 'bg-linear-to-r from-rose-500 to-red-500';
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
						Brauzeringiz videoni qo'llab-quvvatlamaydi.
					</video>

					<div
						role="application"
						class="pointer-events-none absolute inset-0 z-5"
						oncontextmenu={(e) => e.preventDefault()}
					></div>

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

			{#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
				<div class="flex flex-col gap-3">
					{#if !isVideoFinished}
						<div
							class="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700"
							transition:slide
						>
							<Lock size={14} />
							<span>Tugmachani ochish uchun videoni oxirigacha ko'ring</span>
						</div>
					{:else}
						<div
							class="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700"
							transition:slide
						>
							<CheckCircle2 size={14} />
							<span>Video ko'rildi! Endi darsni yakunlashingiz mumkin</span>
						</div>
					{/if}

					<button
						onclick={markComplete}
						disabled={isSubmittingComplete || !isVideoFinished}
						class="flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#FA2E69] px-6 py-4 font-black transition-all duration-300 hover:bg-[#D81B53] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none {isVideoFinished
							? 'text-white shadow-[0_8px_20px_-6px_rgba(250,46,105,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(250,46,105,0.5)]'
							: 'text-slate-400'}"
					>
						{#if isSubmittingComplete}
							<span
								class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
							></span>
							<span>Yuborilmoqda...</span>
						{:else}
							{#if !isVideoFinished}
								<Lock size={18} />
							{:else}
								<CheckCircle2 size={18} />
							{/if}
							<span>Darsni yakunlash</span>
						{/if}
					</button>
				</div>
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
			{@const assignment = lesson.assignments[0]}
			<div
				class="sticky top-6 h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8"
			>
				<div class="mb-6">
					<div class="mb-4 flex items-center justify-between">
						<span
							class="rounded-full bg-slate-100 px-4 py-1.5 text-[11px] font-extrabold tracking-widest text-slate-500 uppercase"
						>
							{assignment.type === 'text'
								? 'Matnli topshiriq'
								: assignment.type === 'link'
									? 'Havola yuborish'
									: 'Fayl yuklash'}
						</span>
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full bg-[#FA2E69]/10 text-[#FA2E69]"
						>
							<Upload size={16} />
						</div>
					</div>
					<h2 class="mb-2 text-2xl font-black tracking-tight text-slate-900">{assignment.title}</h2>
					<p class="text-[14px] leading-relaxed text-slate-500">
						{assignment.description}
					</p>
				</div>

				<div class="mb-6 grid grid-cols-2 gap-4">
					<div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
						<span class="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase"
							>Maks. Ball</span
						>
						<span class="text-lg font-black text-slate-900">{assignment.max_score}</span>
					</div>
					<div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
						<span class="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase"
							>Urinishlar</span
						>
						<span class="text-lg font-black text-slate-900">{assignment.max_attempts}</span>
					</div>
				</div>

				<form
					method="POST"
					action="?/uploadAssignment"
					use:enhance={submitAssignment}
					enctype="multipart/form-data"
					class="space-y-5"
				>
					<input type="hidden" name="assignment" value={assignment.id} />

					{#if assignment.type === 'file'}
						<label
							class="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-all duration-300
							{isDragging
								? 'scale-[0.99] border-[#FA2E69] bg-[#FA2E69]/5'
								: 'border-slate-200 bg-white hover:border-[#FA2E69]/50 hover:bg-slate-50/50'}"
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
							ondrop={handleFileDrop}
							role="presentation"
						>
							<input type="file" name="file" class="hidden" onchange={handleFileSelect} required />

							{#if selectedFile}
								<div class="flex flex-col items-center text-center" in:fade>
									<div
										class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FA2E69]/10 text-[#FA2E69] shadow-inner"
									>
										<FileIcon size={28} />
									</div>
									<span class="line-clamp-1 text-sm font-bold text-slate-800"
										>{selectedFile.name}</span
									>
									<span class="mt-1 text-[11px] font-semibold text-slate-500"
										>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span
									>
								</div>
							{:else}
								<div
									class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-[#FA2E69]/10 group-hover:text-[#FA2E69] group-hover:shadow-[0_8px_20px_-6px_rgba(250,46,105,0.3)]"
								>
									<Upload size={28} strokeWidth={1.5} />
								</div>
								<span class="mb-1 text-[15px] font-bold text-slate-800">Faylni tanlang</span>
								<span class="text-[12px] font-medium text-slate-400">PDF, JPG, PNG yoki ZIP</span>
							{/if}
						</label>
					{:else if assignment.type === 'text'}
						<div class="space-y-2">
							<label
								for="text_answer"
								class="ml-1 text-[13px] font-bold tracking-wide text-slate-700 uppercase"
								>Sizning javobingiz</label
							>
							<textarea
								id="text_answer"
								name="text_answer"
								rows="6"
								placeholder="Topshiriq yuzasidan batafsilroq yozing..."
								class="min-h-[160px] w-full rounded-2xl border-2 border-slate-100 bg-white p-4 text-[15px] font-medium transition-all outline-none placeholder:text-slate-300 focus:border-[#FA2E69]/30 focus:ring-4 focus:ring-[#FA2E69]/5"
								required
							></textarea>
						</div>
					{:else if assignment.type === 'link'}
						<div class="space-y-2">
							<label
								for="text_answer"
								class="ml-1 text-[13px] font-bold tracking-wide text-slate-700 uppercase"
								>Havola (Link)</label
							>
							<div class="relative">
								<input
									type="url"
									id="text_answer"
									name="text_answer"
									placeholder="https://example.com/your-work"
									class="w-full rounded-2xl border-2 border-slate-100 bg-white p-4 text-[15px] font-medium transition-all outline-none placeholder:text-slate-300 focus:border-[#FA2E69]/30 focus:ring-4 focus:ring-[#FA2E69]/5"
									required
								/>
							</div>
						</div>
					{/if}

					{#if assignment.type !== 'text'}
						<div class="space-y-2">
							<label
								for="desc_answer"
								class="ml-1 text-[13px] font-bold tracking-wide text-slate-700 uppercase"
								>Qo'shimcha izoh (ixtiyoriy)</label
							>
							<textarea
								id="desc_answer"
								name="desc_answer"
								rows="3"
								placeholder="Topshiriq yuzasidan izoh qoldiring..."
								class="w-full rounded-2xl border-2 border-slate-100 bg-white p-4 text-[14px] font-medium transition-all outline-none placeholder:text-slate-300 focus:border-[#FA2E69]/30 focus:ring-4 focus:ring-[#FA2E69]/5"
							></textarea>
						</div>
					{/if}

					<button
						type="submit"
						disabled={isSubmitting || (assignment.type === 'file' && !selectedFile)}
						class="group relative w-full overflow-hidden rounded-2xl bg-[#FA2E69] py-4.5 font-bold text-white shadow-[0_10px_25px_rgba(250,46,105,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D81B53] hover:shadow-[0_15px_35px_rgba(250,46,105,0.4)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
					>
						<div class="relative z-10 flex items-center justify-center gap-2.5">
							{#if isSubmitting}
								<div
									class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
								></div>
								<span>Yuborilmoqda...</span>
							{:else}
								<span>Topshiriqni yuborish</span>
								<ArrowRight size={18} class="transition-transform group-hover:translate-x-1" />
							{/if}
						</div>
					</button>
				</form>

				{#if assignment.submissions && assignment.submissions.length > 0}
					<div class="mt-10 border-t border-slate-100 pt-8">
						<h3 class="mb-5 text-[16px] font-black tracking-tight text-slate-900">
							Oldingi urinishlar
						</h3>

						<div class="space-y-4">
							{#each assignment.submissions as sub (sub.id)}
								<div
									class="group relative overflow-hidden rounded-[24px] border border-slate-100 bg-white p-5 transition-all duration-300 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40"
									transition:slide
								>
									<div class="flex items-start justify-between">
										<div class="space-y-1">
											<div class="flex items-center gap-2">
												<span class="text-[12px] font-bold text-slate-400">
													{new Date(sub.submitted_at || Date.now()).toLocaleDateString('uz-UZ', {
														day: 'numeric',
														month: 'short'
													})}
												</span>
												<div class="h-1 w-1 rounded-full bg-slate-200"></div>
												<span class="text-[12px] font-bold text-slate-400">
													{new Date(sub.submitted_at || Date.now()).toLocaleTimeString('uz-UZ', {
														hour: '2-digit',
														minute: '2-digit'
													})}
												</span>
											</div>

											{#if sub.status === 'Graded'}
												<div class="flex items-center gap-3 pt-1">
													<div class="flex items-center gap-1">
														<span class="text-2xl font-black text-slate-900">{sub.score}</span>
														<span class="text-sm font-bold text-slate-300"
															>/ {assignment.max_score}</span
														>
													</div>
													<div
														class="flex h-1.5 w-1.5 rounded-full {sub.score >=
														assignment.max_score * 0.8
															? 'bg-emerald-500'
															: sub.score >= assignment.max_score * 0.5
																? 'bg-amber-500'
																: 'bg-rose-500'}"
													></div>
												</div>
											{:else}
												<div class="flex items-center gap-2 pt-1">
													<span class="text-sm font-black tracking-wider text-slate-400 uppercase"
														>Tekshirilmoqda</span
													>
													<div class="flex gap-1">
														<div
															class="h-1 w-1 animate-bounce rounded-full bg-slate-300"
															style="animation-delay: 0ms"
														></div>
														<div
															class="h-1 w-1 animate-bounce rounded-full bg-slate-300"
															style="animation-delay: 150ms"
														></div>
														<div
															class="h-1 w-1 animate-bounce rounded-full bg-slate-300"
															style="animation-delay: 300ms"
														></div>
													</div>
												</div>
											{/if}
										</div>

										{#if sub.status === 'Graded'}
											<div
												class="flex h-10 items-center justify-center rounded-2xl border px-4 text-[12px] font-black tracking-widest uppercase {getScoreColor(
													sub.score,
													assignment.max_score
												)} shadow-inner"
											>
												Baholandi
											</div>
										{:else}
											<div
												class="flex h-10 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 px-4 text-[11px] font-black tracking-widest text-slate-400 uppercase"
											>
												Kutilmoqda
											</div>
										{/if}
									</div>

									{#if sub.feedback}
										<div
											class="relative mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
										>
											<div class="mb-2 flex items-center gap-2">
												<div class="h-1.5 w-1.5 rounded-full bg-[#FA2E69]"></div>
												<span
													class="text-[10px] font-black tracking-widest text-slate-400 uppercase"
													>Mentor fikri</span
												>
											</div>
											<p class="text-[13px] leading-relaxed font-medium text-slate-600 italic">
												"{sub.feedback}"
											</p>
										</div>
									{/if}

									<!-- Score indicator line -->
									{#if sub.status === 'Graded'}
										<div
											class="absolute right-0 bottom-0 left-0 h-1 {getScoreGradient(
												sub.score,
												assignment.max_score
											)} opacity-20"
										></div>
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
