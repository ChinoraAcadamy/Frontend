<script>
    /* eslint-disable no-unused-vars */
	import {
		Search,
		Plus,
		Edit2,
		Trash2,
		CheckCircle2,
		ChevronLeft,
		ChevronRight,
		AlertTriangle,
		Users
	} from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

	import AddStudentModal from '@/lib/components/ui/admin/AddStudentModal.svelte';
	import EditStudentModal from '@/lib/components/ui/admin/EditStudentModal.svelte';

	let { data, form } = $props();

	// ==================== STATE ====================
	let isAddModalOpen = $state(false);
	let editTarget = $state(null);
	let deleteTarget = $state(null);
	let isDeleting = $state(false);

	let searchValue = $state('');
	let statusFilter = $state('all');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	let toast = $state(null);
	let toastTimer;

    // --- Reactivity & Caching ---
    // Instead of awaiting directly in HTML which causes skeletons to flash on every invalidateAll(),
    // we manage resolved data locally.
    let resolvedData = $state(null);
    let isLoading = $state(true);

    $effect(() => {
        data.lazy.studentsData.then(res => {
            // Only update on fresh load or actual data changes.
            resolvedData = res;
            isLoading = false;
        }).catch(err => {
            resolvedData = { error: err };
            isLoading = false;
        });
    });

	// ==================== HELPERS ====================
	function showToast(message, type = 'success') {
		clearTimeout(toastTimer);
		toast = { message, type };
		toastTimer = setTimeout(() => (toast = null), 3500);
	}

	const getFullName = (s) =>
		[s.first_name, s.last_name].filter(Boolean).join(' ') || s.username || '';
	const getInitials = (s) =>
		((s.first_name?.[0] || '') + (s.last_name?.[0] || '')).toUpperCase() ||
		s.username?.[0]?.toUpperCase() ||
		'?';

	// Soft, flat colors for avatars favoring #ed4b72 context
	const avatarColors = [
		'bg-[#ed4b72]/10 text-[#ed4b72]',
		'bg-indigo-100 text-indigo-700',
		'bg-rose-100 text-[#FA2E69]',
		'bg-amber-100 text-amber-700',
		'bg-cyan-100 text-cyan-700',
		'bg-violet-100 text-violet-700'
	];
	const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

	// ==================== EFFECTS ====================
	$effect(() => {
		if (form?.createSuccess) {
			showToast(m.admin_students_created ? m.admin_students_created() : 'Student yaratildi!');
			isAddModalOpen = false;
		}
		if (form?.createError) {
			showToast(form.createError, 'error');
		}
		if (form?.updateSuccess) {
			showToast(m.admin_students_updated ? m.admin_students_updated() : "Ma'lumotlar yangilandi!");
			editTarget = null;
		}
		if (form?.updateError) {
			showToast(form.updateError, 'error');
		}
		if (form?.deleteSuccess) {
			showToast(m.admin_students_deleted ? m.admin_students_deleted() : "Student o'chirildi!");
			deleteTarget = null;
			isDeleting = false;
		}
		if (form?.deleteError) {
			showToast(form.deleteError, 'error');
			isDeleting = false;
		}
	});

    let filteredStudents = $derived.by(() => {
        if (!resolvedData || !resolvedData.students) return [];
        return resolvedData.students.filter((student) => {
            const matchesSearch =
                !searchValue ||
                getFullName(student).toLowerCase().includes(searchValue.toLowerCase()) ||
                student.username?.toLowerCase().includes(searchValue.toLowerCase());
            const matchesStatus = statusFilter === 'all' || String(student.is_active) === statusFilter;
            return matchesSearch && matchesStatus;
        });
    });

    let totalPages = $derived(Math.ceil(filteredStudents.length / itemsPerPage));
    let paginatedStudents = $derived(filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ));
</script>

