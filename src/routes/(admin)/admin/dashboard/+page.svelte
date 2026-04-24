<script lang="ts">
	/* eslint-disable no-unused-vars */
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { Users, BookOpen, TrendingUp, DollarSign, Award, Plus, Search } from 'lucide-svelte';
	import LeaderboardTable from '@/lib/components/ui/dashboard/LeaderboardTable.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	// Reyting uchun o'rinlarni aniqlab beruvchi yordamchi funksiya
	const getMedal = (index) => {
		if (index === 0) return '🥇';
		if (index === 1) return '🥈';
		if (index === 2) return '🥉';
		return index + 1;
	};

	const statConfig = [
		{
			key: 'totalCount',
			title: m.admin_dash_total_students ? m.admin_dash_total_students() : 'Jami shogirdlar',
			change: '+18',
			icon: Users,
			color: 'text-primary',
			bg: 'bg-primary/10'
		},
		{
			key: 'coursesCount',
			title: m.admin_dash_active_courses ? m.admin_dash_active_courses() : 'Faol kurslar',
			change: '+2',
			icon: BookOpen,
			color: 'text-success',
			bg: 'bg-success/10'
		},
		{
			title: m.admin_dash_monthly_income ? m.admin_dash_monthly_income() : 'Bu oy daromad',
			value: '18.4M',
			change: '+12%',
			icon: DollarSign,
			color: 'text-warning',
			bg: 'bg-warning/10'
		},
		{
			title: m.admin_dash_avg_retention ? m.admin_dash_avg_retention() : 'O‘rtacha retention',
			value: '87%',
			change: '-3%',
			icon: TrendingUp,
			color: 'text-primary',
			bg: 'bg-primary/10'
		}
	];
</script>

