<!-- src/routes/dashboard/admin/students/[id]/+page.svelte -->
<script>
	import { ArrowLeft, Key, UserCog, UserMinus, UserCheck, Trophy, BookOpen, Lock, Trash2, CheckCircle2, Unlock } from 'lucide-svelte';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import ChangePasswordModal from '@/lib/components/ui/admin/ChangePasswordModal.svelte';

	let { data } = $props();

	// Real data (backenddan keladi)
	let student = $derived(data.student);

	// let activeTab = $state('Hammasi');
	let isChangePasswordOpen = $state(false);

	// Yordamchi funksiyalar
	const formatDate = (date) => date 
		? new Date(date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }) 
		: "Noma'lum";

	const formatShortDate = (date) => date 
		? new Date(date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) 
		: '';

	const getInitials = (first, last) => 
		`${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || '?';

	// Status ranglari uchun reusable class
	let statusClass = $derived(
		student.is_active 
			? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
			: 'bg-red-50 text-red-600 border-red-200'
	);
</script>

<div class="mx-auto min-h-screen max-w-7xl space-y-8 bg-[#f8fafc] p-4 font-sans md:p-8">
	
	<!-- Back + Breadcrumb -->
	<div class="flex items-center gap-4 mb-6">
		<button onclick={() => history.back()} class="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
			<ArrowLeft size={20} />
			Ortga
		</button>
		<Breadcrumb />
	</div>

	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-black tracking-tight text-slate-800">
				{student.first_name} {student.last_name}
			</h1>
			<p class="text-slate-500 font-medium">@{student.username}</p>
		</div>

		<div class="flex flex-wrap gap-3">
			<button onclick={() => isChangePasswordOpen = true}
				class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
				<Key size={16} /> Parol
			</button>

			<button class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all">
				<UserCog size={16} /> Tahrirlash
			</button>

			<button onclick={() => student.is_active = !student.is_active}
				class="flex items-center gap-2 rounded-2xl border font-semibold text-sm shadow-sm transition-all px-5 py-2.5
					{student.is_active 
						? 'border-red-200 text-red-500 hover:bg-red-50' 
						: 'border-emerald-200 text-emerald-500 hover:bg-emerald-50'}">
				{#if student.is_active}
					<UserMinus size={16} /> Faolsizlashtirish
				{:else}
					<UserCheck size={16} /> Faollashtirish
				{/if}
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Student Info -->
		<div class="flex flex-col items-center gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row lg:col-span-2">
			<div class="h-24 w-24 shrink-0 rounded-full bg-linear-to-br from-[#ed4b72] to-[#de3c61] flex items-center justify-center text-4xl font-bold text-white shadow-lg">
				{#if student.picture}
					<img src={student.picture} alt="Avatar" class="h-full w-full object-cover rounded-full" />
				{:else}
					{getInitials(student.first_name, student.last_name)}
				{/if}
			</div>

			<div class="flex-1 text-center sm:text-left space-y-3">
				<div class="flex flex-col sm:flex-row sm:items-center gap-3">
					<h2 class="text-3xl font-bold text-slate-800">
						{student.first_name} {student.last_name}
					</h2>
					<span class="mx-auto inline-block w-fit rounded-full px-4 py-1 text-xs font-bold border {statusClass} sm:mx-0">
						{student.is_active ? 'Faol' : 'Nofaol'}
					</span>
				</div>

				<p class="font-medium text-slate-500">@{student.username}</p>

				<div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 sm:justify-start">
					<span>📱 {student.phone_number || 'Telefon yo‘q'}</span>
					<span>📅 Qo‘shilgan: {formatDate(student.created_at)}</span>
					<span>🕒 Oxirgi kirish: {formatShortDate(student.last_login) || 'Hech qachon'}</span>
				</div>
			</div>
		</div>

		<!-- Total Score Card -->
		<div class="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-linear-to-r from-[#ed4b72] to-[#de3c61] p-8 text-white shadow-lg shadow-rose-200">
			<Trophy class="absolute -right-6 -bottom-6 h-40 w-40 text-white/10" strokeWidth={1} />
			<div class="relative z-10">
				<h2 class="text-lg font-medium opacity-90">Total Score</h2>
				<div class="text-5xl font-bold mt-1">{student.total_score}</div>
				<p class="text-sm opacity-90 mt-1">Umumiy yig‘ilgan ball</p>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Courses -->
		<div class="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-800">Kurslar ({student.courses_count || 0})</h2>
				<button class="text-[#ed4b72] text-sm font-medium hover:underline flex items-center gap-1">
					+ Kurs qo‘shish
				</button>
			</div>

			<div class="flex flex-col gap-3">
				{#if student.courses && student.courses.length > 0}
					{#each student.courses as course (course.id)}
						<div class="flex flex-col gap-4 rounded-2xl border border-slate-100 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center">
							<div class="flex items-center gap-4 flex-1">
								<div class="h-14 w-14 shrink-0 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border">
									<BookOpen size={24} />
								</div>
								<div class="flex-1">
									<h4 class="font-semibold text-slate-800">{course.title}</h4>
									<div class="mt-3 flex items-center gap-3">
										<div class="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
											<div class="h-full bg-[#10B981]" style="width: {course.progress || 0}%"></div>
										</div>
										<span class="text-xs font-bold text-slate-400">{course.progress || 0}%</span>
									</div>
								</div>
							</div>

							<div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
								<span class="hidden text-xs text-slate-400 sm:block">
									{formatShortDate(course.enrolled_at)}
								</span>
								<div class="flex gap-2">
									<button class="rounded-xl border bg-white p-3 text-orange-500 hover:bg-orange-50 transition-all shadow-sm">
										{#if course.is_blocked}<Lock size={16} />{:else} <Unlock size={16} />{/if}
									</button>
									<button class="rounded-xl border border-slate-200 bg-white p-3 text-red-500 hover:bg-red-50 transition-all shadow-sm">
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div class="rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center text-slate-400">
						Student hali hech qanday kursga biriktirilmagan
					</div>
				{/if}
			</div>
		</div>

		<!-- Right Sidebar -->
		<div class="space-y-6 lg:col-span-1">
			<!-- Ranking -->
			<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm text-center">
				<h2 class="text-lg font-medium text-slate-600">Reyting o‘rni</h2>
				<div class="text-4xl font-bold text-slate-800 mt-2">Top 15%</div>
				<p class="text-sm text-slate-400">Jami studentlar orasida</p>
			</div>

			<!-- Platforma eslatmasi -->
			<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
				<h2 class="text-lg font-bold text-slate-800 mb-4">Platforma eslatmasi</h2>
				<div class="flex gap-3 rounded-2xl bg-blue-50/70 border border-blue-100 p-4">
					<CheckCircle2 size={22} class="text-blue-500 mt-0.5" />
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
	studentName="{student.first_name} {student.last_name}"
	onClose={() => isChangePasswordOpen = false}
/>