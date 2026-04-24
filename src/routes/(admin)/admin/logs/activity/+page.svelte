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
			CREATE: {
				label: m.admin_logs_act_created ? m.admin_logs_act_created() : 'Yaratildi',
				classes: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
			},
			UPDATE: {
				label: m.admin_logs_act_updated ? m.admin_logs_act_updated() : 'Yangilandi',
				classes: 'bg-blue-500/10 text-blue-600 ring-blue-500/20'
			},
			DELETE: {
				label: m.admin_logs_act_deleted ? m.admin_logs_act_deleted() : "O'chirildi",
				classes: 'bg-rose-500/10 text-rose-600 ring-rose-500/20'
			},
			LOGOUT: {
				label: m.admin_logs_act_logout ? m.admin_logs_act_logout() : 'Tizimdan chiqish',
				classes: 'bg-amber-500/10 text-amber-600 ring-amber-500/20'
			},
			LOGIN: {
				label: m.admin_logs_act_login ? m.admin_logs_act_login() : 'Tizimga kirish',
				classes: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
			},
			SUBMISSION_CREATED: {
				label: m.admin_logs_act_sub_created ? m.admin_logs_act_sub_created() : 'Topshiriq yubordi',
				classes: 'bg-indigo-500/10 text-indigo-600 ring-indigo-500/20'
			},
			SUBMISSION_GRADED: {
				label: m.admin_logs_act_sub_graded ? m.admin_logs_act_sub_graded() : 'Topshiriq baholandi',
				classes: 'bg-purple-500/10 text-purple-600 ring-purple-500/20'
			},
			LESSON_COMPLETED: {
				label: m.admin_logs_act_lesson_comp ? m.admin_logs_act_lesson_comp() : 'Darsni tugatdi',
				classes: 'bg-teal-500/10 text-teal-600 ring-teal-500/20'
			},
			STUDENT_DEACTIVATED: {
				label: m.admin_logs_act_student_deact
					? m.admin_logs_act_student_deact()
					: 'Talaba faolsizlantirildi',
				classes: 'bg-rose-500/10 text-rose-600 ring-rose-500/20'
			},
			PASSWORD_CHANGED: {
				label: m.admin_logs_act_pwd_changed
					? m.admin_logs_act_pwd_changed()
					: "Parol o'zgartirildi",
				classes: 'bg-amber-500/10 text-amber-600 ring-amber-500/20'
			},
			ADMIN_CREATED: {
				label: m.admin_logs_act_admin_created
					? m.admin_logs_act_admin_created()
					: 'Admin yaratildi',
				classes: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
			},
			ENROLLMENT_BLOCKED: {
				label: m.admin_logs_act_enroll_blocked
					? m.admin_logs_act_enroll_blocked()
					: "A'zo bloklandi",
				classes: 'bg-rose-500/10 text-rose-600 ring-rose-500/20'
			},
			ENROLLMENT_UNBLOCKED: {
				label: m.admin_logs_act_enroll_unblocked
					? m.admin_logs_act_enroll_unblocked()
					: "A'zo blokdan chiqarildi",
				classes: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
			},
			ENROLLMENT_CREATED: {
				label: m.admin_logs_act_enroll_created
					? m.admin_logs_act_enroll_created()
					: "Kursga a'zo qilindi",
				classes: 'bg-blue-500/10 text-blue-600 ring-blue-500/20'
			},
			LESSON_DELETED: {
				label: m.admin_logs_act_lesson_deleted
					? m.admin_logs_act_lesson_deleted()
					: "Dars o'chirildi",
				classes: 'bg-rose-500/10 text-rose-600 ring-rose-500/20'
			},
			LESSON_CREATED: {
				label: m.admin_logs_act_lesson_created
					? m.admin_logs_act_lesson_created()
					: 'Dars yaratildi',
				classes: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
			},
			LESSON_EDITED: {
				label: m.admin_logs_act_lesson_edited
					? m.admin_logs_act_lesson_edited()
					: 'Dars tahrirlandi',
				classes: 'bg-blue-500/10 text-blue-600 ring-blue-500/20'
			},
			MODULE_CREATED: {
				label: m.admin_logs_act_mod_created ? m.admin_logs_act_mod_created() : 'Modul yaratildi',
				classes: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
			},
			MODULE_EDITED: {
				label: m.admin_logs_act_mod_edited ? m.admin_logs_act_mod_edited() : 'Modul tahrirlandi',
				classes: 'bg-blue-500/10 text-blue-600 ring-blue-500/20'
			},
			COURSE_EDITED: {
				label: m.admin_logs_act_course_edited
					? m.admin_logs_act_course_edited()
					: 'Kurs tahrirlandi',
				classes: 'bg-blue-500/10 text-blue-600 ring-blue-500/20'
			},
			COURSE_CREATED: {
				label: m.admin_logs_act_course_created
					? m.admin_logs_act_course_created()
					: 'Kurs yaratildi',
				classes: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
			},
			COURSE_UPDATED: {
				label: m.admin_logs_act_course_updated
					? m.admin_logs_act_course_updated()
					: 'Kurs yangilandi',
				classes: 'bg-blue-500/10 text-blue-600 ring-blue-500/20'
			},
			COURSE_DELETED: {
				label: m.admin_logs_act_course_deleted
					? m.admin_logs_act_course_deleted()
					: "Kurs o'chirildi",
				classes: 'bg-rose-500/10 text-rose-600 ring-rose-500/20'
			},
			ENROLLMENT_DELETED: {
				label: m.admin_logs_act_enroll_deleted
					? m.admin_logs_act_enroll_deleted()
					: "A'zolik o'chirildi",
				classes: 'bg-rose-500/10 text-rose-600 ring-rose-500/20'
			},
			STUDENT_CREATED: {
				label: m.admin_logs_act_student_created
					? m.admin_logs_act_student_created()
					: 'Talaba yaratildi',
				classes: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
			},
			STUDENT_UPDATED: {
				label: m.admin_logs_act_student_updated
					? m.admin_logs_act_student_updated()
					: 'Talaba tahrirlandi',
				classes: 'bg-blue-500/10 text-blue-600 ring-blue-500/20'
			}
		};

		return (
			map[safeAction] || {
				label: action
					? action
							.split('_')
							.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
							.join(' ')
					: m.admin_student_unknown_date
						? m.admin_student_unknown_date()
						: "Noma'lum",
				classes: 'bg-muted/10 text-muted ring-muted/20'
			}
		);
	};
