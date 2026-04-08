<script lang="ts">
	import { resolve } from '$app/paths';
	import CourseCard from '@/lib/components/ui/courses/CourseCard.svelte';
	import { BookOpen, Award, TrendingUp } from 'lucide-svelte';

	let { data } = $props();

	// Student dashboard uchun statik config (keylar serverdan keladigan data'ga moslanadi)
	const statConfig = [
		{ title: 'Mening kurslarim', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', key: 'courses_count' },
		{ title: 'Umumiy ball', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', key: 'total_score' },
		{ title: 'Reytingdagi o\'rnim', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', key: 'rank' },
	];
</script>

<div class="mx-auto min-h-screen max-w-7xl space-y-8 bg-[#f8fafc] p-4 font-sans md:p-8">
	
	<!-- Stats Section -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#await data.lazy.courses}
			{#each statConfig as _ ( _.title )}
				<div class="bg-white rounded-3xl p-7 shadow-sm border border-white/70 animate-pulse">
					<div class="flex items-center justify-between mb-6">
						<div class="w-12 h-12 rounded-2xl bg-slate-100"></div>
						<div class="w-12 h-4 bg-slate-50 rounded"></div>
					</div>
					<div class="h-10 bg-slate-100 rounded w-16 mb-2"></div>
					<div class="h-4 bg-slate-50 rounded w-24"></div>
				</div>
			{/each}
		{:then courses}
			{#each statConfig as config (config.title)}
				<div class="bg-white rounded-3xl p-7 shadow-sm border border-white/70">
					<div class="flex items-center justify-between">
						<div class="{config.bg} w-12 h-12 rounded-2xl flex items-center justify-center">
							<config.icon class="w-6 h-6 {config.color}" />
						</div>
					</div>
					<p class="text-4xl font-bold mt-6 text-slate-800">
						{#if config.key === 'courses_count'}
							{courses?.length ?? 0}
						{:else if config.key === 'total_score'}
							200
						{:else if config.key === 'rank'}
							115
						{:else}
							0
						{/if}
					</p>
					<p class="text-slate-500 text-sm mt-1">{config.title}</p>
				</div>
			{/each}
		{/await}
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
			{#await data.lazy.courses}
				{#each Array(2) as _, i (i)}
					<div class="w-72 h-48 bg-slate-100 rounded-3xl animate-pulse shrink-0"></div>
				{/each}
			{:then courses}
				{#if courses && courses.length > 0}
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
					<p class="text-slate-400 p-4">Hozircha kurslar yo‘q...</p>
				{/if}
			{/await}
		</div>
	</section>

	<!-- Ranking Leaderboard -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
			<h2 class="mb-6 text-xl font-bold text-slate-800">Ranking Leaderboard</h2>
			
			<div class="overflow-x-auto">
				{#await data.lazy.ranking}
					<div class="animate-pulse space-y-4">
						{#each Array(5) as _, i (i)}
							<div class="h-10 rounded-lg bg-slate-50"></div>
						{/each}
					</div>
				{:then ranking}
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
							{#each (ranking || []).slice(0, 5) as user (user.id || user.name)}
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
				{/await}
			</div>
		</div>

		<!-- Recent Submissions (hozircha mock) -->
		<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
			<h2 class="mb-6 text-xl font-bold text-slate-800">Recent Submissions</h2>
			<div class="overflow-x-auto">
				<p class="text-slate-400 p-4 text-center">Hozircha topshiriqlar yo‘q...</p>
			</div>
		</div>
	</div>
</div>
