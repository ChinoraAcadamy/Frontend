<!-- src/routes/dashboard/admin/students/+page.svelte -->
<script>
	import {
		Search,
		Plus,
		Edit2,
		Trash2,
		CheckCircle2,
		ChevronLeft,
		ChevronRight,
		AlertTriangle
	} from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	// import { invalidateAll } from '$app/navigation';

	import AddStudentModal from '@/lib/components/ui/admin/AddStudentModal.svelte';
	import EditStudentModal from '@/lib/components/ui/admin/EditStudentModal.svelte';
	import { resolve } from '$app/paths';

	let { data, form } = $props();

	// ==================== REACTIVE STATE ====================
	let isAddModalOpen = $state(false);
	let editTarget = $state(null);
	let deleteTarget = $state(null);
	let isDeleting = $state(false);

	// Toast
	let toast = $state(null);
	let toastTimer;

	function showToast(message, type) {
		clearTimeout(toastTimer);
		toast = { message, type };
		toastTimer = setTimeout(() => (toast = null), 3500);
	}

	// ==================== FILTERS ====================
	let searchValue = $state('');
	let statusFilter = $state('all'); // 'all' | 'true' | 'false'
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// ==================== COMPUTED ====================
	let filteredStudents = $derived.by(() => {
		return data.students.filter((student) => {
			const matchesSearch =
				!searchValue ||
				getFullName(student).toLowerCase().includes(searchValue.toLowerCase()) ||
				student.username?.toLowerCase().includes(searchValue.toLowerCase());

			const matchesStatus = statusFilter === 'all' || String(student.is_active) === statusFilter;

			return matchesSearch && matchesStatus;
		});
	});

	let totalPages = $derived(Math.ceil(filteredStudents.length / itemsPerPage));
	let paginatedStudents = $derived(
		filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	// ==================== HELPERS ====================
	function getFullName(s) {
		return [s.first_name, s.last_name].filter(Boolean).join(' ') || s.username || '';
	}

	function getInitials(s) {
		const f = s.first_name?.[0] ?? '';
		const l = s.last_name?.[0] ?? '';
		return (f + l).toUpperCase() || s.username?.[0]?.toUpperCase() || '?';
	}

	const avatarColors = [
		'bg-pink-500 text-white',
		'bg-indigo-500 text-white',
		'bg-emerald-500 text-white',
		'bg-amber-500 text-white',
		'bg-cyan-500 text-white',
		'bg-rose-500 text-white'
	];

	function getAvatarColor(id) {
		return avatarColors[id % avatarColors.length];
	}

	// ==================== MODALS ====================
	function openEdit(student) {
		editTarget = { ...student };
	}

	function openDelete(student) {
		deleteTarget = { id: student.id, name: getFullName(student) };
	}

	// function saveEdit() {
	// 	// Backend action orqali yangilanishi kerak
	// 	editTarget = null;
	// }

	// function confirmDelete() {
	// 	// Backend action orqali o'chiriladi
	// 	deleteTarget = null;
	// }

	// Formdan keladigan natijalarni kuzatish
	$effect(() => {
		if (form?.createSuccess) {
			showToast('Student muvaffaqiyatli yaratildi!', 'success');
			isAddModalOpen = false;
		}
		if (form?.createError) showToast(form.createError, 'error');
		if (form?.updateSuccess) {
			showToast("Student ma'lumotlari yangilandi!", 'success');
			editTarget = null;
		}
		if (form?.updateError) showToast(form.updateError, 'error');
		if (form?.deleteSuccess) {
			showToast("Student o'chirildi!", 'success');
			deleteTarget = null;
		}
		if (form?.deleteError) {
			showToast(form.deleteError, 'error');
			deleteTarget = null;
		}
	});
</script>

<div class="min-h-screen bg-slate-50/50 p-4 font-sans sm:p-6 lg:p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Toast -->
		{#if toast}
			<div
				class="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-xl backdrop-blur-md
				{toast.type === 'success'
					? 'border-emerald-200 bg-emerald-50 text-emerald-700'
					: 'border-rose-200 bg-rose-50 text-rose-700'}"
				transition:fly={{ x: 50, duration: 400 }}
			>
				<CheckCircle2
					size={20}
					class={toast.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}
				/>
				{toast.message}
			</div>
		{/if}

		<!-- Delete Confirmation -->
		{#if deleteTarget}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
				transition:fade={{ duration: 200 }}
			>
				<div
					class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
					transition:fly={{ y: 20, duration: 300 }}
				>
					<div class="mb-5 flex justify-center">
						<div class="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
							<AlertTriangle size={28} class="text-rose-500" />
						</div>
					</div>
					<h3 class="mb-2 text-center text-xl font-bold">Studentni o'chirish</h3>
					<p class="mb-8 text-center text-slate-500">
						Haqiqatan ham <strong>{deleteTarget.name}</strong> ni o‘chirib tashlamoqchimisiz?
					</p>
					<form method="POST" action="?/deleteStudent" use:enhance class="flex gap-3">
						<input type="hidden" name="studentId" value={deleteTarget.id} />
						<button
							type="button"
							onclick={() => (deleteTarget = null)}
							class="flex-1 rounded-2xl bg-slate-100 py-3 font-semibold text-slate-600 hover:bg-slate-200"
						>
							Bekor qilish
						</button>
						<button
							type="submit"
							disabled={isDeleting}
							class="flex-1 rounded-2xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600"
						>
							{isDeleting ? 'O‘chirilmoqda...' : 'O‘chirish'}
						</button>
					</form>
				</div>
			</div>
		{/if}

		<!-- Header -->
		<div class="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-3xl font-black tracking-tight text-slate-800">STUDENTLAR</h1>
				<p class="mt-1 text-sm font-medium text-slate-500">
					Jami <span class="text-[#ed4b72]">{data.totalCount}</span> ta student
				</p>
			</div>

			<button
				onclick={() => (isAddModalOpen = true)}
				class="group flex h-12 items-center gap-2.5 rounded-2xl bg-slate-900 px-6 font-semibold text-white transition-all hover:bg-[#ed4b72] active:scale-95"
			>
				<Plus size={20} strokeWidth={2.5} class="transition-transform group-hover:rotate-90" />
				Yangi qo‘shish
			</button>
		</div>

		<!-- Filters -->
		<div class="mb-6 flex flex-col gap-4 md:flex-row">
			<div class="relative flex-1 md:max-w-md">
				<Search size={18} class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					placeholder="Ism yoki username bo'yicha qidirish..."
					bind:value={searchValue}
					class="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-4 pl-11 text-sm outline-none focus:border-[#ed4b72] focus:ring-4 focus:ring-[#ed4b72]/10"
				/>
			</div>

			<select
				bind:value={statusFilter}
				class="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium outline-none focus:border-[#ed4b72]"
			>
				<option value="all">Barcha statuslar</option>
				<option value="true">Faol</option>
				<option value="false">Nofaol</option>
			</select>
		</div>

		<!-- Table -->
		<div class="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
			<div class="overflow-x-auto">
				<table class="w-full min-w-225 text-left">
					<thead class="border-b border-slate-100 bg-slate-50">
						<tr>
							<th class="admin-table">Ism Familiya</th>
							<th class="admin-table">Username</th>
							<th class="admin-table">Telefon</th>
							<th class="admin-table">Kurslar</th>
							<th class="admin-table">Score</th>
							<th class="admin-table">Status</th>
							<th class="admin-table text-right">Amallar</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each paginatedStudents as student (student.id)}
							<tr class="group transition-colors hover:bg-slate-50">
								<td class="px-6 py-5">
									<a href={resolve(`/admin/students/${student.id}`)} class="items flex">
										<div class="flex items-center gap-4">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white {getAvatarColor(
													student.id
												)}"
											>
												{getInitials(student)}
											</div>
											<span class="font-semibold text-slate-800">{getFullName(student)}</span>
										</div>
									</a>
								</td>
								<td class="px-6 py-5">
									<span class="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
										>@{student.username}</span
									>
								</td>
								<td class="px-6 py-5 text-slate-600">{student.phone_number || '—'}</td>
								<td class="px-6 py-5 font-semibold text-slate-700">{student.courses_count ?? 0}</td>
								<td class="px-6 py-5 font-bold text-[#ed4b72]">{student.total_score ?? 0}</td>
								<td class="px-6 py-5">
									<span
										class="rounded-full border px-4 py-1 text-xs font-bold
										{student.is_active
											? 'border-emerald-200 bg-emerald-50 text-emerald-600'
											: 'border-rose-200 bg-rose-50 text-rose-600'}"
									>
										{student.is_active ? 'Faol' : 'Nofaol'}
									</span>
								</td>
								<td class="px-6 py-5 text-right">
									{#if student.is_active}
                                        <div
										class="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<button
											onclick={() => openEdit(student)}
											class="rounded-xl p-3 transition-colors hover:bg-blue-50"
										>
											<Edit2 size={18} />
										</button>
										<button
											onclick={() => openDelete(student)}
											class="rounded-xl p-3 transition-colors hover:bg-rose-50"
										>
											<Trash2 size={18} />
										</button>
									</div>
                                    {/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex items-center justify-between border-t border-slate-100 px-6 py-5">
					<button
						onclick={() => currentPage > 1 && currentPage--}
						disabled={currentPage === 1}
						class="flex items-center gap-1 rounded-2xl px-5 py-2 transition-colors hover:bg-slate-100"
					>
						<ChevronLeft size={18} /> Ortga
					</button>

					<div class="flex gap-1">
						{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p (p)}
							<button
								onclick={() => (currentPage = p)}
								class="flex h-9 w-9 items-center justify-center rounded-xl {p === currentPage
									? 'bg-[#ed4b72] text-white'
									: 'hover:bg-slate-100'}"
							>
								{p}
							</button>
						{/each}
					</div>

					<button
						onclick={() => currentPage < totalPages && currentPage++}
						disabled={currentPage === totalPages}
						class="flex items-center gap-1 rounded-2xl px-5 py-2 transition-colors hover:bg-slate-100"
					>
						Keyingi <ChevronRight size={18} />
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Modals -->
{#if isAddModalOpen}
	<AddStudentModal
		isOpen={isAddModalOpen}
		availableCourses={data.courses}
		onClose={() => (isAddModalOpen = false)}
	/>
{/if}

{#if editTarget}
	<EditStudentModal isOpen={true} student={editTarget} onClose={() => (editTarget = null)} />
{/if}

{#if deleteTarget}
	<!-- Delete confirmation modal (oldin bergan kodingizni shu yerga qo‘ying) -->
{/if}

<style>
	@reference "tailwindcss";

	.admin-table {
		@apply px-6 py-5 text-xs font-bold tracking-widest text-slate-500 uppercase;
	}
</style>
