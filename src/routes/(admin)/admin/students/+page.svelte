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

	// Soft, flat colors for avatars
	const avatarColors = [
		'bg-pink-100 text-pink-700',
		'bg-indigo-100 text-indigo-700',
		'bg-emerald-100 text-emerald-700',
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
</script>

{#snippet toastNotification()}
	{#if toast}
		<div
			class="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all
            {toast.type === 'success'
				? 'border-emerald-200 text-emerald-800'
				: 'border-red-200 text-red-800'}"
			transition:fly={{ x: 50, duration: 300 }}
		>
			<CheckCircle2
				size={18}
				class={toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'}
			/>
			{toast.message}
		</div>
	{/if}
{/snippet}

{#snippet tableSkeleton()}
	<div class="animate-pulse space-y-3 rounded-xl border border-gray-200 bg-white p-6">
		<div class="h-10 w-full rounded-lg bg-gray-100"></div>
		{#each Array(5) as _, i (i)}
			<div class="mt-2 h-14 w-full rounded-lg bg-gray-50"></div>
		{/each}
	</div>
{/snippet}

<div class="min-h-screen bg-gray-50/50 p-4 font-sans sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		{@render toastNotification()}

		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">{m.admin_students_title ? m.admin_students_title() : "Studentlar ro'yxati"}</h1>
				{#await data.lazy.studentsData then resolvedData}
					<p class="mt-1 text-sm text-gray-500">
						{m.admin_students_total ? m.admin_students_total() : 'Jami'} <span class="font-medium text-gray-900">{resolvedData.totalCount}</span> {m.admin_students_count_suffix ? m.admin_students_count_suffix() : 'ta student'}
					</p>
				{/await}
			</div>

			<button
				onclick={() => (isAddModalOpen = true)}
				class="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-600/20 active:scale-95"
			>
				<Plus size={18} strokeWidth={2.5} />
				{m.admin_students_add_new ? m.admin_students_add_new() : 'Yangi qo‘shish'}
			</button>
		</div>

		<div class="mb-6 flex flex-col gap-3 md:flex-row">
			<div class="relative flex-1 md:max-w-md">
				<Search size={18} class="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder={m.admin_students_search_placeholder ? m.admin_students_search_placeholder() : "Ism yoki username bo'yicha qidirish..."}
					bind:value={searchValue}
					class="h-10 w-full rounded-lg border border-gray-200 bg-white pr-4 pl-10 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
				/>
			</div>
			<select
				bind:value={statusFilter}
				class="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 transition-colors outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
			>
				<option value="all">{m.admin_students_filter_all ? m.admin_students_filter_all() : 'Barcha statuslar'}</option>
				<option value="true">{m.admin_students_filter_active ? m.admin_students_filter_active() : 'Faol'}</option>
				<option value="false">{m.admin_students_filter_inactive ? m.admin_students_filter_inactive() : 'Nofaol'}</option>
			</select>
		</div>

		{#await data.lazy.studentsData}
			{@render tableSkeleton()}
		{:then resolvedData}
			{@const filteredStudents = resolvedData.students.filter((student) => {
				const matchesSearch =
					!searchValue ||
					getFullName(student).toLowerCase().includes(searchValue.toLowerCase()) ||
					student.username?.toLowerCase().includes(searchValue.toLowerCase());
				const matchesStatus = statusFilter === 'all' || String(student.is_active) === statusFilter;
				return matchesSearch && matchesStatus;
			})}
			{@const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)}
			{@const paginatedStudents = filteredStudents.slice(
				(currentPage - 1) * itemsPerPage,
				currentPage * itemsPerPage
			)}

			<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[900px] text-left text-sm">
						<thead class="border-b border-gray-200 bg-gray-50/80">
							<tr>
								<th class="admin-table">{m.admin_students_col_name ? m.admin_students_col_name() : 'Ism Familiya'}</th>
								<th class="admin-table">{m.admin_students_col_username ? m.admin_students_col_username() : 'Username'}</th>
								<th class="admin-table">{m.admin_students_col_phone ? m.admin_students_col_phone() : 'Telefon'}</th>
								<th class="admin-table text-center">{m.admin_students_col_courses ? m.admin_students_col_courses() : 'Kurslar'}</th>
								<th class="admin-table">{m.admin_students_col_status ? m.admin_students_col_status() : 'Status'}</th>
								<th class="admin-table text-right">{m.admin_students_col_actions ? m.admin_students_col_actions() : 'Amallar'}</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each paginatedStudents as student (student.id)}
								<tr class="group transition-colors hover:bg-gray-50/50">
									<td class="px-6 py-3.5">
										<a
											href={resolve(`/admin/students/${student.id}`)}
											class="flex items-center gap-3"
										>
											<div
												class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold {getAvatarColor(
													student.id
												)}"
											>
												{getInitials(student)}
											</div>
											<span class="font-medium text-gray-900">{getFullName(student)}</span>
										</a>
									</td>
									<td class="px-6 py-3.5">
										<span class="text-gray-500">@{student.username}</span>
									</td>
									<td class="px-6 py-3.5 text-gray-500">{student.phone_number || '—'}</td>
									<td class="px-6 py-3.5 text-center font-medium text-gray-700">
										{student.courses_count ?? 0}
									</td>
									<td class="px-6 py-3.5">
										<span
											class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium {student.is_active
												? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ring-inset'
												: 'bg-gray-100 text-gray-600 ring-1 ring-gray-500/10 ring-inset'}"
										>
											{student.is_active ? (m.admin_students_active ? m.admin_students_active() : 'Faol') : (m.admin_students_inactive ? m.admin_students_inactive() : 'Nofaol')}
										</span>
									</td>
									<td class="px-6 py-3.5 text-right">
										<div
											class="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100"
										>
											<button
												onclick={() => (editTarget = { ...student })}
												class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
												title={m.admin_students_edit ? m.admin_students_edit() : "Tahrirlash"}
											>
												<Edit2 size={16} />
											</button>
											<button
												onclick={() =>
													(deleteTarget = { id: student.id, name: getFullName(student) })}
												class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
												title={m.admin_students_delete ? m.admin_students_delete() : "O'chirish"}
											>
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="6" class="py-12 text-center text-gray-500">
										<Users class="mx-auto mb-3 h-10 w-10 text-gray-300" />
										{m.admin_students_not_found ? m.admin_students_not_found() : "Hech qanday ma'lumot topilmadi."}
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
						<button
							onclick={() => currentPage--}
							disabled={currentPage === 1}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
						>
							<ChevronLeft size={16} /> {m.admin_students_prev ? m.admin_students_prev() : 'Ortga'}
						</button>
						<div class="flex gap-1">
							{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p (p)}
								<button
									onclick={() => (currentPage = p)}
									class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors {p ===
									currentPage
										? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
										: 'text-gray-600 hover:bg-gray-100'}"
								>
									{p}
								</button>
							{/each}
						</div>
						<button
							onclick={() => currentPage++}
							disabled={currentPage === totalPages}
							class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
						>
							{m.admin_students_next ? m.admin_students_next() : 'Keyingi'} <ChevronRight size={16} />
						</button>
					</div>
				{/if}
			</div>
		{:catch error}
			<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
				{m.admin_students_error_loading ? m.admin_students_error_loading({ error }) : `Ma'lumotlarni yuklashda xatolik yuz berdi. ${error}`}
			</div>
		{/await}
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
		class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
	>
		<div
			class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
			transition:fly={{ y: 15, duration: 250 }}
		>
			<div class="mb-4 flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
					<AlertTriangle size={20} class="text-red-600" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900">{m.admin_students_delete_confirm_title ? m.admin_students_delete_confirm_title() : "O'chirishni tasdiqlang"}</h3>
			</div>

			<p class="mb-6 text-sm text-gray-500">
				{@html m.admin_students_delete_confirm_desc ? m.admin_students_delete_confirm_desc({ name: `<strong class="font-medium text-gray-900">${deleteTarget.name}</strong>` }) : `Haqiqatan ham <strong class="font-medium text-gray-900">${deleteTarget.name}</strong> ni o‘chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
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
					class="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					{m.admin_students_cancel ? m.admin_students_cancel() : 'Bekor qilish'}
				</button>
				<button
					type="submit"
					disabled={isDeleting}
					class="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
				>
					{isDeleting ? (m.admin_students_deleting ? m.admin_students_deleting() : 'O‘chirilmoqda...') : (m.admin_students_delete ? m.admin_students_delete() : 'O‘chirish')}
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	@reference "tailwindcss";

	.admin-table {
		@apply px-6 py-3 font-medium text-gray-500;
	}
</style>
