<script lang="ts">
	import { Lock, ArrowRight, BookOpen, Tag } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		id,
		title,
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

<article
	class="course-card {isLocked ? 'course-card--locked' : ''} {isCompleted
		? 'course-card--completed'
		: ''}"
>
	<!-- Thumbnail -->
	<div class="card-thumb {isLocked ? 'card-thumb--locked' : ''}">
		<img
			src={displayImage}
			alt={title}
			class="thumb-img"
			width="400"
			height="225"
			loading="lazy"
			onerror={handleImageError}
		/>
		{#if isLocked}
			<div class="thumb-overlay">
				<Lock size={18} />
			</div>
		{/if}
		{#if isCompleted}
			<div class="completion-badge">
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path
						d="M2 6L5 9L10 3"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				{m.course_completed()}
			</div>
		{/if}
	</div>

	<!-- Body -->
	<div class="card-body {isLocked ? 'card-body--locked' : ''}">
		<div class="card-info">
			<h3 class="card-title">{title}</h3>
			<div class="card-meta">
				<span class="meta-item">
					<BookOpen size={11} />
					{lessons}
					{m.lessons_label()}
				</span>
				<span class="meta-dot"></span>
				<span class="meta-item">
					<Tag size={11} />
					{price}
					{m.price_label()}
				</span>
			</div>
		</div>

		<!-- Progress -->
		<div class="card-progress">
			<div class="progress-header">
				<span class="progress-label">{m.course_progress()}</span>
				<span class="progress-value {isCompleted ? 'progress-value--done' : ''}">{progress}%</span>
			</div>
			<div class="progress-track">
				<div
					class="progress-fill {isCompleted ? 'progress-fill--done' : ''}"
					style="width: {progress}%"
				></div>
			</div>
		</div>

		<!-- Action -->
		<div class="card-action">
			<button
				onclick={() => onContinue?.(id)}
				disabled={isLocked}
				class="action-btn {isLocked
					? 'action-btn--locked'
					: isCompleted
						? 'action-btn--done'
						: 'action-btn--active'}"
			>
				{#if isLocked}
					<Lock size={13} />
					{m.course_contact_admin()}
				{:else if isCompleted}
					<svg width="13" height="13" viewBox="0 0 12 12" fill="none">
						<path
							d="M2 6L5 9L10 3"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					{m.course_review()}
				{:else}
					{m.course_continue()}
					<ArrowRight size={13} class="btn-arrow" />
				{/if}
			</button>
		</div>
	</div>
</article>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

	.course-card {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 0;
		background: var(--bg-card);
		border-radius: 18px;
		border: 1.5px solid var(--border-main);
		overflow: hidden;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.15s ease;
		font-family: 'Instrument Sans', 'Helvetica Neue', sans-serif;
		position: relative;
	}

	.course-card::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background: var(--primary);
		opacity: 0;
		transition: opacity 0.2s ease;
		border-radius: 18px 0 0 18px;
	}

	.course-card:not(.course-card--locked):hover {
		border-color: var(--primary);
		box-shadow: 0 8px 32px rgba(155, 28, 72, 0.1);
		transform: translateX(2px);
	}

	.course-card:not(.course-card--locked):hover::before {
		opacity: 1;
	}

	.course-card--locked {
		background: var(--bg-main);
		border-color: var(--border-main);
	}

	.course-card--completed::before {
		background: #10b981;
	}

	/* ── Thumbnail ─────────────────────────── */
	.card-thumb {
		position: relative;
		overflow: hidden;
		background: var(--bg-main);
		flex-shrink: 0;
	}

	.card-thumb--locked {
		filter: grayscale(0.7);
		opacity: 0.65;
	}

	.thumb-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.5s ease;
	}

	.course-card:not(.course-card--locked):hover .thumb-img {
		transform: scale(1.06);
	}

	.thumb-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.completion-badge {
		position: absolute;
		bottom: 8px;
		left: 8px;
		display: flex;
		align-items: center;
		gap: 4px;
		background: #10b981;
		color: #fff;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: 999px;
	}

	/* ── Body ──────────────────────────────── */
	.card-body {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.125rem;
		min-width: 0;
	}

	.card-body--locked {
		opacity: 0.6;
	}

	/* Info */
	.card-info {
		min-width: 0;
	}

	.card-title {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-main);
		letter-spacing: -0.01em;
		line-height: 1.3;
		margin: 0 0 5px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.15s;
	}

	.course-card:not(.course-card--locked):hover .card-title {
		color: var(--primary);
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
		letter-spacing: 0.01em;
	}

	.meta-dot {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--border-main);
	}

	/* Progress */
	.card-progress {
		width: 140px;
		flex-shrink: 0;
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
	}

	.progress-label {
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.progress-value {
		font-size: 12px;
		font-weight: 700;
		color: var(--text-main);
		font-variant-numeric: tabular-nums;
	}

	.progress-value--done {
		color: #10b981;
	}

	.progress-track {
		height: 5px;
		background: var(--bg-main);
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--primary);
		border-radius: 999px;
		transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.progress-fill--done {
		background: #10b981;
	}

	/* Action button */
	.card-action {
		flex-shrink: 0;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 0 1.125rem;
		height: 38px;
		border-radius: 10px;
		border: none;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition:
			background 0.15s,
			box-shadow 0.15s,
			transform 0.1s;
		white-space: nowrap;
		font-family: inherit;
	}

	.action-btn--active {
		background: var(--primary);
		color: #fff;
		box-shadow: 0 3px 12px rgba(155, 28, 72, 0.22);
	}

	.action-btn--active:hover {
		background: var(--primary-hover);
		box-shadow: 0 5px 18px rgba(155, 28, 72, 0.3);
		transform: translateY(-1px);
	}

	.action-btn--active:active {
		transform: translateY(0) scale(0.97);
	}

	.action-btn--done {
		background: var(--bg-main);
		color: #10b981;
	}

	.action-btn--done:hover {
		background: var(--border-main);
	}

	.action-btn--locked {
		background: var(--bg-main);
		color: var(--text-muted);
		cursor: not-allowed;
	}

	:global(.btn-arrow) {
		transition: transform 0.2s ease;
	}

	.action-btn--active:hover :global(.btn-arrow) {
		transform: translateX(3px);
	}

	/* ── Responsive ─────────────────────────── */

	/* Medium: tablet */
	@media (max-width: 720px) {
		.card-thumb {
			width: 100px;
		}

		.card-body {
			grid-template-columns: 1fr auto;
			grid-template-rows: auto auto;
			gap: 0.625rem 0.875rem;
			padding: 0.875rem 1rem;
		}

		.card-info {
			grid-column: 1;
			grid-row: 1;
		}

		.card-progress {
			grid-column: 1;
			grid-row: 2;
			width: 100%;
		}

		.card-action {
			grid-column: 2;
			grid-row: 1 / 3;
			display: flex;
			align-items: center;
		}

		.action-btn {
			padding: 0 0.875rem;
			height: 36px;
			font-size: 11.5px;
		}
	}

	/* Small: mobile */
	@media (max-width: 480px) {
		.course-card {
			grid-template-columns: 90px 1fr;
			border-radius: 14px;
		}

		.card-body {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			gap: 0.5rem;
			padding: 0.75rem 0.875rem;
		}

		.card-info {
			grid-column: 1;
			grid-row: 1;
		}
		.card-progress {
			grid-column: 1;
			grid-row: 2;
			width: 100%;
		}
		.card-action {
			grid-column: 1;
			grid-row: 3;
		}

		.action-btn {
			width: 100%;
			justify-content: center;
			height: 36px;
		}

		.card-title {
			font-size: 0.8125rem;
		}
	}
</style>
