<script>
	import {
		ArrowLeft,
		Key,
		UserCog,
		UserMinus,
		Trophy,
		BookOpen,
		Lock,
		Trash2,
		CheckCircle2,
		Unlock,
		Loader2
	} from 'lucide-svelte';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import ChangePasswordModal from '@/lib/components/ui/admin/ChangePasswordModal.svelte';
	import { enhance } from '$app/forms';
	import EditStudentModal from '@/lib/components/ui/admin/EditStudentModal.svelte';
	import AddEnrollmentModal from '@/lib/components/ui/admin/AddEnrollmentModal.svelte';
	import { showToast } from '@/lib/utils/toast.js';

	let { data, form } = $props();

	let courses = $state(data.student.courses ? [...data.student.courses] : []);
	let loadingEnrollments = $state([]);

	let isChangePasswordOpen = $state(false);
	let isAddEnrollmentOpen = $state(false);
	let editTarget = $state(null);
	let isDeleting = $state(false);
	let isActive = $state(data.student.is_active);

	function openEdit(student) {
		editTarget = { ...student };
	}

	const formatDate = (date) =>
		date
			? new Date(date).toLocaleDateString('uz-UZ', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})
			: "Noma'lum";

	const formatShortDate = (date) =>
		date ? new Date(date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) : '';

	const getInitials = (first, last) => `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || '?';

	let statusClass = $derived(
		data.student.is_active
			? 'bg-emerald-50 text-emerald-600 border-emerald-200'
			: 'bg-red-50 text-red-600 border-red-200'
	);

	$effect(() => {
		if (form?.updateSuccess) {
			showToast('Talaba muvaffaqiyatli yangilandi!', 'success');
		}
	});

	async function deleteStudent() {
		isDeleting = true;
		try {
			const res = await fetch('/api/student', {
				method: 'DELETE',
				body: JSON.stringify({ id: data.student.id })
			});

			if (!res.ok) {
				showToast('Talaba o‘chirilmadi!', 'error');
			}

			showToast('Talaba o‘chirildi!', 'success');
		} catch (error) {
			console.error(error);
			showToast('Talaba o‘chirilmadi!', 'error');
		} finally {
			isDeleting = false;
		}
	}
</script>

<div class="mx-auto min-h-screen max-w-7xl space-y-8 bg-[#f8fafc] p-4 font-sans md:p-8">
	<div class="mb-6 flex items-center gap-4">
		<button
			onclick={() => history.back()}
			class="flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-700"
		>
			<ArrowLeft size={20} />
			Ortga
		</button>
		<Breadcrumb />
	</div>

	<div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-3xl font-black tracking-tight text-slate-800">
				{data.student.first_name}
				{data.student.last_name}
			</h1>
			<p class="font-medium text-slate-500">@{data.student.username}</p>
		</div>

		<div class="flex flex-wrap gap-3">
			<button
				onclick={() => (isChangePasswordOpen = true)}
				class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50"
			>
				<Key size={16} /> Parol
			</button>
			{#if isActive}
				<button
					class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50"
					onclick={() => openEdit(data.student)}
				>
					<UserCog size={16} /> Tahrirlash
				</button>
				<button
					onclick={() => {
						isActive = !isActive;
						deleteStudent();
					}}
					class="flex items-center gap-2 rounded-2xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 shadow-sm transition-all hover:bg-red-50"
				>
					{#if isDeleting}
						<Loader2 size={16} class="animate-spin" />
					{:else}
						<UserMinus size={16} /> Faolsizlashtirish
					{/if}
				</button>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div
			class="flex flex-col items-center gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row lg:col-span-2"
		>
			<div
				class="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#ed4b72] to-[#de3c61] text-4xl font-bold text-white shadow-lg"
			>
				{getInitials(data.student.first_name, data.student.last_name)}
			</div>

			<div class="flex-1 space-y-3 text-center sm:text-left">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
					<h2 class="text-3xl font-bold text-slate-800">
						{data.student.first_name}
						{data.student.last_name}
					</h2>
					<span
						class="mx-auto inline-block w-fit rounded-full border px-4 py-1 text-xs font-bold {statusClass} sm:mx-0"
					>
						{data.student.is_active ? 'Faol' : 'Nofaol'}
					</span>
				</div>

				<p class="font-medium text-slate-500">@{data.student.username}</p>

				<div
					class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 sm:justify-start"
				>
					<span>📱 {data.student.phone_number || 'Telefon yo‘q'}</span>
					<span>📅 Qo‘shilgan: {formatDate(data.student.created_at)}</span>
					<span>🕒 Oxirgi kirish: {formatShortDate(data.student.last_login) || 'Hech qachon'}</span>
				</div>
			</div>
		</div>

		<div
			class="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-linear-to-r from-[#ed4b72] to-[#de3c61] p-8 text-white shadow-lg shadow-rose-200"
		>
			<Trophy class="absolute -right-6 -bottom-6 h-40 w-40 text-white/10" strokeWidth={1} />
			<div class="relative z-10">
				<h2 class="text-lg font-medium opacity-90">Total Score</h2>
				<div class="mt-1 text-5xl font-bold">{data.student.total_score}</div>
				<p class="mt-1 text-sm opacity-90">Umumiy yig‘ilgan ball</p>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-800">
					Kurslar ({data.student.courses_count || 0})
				</h2>
				<button 
					class="flex items-center gap-1 text-sm font-medium text-[#ed4b72] hover:underline"
					onclick={() => isAddEnrollmentOpen = true}
				>
					+ Kurs qo‘shish
				</button>
			</div>

			<div class="flex flex-col gap-3">
				{#if courses.length > 0}
					{#each courses as course (course.enrollment_id)}
						<div class="flex items-center justify-between rounded-2xl border border-slate-100 p-5">
							<div class="flex items-center gap-4">
								<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
									<BookOpen size={24} />
								</div>
								<div>
									<h4 class="font-semibold text-slate-800">{course.title}</h4>
									<p class="text-xs text-slate-400">
										Status: {course.is_blocked ? 'Bloklangan' : 'Faol'}
									</p>
								</div>
							</div>

							<div class="flex gap-2">
								<!-- BLOKLASH tugmasi -->
								{#if !course.is_blocked}
									<form
										method="POST"
										action="?/blockEnrollment"
										use:enhance={() => {
											const id = course.enrollment_id;
											loadingEnrollments = [...loadingEnrollments, id];

											return async ({ result }) => {
												if (result.type === 'success') {
													const idx = courses.findIndex((c) => c.enrollment_id === id);
													if (idx !== -1) {
														courses[idx] = {
															...courses[idx],
															is_blocked: true
														};
													}
												}
												loadingEnrollments = loadingEnrollments.filter((x) => x !== id);
											};
										}}
									>
										<input type="hidden" name="enrollmentId" value={course.enrollment_id} />
										<button
											type="submit"
											disabled={course.is_blocked ||
												loadingEnrollments.includes(course.enrollment_id)}
											class="rounded-xl border bg-white px-5 py-3 text-sm font-bold shadow-sm transition-all disabled:opacity-40
								   {course.is_blocked ? 'display-none' : 'text-orange-500 hover:bg-orange-50'}"
										>
											{#if loadingEnrollments.includes(course.enrollment_id)}
												<Loader2 size={18} class="animate-spin" />
											{:else}
												<div class="flex items-center gap-2">
													<Lock size={18} /> Bloklash
												</div>
											{/if}
										</button>
									</form>
								{/if}

								<!-- OCHISH tugmasi -->

								{#if course.is_blocked}
									<form
										method="POST"
										action="?/unblockEnrollment"
										use:enhance={() => {
											const id = course.enrollment_id;
											loadingEnrollments = [...loadingEnrollments, id];

											return async ({ result }) => {
												if (result.type === 'success') {
													const idx = courses.findIndex((c) => c.enrollment_id === id);
													if (idx !== -1) {
														courses[idx] = {
															...courses[idx],
															is_blocked: false
														};
													}
												}
												loadingEnrollments = loadingEnrollments.filter((x) => x !== id);
											};
										}}
									>
										<input type="hidden" name="enrollmentId" value={course.enrollment_id} />
										<button
											type="submit"
											disabled={!course.is_blocked ||
												loadingEnrollments.includes(course.enrollment_id)}
											class="rounded-xl border bg-white px-5 py-3 text-sm font-bold shadow-sm transition-all disabled:opacity-40
								   {!course.is_blocked ? 'display-none' : 'text-emerald-500 hover:bg-emerald-50'}"
										>
											{#if loadingEnrollments.includes(course.enrollment_id)}
												<Loader2 size={18} class="animate-spin" />
											{:else}
												<div class="flex items-center gap-2">
													<Unlock size={18} /> Ochish
												</div>
											{/if}
										</button>
									</form>
								{/if}

								<!-- O‘chirish tugmasi (o‘zgarmaydi) -->
								<form
									method="POST"
									action="?/removeEnrollment"
									use:enhance={() => {
										const id = course.enrollment_id;
										loadingEnrollments = [...loadingEnrollments, id];

										return async ({ result }) => {
											if (result.type === 'success') {
												courses = courses.filter((c) => c.enrollment_id !== id);
											}
											loadingEnrollments = loadingEnrollments.filter((x) => x !== id);
										};
									}}
								>
									<input type="hidden" name="enrollmentId" value={course.enrollment_id} />
									<button type="submit" class="rounded-xl border p-3 text-red-500 hover:bg-red-50">
										<Trash2 size={18} />
									</button>
								</form>
							</div>
						</div>
					{/each}
				{:else}
					<div
						class="rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center text-slate-400"
					>
						Student hali hech qanday kursga biriktirilmagan
					</div>
				{/if}
			</div>
		</div>

		<div class="space-y-6 lg:col-span-1">
			<div class="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
				<h2 class="text-lg font-medium text-slate-600">Reyting o‘rni</h2>
				<div class="mt-2 text-4xl font-bold text-slate-800">Top 15%</div>
				<p class="text-sm text-slate-400">Jami studentlar orasida</p>
			</div>

			<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-bold text-slate-800">Platforma eslatmasi</h2>
				<div class="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
					<CheckCircle2 size={22} class="mt-0.5 text-blue-500" />
					<p class="text-sm leading-relaxed text-blue-700/90">
						Student barcha kurslarni 80%+ natija bilan tugatsa, avtomatik sertifikat beriladi.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<ChangePasswordModal
	isOpen={isChangePasswordOpen}
	studentName={`${data.student.first_name} ${data.student.last_name}`}
	onClose={() => (isChangePasswordOpen = false)}
/>

{#if editTarget}
	<EditStudentModal isOpen={true} student={editTarget} onClose={() => (editTarget = null)} />
{/if}

<AddEnrollmentModal
	isOpen={isAddEnrollmentOpen}
	availableCourses={data.availableCourses}
	studentName={`${data.student.first_name} ${data.student.last_name}`}
	onClose={() => (isAddEnrollmentOpen = false)}
/>
