<script>
	import { ChevronLeft, ChevronRight, Trophy, Crown, Medal } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { rankingData = null, isAdmin = false, currentUserId = null } = $props();

	// Component local state for instantaneous pagination
	let currentPage = $state(1);

	// Data is expected to be an array or a DRF object. We convert it to a flat array.
	let results = $derived(rankingData?.results ? rankingData.results : rankingData || []);
	let count = $derived(results.length);
	let pageSize = $derived(isAdmin ? 10 : 5);
	let totalPages = $derived(Math.max(1, Math.ceil(count / pageSize)));

	// Frontend-only reactive pagination: slice the full results array
	let paginatedResults = $derived(
		results.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	function changePage(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		currentPage = newPage;
	}

	const getMedalIcon = (rank) => {
		if (rank === 1)
			return { icon: Crown, color: 'text-amber-500', bg: 'bg-amber-100/50', label: '🥇' };
		if (rank === 2)
			return { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-100/50', label: '🥈' };
		if (rank === 3)
			return { icon: Trophy, color: 'text-orange-400', bg: 'bg-orange-100/50', label: '🥉' };
		return null;
	};
</script>

<div class="flex h-full flex-col rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold text-slate-800">{m.dashboard_leaderboard()}</h2>
	</div>

	<!-- Table -->
	<div class="min-h-[380px] flex-1 overflow-x-auto">
		<table class="w-full border-collapse text-left">
			<thead>
				<tr class="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
					<th class="px-2 pb-3">{m.rank_pos()}</th>
					<th class="px-2 pb-3">{m.rank_student()}</th>
					<th class="px-2 pb-3">{m.rank_course()}</th>
					<th class="px-2 pb-3 text-right">{m.rank_score()}</th>
				</tr>
			</thead>
			<tbody class="text-sm">
				{#if !rankingData}
					<!-- Skeleton -->
					{#each Array(5) as _, i (i)}
						<tr>
							<td colspan="4" class="px-2 py-3">
								<div class="h-12 w-full animate-pulse rounded-xl bg-slate-50"></div>
							</td>
						</tr>
					{/each}
				{:else if results.length === 0}
					<tr>
						<td colspan="4" class="py-8 text-center text-sm font-semibold text-slate-400">
							{m.no_data_found ? m.no_data_found() : "Ma'lumot topilmadi..."}
						</td>
					</tr>
				{:else}
					{#each paginatedResults as user, i (user.id)}
						{@const rank = (currentPage - 1) * pageSize + i + 1}
						{@const medal = getMedalIcon(rank)}
						{@const isMe = String(user.id) === String(currentUserId)}

						<tr
							class="group border-b border-transparent transition-all duration-200 last:border-0 {isAdmin
								? 'cursor-pointer'
								: ''} {isMe ? 'relative z-10 bg-rose-50/40' : 'hover:bg-slate-50/80'}"
							onclick={() => isAdmin && (window.location.href = `/admin/students/${user.id}`)}
						>
							<td class="px-2 py-3.5 first:rounded-l-2xl last:rounded-r-2xl">
								<div class="flex items-center gap-2">
									{#if medal}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-xl {medal.bg} {medal.color} border border-white/50 shadow-sm"
										>
											<medal.icon size={16} strokeWidth={2.5} />
										</div>
									{:else}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[11px] font-black text-slate-400"
										>
											{rank}
										</div>
									{/if}
								</div>
							</td>
							<td class="px-2 py-3.5">
								<div class="flex items-center gap-3">
									<div class="relative">
										{#if user.picture}
											<img
												src={user.picture}
												alt=""
												class="h-10 w-10 rounded-xl object-cover shadow-sm ring-2 ring-white"
											/>
										{:else}
											<div
												class="flex h-10 w-10 items-center justify-center rounded-xl {isMe
													? 'bg-rose-100 text-rose-600'
													: 'bg-slate-100 text-slate-500'} text-xs font-black tracking-wider uppercase shadow-sm ring-2 ring-white"
											>
												{user.first_name?.[0] || user.username[0] || '?'}
											</div>
										{/if}
										{#if isMe}
											<div
												class="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
											></div>
										{/if}
									</div>
									<div class="flex flex-col">
										<span class="leading-none font-black text-slate-800">
											{user.first_name && user.last_name
												? `${user.first_name} ${user.last_name}`
												: user.username}
											{#if isMe}
												<span
													class="ml-1.5 inline-flex items-center rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-rose-600 uppercase ring-1 ring-rose-200"
												>
													{m.you ? m.you() : 'Siz'}
												</span>
											{/if}
										</span>
										<span class="mt-1 text-[10px] font-bold tracking-tight text-slate-400 uppercase"
											>ID: {user.username || user.id}</span
										>
									</div>
								</div>
							</td>
							<td class="px-2 py-3.5">
								<div
									class="flex w-fit items-center gap-1.5 rounded-lg border border-slate-100/50 bg-slate-50/50 px-2 py-1 text-xs font-bold text-slate-500"
								>
									<span class="text-slate-700">{user.courses_count || 0}</span>
									<span class="text-[10px] uppercase opacity-70"
										>{m.unit_ta ? m.unit_ta() : 'TA'}</span
									>
								</div>
							</td>
							<td class="px-2 py-3.5 text-right">
								<div class="inline-flex flex-col items-end">
									<span
										class="text-base font-black {rank <= 3
											? 'text-slate-900'
											: 'text-slate-800'} leading-none"
									>
										{user.total_score || 0}
									</span>
									<span class="mt-1 text-[10px] font-black tracking-widest text-[#ed4b72] uppercase"
										>{m.unit_ball ? m.unit_ball() : 'BALL'}</span
									>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Pagination Controls -->
	{#if rankingData && totalPages > 1}
		<div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
			<div class="flex items-center gap-2">
				<div class="flex -space-x-1.5">
					{#each results.slice(0, 3) as u (u)}
						<div
							class="h-6 w-6 overflow-hidden rounded-full border-2 border-white ring-1 ring-slate-100"
						>
							{#if u.picture}
								<img src={u.picture} alt="" class="h-full w-full object-cover" />
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-slate-50 text-[8px] font-black text-slate-300 uppercase"
								>
									{u.first_name?.[0] || u.username[0]}
								</div>
							{/if}
						</div>
					{/each}
				</div>
				<span class="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
					{m.pagination_total_people ? m.pagination_total_people({ count }) : `Jami ${count} kishi`}
				</span>
			</div>

			<div class="flex items-center gap-3">
				<button
					onclick={() => changePage(currentPage - 1)}
					disabled={currentPage === 1}
					class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ChevronLeft size={18} strokeWidth={3} />
				</button>

				<div
					class="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 shadow-inner"
				>
					<span class="text-xs font-black text-slate-700">{currentPage}</span>
					<span class="text-[10px] font-black text-slate-300 uppercase">/</span>
					<span class="text-xs font-black text-slate-400">{totalPages}</span>
				</div>

				<button
					onclick={() => changePage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ChevronRight size={18} strokeWidth={3} />
				</button>
			</div>
		</div>
	{/if}
</div>
