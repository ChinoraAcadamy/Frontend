<script lang="ts">
	import { navigating } from '$app/stores';

	let progress = $state(0);
	let visible = $state(false);
	let completing = $state(false);
	let timer;
	let completeTimer;
	let hideTimer;
	let resetTimer;

	$effect(() => {
		if ($navigating) {
			// Avvalgi timerlarni tozalash
			clearInterval(timer);
			clearTimeout(completeTimer);
			clearTimeout(hideTimer);
			clearTimeout(resetTimer);

			completing = false;
			visible = true;
			progress = 0;

			// Keyingi tick'da boshlash (CSS transition ishlashi uchun)
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					progress = 18;

					timer = setInterval(() => {
						if (progress >= 85) {
							clearInterval(timer);
						} else {
							// Tezlik: boshida tez, oxirida sekin
							const remaining = 85 - progress;
							const increment = remaining * 0.08 + 0.4;
							progress = Math.min(progress + increment, 85);
						}
					}, 250);
				});
			});
		} else {
			clearInterval(timer);

			if (visible) {
				completing = true;
				progress = 100;

				completeTimer = setTimeout(() => {
					visible = false;

					hideTimer = setTimeout(() => {
						progress = 0;
						completing = false;
					}, 350);
				}, 380);
			}
		}
	});
</script>

<!-- Bar -->
<div
	class="topbar"
	class:topbar--visible={visible}
	class:topbar--completing={completing}
	style="--p:{progress}%"
	aria-hidden="true"
>
	<!-- Shimmer highlight -->
	{#if visible && progress > 0 && progress < 100}
		<div class="topbar-shimmer"></div>
	{/if}

	<!-- Glow orb at the tip -->
	{#if visible && progress > 0 && progress < 100}
		<div class="topbar-orb"></div>
	{/if}
</div>

<style>
	.topbar {
		position: fixed;
		top: 0;
		left: 0;
		height: 2.5px;
		width: var(--p, 0%);
		z-index: 9999;
		pointer-events: none;

		background: linear-gradient(
			90deg,
			#9b1c48 0%,
			#d63a6e 50%,
			#ff6b9d 100%
		);

		/* Opacity transition */
		opacity: 0;
		transition:
			width 280ms cubic-bezier(0.1, 0.05, 0, 1),
			opacity 250ms ease;

		/* Glow */
		box-shadow:
			0 0 8px rgba(155, 28, 72, 0.6),
			0 0 2px rgba(214, 58, 110, 0.4);

		/* Prevent sub-pixel rendering artifacts */
		will-change: width, opacity;
		transform: translateZ(0);
	}

	.topbar--visible {
		opacity: 1;
	}

	/* Completion: fast width, then fade */
	.topbar--completing {
		transition:
			width 300ms cubic-bezier(0.4, 0, 0.2, 1),
			opacity 300ms ease 360ms;
		opacity: 0;
	}

	/* Shimmer — soft white highlight traveling right */
	.topbar-shimmer {
		position: absolute;
		top: 0;
		right: 0;
		width: 80px;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.45) 60%,
			rgba(255, 255, 255, 0.0) 100%
		);
		animation: shimmer-move 1.6s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes shimmer-move {
		0%   { opacity: 0.4; transform: scaleX(0.7); }
		50%  { opacity: 1;   transform: scaleX(1); }
		100% { opacity: 0.4; transform: scaleX(0.7); }
	}

	/* Orb — glowing dot at the leading edge */
	.topbar-orb {
		position: absolute;
		top: 50%;
		right: -1px;
		transform: translateY(-50%);
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #ff8ab5;
		box-shadow:
			0 0 6px 2px rgba(255, 107, 157, 0.7),
			0 0 14px 4px rgba(155, 28, 72, 0.4);
		pointer-events: none;
	}
</style>