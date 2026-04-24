<script>
	/* eslint-disable no-unused-vars */
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import CourseGridCard from '@/lib/components/ui/courses/CourseGridCard.svelte';
	import CourseListRow from '@/lib/components/ui/courses/CourseListRow.svelte';
	import { Search, BookOpen, LayoutGrid, List, X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	// svelte-ignore state_referenced_locally
	let searchQuery = $state(data.search);
	let viewMode = $state('grid');

	onMount(() => {
		const savedView = localStorage.getItem('courseViewMode');
		if (savedView) viewMode = savedView;
	});

	function toggleView(mode) {
		viewMode = mode;
		localStorage.setItem('courseViewMode', mode);
	}

	/** @type {any} */
	let searchTimeout;

	/** @param {Event} e */
	function handleSearch(e) {
		const val = /** @type {HTMLInputElement} */ (e.target).value;
		searchQuery = val;
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			const url = new URL($page.url);
			if (val.trim()) {
				url.searchParams.set('search', val.trim());
			} else {
				url.searchParams.delete('search');
			}
			url.searchParams.set('page', '1');
			goto(resolve(url.toString()), { keepFocus: true, noScroll: true });
		}, 400);
	}

	/** @param {number} courseId */
	function handleContinueCourse(courseId) {
		goto(resolve(/** @type {any} */ (`/kurslarim/${courseId}`)));
	}

	function clearSearch() {
		searchQuery = '';
		clearTimeout(searchTimeout);
		const url = new URL($page.url);
		url.searchParams.delete('search');
		url.searchParams.set('page', '1');
		goto(resolve(url.toString()), { keepFocus: true, noScroll: true });
	}
</script>

