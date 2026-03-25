<script lang="ts">
	import ChangePasswordModal from '@/lib/components/ui/admin/ChangePasswordModal.svelte';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import {
		UserCog, Key, UserMinus, UserCheck,
		Trophy, BookOpen, FileText, ExternalLink,
		Lock, Trash2, CheckCircle2
	} from 'lucide-svelte';

	let { data } = $props();

	// Mock student data (real data will come from `data` prop)
	let student = $state({
		id: 1,
		first_name: "Ali",
		last_name: "Karimov",
		username: "ali_dev",
		is_active: true,
		joined_date: "15-yanvar, 2026",
		last_login: "2 soat oldin",
		total_score: 1250,
		courses_count: 3,
		submissions_count: 12
	});

	let activeTab = $state('Hammasi');
	let isChangePasswordOpen = $state(false);
</script>

<div class="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 font-['Poppins']">

	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
		<div class="space-y-1">
			<Breadcrumb />
		</div>

		<div class="flex flex-wrap gap-2">
			<button class="px-4 py-2 rounded-xl border-2 border-[#FF4D8D] text-[#FF4D8D] font-bold text-sm hover:bg-[#FF4D8D] hover:text-white transition-all">
				Kursga Biriktirish
			</button>

			<button
				onclick={() => isChangePasswordOpen = true}
				class="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
			>
				<Key size={16} /> Parol
			</button>

			<button class="px-4 py-2 rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2">
				<UserCog size={16} /> Tahrirlash
			</button>

			<button
				onclick={() => student.is_active = !student.is_active}
				class="px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all flex items-center gap-2
					{student.is_active
						? 'border-red-200 text-red-500 hover:bg-red-50'
						: 'border-emerald-200 text-emerald-500 hover:bg-emerald-50'}"
			>
				{#if student.is_active}
					<UserMinus size={16} /> Faolsizlashtirish
				{:else}
					<UserCheck size={16} /> Faollashtirish
				{/if}
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

		<!-- Profile Card -->
		<div class="lg:col-span-3 bg-white rounded-[12px] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
			<div class="flex items-center gap-6">
				<div class="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF4D8D] to-[#ff85af] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-pink-100">
					{student.first_name[0]}{student.last_name[0]}
				</div>
				<div class="space-y-1">
					<div class="flex items-center gap-3">
						<h1 class="text-2xl font-bold text-slate-800">{student.first_name} {student.last_name}</h1>
						<span class="px-3 py-1 rounded-full text-xs font-bold {student.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}">
							{student.is_active ? 'Faol' : 'Nofaol'}
						</span>
					</div>
					<p class="text-[#6B7280] font-medium">@{student.username}</p>
					<div class="flex gap-4 text-xs text-slate-400 font-medium">
						<span>Qo'shilgan: {student.joined_date}</span>
						<span>Oxirgi kirish: {student.last_login}</span>
					</div>
				</div>
			</div>

			<div class="flex gap-4">
				<div class="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-50 min-w-[120px] text-center">
					<Trophy class="mx-auto text-amber-500 mb-1" size={24} />
					<div class="text-xl font-black text-slate-800">{student.total_score}</div>
					<div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Umumiy ball</div>
				</div>
				<div class="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-50 min-w-[120px] text-center">
					<BookOpen class="mx-auto text-[#FF4D8D] mb-1" size={24} />
					<div class="text-xl font-black text-slate-800">{student.courses_count}</div>
					<div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Kurslar</div>
				</div>
				<div class="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-50 min-w-[120px] text-center">
					<FileText class="mx-auto text-blue-500 mb-1" size={24} />
					<div class="text-xl font-black text-slate-800">{student.submissions_count}</div>
					<div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Topshiriqlar</div>
				</div>
			</div>
		</div>

		<!-- Left Column -->
		<div class="lg:col-span-2 space-y-6">

			<!-- Courses -->
			<div class="bg-white rounded-[12px] shadow-sm border border-slate-100 overflow-hidden">
				<div class="p-5 border-b border-slate-50 flex justify-between items-center">
					<h2 class="font-bold text-slate-800 flex items-center gap-2">
						<BookOpen size={18} class="text-[#FF4D8D]" /> Kurslar
					</h2>
					<button class="text-xs font-bold text-[#FF4D8D] bg-pink-50 px-3 py-1.5 rounded-lg hover:bg-[#FF4D8D] hover:text-white transition-all">
						+ Kurs Qo'shish
					</button>
				</div>
				<div class="divide-y divide-slate-50">
					{#each Array(2) as _, i (i)}
					<div class="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shadow-inner">
								<img src="https://via.placeholder.com/48" alt="course cover" />
							</div>
							<div>
								<h4 class="font-bold text-sm text-slate-800">UX/UI Design Foundation</h4>
								<div class="flex items-center gap-3 mt-1">
									<div class="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
										<div class="h-full bg-emerald-500" style="width: 65%"></div>
									</div>
									<span class="text-[10px] font-bold text-slate-400">65%</span>
								</div>
							</div>
						</div>
						<div class="flex items-center gap-6">
							<span class="text-[11px] text-slate-400 font-medium hidden md:block">Biriktirilgan: 1-mart</span>
							<div class="flex items-center gap-2">
								<button class="p-2 rounded-lg border border-orange-100 text-orange-500 hover:bg-orange-50 transition-all" title="Bloklash">
									<Lock size={14} />
								</button>
								<button class="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all" title="Chiqarish">
									<Trash2 size={14} />
								</button>
							</div>
						</div>
					</div>
					{/each}
				</div>
			</div>

			<!-- Submissions -->
			<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
				<div class="p-5 border-b border-slate-50 flex justify-between items-center flex-wrap gap-4">
					<h2 class="font-bold text-slate-800">Topshiriqlar</h2>
					<div class="flex bg-slate-100 p-1 rounded-xl">
						{#each ['Hammasi', 'Kutilmoqda', 'Baholandi'] as tab (tab)}
							<button
								onclick={() => activeTab = tab}
								class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all {activeTab === tab ? 'bg-white text-[#FF4D8D] shadow-sm' : 'text-slate-500'}"
							>
								{tab}
							</button>
						{/each}
					</div>
				</div>
				<div class="p-4 space-y-3">
					{#each Array(3) as _, i (i)}
					<div class="flex items-center justify-between p-3 border border-slate-50 rounded-xl hover:border-pink-100 transition-all">
						<div class="flex items-center gap-3">
							<div class="p-2.5 rounded-xl bg-blue-50 text-blue-500">
								<FileText size={18} />
							</div>
							<div>
								<p class="text-sm font-bold text-slate-800">2-Dars: Ranglar nazariyasi</p>
								<p class="text-[11px] text-slate-400 font-medium">Graphic Design Pro • 20-fevral</p>
							</div>
						</div>
						<div class="flex items-center gap-4">
							{#if i === 0}
								<span class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold uppercase">Kutilmoqda</span>
							{:else}
								<span class="text-lg font-black text-[#FF4D8D]">95</span>
								<span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">Baholandi</span>
							{/if}
							<button class="p-2 text-slate-400 hover:text-[#FF4D8D] transition-colors">
								<ExternalLink size={18} />
							</button>
						</div>
					</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Right Column -->
		<div class="lg:col-span-1">
			<div class="bg-white rounded-[12px] p-5 shadow-sm border border-slate-100">
				<h3 class="font-bold text-slate-800 mb-4 tracking-tight uppercase text-xs">Platforma eslatmasi</h3>
				<div class="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
					<CheckCircle2 size={18} class="text-blue-500 shrink-0" />
					<p class="text-xs leading-relaxed text-blue-700 font-medium">
						Student barcha kurslarni 80% dan yuqori natija bilan yakunlasa, avtomatik sertifikat generatsiya qilinadi.
					</p>
				</div>
			</div>
		</div>

	</div>
</div>

<!-- Change Password Modal -->
<ChangePasswordModal
	isOpen={isChangePasswordOpen}
	studentName="{student.first_name} {student.last_name}"
	onClose={() => isChangePasswordOpen = false}
/>