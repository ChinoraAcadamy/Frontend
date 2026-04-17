<script lang="ts">
	/* eslint-disable no-unused-vars */

	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import CourseCard from '@/lib/components/ui/courses/CourseCard.svelte';
	import LeaderboardTable from '@/lib/components/ui/dashboard/LeaderboardTable.svelte';
	import { BookOpen, Award, TrendingUp, ChevronRight, FileCheck } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { data } = $props();

	// Student dashboard uchun statik config (keylar serverdan keladigan data'ga moslanadi)
	const statConfig = [
		{
			title: m.stat_courses(),
			icon: BookOpen,
			color: 'text-blue-600',
			bg: 'bg-blue-50',
			key: 'courses_count'
		},
		{
			title: m.stat_score(),
			icon: Award,
			color: 'text-amber-600',
			bg: 'bg-amber-50',
			key: 'total_score'
		},
		{
			title: m.stat_rank(),
			icon: TrendingUp,
			color: 'text-emerald-600',
			bg: 'bg-emerald-50',
			key: 'rank'
		}
	];

	function formatDate(dateStr) {
		if (!dateStr) return '—';
		return new Date(dateStr).toLocaleDateString(getLocale() === 'uz' ? 'uz-UZ' : 'ru-RU', {
			day: 'numeric',
			month: 'short'
		});
	}

	const statusColors = {
		pending: { bg: 'bg-slate-100', text: 'text-slate-600' },
		submitted: { bg: 'bg-blue-50', text: 'text-blue-600' },
		graded: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
		rejected: { bg: 'bg-rose-50', text: 'text-rose-600' }
	};
</script>

<div class="mx-auto min-h-screen max-w-7xl space-y-8 bg-[#f8fafc] p-4 font-sans md:p-8">
	<!-- Stats Section -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#await data.lazy.courses}
			{#each statConfig as _ (_.title)}
				<div class="animate-pulse rounded-3xl border border-white/70 bg-white p-7 shadow-sm">
					<div class="mb-6 flex items-center justify-between">
						<div class="h-12 w-12 rounded-2xl bg-slate-100"></div>
						<div class="h-4 w-12 rounded bg-slate-50"></div>
					</div>
					<div class="mb-2 h-10 w-16 rounded bg-slate-100"></div>
					<div class="h-4 w-24 rounded bg-slate-50"></div>
				</div>
			{/each}
		{:then courses}
			{#each statConfig as config (config.title)}
				<div class="rounded-3xl border border-white/70 bg-white p-7 shadow-sm">
					<div class="flex items-center justify-between">
						<div class="{config.bg} flex h-12 w-12 items-center justify-center rounded-2xl">
							<config.icon class="h-6 w-6 {config.color}" />
						</div>
					</div>
					<p class="mt-6 text-4xl font-bold text-slate-800">
						{#if config.key === 'courses_count'}
							{courses?.length ?? 0}
						{:else if config.key === 'total_score'}
							{data.userScore}
						{:else if config.key === 'rank'}
							{data.myRank ?? '—'}
						{:else}
							0
						{/if}
					</p>
					<p class="mt-1 text-sm text-slate-500">{config.title}</p>
				</div>
			{/each}
		{/await}
	</div>

	<!-- Mening kurslarim -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold text-slate-800">{m.menu_my_courses()}</h2>
			<a
				href={resolve('/kurslarim')}
				class="group flex items-center gap-1 text-sm font-semibold text-[#ef4444] hover:underline"
			>
				{m.dashboard_view_all()}
				<ChevronRight size={16} class="transition-transform group-hover:translate-x-0.5" />
			</a>
		</div>

		<div class="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-4">
			{#await data.lazy.courses}
				{#each Array(2) as _, i (i)}
					<div class="h-48 w-72 shrink-0 animate-pulse rounded-3xl bg-slate-100"></div>
				{/each}
			{:then courses}
				{#if courses && courses.length > 0}
					{#each courses as course (course.id)}
						{#if course.is_blocked}
							<div class="cursor-not-allowed snap-start">
								<CourseCard
									title={course.title}
									progress={course.progress}
									lessons={course.lessons}
									image={course.img}
									is_blocked={true}
								/>
							</div>
						{:else}
							<div class="snap-start">
								<a href={resolve(`/kurslarim/${course.id}`)}>
									<CourseCard
										title={course.title}
										progress={course.progress}
										lessons={course.lessons}
										image={course.img}
										is_blocked={false}
									/>
								</a>
							</div>
						{/if}
					{/each}
				{:else}
					<p class="p-4 text-slate-400">{m.dashboard_no_courses()}</p>
				{/if}
			{/await}
		</div>
	</section>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Ranking Leaderboard dynamically imported -->
		<div class="h-full">
			{#await data.lazy.ranking}
				<div
					class="flex h-96 flex-col items-center justify-center rounded-3xl border border-white/70 bg-white p-6 shadow-sm"
				>
					<div
						class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#ed4b72]"
					></div>
				</div>
			{:then ranking}
				<LeaderboardTable
					rankingData={ranking}
					isAdmin={false}
					currentUserId={data.user?.id}
				/>
			{/await}
		</div>

		<!-- Recent Submissions -->
		<div class="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-800">{m.dashboard_recent_submissions()}</h2>
				<a
					href={resolve('/baholar')}
					class="group flex items-center gap-1 text-sm font-semibold text-[#ef4444] hover:underline"
				>
					{m.dashboard_view_all()}
					<ChevronRight size={16} class="transition-transform group-hover:translate-x-0.5" />
				</a>
			</div>

			<div class="space-y-4">
				{#await data.lazy.recentSubmissions}
					{#each Array(3) as _, i (i)}
						<div class="h-20 w-full animate-pulse rounded-2xl bg-slate-50"></div>
					{/each}
				{:then submissions}
					{#if submissions && submissions.length > 0}
						{#each submissions as sub (sub.id)}
							<div
								class="group relative flex items-center gap-4 rounded-2xl border border-slate-50 bg-white p-4 transition-all hover:border-[#ef4444]/10 hover:shadow-sm"
							>
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#ef4444]/5 group-hover:text-[#ef4444]"
								>
									<FileCheck size={20} />
								</div>

								<div class="min-w-0 flex-1">
									<h4 class="truncate text-sm font-bold tracking-tight text-slate-800">
										{sub.assignment_title || sub.assignment?.title || 'Assignment'}
									</h4>
									<div class="mt-0.5 flex items-center gap-2 text-xs font-medium text-slate-400">
										<span>{formatDate(sub.submitted_at)}</span>
										<span>•</span>
										<span class="truncate"
											>{sub.lesson_title || sub.assignment?.lesson_title || 'Lesson'}</span
										>
									</div>
								</div>

								<div class="text-right">
									{#if sub.status === 'graded'}
										<div class="text-sm font-bold text-slate-800">
											{sub.score}<span class="text-[10px] text-slate-400"
												>/{sub.max_score || 10}</span
											>
										</div>
									{/if}
									<div class="mt-1">
										<span
											class="inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase {statusColors[
												sub.status
											]?.bg} {statusColors[sub.status]?.text}"
										>
											{m[`status_${sub.status}`]?.() || sub.status}
										</span>
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<div class="flex flex-col items-center justify-center py-10 text-center">
							<div
								class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-200"
							>
								<FileCheck size={24} />
							</div>
							<p class="text-sm font-medium text-slate-400">{m.dashboard_no_submissions()}</p>
						</div>
					{/if}
				{/await}
			</div>
		</div>
	</div>
</div>