</script>

{#snippet tableSkeleton()}
	<div class="border-main bg-card animate-pulse space-y-3 rounded-xl border p-6">
		<div class="h-10 w-full rounded-lg bg-muted/10"></div>
		{#each Array(8) as _, i (i)}
			<div class="mt-2 h-14 w-full rounded-lg bg-muted/5"></div>
		{/each}
	</div>
{/snippet}

<div class="bg-main min-h-screen p-4 font-sans sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-main flex items-center gap-2 text-2xl font-semibold">
					<Activity class="text-primary" />
					{m.admin_logs_activity_title ? m.admin_logs_activity_title() : 'Tizim faoliyati'}
				</h1>
				{#await data.lazy.activityData then resolvedData}
					<p class="mt-1 text-sm text-muted">
						{m.admin_students_total ? m.admin_students_total() : 'Jami'}
						<span class="text-main font-medium">{resolvedData.count}</span>
						{m.admin_logs_activity_count_suffix ? m.admin_logs_activity_count_suffix() : 'ta yozuv'}
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
					placeholder={m.admin_logs_activity_search
						? m.admin_logs_activity_search()
						: 'Foydalanuvchi, harakat yoki obyektni izlash...'}
					bind:value={searchValue}
					class="border-main bg-card text-main h-10 w-full rounded-lg border pr-4 pl-10 text-sm transition-colors outline-none placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
				/>
			</div>
			<select
				name="ordering"
				bind:value={orderingValue}
				onchange={(e) => /** @type {HTMLSelectElement} */ (e.target).form?.submit()}
				class="border-main bg-card text-main h-10 rounded-lg border px-4 text-sm transition-colors outline-none focus:border-primary focus:ring-1 focus:ring-primary"
			>
				<option value="-created_at"
					>{m.admin_logs_activity_newest
						? m.admin_logs_activity_newest()
						: 'Eng yangilari oldin'}</option
				>
				<option value="created_at"
					>{m.admin_logs_activity_oldest
						? m.admin_logs_activity_oldest()
						: 'Eng eskilar oldin'}</option
				>
			</select>
			<button type="submit" class="hidden"
				>{m.admin_logs_activity_search_btn ? m.admin_logs_activity_search_btn() : 'Izlash'}</button
			>
		</form>

		{#await data.lazy.activityData}
			{@render tableSkeleton()}
		{:then resolvedData}
			{@const logs = resolvedData.results || []}
			{@const totalPages = Math.ceil(resolvedData.count / itemsPerPage)}

			<div class="border-main bg-card overflow-hidden rounded-xl border shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[1000px] text-left text-sm">
						<thead class="border-main border-b bg-muted/5">
							<tr>
								<th class="admin-table"
									>{m.admin_logs_activity_col_user
										? m.admin_logs_activity_col_user()
										: 'Foydalanuvchi'}</th
								>
								<th class="admin-table"
									>{m.admin_logs_activity_col_action
										? m.admin_logs_activity_col_action()
										: 'Harakat turi'}</th
								>
								<th class="admin-table w-1/4"
									>{m.admin_logs_activity_col_target
										? m.admin_logs_activity_col_target()
										: 'Maqsad (Target)'}</th
								>
								<th class="admin-table w-1/4 md:table-cell"
									>{m.admin_logs_activity_col_detail
										? m.admin_logs_activity_col_detail()
										: 'Tafsilot'}</th
								>
								<th class="admin-table sm:table-cell"
									>{m.admin_logs_activity_col_ip ? m.admin_logs_activity_col_ip() : 'IP Manzil'}</th
								>
								<th class="admin-table text-right"
									>{m.admin_logs_activity_col_date ? m.admin_logs_activity_col_date() : 'Sana'}</th
								>
							</tr>
						</thead>
						<tbody class="divide-main/5 divide-y">
							{#each logs as log (log.id)}
								{@const config = getActionConfig(log.action)}
								<tr class="group transition-colors hover:bg-muted/5">
									<td class="px-6 py-4">
										<div class="text-main font-medium">
											{log.user_name}
										</div>
										{#if log.user?.role}
											<div class="text-xs text-muted capitalize">{log.user.role}</div>
										{/if}
									</td>
									<td class="px-6 py-4">
										<span
											class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset {config.classes}"
										>
											{config.label}
										</span>
									</td>
									<td class="px-6 py-4 text-muted">
										{log.target ||
											(m.admin_logs_activity_system ? m.admin_logs_activity_system() : 'Tizim')}
									</td>
									<td class="px-6 py-4 text-muted md:table-cell">
										<div class="max-w-[200px] truncate lg:max-w-xs" title={log.detail}>
											{log.detail || '—'}
										</div>
									</td>
									<td class="px-6 py-4 font-mono text-xs text-muted sm:table-cell">
										{log.ip_address || '—'}
									</td>
									<td class="px-6 py-4 text-right whitespace-nowrap text-muted">
										{formatDate(log.created_at)}
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="6" class="py-16 text-center text-muted">
										<AlertCircle class="mx-auto mb-3 h-12 w-12 text-muted/30" strokeWidth={1.5} />
										<p class="text-base font-medium text-main">
											{m.admin_logs_activity_not_found
												? m.admin_logs_activity_not_found()
												: 'Loglar topilmadi'}
										</p>
										<p class="mt-1">
											{m.admin_logs_activity_not_found_desc
												? m.admin_logs_activity_not_found_desc()
												: "Qidiruvingiz bo'yicha hech qanday natija yo'q."}
										</p>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if totalPages > 1}
					<div class="border-main bg-card flex items-center justify-between border-t px-6 py-4">
						<a
							href={resolve('/admin/logs/activity') +
								`?page=${Math.max(1, currentPage - 1)}&search=${searchValue}&ordering=${orderingValue}`}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-muted/10 {currentPage ===
							1
								? 'pointer-events-none opacity-40'
								: ''}"
						>
							<ChevronLeft size={16} />
							{m.admin_students_prev ? m.admin_students_prev() : 'Ortga'}
						</a>
						<div class="flex gap-1">
							<span class="text-sm font-medium text-muted"
								>{m.admin_logs_activity_page ? m.admin_logs_activity_page() : 'Sahifa'}
								{currentPage} / {totalPages}</span
							>
						</div>
						<a
							href={resolve('/admin/logs/activity') +
								`?page=${Math.min(totalPages, currentPage + 1)}&search=${searchValue}&ordering=${orderingValue}`}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-muted/10 {currentPage ===
							totalPages
								? 'pointer-events-none opacity-40'
								: ''}"
						>
							{m.admin_students_next ? m.admin_students_next() : 'Keyingi'}
							<ChevronRight size={16} />
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
		@apply px-6 py-3 font-medium whitespace-nowrap;
	}
</style>