<div class="min-h-screen bg-main pt-15">
	<div class="mx-auto max-w-screen-2xl p-6 lg:p-10">
		<div class="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
			<div>
				<h1 class="font-tarsk text-4xl font-bold text-foreground">{m.admin_dash_title ? m.admin_dash_title() : 'Admin Dashboard'}</h1>
				<p class="text-muted-foreground mt-2 text-lg">{m.admin_dash_subtitle ? m.admin_dash_subtitle() : 'CHINORA FASHION ACADEMY boshqaruvi'}</p>
			</div>

			<div class="flex flex-wrap items-center gap-4">
				<div class="relative w-80">
					<Search class="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
					<input
						type="text"
						placeholder={m.admin_dash_search_placeholder ? m.admin_dash_search_placeholder() : "Shogird, kurs yoki to‘lov izlash..."}
						class="w-full rounded-2xl border border-main bg-card py-3 pr-4 pl-11 text-main transition-all focus:border-primary focus:outline-none"
					/>
				</div>

				<a
					href={resolve('/admin/courses/create')}
					class="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95"
				>
					<Plus class="h-5 w-5" />
					{m.admin_dash_add_course ? m.admin_dash_add_course() : 'Yangi dars qo‘shish'}
				</a>
			</div>
		</div>

		<div class="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#await data.lazy.stats}
				{#each statConfig as config (config.title)}
					<div class="animate-pulse rounded-3xl border border-main bg-card p-7 shadow-sm">
						<div class="mb-6 flex items-center justify-between">
							<div class="h-12 w-12 rounded-2xl bg-muted/10"></div>
							<div class="h-4 w-12 rounded bg-muted/5"></div>
						</div>
						<div class="mb-2 h-10 w-16 rounded bg-muted/10"></div>
						<div class="h-4 w-24 rounded bg-muted/5"></div>
					</div>
				{/each}
			{:then statsData}
				{#each statConfig as config (config.title)}
					<div class="rounded-3xl border border-main bg-card p-7 shadow-sm">
						<div class="flex items-center justify-between">
							<div class="{config.bg} flex h-12 w-12 items-center justify-center rounded-2xl">
								<config.icon class="h-6 w-6 {config.color}" />
							</div>
							<span class="text-sm font-medium text-success">{config.change}</span>
						</div>
						<p class="mt-6 text-4xl font-bold text-main">
							{'key' in config ? (statsData?.[config.key] ?? 0) : config.value}
						</p>
						<p class="mt-1 text-sm text-muted">{config.title}</p>
					</div>
				{/each}
			{/await}
		</div>

		<div class="grid grid-cols-1 gap-8 xl:grid-cols-12">
			<div class="h-full xl:col-span-8">
				{#await data.lazy.ranking}
					<div
						class="flex h-96 flex-col items-center justify-center rounded-3xl border border-main bg-card p-6 shadow-sm"
					>
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-muted/10 border-t-primary"
						></div>
					</div>
				{:then ranking}
					<LeaderboardTable
						rankingData={ranking}
						isAdmin={true}
						currentUserId={data.user?.id}
					/>
				{/await}
			</div>

			<div class="space-y-8 xl:col-span-4">
				<div class="rounded-3xl border border-main bg-card p-8 shadow-sm">
					<div class="mb-6 flex items-center justify-between">
						<h3 class="flex items-center gap-2 text-xl font-semibold">
							<Users class="h-5 w-5 text-primary" /> {m.admin_dash_new_students ? m.admin_dash_new_students() : 'Yangi shogirdlar'}
						</h3>
						<a
							href={resolve('/admin/students')}
							class="text-sm font-medium text-primary hover:underline">{m.admin_dash_view_all ? m.admin_dash_view_all() : 'Barchasi →'}</a
						>
					</div>

					<div class="space-y-5">
						{#await data.lazy.newStudents}
							{#each Array(3) as _, i (i)}
								<div class="flex animate-pulse items-center gap-4">
									<div class="h-11 w-11 rounded-full bg-muted/10"></div>
									<div class="flex-1 space-y-2">
										<div class="h-4 w-24 rounded bg-muted/10"></div>
										<div class="h-3 w-32 rounded bg-muted/5"></div>
									</div>
								</div>
							{/each}
						{:then students}
							{#each students?.slice(0, 5) || [] as student (student.id)}
								<div class="flex items-center gap-4">
									<div
										class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted/10 font-bold text-primary shadow-sm"
									>
										<a
											href={resolve(`/admin/students/${student.id}`)}
											class="text-base font-medium"
										>
											{student.first_name?.[0] || '?'}{student.last_name?.[0] || ''}
										</a>
									</div>
									<div class="flex-1 overflow-hidden">
										<a
											href={resolve(`/admin/students/${student.id}`)}
											class="text-base font-medium"
										>
											<p class="truncate text-sm font-medium text-main">
												{student.first_name}
												{student.last_name}
											</p>
											<p class="mt-0.5 text-xs text-muted">
												{student.phone_number || student.username}
											</p>
										</a>
									</div>
									<div class="text-right">
										<span
											class="inline-block rounded-lg bg-success/10 px-2 py-1 text-xs font-bold text-success"
										>
											{student.total_score ?? 0} {m.admin_dash_points ? m.admin_dash_points() : 'ball'}
										</span>
									</div>
								</div>
							{/each}
						{/await}
					</div>
				</div>

				<div class="rounded-3xl border border-main bg-card p-8 shadow-sm">
					<h3 class="mb-6 text-xl font-semibold text-main">{m.admin_dash_quick_actions ? m.admin_dash_quick_actions() : 'Tez amallar'}</h3>
					<div class="grid grid-cols-2 gap-4">
						<button
							class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-muted/5 py-6 transition-all hover:border-main hover:bg-muted/10 active:scale-95"
						>
							<Users class="h-7 w-7 text-primary" />
							<span class="text-sm font-medium text-main">{m.admin_dash_add_student ? m.admin_dash_add_student() : 'Shogird qo‘shish'}</span>
						</button>
						<button
							class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-muted/5 py-6 transition-all hover:border-main hover:bg-muted/10 active:scale-95"
						>
							<BookOpen class="h-7 w-7 text-primary" />
							<span class="text-sm font-medium text-main">{m.admin_dash_add_course_qa ? m.admin_dash_add_course_qa() : 'Kurs yaratish'}</span>
						</button>
						<button
							class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-muted/5 py-6 transition-all hover:border-main hover:bg-muted/10 active:scale-95"
						>
							<DollarSign class="h-7 w-7 text-primary" />
							<span class="text-sm font-medium text-main">{m.admin_dash_payments ? m.admin_dash_payments() : 'To‘lovlar'}</span>
						</button>
						<button
							class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-muted/5 py-6 transition-all hover:border-main hover:bg-muted/10 active:scale-95"
						>
							<Award class="h-7 w-7 text-primary" />
							<span class="text-sm font-medium text-main">{m.admin_dash_certs ? m.admin_dash_certs() : 'Sertifikatlar'}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
