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

<article class="agc">
	<!-- Thumbnail -->
	<div class="agc-thumb">
		<img
			src={displayImage}
			alt={title}
			class="agc-img"
			width="400"
			height="225"
			loading="lazy"
			onerror={handleImageError}
		/>

		<div class="agc-thumb-overlay"></div>

		<span class="agc-status {isPublished ? 'agc-status--live' : 'agc-status--draft'}">
			<span class="agc-status-dot"></span>
			{isPublished
				? (m.admin_courses_status_published?.() ?? 'Nashr etilgan')
				: (m.admin_courses_status_draft?.() ?? 'Qoralama')}
		</span>

		<a
			href={resolve(`/admin/courses/${link}`)}
			onclick={() => sessionStorage.setItem('admin_course_detail_tab', 'content')}
			class="agc-preview-btn"
			tabindex="-1"
			aria-hidden="true"
		>
			<Play size={11} class="fill-current" />
			{m.admin_courses_preview?.() ?? "Ko'rish"}
		</a>
	</div>

	<!-- Body -->
	<div class="agc-body">
		<div class="agc-content">
			<h3 class="agc-title">{title}</h3>
			<div class="agc-meta">
				<span class="agc-meta-item">
					<BookOpen size={11} />
					{modules}
					{m.admin_courses_modules?.() ?? 'modul'}
				</span>
				<span class="agc-meta-sep"></span>
				<span class="agc-meta-item">
					<Tag size={11} />
					{price}
					{m.price_label?.() ?? "so'm"}
				</span>
			</div>
		</div>

		<div class="agc-actions">
			<a
				href={resolve(`/admin/courses/${link}`)}
				onclick={() => sessionStorage.setItem('admin_course_detail_tab', 'settings')}
				class="agc-btn agc-btn--edit"
			>
				<Pencil size={12} />
				{m.admin_courses_edit?.() ?? 'Tahrirlash'}
			</a>
		</div>
	</div>
</article>

<style>
	.agc {
		display: flex;
		flex-direction: column;
		background: var(--bg-card);
		border-radius: 18px;
		border: 1.5px solid var(--border-main);
		overflow: hidden;
		height: 100%;
		transition:
			border-color 180ms ease,
			box-shadow 180ms ease,
			transform 180ms ease;
	}

	.agc:hover {
		border-color: rgba(155, 28, 72, 0.28);
		box-shadow: 0 10px 36px rgba(155, 28, 72, 0.1);
		transform: translateY(-2px);
	}

	/* Thumb */
	.agc-thumb {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--bg-main);
		flex-shrink: 0;
	}

	.agc-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 420ms ease;
	}

	.agc:hover .agc-img {
		transform: scale(1.06);
	}

	.agc-thumb-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(10, 8, 6, 0.35) 0%, transparent 55%);
		opacity: 0;
		transition: opacity 180ms ease;
	}

	.agc:hover .agc-thumb-overlay {
		opacity: 1;
	}

	/* Status badge */
	.agc-status {
		position: absolute;
		top: 10px;
		left: 10px;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 4px 9px;
		border-radius: 999px;
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		backdrop-filter: blur(6px);
	}

	.agc-status--live {
		background: rgba(16, 185, 129, 0.15);
		color: #10b981;
		border: 1px solid rgba(16, 185, 129, 0.25);
	}

	.agc-status--draft {
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
		border: 1px solid rgba(245, 158, 11, 0.25);
	}

	.agc-status-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: currentColor;
	}

	.agc-status--live .agc-status-dot {
		animation: blink 2.2s infinite;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	/* Preview button */
	.agc-preview-btn {
		position: absolute;
		bottom: 10px;
		right: 10px;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 5px 11px;
		border-radius: 9px;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(6px);
		color: #9b1c48;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		text-decoration: none;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 180ms ease,
			transform 180ms ease;
		border: 1px solid rgba(155, 28, 72, 0.15);
	}

	.agc:hover .agc-preview-btn {
		opacity: 1;
		transform: translateY(0);
	}

	/* Body */
	.agc-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 1rem 1.125rem 1.125rem;
		gap: 0.875rem;
	}

	.agc-content {
		flex: 1;
	}

	.agc-title {
		font-size: 14.5px;
		font-weight: 700;
		color: var(--text-main);
		line-height: 1.35;
		letter-spacing: -0.01em;
		margin: 0 0 7px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 150ms;
	}

	.agc:hover .agc-title {
		color: #9b1c48;
	}

	.agc-meta {
		display: flex;
		align-items: center;
		gap: 7px;
		flex-wrap: wrap;
	}

	.agc-meta-item {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
	}

	.agc-meta-sep {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--border-main);
	}

	/* Actions */
	.agc-actions {
		padding-top: 0.75rem;
		border-top: 1px solid var(--border-main);
	}

	.agc-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		width: 100%;
		height: 38px;
		border-radius: 11px;
		font-size: 11.5px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-decoration: none;
		transition:
			background 150ms,
			box-shadow 150ms,
			transform 100ms;
	}

	.agc-btn--edit {
		background: #9b1c48;
		color: #fff;
		box-shadow: 0 3px 12px rgba(155, 28, 72, 0.2);
	}

	.agc-btn--edit:hover {
		background: #841639;
		box-shadow: 0 5px 18px rgba(155, 28, 72, 0.28);
		transform: translateY(-1px);
	}

	.agc-btn--edit:active {
		transform: scale(0.97);
	}
</style>
