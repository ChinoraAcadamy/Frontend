<script>
	/* eslint-disable no-unused-vars */
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Lock, Volume2, FastForward, Rewind } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '@/lib/paraglide/runtime';
	import 'plyr/dist/plyr.css';

	let { lesson, isVideoFinished = $bindable(false) } = $props();

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
	let playerReady = $state(false);
	let lastLoadedLessonId = $state(null);

	// --- Security & UI State ---
	let watermarkPos = $state({ top: 10, left: 10 });
	let showWatermark = $state(true);
	let watermarkInterval = $state(null);
	let securityLocked = $state(false);
	let securityViolationCount = $state(0);

	// --- Gesture Indicators State ---
	let gestureText = $state('');
	let gestureIcon = $state(null);
	let showGestureIndicator = $state(false);
	let gestureTimeout = null;

	const completionThreshold = 0.95;

	// --- Security Handlers ---
	function handleKeydown(e) {
		const forbiddenCodes = [123, 44];
		const ctrlCombinations = [73, 74, 85, 83, 80, 67];

		const isCtrlShift = (e.ctrlKey || e.metaKey) && e.shiftKey;
		const isCtrl = e.ctrlKey || e.metaKey;
		const isF12 = e.keyCode === 123;

		if (
			isF12 ||
			(isCtrl && ctrlCombinations.includes(e.keyCode)) ||
			(isCtrlShift && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))
		) {
			e.preventDefault();
			registerViolation();
			if (e.keyCode === 44) {
				toast.error(m.video_not_supported ? 'Screenshot taqiqlangan!' : 'Screenshot prohibited!');
			}
			return false;
		}
	}

	function registerViolation() {
		securityViolationCount++;
		if (securityViolationCount >= 3) {
			securityLocked = true;
			if (player?.playing) player.pause();
		}
	}

	function detectDevTools() {
		if (typeof window === 'undefined') return;
		const widthDiff = window.outerWidth - window.innerWidth;
		const heightDiff = window.outerHeight - window.innerHeight;
		if (widthDiff > 160 || heightDiff > 160) {
			registerViolation();
		}

		let devtoolsOpen = false;
		const element = new Image();
		Object.defineProperty(element, 'id', {
			get: () => {
				devtoolsOpen = true;
				registerViolation();
				return 'detector';
			}
		});

		const start = performance.now();
		const end = performance.now();
		if (end - start > 100) {
			registerViolation();
		}
	}

	let securityLoop;

	$effect(() => {
		if (typeof window === 'undefined') return;
		securityLoop = setInterval(() => {
			detectDevTools();
		}, 2000);
		return () => clearInterval(securityLoop);
	});

	function handleVisibility() {
		if (document.hidden && player?.playing) player.pause();
	}

	function moveWatermark() {
		watermarkPos = { top: Math.random() * 80 + 5, left: Math.random() * 80 + 5 };
	}

	// --- Mobile Gestures ---
	let touchStartX = 0;
	let touchStartY = 0;
	let lastTapTime = 0;
	let singleTapTimeout = null;
	let longPressTimeout = null;
	let isLongPressing = false;
	let initialVolume = 0;
	let initialCurrentTime = 0;

	function showIndicator(text, icon) {
		gestureText = text;
		gestureIcon = icon;
		showGestureIndicator = true;
		if (gestureTimeout) clearTimeout(gestureTimeout);
		gestureTimeout = setTimeout(() => {
			showGestureIndicator = false;
		}, 800);
	}

	function handleTouchStart(e) {
		if (!player) return;
		if (e.touches && e.touches.length > 1) return;

		const touch = e.touches ? e.touches[0] : e;
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
		initialVolume = player.volume;
		initialCurrentTime = player.currentTime;

		longPressTimeout = setTimeout(() => {
			isLongPressing = true;
			player.speed = 2;
			showIndicator('2x Speed', FastForward);
		}, 600);
	}

	function handleTouchMove(e) {
		if (!player || isLongPressing) return;
		const touch = e.touches ? e.touches[0] : e;
		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;

		if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
			if (longPressTimeout) clearTimeout(longPressTimeout);
		}

		const rect = e.currentTarget.getBoundingClientRect();
		const isRightHalf = touchStartX > rect.left + rect.width / 2;

		if (Math.abs(deltaY) > Math.abs(deltaX) && isRightHalf && Math.abs(deltaY) > 20) {
			e.preventDefault();
			const volumeChange = (deltaY / rect.height) * -1;
			player.volume = Math.max(0, Math.min(1, initialVolume + volumeChange));
			showIndicator(`${Math.round(player.volume * 100)}%`, Volume2);
		} else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
			e.preventDefault();
			const seekChange = (deltaX / rect.width) * 90;
			player.currentTime = Math.max(0, Math.min(player.duration, initialCurrentTime + seekChange));
			const dirIcon = deltaX > 0 ? FastForward : Rewind;
			const dirText = deltaX > 0 ? '+' : '';
			showIndicator(`${dirText}${Math.round(seekChange)}s`, dirIcon);
		}
	}

	function handleTouchEnd(e) {
		if (longPressTimeout) clearTimeout(longPressTimeout);
		if (isLongPressing) {
			isLongPressing = false;
			player.speed = 1;
			showGestureIndicator = false;
			return;
		}

		const currentTime = new Date().getTime();
		const tapLength = currentTime - lastTapTime;

		const touch = e.changedTouches ? e.changedTouches[0] : e;
		const rect = e.currentTarget.getBoundingClientRect();
		const isRightHalf = touch.clientX > rect.left + rect.width / 2;

		if (tapLength < 300 && tapLength > 0) {
			if (singleTapTimeout) clearTimeout(singleTapTimeout);
			const seekAmount = 10;
			if (isRightHalf) {
				player.forward(seekAmount);
				showIndicator(`+${seekAmount}s`, FastForward);
			} else {
				player.rewind(seekAmount);
				showIndicator(`-${seekAmount}s`, Rewind);
			}
		} else {
			if (singleTapTimeout) clearTimeout(singleTapTimeout);
			singleTapTimeout = setTimeout(() => {
				player?.togglePlay();
			}, 310);
		}
		lastTapTime = currentTime;
	}

	function handleOverlayClick(e) {
		if (e.pointerType === 'mouse') {
			player?.togglePlay();
		}
	}

	// --- Lifecycle & Effects ---
	onMount(async () => {
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('visibilitychange', handleVisibility);
		window.addEventListener('blur', () => player?.pause());
		watermarkInterval = setInterval(moveWatermark, 10000);

		if (videoElement) {
			const PlyrModule = await import('plyr');
			const Plyr = PlyrModule.default;

			player = new Plyr(videoElement, {
				controls: [
					'play-large',
					'play',
					'progress',
					'current-time',
					'duration',
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
				keyboard: { focused: true, global: false }
			});

			player.on('ready', () => {
				playerReady = true;
				document.documentElement.style.setProperty('--plyr-color-main', '#9b1c48');
			});

			player.on('enterfullscreen', () => {
				if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return;
				try {
					const videoWidth = player.media?.videoWidth || 0;
					const videoHeight = player.media?.videoHeight || 0;
					if (screen.orientation && screen.orientation.lock) {
						if (videoWidth > videoHeight) {
							screen.orientation.lock('landscape').catch(() => {});
						} else {
							screen.orientation.lock('portrait').catch(() => {});
						}
					}
				} catch (e) {}
			});

			player.on('exitfullscreen', () => {
				if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return;
				try {
					if (screen.orientation && screen.orientation.unlock) {
						screen.orientation.unlock();
					}
				} catch (e) {}
			});
		}
	});

	$effect(() => {
		if (player && lesson.id && lastLoadedLessonId !== lesson.id) {
			lastLoadedLessonId = lesson.id;
			isVideoFinished = lesson.is_completed || false;

			const storageKey = getProgressKey(lesson.id);
			const saved = localStorage.getItem(storageKey);

			let isRestored = false;
			let expectedTime = 0;

			if (saved && !isNaN(Number(saved))) {
				expectedTime = parseFloat(saved);
			} else {
				isRestored = true;
			}

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
				}, 4000);
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
		}
		if (watermarkInterval) clearInterval(watermarkInterval);
		if (securityLoop) clearInterval(securityLoop);
		player?.destroy();
	});
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

