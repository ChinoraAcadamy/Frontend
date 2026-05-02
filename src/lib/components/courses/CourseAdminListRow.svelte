<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';
	import { Play, Pencil, BookOpen, Tag } from 'lucide-svelte';

	let { title, price, modules, status, image, link } = $props();

	const isPublished = $derived(status === 'published' || status === 'active');

	function handleImageError(e) {
		e.currentTarget.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
	}

	let displayImage = $derived(
		image || `https://placehold.co/600x400?text=${encodeURIComponent(title)}`
	);
</script>

<article class="alr">
	<!-- Thumb -->
	<div class="alr-thumb">
		<img src={displayImage} alt={title} class="alr-img" loading="lazy" onerror={handleImageError} />
		<span class="alr-status {isPublished ? 'alr-status--live' : 'alr-status--draft'}">
			<span class="alr-dot"></span>
		</span>
	</div>

	<!-- Info -->
	<div class="alr-info">
		<h3 class="alr-title">{title}</h3>
		<div class="alr-meta">
			<span class="alr-meta-item">
				<BookOpen size={10} />
				{modules}
				{m.admin_courses_modules?.() ?? 'modul'}
			</span>
			<span class="alr-sep"></span>
			<span class="alr-meta-item">
				<Tag size={10} />
				{price}
				{m.price_label?.() ?? "so'm"}
			</span>
		</div>
	</div>

	<!-- Status label (hidden on mobile) -->
	<div
		class="alr-status-label {isPublished ? 'alr-status-label--live' : 'alr-status-label--draft'}"
	>
		{isPublished
			? (m.admin_courses_status_published?.() ?? 'Nashr')
			: (m.admin_courses_status_draft?.() ?? 'Qoralama')}
	</div>

	<!-- Actions -->
	<div class="alr-actions">
		<a
			href={resolve(`/admin/courses/${link}`)}
			onclick={() => sessionStorage.setItem('admin_course_detail_tab', 'content')}
			class="alr-btn alr-btn--preview"
		>
			<Play size={11} class="fill-current" />
			<span class="alr-btn-label">{m.admin_courses_preview?.() ?? "Ko'rish"}</span>
		</a>
		<a
			href={resolve(`/admin/courses/${link}`)}
			onclick={() => sessionStorage.setItem('admin_course_detail_tab', 'settings')}
			class="alr-btn alr-btn--edit"
		>
			<Pencil size={11} />
			<span class="alr-btn-label">{m.admin_courses_edit?.() ?? 'Tahrirlash'}</span>
		</a>
	</div>
</article>

<style>
	.alr {
		display: grid;
		grid-template-columns: 96px 1fr auto auto;
		align-items: center;
		gap: 1rem;
		background: var(--bg-card);
		border-radius: 16px;
		border: 1.5px solid var(--border-main);
		padding: 0.75rem 1rem 0.75rem 0.75rem;
		transition:
			border-color 160ms,
			box-shadow 160ms,
			transform 160ms;
		overflow: hidden;
	}

	.alr:hover {
		border-color: rgba(155, 28, 72, 0.25);
		box-shadow: 0 6px 24px rgba(155, 28, 72, 0.08);
		transform: translateX(2px);
	}

	/* Thumb */
	.alr-thumb {
		position: relative;
		width: 96px;
		height: 62px;
		border-radius: 10px;
		overflow: hidden;
		background: var(--bg-main);
		flex-shrink: 0;
	}

	.alr-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 380ms ease;
	}

	.alr:hover .alr-img {
		transform: scale(1.07);
	}

	.alr-status {
		position: absolute;
		bottom: 6px;
		left: 6px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 2px solid var(--bg-card);
	}

	.alr-status--live {
		background: #10b981;
	}
	.alr-status--draft {
		background: #f59e0b;
	}

	.alr-dot {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: currentColor;
	}

	.alr-status--live .alr-dot {
		animation: pulse 2.2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}

	/* Info */
	.alr-info {
		min-width: 0;
	}

	.alr-title {
		font-size: 13.5px;
		font-weight: 700;
		color: var(--text-main);
		letter-spacing: -0.01em;
		line-height: 1.3;
		margin: 0 0 5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: color 140ms;
	}

	.alr:hover .alr-title {
		color: #9b1c48;
	}

	.alr-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.alr-meta-item {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
	}

	.alr-sep {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--border-main);
	}

	/* Status label */
	.alr-status-label {
		flex-shrink: 0;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		padding: 4px 11px;
		border-radius: 999px;
	}

	.alr-status-label--live {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}

	.alr-status-label--draft {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	@media (max-width: 580px) {
		.alr-status-label {
			display: none;
		}
	}

	/* Actions */
	.alr-actions {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-shrink: 0;
	}

	.alr-btn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		height: 34px;
		padding: 0 12px;
		border-radius: 9px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.03em;
		text-decoration: none;
		transition:
			background 140ms,
			box-shadow 140ms,
			transform 100ms;
		white-space: nowrap;
	}

	.alr-btn--preview {
		background: var(--bg-main);
		color: var(--text-muted);
		border: 1.5px solid var(--border-main);
	}

	.alr-btn--preview:hover {
		background: var(--bg-card);
		color: var(--text-main);
		border-color: rgba(155, 28, 72, 0.2);
	}

	.alr-btn--edit {
		background: #9b1c48;
		color: #fff;
		box-shadow: 0 2px 10px rgba(155, 28, 72, 0.2);
	}

	.alr-btn--edit:hover {
		background: #841639;
		box-shadow: 0 4px 16px rgba(155, 28, 72, 0.28);
		transform: translateY(-1px);
	}

	.alr-btn--edit:active {
		transform: scale(0.96);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.alr {
			grid-template-columns: 80px 1fr auto;
			gap: 0.75rem;
			padding: 0.625rem 0.75rem 0.625rem 0.625rem;
		}

		.alr-status-label {
			display: none;
		}

		.alr-btn-label {
			display: none;
		}

		.alr-btn {
			width: 34px;
			padding: 0;
			justify-content: center;
		}
	}
</style>
