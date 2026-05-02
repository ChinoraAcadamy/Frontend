<script lang="ts">
	import { Lock, BookOpen, Tag, ArrowRight } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		id,
		title,
		subtitle,
		image,
		progress = 0,
		price = 0,
		lessons = 0,
		status = 'active',
		onContinue
	} = $props();

	let isLocked = $derived(status === 'locked');
	let isCompleted = $derived(status === 'completed');

	/** @param {Event} e */
	function handleImageError(e) {
		const target = e.currentTarget;
		target.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
	}

	let displayImage = $derived(
		image || `https://placehold.co/600x400?text=${encodeURIComponent(title)}`
	);
</script>

<article class="gc {isLocked ? 'gc--locked' : ''} {isCompleted ? 'gc--completed' : ''}">
	<!-- Thumbnail -->
	<div class="gc-thumb">
		<img
			src={displayImage}
			alt={title}
			class="gc-img"
			width="400"
			height="225"
			loading="lazy"
			onerror={handleImageError}
		/>

		{#if isLocked}
			<div class="gc-lock-veil">
				<div class="gc-lock-icon">
					<Lock size={20} strokeWidth={2.5} />
				</div>
			</div>
			<span class="gc-locked-badge">{m.course_locked()}</span>
		{/if}

		{#if isCompleted}
			<div class="completion-badge">
				<svg width="11" height="11" viewBox="0 0 12 12" fill="none">
					<path
						d="M2 6L5 9L10 3"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				{m.course_completed()}
			</div>
		{/if}

		<!-- Progress strip on thumb bottom -->
		<div class="gc-thumb-progress">
			<div
				class="gc-thumb-fill {isCompleted ? 'gc-thumb-fill--done' : ''}"
				style="width: {progress}%"
			></div>
		</div>
	</div>

	<!-- Body -->
	<div class="gc-body {isLocked ? 'gc-body--locked' : ''}">
		<div class="gc-content">
			<h3 class="gc-title">{title}</h3>
			{#if subtitle}
				<p class="gc-subtitle">{subtitle}</p>
			{/if}

			<div class="gc-stats">
				<span class="gc-stat">
					<BookOpen size={11} />
					{lessons}
					{m.lessons_label ? m.lessons_label() : 'dars'}
				</span>
				<span class="gc-stat-dot"></span>
				<span class="gc-stat">
					<Tag size={11} />
					{price}
					{m.price_label ? m.price_label() : "so'm"}
				</span>
			</div>
		</div>

		<!-- Progress -->
		<div class="gc-progress-wrap">
			<div class="gc-progress-header">
				<span class="gc-progress-label">{m.course_progress()}</span>
				<span class="gc-progress-val {isCompleted ? 'gc-progress-val--done' : ''}">{progress}%</span
				>
			</div>
			<div class="gc-track">
				<div class="gc-fill {isCompleted ? 'gc-fill--done' : ''}" style="width: {progress}%"></div>
			</div>
		</div>

		<!-- CTA -->
		<button
			onclick={() => onContinue?.(id)}
			disabled={isLocked}
			class="gc-btn {isLocked ? 'gc-btn--locked' : isCompleted ? 'gc-btn--done' : 'gc-btn--active'}"
		>
			{#if isLocked}
				<Lock size={13} />
				{m.course_contact_admin()}
			{:else if isCompleted}
				<svg width="13" height="13" viewBox="0 0 12 12" fill="none">
					<path
						d="M2 6L5 9L10 3"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				{m.course_review()}
			{:else}
				{m.course_continue()}
				<ArrowRight size={13} class="gc-arrow" />
			{/if}
		</button>
	</div>
</article>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

	.gc {
		display: flex;
		flex-direction: column;
		background: var(--bg-card);
		border-radius: 20px;
		border: 1.5px solid var(--border-main);
		overflow: hidden;
		transition:
			border-color 0.2s,
			box-shadow 0.2s,
			transform 0.2s;
		font-family: 'Instrument Sans', 'Helvetica Neue', sans-serif;
		height: 100%;
	}

	.gc:not(.gc--locked):hover {
		border-color: var(--primary);
		box-shadow: 0 12px 40px rgba(155, 28, 72, 0.12);
		transform: translateY(-3px);
	}

	.gc--locked {
		background: var(--bg-main);
	}

	/* ── Thumb ─────────────────────────── */
	.gc-thumb {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--bg-main);
		flex-shrink: 0;
	}

	.gc-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.55s ease;
	}

	.gc:not(.gc--locked):hover .gc-img {
		transform: scale(1.07);
	}

	.gc--locked .gc-img {
		filter: grayscale(0.6);
		opacity: 0.65;
	}

	.gc-lock-veil {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.gc-lock-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(4px);
		border: 1.5px solid rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.gc-locked-badge {
		position: absolute;
		top: 10px;
		right: 10px;
		background: #000;
		backdrop-filter: blur(6px);
		color: #fff;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 3px 9px;
		border-radius: 999px;
	}

	.gc-done-badge {
		position: absolute;
		bottom: 14px;
		left: 10px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		background: #10b981;
		color: #fff;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 9px;
		border-radius: 999px;
	}

	.gc-thumb-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(0, 0, 0, 0.1);
	}

	.gc-thumb-fill {
		height: 100%;
		background: var(--primary);
		transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.gc-thumb-fill--done {
		background: #10b981;
	}

	/* ── Body ──────────────────────────── */
	.gc-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 1.125rem 1.25rem 1.25rem;
		gap: 0.875rem;
	}

	.gc-body--locked {
		opacity: 0.55;
	}

	.gc-content {
		flex: 1;
	}

	.gc-title {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-main);
		line-height: 1.35;
		letter-spacing: -0.01em;
		margin: 0 0 5px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.15s;
	}

	.gc:not(.gc--locked):hover .gc-title {
		color: var(--primary);
	}

	.gc-subtitle {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--text-muted);
		margin: 0 0 8px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.gc-stats {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.gc-stat {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
	}

	.gc-stat-dot {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--border-main);
	}

	/* ── Progress ──────────────────────── */
	.gc-progress-wrap {
	}

	.gc-progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
	}

	.gc-progress-label {
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.gc-progress-val {
		font-size: 12px;
		font-weight: 700;
		color: var(--text-main);
		font-variant-numeric: tabular-nums;
	}

	.gc-progress-val--done {
		color: #10b981;
	}

	.gc-track {
		height: 5px;
		background: var(--bg-main);
		border-radius: 999px;
		overflow: hidden;
	}

	.gc-fill {
		height: 100%;
		background: var(--primary);
		border-radius: 999px;
		transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.gc-fill--done {
		background: #10b981;
	}

	/* ── Button ────────────────────────── */
	.gc-btn {
		width: 100%;
		height: 42px;
		border-radius: 12px;
		border: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition:
			background 0.15s,
			box-shadow 0.15s,
			transform 0.1s;
		font-family: inherit;
		flex-shrink: 0;
	}

	.gc-btn--active {
		background: var(--primary);
		color: #fff;
		box-shadow: 0 3px 14px rgba(155, 28, 72, 0.22);
	}

	.gc-btn--active:hover {
		background: var(--primary-hover);
		box-shadow: 0 5px 20px rgba(155, 28, 72, 0.3);
		transform: translateY(-1px);
	}

	.gc-btn--active:active {
		transform: scale(0.97);
	}

	.gc-btn--done {
		background: var(--bg-main);
		color: #10b981;
	}

	.gc-btn--done:hover {
		background: var(--border-main);
	}

	.gc-btn--locked {
		background: var(--bg-main);
		color: var(--text-muted);
		cursor: not-allowed;
	}

	:global(.gc-arrow) {
		transition: transform 0.2s;
	}

	.gc-btn--active:hover :global(.gc-arrow) {
		transform: translateX(3px);
	}
</style>