{#snippet toastNotification()}
	{#if toast}
		<div
			class="fixed top-6 right-6 z-9999999 flex items-center gap-3 rounded-xl border border-main bg-card px-4 py-3 text-sm font-medium shadow-sm transition-all
            {toast.type === 'success'
				? 'border-primary text-primary'
				: 'border-primary/20 text-primary'}"
			transition:fly={{ x: 50, duration: 300 }}
		>
			<CheckCircle2
				size={18}
				class={toast.type === 'success' ? 'text-primary' : 'text-primary'}
			/>
			{toast.message}
		</div>
	{/if}
{/snippet}

{#snippet tableSkeleton()}
	<div class="animate-pulse space-y-3 rounded-xl border border-main bg-card p-6">
		<div class="h-10 w-full rounded-lg bg-muted/10"></div>
		{#each Array(5) as _, i (i)}
			<div class="mt-2 h-14 w-full rounded-lg bg-muted/5"></div>
		{/each}
	</div>
{/snippet}

<div class="min-h-screen bg-main p-4 font-sans sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		{@render toastNotification()}

		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-2xl font-black tracking-tight text-main">{m.admin_students_title ? m.admin_students_title() : "Studentlar ro'yxati"}</h1>
				{#if isLoading}
					<p class="mt-1 text-sm text-muted animate-pulse">Yuklanmoqda...</p>
				{:else if resolvedData && resolvedData.totalCount !== undefined}
					<p class="mt-1 text-sm font-medium text-muted">
						{m.admin_students_total ? m.admin_students_total() : 'Jami'} <span class="font-bold text-primary">{resolvedData.totalCount}</span> {m.admin_students_count_suffix ? m.admin_students_count_suffix() : 'ta student'}
					</p>
				{/if}
			</div>

			<button
				onclick={() => (isAddModalOpen = true)}
				class="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover focus:ring-4 focus:ring-primary/20 active:scale-95"
			>
				<Plus size={18} strokeWidth={3} />
				{m.admin_students_add_new ? m.admin_students_add_new() : 'Yangi qo‘shish'}
			</button>
		</div>

		<div class="mb-6 flex flex-col gap-3 md:flex-row">
			<div class="relative flex-1 md:max-w-md">
				<Search size={18} strokeWidth={2.5} class="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
				<input
					type="text"
					placeholder={m.admin_students_search_placeholder ? m.admin_students_search_placeholder() : "Ism yoki username bo'yicha qidirish..."}
					bind:value={searchValue}
					class="h-11 w-full rounded-xl border-b-2 border-main bg-card pr-4 pl-10 text-sm font-medium text-main transition-all outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
				/>
			</div>
			<select
				bind:value={statusFilter}
				class="h-11 rounded-xl border-b-2 border-main bg-card px-4 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
			>
				<option value="all">{m.admin_students_filter_all ? m.admin_students_filter_all() : 'Barcha statuslar'}</option>
				<option value="true">{m.admin_students_filter_active ? m.admin_students_filter_active() : 'Faol'}</option>
				<option value="false">{m.admin_students_filter_inactive ? m.admin_students_filter_inactive() : 'Nofaol'}</option>
			</select>
		</div>

		{#if isLoading}
			{@render tableSkeleton()}
		{:else if resolvedData?.error}
			<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm font-bold text-red-600">
				{m.admin_students_error_loading ? m.admin_students_error_loading({ error: resolvedData.error }) : `Ma'lumotlarni yuklashda xatolik yuz berdi. ${resolvedData.error}`}
			</div>
		{:else}
			<div class="overflow-hidden rounded-2xl bg-card shadow-sm border border-main">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[900px] text-left text-sm">
						<thead class="border-b border-main bg-muted/5">
							<tr>
								<th class="admin-table">{m.admin_students_col_name ? m.admin_students_col_name() : 'Ism Familiya'}</th>
								<th class="admin-table">{m.admin_students_col_username ? m.admin_students_col_username() : 'Username'}</th>
								<th class="admin-table">{m.admin_students_col_phone ? m.admin_students_col_phone() : 'Telefon'}</th>
								<th class="admin-table text-center">{m.admin_students_col_courses ? m.admin_students_col_courses() : 'Kurslar'}</th>
								<th class="admin-table">{m.admin_students_col_status ? m.admin_students_col_status() : 'Status'}</th>
								<th class="admin-table text-right font-bold w-32">{m.admin_students_col_actions ? m.admin_students_col_actions() : 'Amallar'}</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-main/5">
							{#each paginatedStudents as student (student.id)}
								<tr class="group transition-colors hover:bg-muted/5">
									<td class="px-6 py-4">
										<a
											href={resolve(`/admin/students/${student.id}`)}
											class="flex items-center gap-3"
										>
											<div
												class="flex h-10 w-10 items-center justify-center rounded-[12px] text-[11px] font-black tracking-wider {getAvatarColor(
													student.id
												)}"
											>
												{getInitials(student)}
											</div>
											<span class="font-bold text-main transition-colors group-hover:text-primary">{getFullName(student)}</span>
										</a>
									</td>
									<td class="px-6 py-4">
										<span class="font-medium text-muted">@{student.username}</span>
									</td>
									<td class="px-6 py-4 font-medium text-muted">{student.phone_number || '—'}</td>
									<td class="px-6 py-4 text-center font-bold text-main">
										{student.courses_count ?? 0}
									</td>
									<td class="px-6 py-4">
										<span
											class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider {student.is_active
												? 'bg-primary/10 text-primary'
												: 'bg-muted/10 text-muted'}"
										>
                                            {#if student.is_active}
                                                <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                            {:else}
                                                <span class="h-1.5 w-1.5 rounded-full bg-muted"></span>
                                            {/if}
											{student.is_active ? (m.admin_students_active ? m.admin_students_active() : 'Faol') : (m.admin_students_inactive ? m.admin_students_inactive() : 'Nofaol')}
										</span>
									</td>
									<td class="px-6 py-4 text-right align-middle">
										<div class="flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
											<button
												onclick={() => (editTarget = { ...student })}
												class="rounded-lg p-2 text-muted transition-all hover:bg-muted/10 hover:text-main active:scale-95"
												title={m.admin_students_edit ? m.admin_students_edit() : "Tahrirlash"}
											>
												<Edit2 size={18} />
											</button>
											<button
												onclick={() =>
													(deleteTarget = { id: student.id, name: getFullName(student) })}
												class="rounded-lg p-2 text-muted transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
												title={m.admin_students_delete ? m.admin_students_delete() : "O'chirish"}
											>
												<Trash2 size={18} />
											</button>
										</div>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="6" class="py-16 text-center">
										<Users class="mx-auto mb-4 h-12 w-12 text-muted/30" />
										<p class="text-sm font-medium text-muted">{m.admin_students_not_found ? m.admin_students_not_found() : "Hech qanday ma'lumot topilmadi."}</p>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if totalPages > 1}
					<div
						class="flex items-center justify-between border-t border-main bg-card px-6 py-4"
					>
						<button
							onclick={() => currentPage--}
							disabled={currentPage === 1}
							class="flex h-9 items-center gap-1 rounded-xl bg-muted/5 px-4 text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:bg-muted/10 disabled:opacity-40 disabled:hover:bg-muted/5"
						>
							<ChevronLeft size={16} /> {m.admin_students_prev ? m.admin_students_prev() : 'Ortga'}
						</button>
						<div class="flex gap-1.5">
							{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p (p)}
								<button
									onclick={() => (currentPage = p)}
									class="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all {p ===
									currentPage
										? 'bg-primary text-white shadow-md shadow-primary/20'
										: 'bg-transparent text-muted hover:bg-muted/10'}"
								>
									{p}
								</button>
							{/each}
						</div>
						<button
							onclick={() => currentPage++}
							disabled={currentPage === totalPages}
							class="flex h-9 items-center gap-1 rounded-xl bg-muted/5 px-4 text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:bg-muted/10 disabled:opacity-40 disabled:hover:bg-muted/5"
						>
							{m.admin_students_next ? m.admin_students_next() : 'Keyingi'} <ChevronRight size={16} />
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

{#if isAddModalOpen}
	{#await data.lazy.courses then courses}
		<AddStudentModal
			isOpen={true}
			availableCourses={courses}
			onClose={() => (isAddModalOpen = false)}
		/>
	{/await}
{/if}

{#if editTarget}
	<EditStudentModal isOpen={true} student={editTarget} onClose={() => (editTarget = null)} />
{/if}

{#if deleteTarget}
	<div
		class="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
	>
		<div
			class="w-full max-w-sm rounded-[24px] border border-main bg-card p-6 shadow-2xl"
			transition:fly={{ y: 20, duration: 300 }}
		>
			<div class="mb-5 flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
					<AlertTriangle size={20} strokeWidth={2.5} class="text-primary" />
				</div>
				<h3 class="text-lg font-black text-main leading-tight">{m.admin_students_delete_confirm_title ? m.admin_students_delete_confirm_title() : "O'chirishni tasdiqlang"}</h3>
			</div>

			<p class="mb-8 text-sm font-medium text-muted leading-relaxed">
				{@html m.admin_students_delete_confirm_desc ? m.admin_students_delete_confirm_desc({ name: `<strong class="font-black text-main">${deleteTarget.name}</strong>` }) : `Haqiqatan ham <strong class="font-black text-main">${deleteTarget.name}</strong> ni o‘chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
			</p>

			<form
				method="POST"
				action="?/deleteStudent"
				use:enhance={() => {
					isDeleting = true;
					return async ({ update }) => {
						await update();
						isDeleting = false;
					};
				}}
				class="flex gap-3"
			>
				<input type="hidden" name="studentId" value={deleteTarget.id} />
				<button
					type="button"
					onclick={() => (deleteTarget = null)}
					class="flex-1 rounded-xl bg-muted/10 py-3.5 text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:bg-muted/20 active:scale-95"
				>
					{m.admin_students_cancel ? m.admin_students_cancel() : 'Bekor qilish'}
				</button>
				<button
					type="submit"
					disabled={isDeleting}
					class="flex-1 rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50"
				>
					{isDeleting ? (m.admin_students_deleting ? m.admin_students_deleting() : 'Kutilmoqda...') : (m.admin_students_delete ? m.admin_students_delete() : 'O‘chirish')}
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	@reference "tailwindcss";

	.admin-table {
		@apply px-6 py-4 text-xs font-bold uppercase tracking-widest;
	}
</style>
