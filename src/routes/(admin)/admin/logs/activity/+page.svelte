<script>
	/* eslint-disable no-unused-vars */
	import { Search, ChevronLeft, ChevronRight, Activity, AlertCircle } from 'lucide-svelte';
	import { resolve } from '$app/paths';

	let { data } = $props();

	// ==================== STATE ====================
	let searchValue = $state(data.filters?.search || '');
	let orderingValue = $state(data.filters?.ordering || '-created_at');
	
	$effect(() => {
		searchValue = data.filters?.search || '';
		orderingValue = data.filters?.ordering || '-created_at';
	});

	let currentPage = $derived(data.currentPage || 1);
	const itemsPerPage = 15;

	/** @param {string} dateString */
	const formatDate = (dateString) => {
		if (!dateString) return '—';
		/** @type {Intl.DateTimeFormatOptions} */
		const options = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		};
		return new Date(dateString).toLocaleDateString('uz-UZ', options);
	};

	const getActionConfig = (action) => {
		const map = {
			CREATE: {
				label: 'Yilratildi',
				classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
			},
			UPDATE: { label: 'Yangilandi', classes: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
			DELETE: { label: "O'chirildi", classes: 'bg-rose-50 text-rose-700 ring-rose-600/20' }
		};
		return (
			map[action?.toUpperCase()] || {
				label: action,
				classes: 'bg-gray-50 text-gray-700 ring-gray-600/20'
			}
		);
	};
</script>

{#snippet tableSkeleton()}
	<div class="animate-pulse space-y-3 rounded-xl border border-gray-200 bg-white p-6">
		<div class="h-10 w-full rounded-lg bg-gray-100"></div>
		{#each Array(8) as _, i (i)}
			<div class="mt-2 h-14 w-full rounded-lg bg-gray-50"></div>
		{/each}
	</div>
{/snippet}

<div class="min-h-screen bg-gray-50/50 p-4 font-sans sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="flex items-center gap-2 text-2xl font-semibold text-gray-900">
					<Activity class="text-emerald-600" /> Tizim faoliyati
				</h1>
				{#await data.lazy.activityData then resolvedData}
					<p class="mt-1 text-sm text-gray-500">
						Jami <span class="font-medium text-gray-900">{resolvedData.count}</span> ta yozuv
					</p>
				{/await}
			</div>
		</div>

		<form method="GET" class="mb-6 flex flex-col gap-3 md:flex-row">
			<div class="relative flex-1 md:max-w-md">
				<Search size={18} class="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					name="search"
					placeholder="Foydalanuvchi, harakat yoki obyektni izlash..."
					bind:value={searchValue}
					class="h-10 w-full rounded-lg border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
				/>
			</div>
			<select
				name="ordering"
				bind:value={orderingValue}
				onchange={(e) => (/** @type {HTMLSelectElement} */ (e.target)).form?.submit()}
				class="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 transition-colors outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
			>
				<option value="-created_at">Eng yangilari oldin</option>
				<option value="created_at">Eng eskilar oldin</option>
			</select>
			<button type="submit" class="hidden">Izlash</button>
		</form>

		{#await data.lazy.activityData}
			{@render tableSkeleton()}
		{:then resolvedData}
			{@const logs = resolvedData.results || []}
			{@const totalPages = Math.ceil(resolvedData.count / itemsPerPage)}

			<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[1000px] text-left text-sm">
						<thead class="border-b border-gray-200 bg-gray-50/80">
							<tr>
								<th class="admin-table">Foydalanuvchi</th>
								<th class="admin-table">Harakat turi</th>
								<th class="admin-table w-1/4">Maqsad (Target)</th>
								<th class="admin-table hidden w-1/4 md:table-cell">Tafsilot</th>
								<th class="admin-table hidden sm:table-cell">IP Manzil</th>
								<th class="admin-table text-right">Sana</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each logs as log (log.id)}
								{@const config = getActionConfig(log.action)}
								<tr class="group transition-colors hover:bg-gray-50/50">
									<td class="px-6 py-4">
										<div class="font-medium text-gray-900">
											{log.user_name}
										</div>
										{#if log.user?.role}
											<div class="text-xs text-gray-500 capitalize">{log.user.role}</div>
										{/if}
									</td>
									<td class="px-6 py-4">
										<span
											class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset {config.classes}"
										>
											{config.label}
										</span>
									</td>
									<td class="px-6 py-4 text-gray-700">
										{log.target || 'Tizim'}
									</td>
									<td class="hidden px-6 py-4 text-gray-500 md:table-cell">
										<div class="max-w-[200px] truncate lg:max-w-xs" title={log.detail}>
											{log.detail || '—'}
										</div>
									</td>
									<td class="hidden px-6 py-4 font-mono text-xs text-gray-500 sm:table-cell">
										{log.ip_address || '—'}
									</td>
									<td class="px-6 py-4 text-right whitespace-nowrap text-gray-600">
										{formatDate(log.created_at)}
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="6" class="py-16 text-center text-gray-500">
										<AlertCircle class="mx-auto mb-3 h-12 w-12 text-gray-300" strokeWidth={1.5} />
										<p class="text-base font-medium text-gray-900">Loglar topilmadi</p>
										<p class="mt-1">Qidiruvingiz bo'yicha hech qanday natija yo'q.</p>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if totalPages > 1}
					<div
						class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4"
					>
						<a
							href={resolve('/admin/logs/activity') + `?page=${Math.max(1, currentPage - 1)}&search=${searchValue}&ordering=${orderingValue}`}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 {currentPage ===
							1
								? 'pointer-events-none opacity-40'
								: ''}"
						>
							<ChevronLeft size={16} /> Ortga
						</a>
						<div class="flex gap-1">
							<span class="text-sm font-medium text-gray-600"
								>Sahifa {currentPage} / {totalPages}</span
							>
						</div>
						<a
							href={resolve('/admin/logs/activity') + `?page=${Math.min(totalPages, currentPage + 1)}&search=${searchValue}&ordering=${orderingValue}`}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 {currentPage ===
							totalPages
								? 'pointer-events-none opacity-40'
								: ''}"
						>
							Keyingi <ChevronRight size={16} />
						</a>
					</div>
				{/if}
			</div>
		{:catch error}
			<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
				Ma'lumotlarni yuklashda xatolik yuz berdi. {error}
			</div>
		{/await}
	</div>
</div>

<style>
	@reference "tailwindcss";

	.admin-table {
		@apply px-6 py-3 font-medium whitespace-nowrap text-gray-500;
	}
</style>
