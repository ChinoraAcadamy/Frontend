<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import CourseGridCard from '@/lib/components/ui/courses/CourseGridCard.svelte';
	import { Search, BookOpen } from 'lucide-svelte';

	let { data } = $props();
	console.log(data);
	let courses = $derived(data.courses || []);

	// svelte-ignore state_referenced_locally
	let searchQuery = $state(data.search);

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
		// Darsga o'tish (Hozircha kurslar detail page deb tasavvur qilamiz, yo'q bo'lsa keyin qo'shamiz)
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
	<div class="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
		<div>
			<h1 class="text-[26px] font-black tracking-tight text-slate-800 uppercase md:text-3xl">
				Mening kurslarim
			</h1>
			<p class="mt-1.5 max-w-xl text-sm font-medium text-slate-500 md:text-[15px]">
				O'zingiz obuna bo'lgan barcha kurslarni shu yerdan kuzatib borishingiz va davom
				ettirishingiz mumkin.
			</p>
		</div>

		<div class="relative w-full shrink-0 md:w-80">
			<Search size={18} class="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				placeholder="Kurslarni izlash..."
				value={searchQuery}
				oninput={handleSearch}
				class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium shadow-sm transition-all focus:border-[#9b1c48] focus:ring-2 focus:ring-[#9b1c48]/20 focus:outline-none"
			/>
		</div>
	</div>

	{#if courses.length === 0}
		<div
			class="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm"
		>
			<div
				class="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#fdf2f6] shadow-sm shadow-rose-100/50"
			>
				<BookOpen size={32} class="text-[#9b1c48]" strokeWidth={2.5} />
			</div>

			{#if searchQuery}
				<h3 class="mb-2 text-xl font-bold text-slate-800">Hech narsa topilmadi</h3>
				<p class="mb-6 max-w-sm font-medium text-slate-500">
					"{searchQuery}" bo'yicha hech qanday kurs topilmadi. Boshqa so'z bilan izlab ko'ring.
				</p>
				<button
					onclick={clearSearch}
					class="font-bold text-[#9b1c48] transition-all hover:underline"
				>
					Barcha kurslarni ko'rish
				</button>
			{:else}
				<h3 class="mb-2 text-xl font-bold text-slate-800">Hozircha kurslar yo'q</h3>
				<p class="mb-8 max-w-md leading-relaxed font-medium text-slate-500">
					Siz hali hech qanday kursga obuna bo'lmagansiz. Bilimingizni oshirish uchun yangi
					kurslarga ulaning.
				</p>
				<button
					onclick={() => goto(resolve(/** @type {any} */ ('/dashboard')))}
					class="scale-100 rounded-xl bg-linear-to-r from-[#9b1c48] to-[#c43c66] px-7 py-3 font-bold text-white shadow-lg shadow-[#9b1c48]/25 transition-all hover:brightness-110 active:scale-95"
				>
					Yangi kurslarni kashf etish
				</button>
			{/if}
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each courses as course (course.id)}
				<div
					class="animate-in fade-in slide-in-from-bottom-4 duration-500"
					style="animation-fill-mode: backwards;"
				>
					{console.log(course)}

					<CourseGridCard
						id={course.id}
						title={course.title}
						subtitle={course.price ? `${course.price} UZS` : 'Bepul'}
						image={course.img ||
							`https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`}
						progress={course.progress}
						modules={0}
						lessons={course.total_lessons}
						status={course.is_blocked ? 'locked' : 'active'}
						onContinue={handleContinueCourse}
					/>
				</div>
			{/each}
		</div>

		{#if data.totalCount > courses.length}
			<!-- Hozircha oddiy load more qismi ko'rinishi, agar pager qo'shilsa url parameter yordamida uzatiladi -->
			<div class="mt-10 flex justify-center">
				<p class="text-sm font-semibold text-slate-400">Jami topilgan kurslar: {data.totalCount}</p>
			</div>
		{/if}
	{/if}
</div>