<div class="courses-root">
	<div class="courses-container">
		<!-- ── Page Header ─────────────────────────────────── -->
		<header class="courses-header">
			<div class="header-left">
				<div class="header-eyebrow">
					<span class="eyebrow-rule"></span>
					<span class="eyebrow-text"
						>{m.courses_subtitle ? m.courses_subtitle() : 'Mening kurslarim'}</span
					>
				</div>
				<h1 class="courses-title">{m.courses_title ? m.courses_title() : 'Kurslar'}</h1>
			</div>

			<div class="header-controls">
				<!-- View Toggle -->
				<div class="view-toggle">
					<button
						onclick={() => toggleView('grid')}
						class="toggle-btn {viewMode === 'grid' ? 'toggle-btn--on' : ''}"
						aria-label="Grid ko'rinish"
					>
						<LayoutGrid size={17} />
					</button>
					<button
						onclick={() => toggleView('list')}
						class="toggle-btn {viewMode === 'list' ? 'toggle-btn--on' : ''}"
						aria-label="List ko'rinish"
					>
						<List size={17} />
					</button>
				</div>

				<!-- Search -->
				<div class="search-wrap">
					<Search size={15} class="search-icon" />
					<input
						type="text"
						placeholder={m.courses_search_placeholder
							? m.courses_search_placeholder()
							: 'Kurs qidirish...'}
						value={searchQuery}
						oninput={handleSearch}
						class="search-input"
					/>
					{#if searchQuery}
						<button onclick={clearSearch} class="search-clear" aria-label="Tozalash">
							<X size={13} />
						</button>
					{/if}
				</div>
			</div>
		</header>

		<!-- ── Content ─────────────────────────────────────── -->
		{#await data.lazy.coursesData}
			<!-- Skeleton -->
			<div class={viewMode === 'grid' ? 'courses-grid' : 'courses-list'}>
				{#each Array(viewMode === 'grid' ? 8 : 5) as _, i (i)}
					{#if viewMode === 'grid'}
						<div class="skel-grid-card">
							<div class="skel-thumb"></div>
							<div class="skel-body">
								<div class="skel-line w-full"></div>
								<div class="skel-line w-3/4"></div>
								<div class="skel-line mt-auto w-1/2"></div>
							</div>
						</div>
					{:else}
						<div class="skel-list-row">
							<div class="skel-list-thumb"></div>
							<div class="skel-list-body">
								<div class="skel-line w-48"></div>
								<div class="skel-line w-28"></div>
							</div>
							<div class="skel-line w-32 self-center"></div>
							<div class="skel-btn-ph"></div>
						</div>
					{/if}
				{/each}
			</div>
		{:then resolvedData}
			{@const courses = resolvedData.courses || []}
			{@const totalCount = resolvedData.totalCount || 0}

			{#if courses.length === 0}
				<!-- Empty State -->
				<div class="empty-state">
					<div class="empty-icon-wrap">
						<BookOpen size={28} strokeWidth={1.5} />
					</div>

					{#if searchQuery}
						<h3 class="empty-title">
							{m.courses_not_found ? m.courses_not_found() : 'Natija topilmadi'}
						</h3>
						<p class="empty-desc">
							{m.courses_not_found_desc
								? m.courses_not_found_desc({ query: searchQuery })
								: `"${searchQuery}" bo'yicha kurs topilmadi`}
						</p>
						<button onclick={clearSearch} class="empty-link">
							{m.courses_view_all ? m.courses_view_all() : "Barcha kurslarni ko'rish"}
						</button>
					{:else}
						<h3 class="empty-title">
							{m.courses_empty ? m.courses_empty() : 'Kurslar mavjud emas'}
						</h3>
						<p class="empty-desc">
							{m.courses_empty_desc
								? m.courses_empty_desc()
								: "Hali hech qanday kurs qo'shilmagan."}
						</p>
						<button
							onclick={() => goto(resolve(/** @type {any} */ ('/dashboard')))}
							class="empty-btn"
						>
							{m.courses_discover ? m.courses_discover() : 'Kurslarni kashf etish'}
						</button>
					{/if}
				</div>
			{:else}
				<!-- Grid Mode -->
				{#if viewMode === 'grid'}
					<div class="courses-grid">
						{#each courses as course, i (course.id)}
							<div class="course-appear" style="animation-delay: {i * 40}ms">
								<CourseGridCard
									id={course.id}
									title={course.title}
									subtitle={course.price
										? `${course.price} UZS`
										: m.course_free
											? m.course_free()
											: 'Bepul'}
									image={course.img}
									progress={course.progress}
									price={course.price}
									lessons={course.total_lessons}
									status={course.is_blocked
										? 'locked'
										: course.progress === 100
											? 'completed'
											: 'active'}
									onContinue={handleContinueCourse}
								/>
							</div>
						{/each}
					</div>

					<!-- List Mode -->
				{:else}
					<div class="courses-list">
						{#each courses as course, i (course.id)}
							<div class="course-appear" style="animation-delay: {i * 35}ms">
								<CourseListRow
									id={course.id}
									title={course.title}
									image={course.img}
									progress={course.progress}
									price={course.price}
									lessons={course.total_lessons}
									status={course.is_blocked
										? 'locked'
										: course.progress === 100
											? 'completed'
											: 'active'}
									onContinue={handleContinueCourse}
								/>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Footer Count -->
				{#if totalCount > courses.length}
					<div class="courses-footer">
						<span class="footer-count">
							{courses.length} / {totalCount}
							{m.courses_total ? '' : "ta kurs ko'rsatilmoqda"}
						</span>
					</div>
				{/if}
			{/if}
		{/await}
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

	/* ── Root ──────────────────────────────────────────── */
	.courses-root {
		min-height: calc(100vh - 80px);
		background: var(--bg-main);
		font-family: 'Instrument Sans', 'Helvetica Neue', sans-serif;
	}

	.courses-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2.5rem 1.25rem 4rem;
	}

	@media (min-width: 640px) {
		.courses-container {
			padding: 3rem 1.5rem 4rem;
		}
	}

	@media (min-width: 1024px) {
		.courses-container {
			padding: 3.5rem 2.5rem 5rem;
		}
	}

	/* ── Header ────────────────────────────────────────── */
	.courses-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	.header-eyebrow {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 0.5rem;
	}

	.eyebrow-rule {
		width: 22px;
		height: 2px;
		background: var(--primary);
		border-radius: 2px;
		flex-shrink: 0;
	}

	.eyebrow-text {
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--primary);
	}

	.courses-title {
		font-size: clamp(1.75rem, 4vw, 2.75rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--text-main);
		margin: 0;
		line-height: 1.05;
	}

	/* Controls row */
	.header-controls {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	@media (max-width: 480px) {
		.header-controls {
			width: 100%;
		}
	}

	/* View toggle */
	.view-toggle {
		display: flex;
		align-items: center;
		gap: 3px;
		background: var(--bg-card);
		border: 1.5px solid var(--border-main);
		border-radius: 12px;
		padding: 4px;
		flex-shrink: 0;
	}

	.toggle-btn {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		border: none;
		background: transparent;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.toggle-btn:hover:not(.toggle-btn--on) {
		background: var(--bg-main);
		color: var(--text-main);
	}

	.toggle-btn--on {
		background: var(--primary);
		color: #fff;
		box-shadow: 0 2px 8px rgba(155, 28, 72, 0.25);
	}

	/* Search */
	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 200px;
		max-width: 320px;
	}

	@media (max-width: 480px) {
		.search-wrap {
			max-width: 100%;
		}
	}

	:global(.search-icon) {
		position: absolute;
		left: 13px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		height: 44px;
		padding: 0 38px 0 38px;
		border-radius: 12px;
		border: 1.5px solid var(--border-main);
		background: var(--bg-card);
		font-size: 13px;
		font-weight: 500;
		color: var(--text-main);
		outline: none;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
		font-family: inherit;
		box-sizing: border-box;
	}

	.search-input::placeholder {
		color: var(--text-muted);
		opacity: 0.5;
	}

	.search-input:focus {
		border-color: var(--primary);
		box-shadow: 0 0 0 4px rgba(155, 28, 72, 0.08);
	}

	.search-clear {
		position: absolute;
		right: 11px;
		top: 50%;
		transform: translateY(-50%);
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: none;
		background: var(--bg-main);
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.search-clear:hover {
		background: var(--border-main);
		color: var(--text-main);
	}

	/* ── Grid Layout ───────────────────────────────────── */
	.courses-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.courses-grid {
			gap: 1.125rem;
		}
	}

	@media (min-width: 900px) {
		.courses-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}
	}

	@media (min-width: 1200px) {
		.courses-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 1.375rem;
		}
	}

	/* ── List Layout ───────────────────────────────────── */
	.courses-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	/* ── Appear animation ──────────────────────────────── */
	.course-appear {
		animation: appear 0.32s ease both;
		height: 100%;
	}

	@keyframes appear {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── Skeleton ──────────────────────────────────────── */
	@keyframes shimmer {
		0% {
			background-position: -600px 0;
		}
		100% {
			background-position: 600px 0;
		}
	}

	.skel-grid-card {
		border-radius: 20px;
		background: var(--bg-card);
		border: 1.5px solid var(--border-main);
		overflow: hidden;
	}

	.skel-thumb {
		aspect-ratio: 16/9;
		background: linear-gradient(90deg, var(--bg-main) 25%, var(--border-main) 50%, var(--bg-main) 75%);
		background-size: 600px 100%;
		animation: shimmer 1.5s infinite;
	}

	.skel-body {
		padding: 1.125rem 1.25rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.skel-line {
		height: 11px;
		border-radius: 6px;
		background: linear-gradient(90deg, var(--bg-main) 25%, var(--border-main) 50%, var(--bg-main) 75%);
		background-size: 600px 100%;
		animation: shimmer 1.5s infinite;
	}

	.w-full {
		width: 100%;
	}
	.w-3\/4 {
		width: 75%;
	}
	.w-1\/2 {
		width: 50%;
	}
	.w-48 {
		width: 12rem;
	}
	.w-28 {
		width: 7rem;
	}
	.w-32 {
		width: 8rem;
	}
	.mt-auto {
		margin-top: auto;
	}

	.skel-list-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 0.875rem 1rem;
		background: var(--bg-card);
		border-radius: 18px;
		border: 1.5px solid var(--border-main);
	}

	.skel-list-thumb {
		width: 90px;
		height: 60px;
		border-radius: 10px;
		flex-shrink: 0;
		background: linear-gradient(90deg, var(--bg-main) 25%, var(--border-main) 50%, var(--bg-main) 75%);
		background-size: 600px 100%;
		animation: shimmer 1.5s infinite;
	}

	.skel-list-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.skel-btn-ph {
		width: 100px;
		height: 36px;
		border-radius: 10px;
		flex-shrink: 0;
		background: linear-gradient(90deg, var(--bg-main) 25%, var(--border-main) 50%, var(--bg-main) 75%);
		background-size: 600px 100%;
		animation: shimmer 1.5s infinite;
	}

	.self-center {
		align-self: center;
	}

	/* ── Empty State ───────────────────────────────────── */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 5rem 2rem;
		background: var(--bg-card);
		border-radius: 24px;
		border: 1.5px solid var(--border-main);
		min-height: 360px;
	}

	.empty-icon-wrap {
		width: 64px;
		height: 64px;
		border-radius: 18px;
		background: var(--bg-main);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		opacity: 0.5;
		margin-bottom: 1.375rem;
	}

	.empty-title {
		font-size: 1.1875rem;
		font-weight: 700;
		color: var(--text-main);
		letter-spacing: -0.02em;
		margin: 0 0 0.5rem;
	}

	.empty-desc {
		font-size: 0.875rem;
		color: var(--text-muted);
		max-width: 340px;
		line-height: 1.6;
		margin: 0 0 1.5rem;
	}

	.empty-link {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--primary);
		border: none;
		background: none;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
		font-family: inherit;
	}

	.empty-btn {
		height: 44px;
		padding: 0 1.75rem;
		border-radius: 12px;
		border: none;
		background: var(--primary);
		color: #fff;
		font-size: 12.5px;
		font-weight: 700;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition:
			background 0.15s,
			box-shadow 0.15s,
			transform 0.1s;
		box-shadow: 0 4px 16px rgba(155, 28, 72, 0.22);
		font-family: inherit;
	}

	.empty-btn:hover {
		background: var(--primary-hover);
		transform: translateY(-1px);
		box-shadow: 0 6px 22px rgba(155, 28, 72, 0.28);
	}

	/* ── Footer ────────────────────────────────────────── */
	.courses-footer {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
	}

	.footer-count {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
		opacity: 0.5;
	}
</style>
