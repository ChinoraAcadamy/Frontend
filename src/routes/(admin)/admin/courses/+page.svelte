<script lang="ts">
	/* eslint-disable no-unused-vars */

	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import CourseAdminCard from '@/lib/components/ui/courses/CourseAdminCard.svelte';
	import CourseAdminListRow from '@/lib/components/ui/courses/CourseAdminListRow.svelte';
	import { Plus, Search, LayoutGrid, List } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { data } = $props();

	let viewMode = $state('grid'); // 'grid' | 'list'
	let deletedCourseIds = $state([]);

	onMount(() => {
		const savedView = localStorage.getItem('adminCourseViewMode');
		if (savedView) viewMode = savedView;

		// Kesh hisobiga o'chirilgan kurslarni ekranda darhol yo'q qilish siri
		let storedIds = [];
		try {
			storedIds = JSON.parse(sessionStorage.getItem('deletedCourseIds') || '[]');
		} catch (e) {
			console.log(e);
		}

		// Agar serverdan redirect bo'lib, url'da id kelsa, uni saqlab olamiz
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
	<title
		>{m.admin_courses_head_title
			? m.admin_courses_head_title()
			: "Kurslar ro'yxati - Admin Panel"}</title
	>
	<meta
		name="description"
		content={m.admin_courses_head_desc
			? m.admin_courses_head_desc()
			: "Chinora Academy platformasidagi barcha kurslarni ko'rish va boshqarish uchun bu yerda ro'yxat mavjud. Har bir kursning tafsilotlarini ko'rish, tahrirlash yoki o'chirish uchun kerakli kursni tanlang."}
	/>
</svelte:head>

<div class="mx-auto min-h-screen max-w-7xl bg-[#f8fafc] p-4 font-sans md:p-8">
	<div class="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
		<div>
			<h1 class="text-3xl font-black tracking-tighter text-slate-900 uppercase md:text-4xl">
				{m.admin_courses_title ? m.admin_courses_title() : "Kurslar ro'yxati"}
			</h1>
			<p class="mt-2 text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase opacity-80">
				{m.admin_courses_subtitle
					? m.admin_courses_subtitle()
					: 'Barcha kurslarni boshqarish va tahrirlash markazi.'}
			</p>
		</div>

		<div class="flex w-full flex-wrap items-center gap-3 sm:w-auto">
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

			<div class="relative flex-1 sm:w-64">
				<Search size={14} class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					placeholder={m.admin_courses_search_placeholder
						? m.admin_courses_search_placeholder()
						: 'Search courses...'}
					class="h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-11 text-[11px] font-black tracking-widest uppercase transition-all outline-none focus:border-[#9b1c48]/30 focus:ring-4 focus:ring-[#9b1c48]/5"
				/>
			</div>

			<a
				href={resolve('/admin/courses/create')}
				class="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#9b1c48] px-6 text-[11px] font-black tracking-widest text-white uppercase shadow-lg shadow-[#9b1c48]/20 transition-all hover:bg-[#80163a] active:scale-95"
			>
				<Plus size={16} strokeWidth={3} />
				<span class="hidden sm:inline"
					>{m.admin_courses_btn_add ? m.admin_courses_btn_add() : "Kurs qo'shish"}</span
				>
			</a>
		</div>
	</div>

	<div
		class={viewMode === 'grid'
			? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
			: 'flex flex-col gap-4'}
	>
		{#await data.lazy.courses}
			{#each Array(8) as _, i (i)}
				<div
					class="animate-pulse rounded-xl border-2 border-slate-50 bg-white {viewMode === 'grid'
						? 'h-80'
						: 'flex h-24 items-center gap-4 p-4'}"
				>
					{#if viewMode === 'grid'}
						<div class="aspect-video w-full border-b border-slate-100 bg-slate-50"></div>
						<div class="space-y-4 p-5">
							<div class="h-5 w-3/4 rounded bg-slate-50"></div>
							<div class="h-4 w-1/2 rounded bg-slate-50"></div>
						</div>
					{:else}
						<div class="h-16 w-24 shrink-0 rounded-lg bg-slate-50"></div>
						<div class="flex-1 space-y-2">
							<div class="h-4 w-64 rounded bg-slate-50"></div>
						</div>
						<div class="h-10 w-32 rounded-lg bg-slate-50"></div>
					{/if}
				</div>
			{/each}
		{:then courses}
			{@const activeCourses = courses.filter((c) => !deletedCourseIds.includes(c.id.toString()))}
			{#each activeCourses as course (course.id)}
				<div class="animate-in fade-in slide-in-from-bottom-2 duration-300">
					{#if viewMode === 'grid'}
						<CourseAdminCard
							title={course.title}
							price={course.price}
							modules={course.modules_count}
							status={course.is_published
								? 'published'
								: m.admin_courses_status_draft
									? m.admin_courses_status_draft()
									: 'Qoralama'}
							link={course.id}
							image={course.img}
						/>
					{:else}
						<CourseAdminListRow
							title={course.title}
							price={course.price}
							modules={course.modules_count}
							status={course.is_published
								? 'published'
								: m.admin_courses_status_draft
									? m.admin_courses_status_draft()
									: 'Qoralama'}
							link={course.id}
							image={course.img}
						/>
					{/if}
				</div>
			{:else}
				<div
					class="col-span-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-100 rounded-xl bg-white"
				>
					<div class="mb-6 rounded-full bg-slate-50 p-6 border border-slate-100">
						<Search size={48} class="text-slate-200" />
					</div>
					<h3 class="text-xl font-black text-slate-800 uppercase tracking-tighter">
						{m.admin_courses_not_found ? m.admin_courses_not_found() : 'Kurslar topilmadi'}
					</h3>
					<p class="mt-2 text-[11px] font-black text-slate-400 uppercase tracking-tight">
						{m.admin_courses_not_found_desc
							? m.admin_courses_not_found_desc()
							: 'Hozircha hech qanday kurs yaratilmagan.'}
					</p>
				</div>
			{/each}
		{/await}
	</div>
</div>
