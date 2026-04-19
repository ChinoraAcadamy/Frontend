<script>
	/* eslint-disable no-unused-vars */
	import { Search, ChevronLeft, ChevronRight, Activity, AlertCircle } from 'lucide-svelte';
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
		const safeAction = (action || '').toUpperCase();
		const map = {
			CREATE: { label: m.admin_logs_act_created ? m.admin_logs_act_created() : 'Yaratildi', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
			UPDATE: { label: m.admin_logs_act_updated ? m.admin_logs_act_updated() : 'Yangilandi', classes: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
			DELETE: { label: m.admin_logs_act_deleted ? m.admin_logs_act_deleted() : "O'chirildi", classes: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
			LOGOUT: { label: m.admin_logs_act_logout ? m.admin_logs_act_logout() : 'Tizimdan chiqish', classes: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
			LOGIN: { label: m.admin_logs_act_login ? m.admin_logs_act_login() : 'Tizimga kirish', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
			SUBMISSION_CREATED: { label: m.admin_logs_act_sub_created ? m.admin_logs_act_sub_created() : 'Topshiriq yubordi', classes: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' },
			SUBMISSION_GRADED: { label: m.admin_logs_act_sub_graded ? m.admin_logs_act_sub_graded() : 'Topshiriq baholandi', classes: 'bg-purple-50 text-purple-700 ring-purple-600/20' },
			LESSON_COMPLETED: { label: m.admin_logs_act_lesson_comp ? m.admin_logs_act_lesson_comp() : 'Darsni tugatdi', classes: 'bg-teal-50 text-teal-700 ring-teal-600/20' },
			STUDENT_DEACTIVATED: { label: m.admin_logs_act_student_deact ? m.admin_logs_act_student_deact() : 'Talaba faolsizlantirildi', classes: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
			PASSWORD_CHANGED: { label: m.admin_logs_act_pwd_changed ? m.admin_logs_act_pwd_changed() : 'Parol o\'zgartirildi', classes: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
			ADMIN_CREATED: { label: m.admin_logs_act_admin_created ? m.admin_logs_act_admin_created() : 'Admin yaratildi', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
			ENROLLMENT_BLOCKED: { label: m.admin_logs_act_enroll_blocked ? m.admin_logs_act_enroll_blocked() : 'A\'zo bloklandi', classes: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
			ENROLLMENT_UNBLOCKED: { label: m.admin_logs_act_enroll_unblocked ? m.admin_logs_act_enroll_unblocked() : 'A\'zo blokdan chiqarildi', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
			ENROLLMENT_CREATED: { label: m.admin_logs_act_enroll_created ? m.admin_logs_act_enroll_created() : 'Kursga a\'zo qilindi', classes: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
			LESSON_DELETED: { label: m.admin_logs_act_lesson_deleted ? m.admin_logs_act_lesson_deleted() : 'Dars o\'chirildi', classes: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
			LESSON_CREATED: { label: m.admin_logs_act_lesson_created ? m.admin_logs_act_lesson_created() : 'Dars yaratildi', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
			LESSON_EDITED: { label: m.admin_logs_act_lesson_edited ? m.admin_logs_act_lesson_edited() : 'Dars tahrirlandi', classes: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
			MODULE_CREATED: { label: m.admin_logs_act_mod_created ? m.admin_logs_act_mod_created() : 'Modul yaratildi', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
			MODULE_EDITED: { label: m.admin_logs_act_mod_edited ? m.admin_logs_act_mod_edited() : 'Modul tahrirlandi', classes: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
			COURSE_EDITED: { label: m.admin_logs_act_course_edited ? m.admin_logs_act_course_edited() : 'Kurs tahrirlandi', classes: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
			COURSE_CREATED: { label: m.admin_logs_act_course_created ? m.admin_logs_act_course_created() : 'Kurs yaratildi', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' }
		};
		
		return map[safeAction] || {
			label: action ? action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : (m.admin_student_unknown_date ? m.admin_student_unknown_date() : 'Noma\'lum'),
			classes: 'bg-gray-50 text-gray-700 ring-gray-600/20'
		};
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
					<Activity class="text-emerald-600" /> {m.admin_logs_activity_title ? m.admin_logs_activity_title() : 'Tizim faoliyati'}
				</h1>
				{#await data.lazy.activityData then resolvedData}
					<p class="mt-1 text-sm text-gray-500">
						{m.admin_students_total ? m.admin_students_total() : 'Jami'} <span class="font-medium text-gray-900">{resolvedData.count}</span> {m.admin_logs_activity_count_suffix ? m.admin_logs_activity_count_suffix() : 'ta yozuv'}
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
					placeholder={m.admin_logs_activity_search ? m.admin_logs_activity_search() : "Foydalanuvchi, harakat yoki obyektni izlash..."}
					bind:value={searchValue}
					class="h-10 w-full rounded-lg border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
				/>
			</div>
			<select
				name="ordering"
				bind:value={orderingValue}
				onchange={(e) => /** @type {HTMLSelectElement} */ (e.target).form?.submit()}
				class="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 transition-colors outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
			>
				<option value="-created_at">{m.admin_logs_activity_newest ? m.admin_logs_activity_newest() : 'Eng yangilari oldin'}</option>
				<option value="created_at">{m.admin_logs_activity_oldest ? m.admin_logs_activity_oldest() : 'Eng eskilar oldin'}</option>
			</select>
			<button type="submit" class="hidden">{m.admin_logs_activity_search_btn ? m.admin_logs_activity_search_btn() : 'Izlash'}</button>
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
								<th class="admin-table">{m.admin_logs_activity_col_user ? m.admin_logs_activity_col_user() : 'Foydalanuvchi'}</th>
								<th class="admin-table">{m.admin_logs_activity_col_action ? m.admin_logs_activity_col_action() : 'Harakat turi'}</th>
								<th class="admin-table w-1/4">{m.admin_logs_activity_col_target ? m.admin_logs_activity_col_target() : 'Maqsad (Target)'}</th>
								<th class="admin-table w-1/4 md:table-cell">{m.admin_logs_activity_col_detail ? m.admin_logs_activity_col_detail() : 'Tafsilot'}</th>
								<th class="admin-table sm:table-cell">{m.admin_logs_activity_col_ip ? m.admin_logs_activity_col_ip() : 'IP Manzil'}</th>
								<th class="admin-table text-right">{m.admin_logs_activity_col_date ? m.admin_logs_activity_col_date() : 'Sana'}</th>
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
										{log.target || (m.admin_logs_activity_system ? m.admin_logs_activity_system() : 'Tizim')}
									</td>
									<td class="px-6 py-4 text-gray-500 md:table-cell">
										<div class="max-w-[200px] truncate lg:max-w-xs" title={log.detail}>
											{log.detail || '—'}
										</div>
									</td>
									<td class="px-6 py-4 font-mono text-xs text-gray-500 sm:table-cell">
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
										<p class="text-base font-medium text-gray-900">{m.admin_logs_activity_not_found ? m.admin_logs_activity_not_found() : 'Loglar topilmadi'}</p>
										<p class="mt-1">{m.admin_logs_activity_not_found_desc ? m.admin_logs_activity_not_found_desc() : 'Qidiruvingiz bo\'yicha hech qanday natija yo\'q.'}</p>
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
							href={resolve('/admin/logs/activity') +
								`?page=${Math.max(1, currentPage - 1)}&search=${searchValue}&ordering=${orderingValue}`}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 {currentPage ===
							1
								? 'pointer-events-none opacity-40'
								: ''}"
						>
							<ChevronLeft size={16} /> {m.admin_students_prev ? m.admin_students_prev() : 'Ortga'}
						</a>
						<div class="flex gap-1">
							<span class="text-sm font-medium text-gray-600"
								>{m.admin_logs_activity_page ? m.admin_logs_activity_page() : 'Sahifa'} {currentPage} / {totalPages}</span
							>
						</div>
						<a
							href={resolve('/admin/logs/activity') +
								`?page=${Math.min(totalPages, currentPage + 1)}&search=${searchValue}&ordering=${orderingValue}`}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 {currentPage ===
							totalPages
								? 'pointer-events-none opacity-40'
								: ''}"
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
		@apply px-6 py-3 font-medium whitespace-nowrap text-gray-500;
	}
</style>
