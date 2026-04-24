<script>
	/* eslint-disable no-unused-vars */
	import { Search, ChevronLeft, ChevronRight, KeyRound, MonitorSmartphone, Calendar, ShieldAlert, ShieldCheck } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

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
		const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
		return new Date(dateString).toLocaleDateString('uz-UZ', options);
	};

	const getStatusConfig = (status) => {
		const isSuccess = status?.toUpperCase() === 'SUCCESS';
		return {
			label: status || (m.admin_student_unknown_date ? m.admin_student_unknown_date() : 'Noma\'lum'),
			Icon: isSuccess ? ShieldCheck : ShieldAlert,
			iconClass: isSuccess ? 'text-emerald-500' : 'text-primary',
			classes: isSuccess ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' : 'bg-primary/10 text-primary ring-primary/20'
		};
	};

	let formatUser = (user, userNameStr, attemptStr) => {
		if (user) {
			return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
		}
		if (userNameStr) return userNameStr;
		return attemptStr || (m.admin_student_unknown_date ? m.admin_student_unknown_date() : 'Noma\'lum');
	};
</script>

{#snippet tableSkeleton()}
	<div class="animate-pulse space-y-3 rounded-xl border border-main bg-card p-6">
		<div class="h-10 w-full rounded-lg bg-muted/10"></div>
		{#each Array(8) as _, i (i)}
			<div class="mt-2 h-14 w-full rounded-lg bg-muted/5"></div>
		{/each}
	</div>
{/snippet}

<div class="min-h-screen bg-main p-4 font-sans sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="flex items-center gap-2 text-2xl font-semibold text-main">
					<KeyRound class="text-primary" /> {m.admin_logs_login_title ? m.admin_logs_login_title() : "Tizimga kirish tarixi"}
				</h1>
				{#await data.lazy.loginData then resolvedData}
					<p class="mt-1 text-sm text-muted">
						{m.admin_students_total ? m.admin_students_total() : 'Jami'} <span class="font-medium text-main">{resolvedData.count}</span> {m.admin_logs_login_count_suffix ? m.admin_logs_login_count_suffix() : "ta urinish"}
					</p>
				{/await}
			</div>
		</div>

		<form method="GET" class="mb-6 flex flex-col gap-3 md:flex-row">
			<div class="relative flex-1 md:max-w-md">
				<Search size={18} class="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
				<input
					type="text"
					name="search"
					placeholder={m.admin_logs_login_search ? m.admin_logs_login_search() : "Ism, username yoki IP manzilni izlash..."}
					bind:value={searchValue}
					class="h-10 w-full rounded-lg border border-main bg-card pr-4 pl-10 text-sm text-main transition-colors outline-none placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
				/>
			</div>
			<select
				name="ordering"
				bind:value={orderingValue}
				onchange={(e) => (/** @type {HTMLSelectElement} */ (e.target)).form?.submit()}
				class="h-10 rounded-lg border border-main bg-card px-4 text-sm text-main transition-colors outline-none focus:border-primary focus:ring-1 focus:ring-primary"
			>
				<option value="-created_at">{m.admin_logs_activity_newest ? m.admin_logs_activity_newest() : 'Eng yangilari oldin'}</option>
				<option value="created_at">{m.admin_logs_activity_oldest ? m.admin_logs_activity_oldest() : 'Eng eskilar oldin'}</option>
			</select>
			<button type="submit" class="hidden">{m.admin_logs_activity_search_btn ? m.admin_logs_activity_search_btn() : 'Izlash'}</button>
		</form>

		{#await data.lazy.loginData}
			{@render tableSkeleton()}
		{:then resolvedData}
			{@const logs = resolvedData.results || []}
			{@const totalPages = Math.ceil(resolvedData.count / itemsPerPage)}
			
			<div class="overflow-hidden rounded-xl border border-main bg-card shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[1000px] text-left text-sm">
						<thead class="border-b border-main bg-muted/5">
							<tr>
								<th class="admin-table">{m.admin_logs_login_col_attempt ? m.admin_logs_login_col_attempt() : "Urinish (Username)"}</th>
								<th class="admin-table hidden sm:table-cell">{m.admin_logs_login_col_status ? m.admin_logs_login_col_status() : "Holat (Status)"}</th>
								<th class="admin-table hidden md:table-cell">{m.admin_logs_login_col_device ? m.admin_logs_login_col_device() : "Qurilma (Device)"}</th>
								<th class="admin-table hidden sm:table-cell">{m.admin_logs_activity_col_ip ? m.admin_logs_activity_col_ip() : 'IP Manzil'}</th>
								<th class="admin-table text-right">{m.admin_logs_activity_col_date ? m.admin_logs_activity_col_date() : 'Sana'}</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-main/5">
							{#each logs as log (log.id)}
								{@const config = getStatusConfig(log.status)}
								<tr class="group transition-colors hover:bg-muted/5">
									<td class="px-6 py-4">
										<div class="font-medium text-main">
											{formatUser(log.user, log.user_name, log.username_attempt)}
										</div>
										<div class="text-xs text-muted mt-0.5">
											@{log.username_attempt}
										</div>
									</td>
									<td class="px-6 py-4 hidden sm:table-cell">
										<span class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset {config.classes}">
											<config.Icon size={14} class={config.iconClass} />
											{config.label}
										</span>
									</td>
									<td class="px-6 py-4 text-muted hidden md:table-cell">
										<div class="flex flex-col gap-0.5">
											<span class="flex items-center gap-1 text-xs font-medium text-main">
												<MonitorSmartphone size={14} /> 
												{log.device_info ? log.device_info.split(',')[0] : (m.admin_logs_login_unknown_device ? m.admin_logs_login_unknown_device() : 'Noma\'lum Qurilma')}
											</span>
											<span class="text-xs text-muted/60 truncate max-w-[200px]" title={log.device_info}>
												{log.device_info || '—'}
											</span>
										</div>
									</td>
									<td class="px-6 py-4 text-muted hidden sm:table-cell font-mono text-xs">
										{log.ip_address || '—'}
									</td>
									<td class="px-6 py-4 text-right text-muted whitespace-nowrap">
										<div class="flex items-center justify-end gap-1.5">
											<Calendar size={14} class="text-muted/40" />
											{formatDate(log.created_at)}
										</div>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="5" class="py-16 text-center text-muted">
										<KeyRound class="mx-auto mb-3 h-12 w-12 text-muted/30" strokeWidth={1.5} />
										<p class="text-base font-medium text-main">{m.admin_logs_activity_not_found ? m.admin_logs_activity_not_found() : 'Loglar topilmadi'}</p>
										<p class="mt-1">{m.admin_logs_activity_not_found_desc ? m.admin_logs_activity_not_found_desc() : 'Qidiruvingiz bo\'yicha hech qanday natija yo\'q.'}</p>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if totalPages > 1}
					<div class="flex items-center justify-between border-t border-main bg-card px-6 py-4">
						<a
							href={resolve('/admin/logs/login') + `?page=${Math.max(1, currentPage - 1)}&search=${searchValue}&ordering=${orderingValue}`}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-muted/10 {currentPage === 1 ? 'pointer-events-none opacity-40' : ''}"
						>
							<ChevronLeft size={16} /> {m.admin_students_prev ? m.admin_students_prev() : 'Ortga'}
						</a>
						<div class="flex gap-1">
							<span class="text-sm font-medium text-muted">{m.admin_logs_activity_page ? m.admin_logs_activity_page() : 'Sahifa'} {currentPage} / {totalPages}</span>
						</div>
						<a
							href={resolve('/admin/logs/login') + `?page=${Math.min(totalPages, currentPage + 1)}&search=${searchValue}&ordering=${orderingValue}`}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-muted/10 {currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}"
						>
							{m.admin_students_next ? m.admin_students_next() : 'Keyingi'} <ChevronRight size={16} />
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
		@apply px-6 py-3 font-medium text-muted whitespace-nowrap;
	}
</style>
