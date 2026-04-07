<script lang="ts">
	import { resolve } from '$app/paths';
	import CourseCard from '@/lib/components/ui/courses/CourseCard.svelte';
	// import StatusBadge from '@/lib/components/ui/courses/StatusBadge.svelte';

	let { data } = $props();

	// Backenddan keladigan real ma'lumotlar
	let courses = $derived(data.courses || []);
	let ranking = $derived(data.ranking || []);

	// Agar submissions ham kerak bo'lsa, keyin qo'shamiz
	// Hozircha mock qoldirdim (agar backendda yo'q bo'lsa)
	// const submissions = [
	// 	{ id: 1, name: 'Assignment 1', course: 'Course ...', score: 50, status: 'Pending' },
	// 	{ id: 2, name: 'Assignment 2', course: 'Yangi K...', score: 60, status: 'Graded' },
	// 	{ id: 3, name: 'Assignment 3', course: 'Course ...', score: 80, status: 'Graded' },
	// 	{ id: 4, name: 'Assignment 4', course: 'Course ...', score: 40, status: 'Graded' }
	// ];
</script>

<div class="mx-auto min-h-screen max-w-7xl space-y-8 bg-[#f8fafc] p-4 font-sans md:p-8">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div
			class="rounded-3xl bg-linear-to-r from-[#ed4b72] to-[#de3c61] p-6 text-white shadow-lg shadow-rose-200"
		>
			<h2 class="mb-2 text-lg font-medium opacity-90">Total Score</h2>
			<div class="mb-1 text-5xl font-bold">200<span class="text-3xl opacity-80">/320</span></div>
			<p class="text-sm opacity-90">Umumiy ball</p>
		</div>

		<div
			class="flex flex-col justify-center rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
		>
			<h2 class="mb-2 text-lg font-medium text-slate-600">Ranking Position</h2>
			<div class="mb-1 text-4xl font-bold text-slate-800">Reyting 115</div>
			<p class="text-sm text-slate-400">Reyting</p>
		</div>
	</div>

	<!-- Mening kurslarim -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold text-slate-800">Mening kurslarim</h2>
			<a href={resolve('/kurslarim')} class="text-sm font-medium text-[#ef4444] hover:underline"
				>Barchasi</a
			>
		</div>

		<div class="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-4">
			{#if courses.length > 0}
				{#each courses as course (course.id)}
					<div class="snap-start">
						<a href={resolve(`/kurslarim/${course.id}`)}>
							<CourseCard
								title={course.title}
								progress={course.progress}
								lessons={course.lessons}
							/>
						</a>
					</div>
				{/each}
			{:else}
				<p class="text-slate-400">Hozircha kurslar yo‘q...</p>
			{/if}
		</div>
	</section>

	<!-- Ranking va Submissions -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Ranking Leaderboard -->
		<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
			<h2 class="mb-6 text-xl font-bold text-slate-800">Ranking Leaderboard</h2>
			<div class="overflow-x-auto">
				<table class="w-full border-collapse text-left">
					<thead>
						<tr class="border-b border-slate-100 text-sm text-slate-400">
							<th class="px-2 pb-3 font-medium">Pos.</th>
							<th class="px-2 pb-3 font-medium">Student</th>
							<th class="px-2 pb-3 font-medium">Score</th>
							<th class="px-2 pb-3 font-medium">Course</th>
							<th class="px-2 pb-3 font-medium">Score</th>
						</tr>
					</thead>
					<tbody class="text-sm">
						{#each ranking.slice(0, 5) as user (user.id || user.name)}
							<tr
								class="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
							>
								<td class="px-2 py-3">
									<div
										class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs"
									>
										{user.medal || '🏅'}
									</div>
								</td>
								<td class="flex items-center gap-3 px-2 py-3">
									<div class="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-200">
										<img
											src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name || user.username}`}
											alt="avatar"
											class="h-full w-full object-cover"
										/>
									</div>
									<span class="font-medium">{user.name || user.username}</span>
								</td>
								<td class="px-2 py-3 font-medium">{user.score || user.total_score}</td>
								<td class="px-2 py-3 text-slate-500">{user.courses_count || '—'}</td>
								<td class="px-2 py-3 font-semibold">{user.total_score}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Recent Submissions (hozircha mock) -->
		<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
			<h2 class="mb-6 text-xl font-bold text-slate-800">Recent Submissions</h2>
			<!-- Agar backenddan submissions ham keladigan bo'lsa, keyin qo'shamiz -->
			<div class="overflow-x-auto">
				<table class="w-full border-collapse text-left">
					<!-- ... submissions jadvali o'zgarmadi ... -->
				</table>
			</div>
		</div>
	</div>
</div>