<!-- ── Video Shell ─────────────────────────────────── -->
<div class="vp-shell">
	<!-- ── Skeleton loader ─────────────────────────────── -->
	{#if !playerReady}
		<div class="vp-skeleton" transition:fade={{ duration: 200 }}>
			<div class="vp-skeleton-spinner"></div>
		</div>
	{/if}

	<!-- ── Video element ───────────────────────────────── -->
	<video
		bind:this={videoElement}
		class="vp-video {playerReady ? 'vp-video--ready' : ''}"
		playsinline
		crossorigin="anonymous"
	>
		{m.video_not_supported ? m.video_not_supported() : "Brauzeringiz videoni qo'llab-quvvatlamaydi."}
	</video>

	<!-- ── Gesture overlay (mobile only, top 70%) ─────── -->
	<button
		type="button"
		class="vp-gesture-overlay"
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		onclick={handleOverlayClick}
		aria-label="Video controls"
	></button>

	<!-- ── Gesture indicator bubble ───────────────────── -->
	{#if showGestureIndicator}
		<div class="vp-gesture-bubble" transition:fade={{ duration: 120 }}>
			{#if gestureIcon}
				<gestureIcon size={28} />
			{/if}
			<span>{gestureText}</span>
		</div>
	{/if}

	<!-- ── Watermark ───────────────────────────────────── -->
	{#if showWatermark}
		<div
			class="vp-watermark"
			style="top: {watermarkPos.top}%; left: {watermarkPos.left}%;"
		>
			{userIdent}
		</div>
	{/if}
</div>

<!-- ── Security lock screen ───────────────────────── -->
{#if securityLocked}
	<div class="vp-lock-screen" transition:fade>
		<div class="vp-lock-icon">
			<Lock size={44} strokeWidth={2} />
		</div>
		<h2 class="vp-lock-title">
			{m.security_lock_title ? m.security_lock_title() : 'Xavfsizlik tizimi faollashdi'}
		</h2>
		<p class="vp-lock-desc">
			{m.security_lock_desc
				? m.security_lock_desc()
				: "Dars materiallarini ko'rish uchun DevTools (inspektor) panelini yoping va sahifani yangilang."}
		</p>
		<button onclick={() => window.location.reload()} class="vp-lock-btn">
			{m.refresh_page ? m.refresh_page() : 'Sahifani yangilash'}
		</button>
		<span class="vp-lock-brand">Chinora Academy Security Guard</span>
	</div>
{/if}

<style>
	/* ── Shell ─────────────────────────────────────────── */
	.vp-shell {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		background: #000;
		border-radius: 16px;
		overflow: hidden;
		/* Native app shadow */
		box-shadow:
			0 2px 4px rgba(0,0,0,0.12),
			0 8px 24px rgba(0,0,0,0.18),
			0 24px 48px rgba(0,0,0,0.12);
	}

	/* No rounded corners on fullscreen */
	:global(.plyr--fullscreen-active) .vp-shell,
	:global(.plyr--fullscreen) .vp-shell {
		border-radius: 0;
	}

	/* ── Skeleton ──────────────────────────────────────── */
	.vp-skeleton {
		position: absolute;
		inset: 0;
		z-index: 30;
		background: #0d0d0d;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.vp-skeleton-spinner {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 3px solid rgba(155, 28, 72, 0.2);
		border-top-color: #9b1c48;
		animation: vp-spin 0.7s linear infinite;
	}

	/* ── Video ─────────────────────────────────────────── */
	.vp-video {
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 0.3s ease;
		display: block;
	}

	.vp-video--ready {
		opacity: 1;
	}

	/* ── Gesture overlay ───────────────────────────────── */
	.vp-gesture-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 70%;
		z-index: 2;
		background: transparent;
		border: none;
		outline: none;
		cursor: pointer;
		touch-action: none;
		pointer-events: none; /* desktop: off by default */
	}

	/* Mobile: enable touch */
	@media (pointer: coarse) {
		.vp-gesture-overlay {
			pointer-events: auto;
		}
	}

	/* ── Gesture bubble ────────────────────────────────── */
	.vp-gesture-bubble {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 20;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		background: rgba(0, 0, 0, 0.72);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border-radius: 18px;
		padding: 14px 22px;
		color: #fff;
		pointer-events: none;
	}

	.vp-gesture-bubble span {
		font-size: 18px;
		font-weight: 800;
		letter-spacing: 0.04em;
		font-family: inherit;
	}

	/* ── Watermark ─────────────────────────────────────── */
	.vp-watermark {
		position: absolute;
		z-index: 10;
		font-size: 11px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.15);
		pointer-events: none;
		user-select: none;
		transition: top 1.2s ease, left 1.2s ease;
		letter-spacing: 0.06em;
	}

	/* ── Lock screen ───────────────────────────────────── */
	.vp-lock-screen {
		position: fixed;
		inset: 0;
		z-index: 9999;
		background: var(--bg-main, #0f0f0f);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		backdrop-filter: blur(20px);
	}

	.vp-lock-icon {
		width: 96px;
		height: 96px;
		border-radius: 28px;
		background: rgba(155, 28, 72, 0.15);
		border: 1.5px solid rgba(155, 28, 72, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #9b1c48;
		margin-bottom: 1.75rem;
	}

	.vp-lock-title {
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 900;
		color: var(--text-main, #fff);
		letter-spacing: -0.02em;
		margin: 0 0 0.75rem;
	}

	.vp-lock-desc {
		font-size: 1rem;
		line-height: 1.65;
		color: var(--text-muted, rgba(255,255,255,0.5));
		max-width: 420px;
		margin: 0 0 2rem;
	}

	.vp-lock-btn {
		height: 48px;
		padding: 0 2rem;
		border-radius: 14px;
		border: none;
		background: var(--bg-card, rgba(255,255,255,0.08));
		color: var(--text-main, #fff);
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
		font-family: inherit;
	}

	.vp-lock-btn:hover { background: rgba(155, 28, 72, 0.2); }
	.vp-lock-btn:active { transform: scale(0.97); }

	.vp-lock-brand {
		margin-top: 1.25rem;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-muted, rgba(255,255,255,0.2));
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.vp-lock-brand::before {
		content: '';
		display: block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #9b1c48;
		animation: vp-blink 2s infinite;
	}

	/* ═══════════════════════════════════════════════════
	   PLYR OVERRIDES — YouTube/Native App Style
	═══════════════════════════════════════════════════ */

	/* ── Core variables ────────────────────────────────── */
	:global(.plyr) {
		--plyr-color-main: #9b1c48;
		--plyr-video-background: #000;
		--plyr-font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
		--plyr-font-size-base: 14px;
		--plyr-font-size-small: 12px;
		--plyr-font-weight-regular: 500;
		--plyr-font-weight-bold: 700;

		/* Controls bar */
		--plyr-control-spacing: 10px;
		--plyr-control-padding: 8px;
		--plyr-control-radius: 10px;
		--plyr-control-icon-size: 18px;
		--plyr-control-toggle-checked-background: #9b1c48;

		/* Progress / Range */
		--plyr-range-track-height: 4px;
		--plyr-range-thumb-height: 16px;
		--plyr-range-thumb-width: 16px;
		--plyr-range-thumb-shadow: 0 2px 8px rgba(0,0,0,0.5);
		--plyr-range-thumb-background: #fff;
		--plyr-video-range-track-background: rgba(255,255,255,0.22);
		--plyr-video-progress-buffered-background: rgba(255,255,255,0.32);

		/* Tooltip */
		--plyr-tooltip-background: rgba(0,0,0,0.85);
		--plyr-tooltip-color: #fff;
		--plyr-tooltip-radius: 8px;
		--plyr-tooltip-padding: 5px 10px;
		--plyr-tooltip-arrow-size: 5px;

		/* Menu */
		--plyr-menu-background: rgba(10,10,10,0.96);
		--plyr-menu-border-color: rgba(255,255,255,0.08);
		--plyr-menu-color: rgba(255,255,255,0.85);

		width: 100% !important;
		height: 100% !important;
		border-radius: 0;
		font-family: var(--plyr-font-family);
	}

	/* ── Controls container — YouTube-style bottom bar ── */
	:global(.plyr--video .plyr__controls) {
		padding: 0 12px 10px !important;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.88) 0%,
			rgba(0, 0, 0, 0.55) 50%,
			transparent 100%
		) !important;
		gap: 0 !important;
		flex-wrap: nowrap !important;
		align-items: flex-end !important;
	}

	/* ── Progress row — full width, own line ───────────── */
	:global(.plyr__progress) {
		width: 100% !important;
		flex: 0 0 100% !important;
		order: -1;
		margin-bottom: 6px !important;
		padding: 0 !important;
	}

	/* ── Seek bar: thicker, easier to grab ─────────────── */
	:global(.plyr__progress input[type='range']) {
		height: 4px !important;
		cursor: pointer;
		transition: height 0.15s ease;
	}

	/* Expand seek bar on hover/focus for easier grabbing */
	:global(.plyr__progress:hover input[type='range']),
	:global(.plyr__progress input[type='range']:active) {
		height: 6px !important;
	}

	/* Thumb — bigger, more tappable */
	:global(.plyr__progress input[type='range']::-webkit-slider-thumb) {
		width: 16px !important;
		height: 16px !important;
		box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 0 3px rgba(155,28,72,0.3) !important;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	:global(.plyr__progress input[type='range']:active::-webkit-slider-thumb) {
		transform: scale(1.3) !important;
		box-shadow: 0 3px 12px rgba(0,0,0,0.6), 0 0 0 5px rgba(155,28,72,0.4) !important;
	}

	/* Buffer fill */
	:global(.plyr__progress .plyr__progress__buffer) {
		border-radius: 999px !important;
	}

	/* ── Large play button — centered, clean ───────────── */
	:global(.plyr--full-ui.plyr--video .plyr__control--overlaid) {
		background: rgba(155, 28, 72, 0.9) !important;
		border: 2px solid rgba(255,255,255,0.15) !important;
		width: 64px !important;
		height: 64px !important;
		border-radius: 50% !important;
		padding: 0 !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		backdrop-filter: blur(4px);
		transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease !important;
		box-shadow: 0 4px 24px rgba(155, 28, 72, 0.5) !important;
	}

	:global(.plyr--full-ui.plyr--video .plyr__control--overlaid:hover) {
		background: #9b1c48 !important;
		transform: scale(1.1) !important;
		box-shadow: 0 6px 32px rgba(155, 28, 72, 0.65) !important;
	}

	:global(.plyr--full-ui.plyr--video .plyr__control--overlaid:active) {
		transform: scale(0.94) !important;
	}

	:global(.plyr--full-ui.plyr--video .plyr__control--overlaid svg) {
		width: 26px !important;
		height: 26px !important;
		margin-left: 3px; /* optical center */
	}

	/* ── Bottom bar buttons ────────────────────────────── */
	:global(.plyr--video .plyr__controls .plyr__control) {
		padding: 7px !important;
		border-radius: 8px !important;
		transition: background 0.12s, transform 0.1s !important;
		color: rgba(255,255,255,0.9) !important;
	}

	:global(.plyr--video .plyr__controls .plyr__control:hover) {
		background: rgba(255,255,255,0.12) !important;
		color: #fff !important;
	}

	:global(.plyr--video .plyr__controls .plyr__control:active) {
		transform: scale(0.88) !important;
		background: rgba(255,255,255,0.18) !important;
	}

	/* Play/pause button in controls — slightly bigger */
	:global(.plyr--video .plyr__controls [data-plyr="play"]) {
		padding: 8px !important;
	}

	:global(.plyr--video .plyr__controls [data-plyr="play"] svg) {
		width: 20px !important;
		height: 20px !important;
	}

	/* ── Time display ──────────────────────────────────── */
	:global(.plyr__time) {
		font-size: 12px !important;
		font-weight: 600 !important;
		color: rgba(255,255,255,0.85) !important;
		letter-spacing: 0.02em !important;
		font-variant-numeric: tabular-nums !important;
	}

	:global(.plyr__time--current) {
		color: #fff !important;
		font-weight: 700 !important;
	}

	/* Separator between current/duration */
	:global(.plyr__time + .plyr__time::before) {
		color: rgba(255,255,255,0.4) !important;
	}

	/* ── Volume ────────────────────────────────────────── */
	:global(.plyr__volume input[type='range']) {
		height: 3px !important;
		width: 72px !important;
	}

	:global(.plyr__volume input[type='range']::-webkit-slider-thumb) {
		width: 13px !important;
		height: 13px !important;
	}

	/* ── Settings menu — glass morphism ────────────────── */
	:global(.plyr__menu__container) {
		border-radius: 14px !important;
		overflow: hidden !important;
		background: rgba(8, 8, 8, 0.95) !important;
		backdrop-filter: blur(16px) !important;
		-webkit-backdrop-filter: blur(16px) !important;
		border: 1px solid rgba(255,255,255,0.1) !important;
		box-shadow: 0 16px 48px rgba(0,0,0,0.6) !important;
		min-width: 180px !important;
	}

	:global(.plyr__menu__container [role='menuitem']) {
		border-radius: 8px !important;
		margin: 2px 6px !important;
		padding: 10px 12px !important;
		font-size: 13.5px !important;
		font-weight: 500 !important;
		transition: background 0.12s !important;
	}

	:global(.plyr__menu__container [role='menuitem']:hover) {
		background: rgba(155, 28, 72, 0.18) !important;
		color: #fff !important;
	}

	:global(.plyr__menu__container [aria-checked='true']) {
		color: #9b1c48 !important;
		font-weight: 700 !important;
	}

	/* ── Captions ──────────────────────────────────────── */
	:global(.plyr__captions) {
		font-size: clamp(13px, 2.5vw, 16px) !important;
		font-weight: 600 !important;
		text-shadow: 0 1px 4px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7) !important;
		padding: 0 1rem 3rem !important;
	}

	:global(.plyr__caption) {
		background: rgba(0,0,0,0.72) !important;
		border-radius: 6px !important;
		padding: 3px 10px !important;
		backdrop-filter: blur(4px) !important;
	}

	/* ── Tooltip ───────────────────────────────────────── */
	:global(.plyr__tooltip) {
		font-size: 12px !important;
		font-weight: 600 !important;
		border-radius: 8px !important;
		padding: 5px 10px !important;
		background: rgba(0,0,0,0.88) !important;
		backdrop-filter: blur(6px) !important;
	}

	/* ── Mobile overrides ──────────────────────────────── */
	@media (max-width: 640px) {
		/* Shell: no rounding on mobile, edge-to-edge */
		.vp-shell {
			border-radius: 12px;
		}

		/* Bigger controls for fingers */
		:global(.plyr--video .plyr__controls .plyr__control) {
			padding: 10px !important;
			min-width: 38px !important;
			min-height: 38px !important;
		}

		/* Hide volume slider — we have swipe gestures */
		:global(.plyr__volume input[type='range']) {
			display: none !important;
		}

		/* Thicker seek bar on mobile */
		:global(.plyr__progress input[type='range']) {
			height: 5px !important;
		}

		:global(.plyr__progress input[type='range']::-webkit-slider-thumb) {
			width: 20px !important;
			height: 20px !important;
		}

		/* Bigger play button on mobile */
		:global(.plyr--full-ui.plyr--video .plyr__control--overlaid) {
			width: 72px !important;
			height: 72px !important;
		}

		:global(.plyr--full-ui.plyr--video .plyr__control--overlaid svg) {
			width: 30px !important;
			height: 30px !important;
		}

		/* Bottom controls more padding for thumb reach */
		:global(.plyr--video .plyr__controls) {
			padding: 0 8px 14px !important;
		}

		/* Hide pip/airplay on mobile — rarely useful */
		:global([data-plyr="pip"]),
		:global([data-plyr="airplay"]) {
			display: none !important;
		}

		/* Bigger font in menu */
		:global(.plyr__menu__container [role='menuitem']) {
			font-size: 15px !important;
			padding: 13px 14px !important;
			min-height: 46px !important;
		}
	}

	/* ── Fullscreen refinements ────────────────────────── */
	:global(.plyr--fullscreen-active .plyr__controls),
	:global(.plyr--fullscreen .plyr__controls) {
		padding-bottom: max(14px, env(safe-area-inset-bottom)) !important;
	}

	:global(.plyr--fullscreen-active .plyr__control--overlaid),
	:global(.plyr--fullscreen .plyr__control--overlaid) {
		width: 80px !important;
		height: 80px !important;
	}

	:global(.plyr--fullscreen-active .plyr__control--overlaid svg),
	:global(.plyr--fullscreen .plyr__control--overlaid svg) {
		width: 34px !important;
		height: 34px !important;
	}

	/* ── Hide native controls always ──────────────────── */
	:global(video::-webkit-media-controls-enclosure) {
		display: none !important;
	}

	/* ── Smooth controls show/hide ─────────────────────── */
	:global(.plyr__controls) {
		transition: opacity 0.28s ease, transform 0.28s ease !important;
	}

	:global(.plyr--hide-controls .plyr__controls) {
		opacity: 0 !important;
		transform: translateY(4px) !important;
	}

	/* ── Animations ─────────────────────────────────────── */
	@keyframes vp-spin {
		to { transform: rotate(360deg); }
	}

	@keyframes vp-blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}
</style>