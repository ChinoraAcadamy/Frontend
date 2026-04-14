<script>
	/* eslint-disable no-unused-vars */

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import CourseGridCard from '@/lib/components/ui/courses/CourseGridCard.svelte';
	import CourseListRow from '@/lib/components/ui/courses/CourseListRow.svelte';
	import { Search, BookOpen, LayoutGrid, List } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	// svelte-ignore state_referenced_locally
	let searchQuery = $state(data.search);
	let viewMode = $state('grid'); // 'grid' | 'list'

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
			// eslint-disable-next-line
			goto(url.toString(), { keepFocus: true, noScroll: true });
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
		// eslint-disable-next-line
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}
</script>

<div class="mx-auto min-h-[calc(100vh-80px)] max-w-7xl bg-[#f8fafc] p-4 font-sans md:p-8">
	<!-- Sarlavha va Qidiruv Qismi -->
	<div class="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
		<div class="flex-1">
			<h1 class="text-[28px] font-black tracking-tighter text-slate-900 uppercase md:text-4xl">
				{m.courses_title()}
			</h1>
			<p
				class="mt-2 max-w-xl text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase opacity-80"
			>
				{m.courses_subtitle()}
			</p>
		</div>

		<div class="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:w-auto">
			<!-- View Toggle -->
			<div
				class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm"
			>
				<button
					onclick={() => toggleView('grid')}
					class="flex h-9 w-10 items-center justify-center rounded-lg transition-all
					{viewMode === 'grid'
						? 'bg-[#9b1c48] text-white shadow-md shadow-[#9b1c48]/20'
						: 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}"
				>
					<LayoutGrid size={18} />
				</button>
				<button
					onclick={() => toggleView('list')}
					class="flex h-9 w-10 items-center justify-center rounded-lg transition-all
					{viewMode === 'list'
						? 'bg-[#9b1c48] text-white shadow-md shadow-[#9b1c48]/20'
						: 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}"
				>
					<List size={18} />
				</button>
			</div>

			<div class="relative flex-1 sm:w-72">
				<Search size={14} class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					placeholder={m.courses_search_placeholder()}
					value={searchQuery}
					oninput={handleSearch}
					class="h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-11 text-[11px] font-black tracking-widest uppercase transition-all outline-none focus:border-[#9b1c48]/30 focus:ring-4 focus:ring-[#9b1c48]/5"
				/>
			</div>
		</div>
	</div>

	{#await data.lazy.coursesData}
		<div
			class={viewMode === 'grid'
				? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
				: 'flex flex-col gap-4'}
		>
			{#each Array(6) as _, i (i)}
				<div
					class="animate-pulse rounded-xl border-2 border-slate-50 bg-white {viewMode === 'grid'
						? 'h-76 p-5'
						: 'flex h-20 items-center gap-4 p-4'}"
				>
					{#if viewMode === 'grid'}
						<div class="mb-4 flex items-start gap-4">
							<div class="h-20 w-20 shrink-0 rounded-lg bg-slate-50"></div>
							<div class="mt-1 flex-1 space-y-2">
								<div class="h-4 w-full rounded bg-slate-50"></div>
								<div class="h-4 w-2/3 rounded bg-slate-50"></div>
							</div>
						</div>
						<div class="mt-auto h-2 w-full rounded-full bg-slate-50"></div>
					{:else}
						<div class="h-12 w-16 shrink-0 rounded-lg bg-slate-50"></div>
						<div class="flex-1 space-y-2">
							<div class="h-4 w-48 rounded bg-slate-50"></div>
						</div>
						<div class="h-10 w-32 rounded-lg bg-slate-50"></div>
					{/if}
				</div>
			{/each}
		</div>
	{:then resolvedData}
		{@const courses = resolvedData.courses || []}
		{@const totalCount = resolvedData.totalCount || 0}

		{#if courses.length === 0}
			<div
				class="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-100 bg-white p-12 text-center"
			>
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-slate-100 bg-slate-50"
				>
					<BookOpen size={32} class="text-slate-200" strokeWidth={2} />
				</div>

				{#if searchQuery}
					<h3 class="mb-2 text-xl font-black tracking-tighter text-slate-800 uppercase">
						{m.courses_not_found()}
					</h3>
					<p class="mb-6 max-w-sm text-[11px] font-black tracking-[0.1em] text-slate-400 uppercase">
						{m.courses_not_found_desc({ query: searchQuery })}
					</p>
					<button
						onclick={clearSearch}
						class="text-xs font-black tracking-widest text-[#9b1c48] uppercase hover:underline"
					>
						{m.courses_view_all()}
					</button>
				{:else}
					<h3 class="mb-2 text-xl font-black tracking-tighter text-slate-800 uppercase">
						{m.courses_empty()}
					</h3>
					<p class="mb-8 max-w-md text-[11px] font-black tracking-[0.1em] text-slate-400 uppercase">
						{m.courses_empty_desc()}
					</p>
					<button
						onclick={() => goto(resolve(/** @type {any} */ ('/dashboard')))}
						class="rounded-xl bg-[#9b1c48] px-10 py-4 text-[11px] font-black tracking-widest text-white uppercase shadow-lg shadow-[#9b1c48]/20 transition-all hover:bg-[#80163a] active:scale-95"
					>
						{m.courses_discover()}
					</button>
				{/if}
			</div>
		{:else}
			<div
				class={viewMode === 'grid'
					? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
					: 'flex flex-col gap-4'}
			>
				{#each courses as course (course.id)}
					<div class="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{#if viewMode === 'grid'}
							<CourseGridCard
								id={course.id}
								title={course.title}
								subtitle={course.price ? `${course.price} UZS` : m.course_free()}
								image={course.img}
								progress={course.progress}
								price={course.price}
								lessons={course.total_lessons}
								status={course.is_blocked ? 'locked' : 'active'}
								onContinue={handleContinueCourse}
							/>
						{:else}
							<CourseListRow
								id={course.id}
								title={course.title}
								image={course.img}
								progress={course.progress}
								price={course.price}
								lessons={course.total_lessons}
								status={course.is_blocked ? 'locked' : 'active'}
								onContinue={handleContinueCourse}
							/>
						{/if}
					</div>
				{/each}
			</div>

			{#if totalCount > courses.length}
				<div class="mt-16 flex justify-center">
					<p class="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">
						{m.courses_total({ total: totalCount })}
					</p>
				</div>
			{/if}
		{/if}
	{/await}
</div>
