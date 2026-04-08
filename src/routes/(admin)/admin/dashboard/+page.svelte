<script lang="ts">
    /* eslint-disable no-unused-vars */
	import { resolve } from '$app/paths';
	import { Users, BookOpen, TrendingUp, DollarSign, Award, Plus, Search } from 'lucide-svelte';

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
			title: 'Jami shogirdlar',
			change: '+18',
			icon: Users,
			color: 'text-blue-600',
			bg: 'bg-blue-100'
		},
		{
			key: 'coursesCount',
			title: 'Faol kurslar',
			change: '+2',
			icon: BookOpen,
			color: 'text-emerald-600',
			bg: 'bg-emerald-100'
		},
		{
			title: 'Bu oy daromad',
			value: '18.4M',
			change: '+12%',
			icon: DollarSign,
			color: 'text-amber-600',
			bg: 'bg-amber-100'
		},
		{
			title: 'O‘rtacha retention',
			value: '87%',
			change: '-3%',
			icon: TrendingUp,
			color: 'text-purple-600',
			bg: 'bg-purple-100'
		}
	];
</script>

<div class="min-h-screen bg-linear-to-br from-slate-50 to-zinc-100 pt-15">
	<div class="mx-auto max-w-screen-2xl p-6 lg:p-10">
		<div class="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
			<div>
				<h1 class="font-tarsk text-4xl font-bold text-foreground">Admin Dashboard</h1>
				<p class="text-muted-foreground mt-2 text-lg">CHINORA FASHION ACADEMY boshqaruvi</p>
			</div>

			<div class="flex flex-wrap items-center gap-4">
				<div class="relative w-80">
					<Search class="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
					<input
						type="text"
						placeholder="Shogird, kurs yoki to‘lov izlash..."
						class="border-border w-full rounded-2xl border bg-white py-3 pr-4 pl-11 transition-all focus:border-primary focus:outline-none"
					/>
				</div>

				<a
					href={resolve('/admin/courses/create')}
					class="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-primary/90"
				>
					<Plus class="h-5 w-5" />
					Yangi dars qo‘shish
				</a>
			</div>
		</div>

		<div class="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#await data.lazy.stats}
				{#each statConfig as config (config.title)}
					<div class="animate-pulse rounded-3xl border border-white/70 bg-white p-7 shadow-sm">
						<div class="mb-6 flex items-center justify-between">
							<div class="h-12 w-12 rounded-2xl bg-slate-100"></div>
							<div class="h-4 w-12 rounded bg-slate-50"></div>
						</div>
						<div class="mb-2 h-10 w-16 rounded bg-slate-100"></div>
						<div class="h-4 w-24 rounded bg-slate-50"></div>
					</div>
				{/each}
			{:then statsData}
				{#each statConfig as config (config.title)}
					<div class="rounded-3xl border border-white/70 bg-white p-7 shadow-sm">
						<div class="flex items-center justify-between">
							<div class="{config.bg} flex h-12 w-12 items-center justify-center rounded-2xl">
								<config.icon class="h-6 w-6 {config.color}" />
							</div>
							<span class="text-sm font-medium text-emerald-500">{config.change}</span>
						</div>
						<p class="mt-6 text-4xl font-bold text-foreground">
							{'key' in config ? (statsData?.[config.key] ?? 0) : config.value}
						</p>
						<p class="text-muted-foreground mt-1 text-sm">{config.title}</p>
					</div>
				{/each}
			{/await}
		</div>

		<div class="grid grid-cols-1 gap-8 xl:grid-cols-12">
			<div class="rounded-3xl border border-white/70 bg-white p-8 shadow-sm xl:col-span-8">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-2xl font-semibold text-slate-800">Top 5 - Eng yaxshi shogirdlar</h2>
					<span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-500"
						>Umumiy reyting</span
					>
				</div>

				<div class="overflow-x-auto">
					{#await data.lazy.ranking}
						<div class="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-4">
							{#each Array(2) as _, i (i)}
								<div class="h-48 w-72 shrink-0 animate-pulse rounded-3xl bg-slate-100"></div>
							{/each}
						</div>
					{:then ranking}
						<table class="w-full border-collapse text-left">
							<thead>
								<tr class="border-b border-slate-100 text-sm text-slate-400">
									<th class="w-12 px-2 pb-3 font-medium">Pos.</th>
									<th class="px-2 pb-3 font-medium">Shogird</th>
									<th class="px-2 pb-3 font-medium">Ball</th>
									<th class="px-2 pb-3 font-medium">Kurslar soni</th>
								</tr>
							</thead>
							<tbody class="text-sm">
								{#each ranking?.slice(0, 5) || [] as user, index (user.id || index)}
									<tr
										class="border-b border-slate-50 text-slate-700 transition-colors last:border-0 hover:bg-slate-50"
									>
										<td class="px-2 py-4">
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold"
											>
												{getMedal(index)}
											</div>
										</td>
										<td class="flex items-center gap-3 px-2 py-4">
											<a href={resolve(`/admin/students/${user.id}`)} class="text-base font-medium">
												{#if user.first_name || user.last_name}
													<span class="text-base font-medium"
														>{user.first_name} {user.last_name}</span
													>
												{:else}
													<span class="text-base font-medium">{user.username}</span>
												{/if}
											</a>
										</td>
										<td class="px-2 py-4 font-medium text-emerald-600">{user.total_score ?? 0}</td>
										<td class="px-2 py-4 text-slate-500">{user.courses_count ?? 0} ta</td>
									</tr>
								{/each}

								{#if !ranking || ranking.length === 0}
									<tr>
										<td colspan="4" class="py-8 text-center text-slate-500">
											Hozircha reyting ma'lumotlari yo'q
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					{/await}
				</div>
			</div>

			<div class="space-y-8 xl:col-span-4">
				<div class="rounded-3xl border border-white/70 bg-white p-8 shadow-sm">
					<div class="mb-6 flex items-center justify-between">
						<h3 class="flex items-center gap-2 text-xl font-semibold">
							<Users class="h-5 w-5 text-primary" /> Yangi shogirdlar
						</h3>
						<a
							href={resolve('/admin/students')}
							class="text-sm font-medium text-primary hover:underline">Barchasi →</a
						>
					</div>

					<div class="space-y-5">
						{#await data.lazy.newStudents}
							{#each Array(3) as _, i (i)}
								<div class="flex animate-pulse items-center gap-4">
									<div class="h-11 w-11 rounded-full bg-slate-50"></div>
									<div class="flex-1 space-y-2">
										<div class="h-4 w-24 rounded bg-slate-50"></div>
										<div class="h-3 w-32 rounded bg-slate-50"></div>
									</div>
								</div>
							{/each}
						{:then students}
							{#each students?.slice(0, 5) || [] as student (student.id)}
								<div class="flex items-center gap-4">
									<div
										class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-primary shadow-sm"
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
											<p class="truncate text-sm font-medium text-foreground">
												{student.first_name}
												{student.last_name}
											</p>
											<p class="text-muted-foreground mt-0.5 text-xs">
												{student.phone_number || student.username}
											</p>
										</a>
									</div>
									<div class="text-right">
										<span
											class="inline-block rounded-lg bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700"
										>
											{student.total_score ?? 0} ball
										</span>
									</div>
								</div>
							{/each}
						{/await}
					</div>
				</div>

				<div class="rounded-3xl border border-white/70 bg-white p-8 shadow-sm">
					<h3 class="mb-6 text-xl font-semibold">Tez amallar</h3>
					<div class="grid grid-cols-2 gap-4">
						<button
							class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-slate-50 py-6 transition-all hover:border-slate-200 hover:bg-slate-100"
						>
							<Users class="h-7 w-7 text-primary" />
							<span class="text-sm font-medium text-slate-700">Shogird qo‘shish</span>
						</button>
						<button
							class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-slate-50 py-6 transition-all hover:border-slate-200 hover:bg-slate-100"
						>
							<BookOpen class="h-7 w-7 text-primary" />
							<span class="text-sm font-medium text-slate-700">Kurs yaratish</span>
						</button>
						<button
							class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-slate-50 py-6 transition-all hover:border-slate-200 hover:bg-slate-100"
						>
							<DollarSign class="h-7 w-7 text-primary" />
							<span class="text-sm font-medium text-slate-700">To‘lovlar</span>
						</button>
						<button
							class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-transparent bg-slate-50 py-6 transition-all hover:border-slate-200 hover:bg-slate-100"
						>
							<Award class="h-7 w-7 text-primary" />
							<span class="text-sm font-medium text-slate-700">Sertifikatlar</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
