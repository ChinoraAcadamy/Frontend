<script lang="ts">
	/* eslint-disable no-unused-vars */

	import { resolve } from '$app/paths';
	import CourseAdminCard from '@/lib/components/ui/courses/CourseAdminCard.svelte';
	import { Plus, Search } from 'lucide-svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>Kurslar ro'yxati - Admin Panel</title>
	<meta
		name="description"
		content="Chinora Academy platformasidagi barcha kurslarni ko'rish va boshqarish uchun bu yerda ro'yxat mavjud. Har bir kursning tafsilotlarini ko'rish, tahrirlash yoki o'chirish uchun kerakli kursni tanlang."
	/>
</svelte:head>

<div class="mx-auto min-h-screen max-w-7xl bg-[#f8fafc] p-4 font-sans md:p-8">
	<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Kurslar ro'yxati</h1>
			<p class="mt-1 text-sm font-medium text-slate-500">
				Chinora Academy platformasidagi barcha kurslarni ko'rish va boshqarish uchun bu yerda
				ro'yxat mavjud. Har bir kursning tafsilotlarini ko'rish, tahrirlash yoki o'chirish uchun
				kerakli kursni tanlang.
			</p>
		</div>

		<div class="flex w-full items-center gap-3 sm:w-auto">
			<div class="relative flex-1 sm:w-64">
				<Search size={18} class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					placeholder="Search courses..."
					class="h-11 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 text-sm shadow-sm transition-all outline-none focus:border-[#ed4b72] focus:ring-[3px] focus:ring-[#ed4b72]/15"
				/>
			</div>

			<a
				href={resolve('/admin/courses/create')}
				class="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-[#ed4b72] to-[#de3c61] px-5 font-bold text-white transition-transform hover:scale-105 hover:shadow-lg hover:shadow-rose-200/50"
			>
				<Plus size={20} strokeWidth={2.5} />
				<span class="hidden sm:inline">Kurs qo'shish</span>
			</a>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#await data.lazy.courses}
			<!-- Premium Skeleton Loaders -->
			{#each Array(8) as _, i (i)}
				<div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
					<div class="aspect-video w-full animate-pulse bg-slate-100"></div>
					<div class="space-y-4 p-5">
						<div class="h-5 w-3/4 animate-pulse rounded-lg bg-slate-100"></div>
						<div class="flex items-center justify-between">
							<div class="h-4 w-20 animate-pulse rounded-md bg-slate-50"></div>
							<div class="h-4 w-16 animate-pulse rounded-md bg-slate-50"></div>
						</div>
						<div class="flex items-center gap-2 pt-2">
							<div class="h-8 flex-1 animate-pulse rounded-xl bg-slate-50"></div>
							<div class="h-8 w-8 animate-pulse rounded-xl bg-slate-50"></div>
						</div>
					</div>
				</div>
			{/each}
		{:then courses}
			{#each courses as course (course.id)}
				<CourseAdminCard
					title={course.title}
					price={course.price}
					modules={course.modules_count}
					status={course.is_published ? 'published' : 'Qoralama'}
					link={course.id}
					image={course.img ||
						`https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`}
				/>
			{:else}
				<div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
					<div class="mb-4 rounded-full bg-slate-100 p-6">
						<Search size={48} class="text-slate-300" />
					</div>
					<h3 class="text-xl font-bold text-slate-800">Kurslar topilmadi</h3>
					<p class="mt-2 text-slate-500">Hozircha hech qanday kurs yaratilmagan.</p>
				</div>
			{/each}
		{/await}
	</div>
</div>
