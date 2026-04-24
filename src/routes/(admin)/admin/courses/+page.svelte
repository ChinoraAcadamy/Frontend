<script lang="ts">
	/* eslint-disable no-unused-vars */
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import CourseAdminCard from '@/lib/components/ui/courses/CourseAdminCard.svelte';
	import CourseAdminListRow from '@/lib/components/ui/courses/CourseAdminListRow.svelte';
	import { Plus, Search, LayoutGrid, List, BookOpen, X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	let viewMode = $state('grid');
	let deletedCourseIds = $state([]);
	let searchQuery = $state('');

	onMount(() => {
		const savedView = localStorage.getItem('adminCourseViewMode');
		if (savedView) viewMode = savedView;

		let storedIds = [];
		try {
			storedIds = JSON.parse(sessionStorage.getItem('deletedCourseIds') || '[]');
		} catch (e) {
			console.log(e);
		}

		const newlyDeleted = $page.url.searchParams.get('deleted_course');
		if (newlyDeleted && !storedIds.includes(newlyDeleted)) {
			storedIds.push(newlyDeleted);
			sessionStorage.setItem('deletedCourseIds', JSON.stringify(storedIds));
		}
		deletedCourseIds = storedIds;
	});

	function toggleView(mode) {
		viewMode = mode;
		localStorage.setItem('adminCourseViewMode', mode);
	}
</script>

<svelte:head>
	<title>{m.admin_courses_head_title?.() ?? "Kurslar ro'yxati - Admin Panel"}</title>
	<meta
		name="description"
		content={m.admin_courses_head_desc?.() ?? "Barcha kurslarni boshqarish."}
	/>
</svelte:head>

<div class="acp-root">
	<!-- ── Header ─────────────────────────────────────── -->
	<header class="acp-header">
		<div class="acp-header-left">
			<div class="acp-eyebrow">
				<span class="acp-eyebrow-rule"></span>
				<span class="acp-eyebrow-text">Admin Panel</span>
			</div>
			<h1 class="acp-title">{m.admin_courses_title?.() ?? "Kurslar"}</h1>
			<p class="acp-subtitle">{m.admin_courses_subtitle?.() ?? 'Barcha kurslarni boshqarish va tahrirlash.'}</p>
		</div>

		<div class="acp-controls">
			<!-- View toggle -->
			<div class="acp-toggle">
				<button
					onclick={() => toggleView('grid')}
					class="acp-toggle-btn {viewMode === 'grid' ? 'acp-toggle-btn--on' : ''}"
					aria-label="Grid ko'rinish"
				>
					<LayoutGrid size={16} />
				</button>
				<button
					onclick={() => toggleView('list')}
					class="acp-toggle-btn {viewMode === 'list' ? 'acp-toggle-btn--on' : ''}"
					aria-label="List ko'rinish"
				>
					<List size={16} />
				</button>
			</div>

			<!-- Search -->
			<div class="acp-search-wrap">
				<Search size={14} class="acp-search-icon" />
				<input
					type="text"
					placeholder={m.admin_courses_search_placeholder?.() ?? 'Kurs qidirish...'}
					bind:value={searchQuery}
					class="acp-search"
				/>
				{#if searchQuery}
					<button onclick={() => (searchQuery = '')} class="acp-search-clear">
						<X size={12} />
					</button>
				{/if}
			</div>

			<!-- Add -->
			<a href={resolve('/admin/courses/create')} class="acp-add-btn">
				<Plus size={15} strokeWidth={2.5} />
				<span class="acp-add-label">{m.admin_courses_btn_add?.() ?? "Kurs qo'shish"}</span>
			</a>
		</div>
	</header>

	<!-- ── Content ────────────────────────────────────── -->
	{#await data.lazy.courses}
		<div class={viewMode === 'grid' ? 'acp-grid' : 'acp-list'}>
			{#each Array(viewMode === 'grid' ? 8 : 6) as _, i (i)}
				{#if viewMode === 'grid'}
					<div class="acp-skel-card">
						<div class="acp-skel-thumb"></div>
						<div class="acp-skel-body">
							<div class="acp-skel-line w-full"></div>
							<div class="acp-skel-line w-2-3"></div>
						</div>
					</div>
				{:else}
					<div class="acp-skel-row">
						<div class="acp-skel-row-thumb"></div>
						<div class="acp-skel-body" style="flex:1; display:flex; flex-direction:column; gap:7px;">
							<div class="acp-skel-line w-48"></div>
							<div class="acp-skel-line w-28"></div>
						</div>
						<div class="acp-skel-line w-24 self-center"></div>
						<div class="acp-skel-btn-ph"></div>
					</div>
				{/if}
			{/each}
		</div>

	{:then courses}
		{@const activeCourses = courses
			.filter((c) => !deletedCourseIds.includes(c.id.toString()))
			.filter((c) => !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()))}

		{#if activeCourses.length === 0}
			<div class="acp-empty">
				<div class="acp-empty-icon">
					<BookOpen size={26} strokeWidth={1.5} />
				</div>
				<h3 class="acp-empty-title">
					{searchQuery
						? (m.admin_courses_not_found?.() ?? 'Kurs topilmadi')
						: (m.admin_courses_not_found?.() ?? 'Kurslar mavjud emas')}
				</h3>
				<p class="acp-empty-desc">
					{searchQuery
						? `"${searchQuery}" bo'yicha hech narsa topilmadi`
						: (m.admin_courses_not_found_desc?.() ?? 'Hozircha hech qanday kurs yaratilmagan.')}
				</p>
				{#if searchQuery}
					<button onclick={() => (searchQuery = '')} class="acp-empty-clear">
						Barcha kurslarni ko'rish
					</button>
				{:else}
					<a href={resolve('/admin/courses/create')} class="acp-empty-btn">
						<Plus size={14} />
						{m.admin_courses_btn_add?.() ?? "Kurs qo'shish"}
					</a>
				{/if}
			</div>
		{:else}
			{#if viewMode === 'grid'}
				<div class="acp-grid">
					{#each activeCourses as course, i (course.id)}
						<div class="acp-appear" style="animation-delay: {i * 35}ms">
							<CourseAdminCard
								title={course.title}
								price={course.price}
								modules={course.modules_count}
								status={course.is_published ? 'published' : 'draft'}
								link={course.id}
								image={course.img}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<div class="acp-list">
					{#each activeCourses as course, i (course.id)}
						<div class="acp-appear" style="animation-delay: {i * 30}ms">
							<CourseAdminListRow
								title={course.title}
								price={course.price}
								modules={course.modules_count}
								status={course.is_published ? 'published' : 'draft'}
								link={course.id}
								image={course.img}
							/>
						</div>
					{/each}
				</div>
			{/if}

			<div class="acp-footer">
				<span class="acp-count">
					{m.admin_courses_count({ count: activeCourses.length })}
				</span>
			</div>
		{/if}
	{/await}
</div>

<style>
	/* ── Root ──────────────────────────────────────────── */
	.acp-root {
		min-height: 100vh;
		background: var(--bg-main);
		padding: 2rem 1.25rem 4rem;
		max-width: 1320px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.acp-root { padding: 2.5rem 1.75rem 4rem; }
	}

	@media (min-width: 1024px) {
		.acp-root { padding: 3rem 2.5rem 5rem; }
	}

	/* ── Header ────────────────────────────────────────── */
	.acp-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 2.25rem;
		flex-wrap: wrap;
	}

	.acp-eyebrow {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 6px;
	}

	.acp-eyebrow-rule {
		width: 20px;
		height: 2px;
		background: #9b1c48;
		border-radius: 2px;
	}

	.acp-eyebrow-text {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #9b1c48;
	}

	.acp-title {
		font-size: clamp(1.625rem, 3.5vw, 2.5rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--text-main);
		margin: 0 0 4px;
		line-height: 1.05;
	}

	.acp-subtitle {
		font-size: 13px;
		color: var(--text-muted);
		margin: 0;
	}

	/* Controls */
	.acp-controls {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	@media (max-width: 500px) {
		.acp-controls { width: 100%; }
	}

	/* Toggle */
	.acp-toggle {
		display: flex;
		align-items: center;
		gap: 3px;
		background: var(--bg-card);
		border: 1.5px solid var(--border-main);
		border-radius: 11px;
		padding: 3px;
		flex-shrink: 0;
	}

	.acp-toggle-btn {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		border: none;
		background: transparent;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 140ms, color 140ms;
	}

	.acp-toggle-btn:hover:not(.acp-toggle-btn--on) {
		background: var(--bg-main);
		color: var(--text-main);
	}

	.acp-toggle-btn--on {
		background: #9b1c48;
		color: #fff;
		box-shadow: 0 2px 8px rgba(155, 28, 72, 0.25);
	}

	/* Search */
	.acp-search-wrap {
		position: relative;
		flex: 1;
		min-width: 180px;
		max-width: 280px;
	}

	@media (max-width: 500px) {
		.acp-search-wrap { max-width: 100%; }
	}

	:global(.acp-search-icon) {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}

	.acp-search {
		width: 100%;
		height: 42px;
		padding: 0 36px 0 36px;
		border-radius: 11px;
		border: 1.5px solid var(--border-main);
		background: var(--bg-card);
		font-size: 13px;
		font-weight: 500;
		color: var(--text-main);
		outline: none;
		transition: border-color 150ms, box-shadow 150ms;
		font-family: inherit;
		box-sizing: border-box;
	}

	.acp-search::placeholder { color: var(--text-muted); opacity: 0.6; }

	.acp-search:focus {
		border-color: #9b1c48;
		box-shadow: 0 0 0 3px rgba(155, 28, 72, 0.08);
	}

	.acp-search-clear {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: none;
		background: var(--bg-main);
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 130ms, color 130ms;
	}

	.acp-search-clear:hover {
		background: var(--border-main);
		color: var(--text-main);
	}

	/* Add button */
	.acp-add-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 42px;
		padding: 0 1.125rem;
		border-radius: 11px;
		background: #9b1c48;
		color: #fff;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-decoration: none;
		box-shadow: 0 3px 14px rgba(155, 28, 72, 0.22);
		transition: background 140ms, box-shadow 140ms, transform 100ms;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.acp-add-btn:hover {
		background: #841639;
		box-shadow: 0 5px 20px rgba(155, 28, 72, 0.3);
		transform: translateY(-1px);
	}

	.acp-add-btn:active { transform: scale(0.97); }

	@media (max-width: 400px) {
		.acp-add-label { display: none; }
		.acp-add-btn { width: 42px; padding: 0; justify-content: center; }
	}

	/* ── Grid ──────────────────────────────────────────── */
	.acp-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (min-width: 860px) {
		.acp-grid { grid-template-columns: repeat(3, 1fr); gap: 1.125rem; }
	}

	@media (min-width: 1180px) {
		.acp-grid { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
	}

	/* ── List ──────────────────────────────────────────── */
	.acp-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	/* ── Appear ────────────────────────────────────────── */
	.acp-appear {
		animation: acp-in 0.28s ease both;
		height: 100%;
	}

	@keyframes acp-in {
		from { opacity: 0; transform: translateY(8px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	/* ── Skeleton ──────────────────────────────────────── */
	@keyframes shimmer {
		0%   { background-position: -500px 0; }
		100% { background-position:  500px 0; }
	}

	.acp-skel-card {
		border-radius: 18px;
		background: var(--bg-card);
		border: 1.5px solid var(--border-main);
		overflow: hidden;
	}

	.acp-skel-thumb {
		aspect-ratio: 16/9;
		background: linear-gradient(90deg, var(--bg-main) 25%, var(--border-main) 50%, var(--bg-main) 75%);
		background-size: 500px 100%;
		animation: shimmer 1.5s infinite;
	}

	.acp-skel-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem 0.75rem 0.75rem;
		background: var(--bg-card);
		border-radius: 16px;
		border: 1.5px solid var(--border-main);
	}

	.acp-skel-row-thumb {
		width: 96px;
		height: 62px;
		border-radius: 10px;
		background: linear-gradient(90deg, var(--bg-main) 25%, var(--border-main) 50%, var(--bg-main) 75%);
		background-size: 500px 100%;
		animation: shimmer 1.5s infinite;
		flex-shrink: 0;
	}

	.acp-skel-body {
		padding: 0.875rem 1.125rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.acp-skel-line {
		height: 11px;
		border-radius: 6px;
		background: linear-gradient(90deg, var(--bg-main) 25%, var(--border-main) 50%, var(--bg-main) 75%);
		background-size: 500px 100%;
		animation: shimmer 1.5s infinite;
	}

	.acp-skel-btn-ph {
		width: 90px;
		height: 34px;
		border-radius: 9px;
		flex-shrink: 0;
		background: linear-gradient(90deg, var(--bg-main) 25%, var(--border-main) 50%, var(--bg-main) 75%);
		background-size: 500px 100%;
		animation: shimmer 1.5s infinite;
	}

	.w-full   { width: 100%; }
	.w-2-3    { width: 68%; }
	.w-48     { width: 11rem; }
	.w-28     { width: 7rem; }
	.w-24     { width: 6rem; }
	.self-center { align-self: center; }

	/* ── Empty ─────────────────────────────────────────── */
	.acp-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 5rem 2rem;
		background: var(--bg-card);
		border-radius: 22px;
		border: 1.5px solid var(--border-main);
		min-height: 340px;
	}

	.acp-empty-icon {
		width: 60px;
		height: 60px;
		border-radius: 16px;
		background: var(--bg-main);
		border: 1.5px solid var(--border-main);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		opacity: 0.5;
		margin-bottom: 1.25rem;
	}

	.acp-empty-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-main);
		letter-spacing: -0.02em;
		margin: 0 0 6px;
	}

	.acp-empty-desc {
		font-size: 13.5px;
		color: var(--text-muted);
		max-width: 320px;
		line-height: 1.6;
		margin: 0 0 1.5rem;
	}

	.acp-empty-clear {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: #9b1c48;
		border: none;
		background: none;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
		font-family: inherit;
	}

	.acp-empty-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 42px;
		padding: 0 1.375rem;
		border-radius: 11px;
		background: #9b1c48;
		color: #fff;
		font-size: 12.5px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-decoration: none;
		box-shadow: 0 3px 14px rgba(155, 28, 72, 0.22);
		transition: background 140ms, box-shadow 140ms, transform 100ms;
	}

	.acp-empty-btn:hover {
		background: #841639;
		transform: translateY(-1px);
		box-shadow: 0 5px 20px rgba(155, 28, 72, 0.28);
	}

	/* ── Footer ────────────────────────────────────────── */
	.acp-footer {
		display: flex;
		justify-content: center;
		margin-top: 2.5rem;
	}

	.acp-count {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		opacity: 0.5;
	}
</style>