<script lang="ts">
	import {
		ChevronLeft,
		Layout,
		ListChecks,
		Users,
		BarChart3,
		Settings,
		ChevronDown,
		Search,
		Phone,
		MoreHorizontal,
		Save,
		Globe,
		Tag,
		CheckCircle2,
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { fade, slide } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';

	let {
		course,
		modules = [],
		adminHeaderActions = undefined,
		adminFooterActions = undefined,
		adminModuleActions = undefined,
		adminLessonActions = undefined
	} = $props();

	let activeTab = $state('content'); // content, students, settings
	let expandedModules = $state({});

	// Modullarni boshqarish: default holatda birinchisini ochib qo'yamiz
	$effect(() => {
		if (modules.length > 0 && Object.keys(expandedModules).length === 0) {
			expandedModules[modules[0].id] = true;
		}
	});

	function toggleModule(id) {
		expandedModules[id] = !expandedModules[id];
	}

	function isExpanded(id) {
		return !!expandedModules[id];
	}

	// Student Search Logic
	let searchQuery = $state('');
	const filteredStudents = $derived(() => {
		const list = course.students || [];
		if (!searchQuery.trim()) return list;
		const query = searchQuery.toLowerCase().trim();
		return list.filter(
			(s) =>
				s.first_name?.toLowerCase().includes(query) ||
				s.last_name?.toLowerCase().includes(query) ||
				s.phone_number?.includes(query) ||
				s.username?.toLowerCase().includes(query)
		);
	});

	// Helper for student initials
	const getInitials = (s) => {
		return (s.first_name?.[0] || '') + (s.last_name?.[0] || '');
	};

	const avatarColors = [
		'bg-rose-100 text-rose-600',
		'bg-emerald-100 text-emerald-600',
		'bg-amber-100 text-amber-600',
		'bg-blue-100 text-blue-600',
		'bg-purple-100 text-purple-600'
	];
	const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

	// --- Course Update Logic ---
	let isSaving = $state(false);
	// eslint-disable-next-line svelte/prefer-writable-derived
	let isPublished = $state(course.is_published);

	const onUpdateCourse = () => {
		isSaving = true;
		return async ({ result, update }) => {
			isSaving = false;
			if (result.type === 'success') {
				toast.success("Kurs muvaffaqiyatli yangilandi");
			} else if (result.type === 'failure') {
				toast.error(result.data?.error || "Xatolik yuz berdi");
			}
			await update();
		};
	};

	$effect(() => {
		isPublished = course.is_published;
	});
</script>

<div class="min-h-screen bg-[#f8fafc] pb-20 font-sans lg:pb-10">
	<!-- Sticky Glass Header -->
	<header
		class="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<div class="flex items-center gap-2 sm:gap-4">
				<a
					href={resolve('/admin/courses')}
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
				>
					<ChevronLeft size={20} />
				</a>
				<div class="min-w-0 flex-1">
					<div class="hidden sm:block">
						<Breadcrumb />
					</div>
					<h1 class="line-clamp-1 text-base font-bold text-slate-900 sm:text-xl">
						{course.title}
					</h1>
				</div>
			</div>

			<div class="flex items-center justify-end gap-1.5 sm:gap-2">
				{#if adminHeaderActions}
					{@render adminHeaderActions()}
				{/if}
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Course Dashboard Cards -->
		<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Course Preview -->
			<div
				class="col-span-1 flex items-center gap-4 overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:col-span-2"
			>
				<div
					class="relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-inner"
				>
					<img
						src={course.img ||
							`https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`}
						alt="Course"
						class="absolute inset-0 h-full w-full object-cover"
					/>
				</div>
				<div class="flex-1">
					<div class="mb-1 flex items-center gap-2">
						<span
							class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase ring-1 ring-emerald-600/20 ring-inset"
						>
							{course.is_published ? 'Active' : 'Draft'}
						</span>
						<span class="text-xs font-medium text-slate-400"
							>• Created {new Date().toLocaleDateString()}</span
						>
					</div>
					<h2 class="line-clamp-1 text-lg font-extrabold text-slate-800">{course.title}</h2>
					<p class="mt-1 line-clamp-2 text-xs text-slate-500">{course.description}</p>
				</div>
			</div>

			<!-- Quick Stats -->
			<div
				class="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
			>
				<div
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#ed4b72]"
				>
					<Layout size={24} />
				</div>
				<div>
					<p class="text-xs font-bold tracking-tight text-slate-400 uppercase">Modules</p>
					<p class="text-2xl font-black text-slate-800">{modules.length}</p>
				</div>
			</div>

			<div
				class="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
			>
				<div
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-rose-50 group-hover:text-[#ed4b72]"
				>
					<ListChecks size={24} />
				</div>
				<div>
					<p class="text-xs font-bold tracking-tight text-slate-400 uppercase">Lessons</p>
					<p class="text-2xl font-black text-slate-800">{course.lessons_count || 0}</p>
				</div>
			</div>
		</div>

		<!-- Content Tabs (App-like navigation) -->
		<div
			class="scrollbar-hide mb-6 flex w-full overflow-x-auto rounded-2xl bg-slate-100 p-1 sm:w-fit"
		>
			<div class="flex min-w-full gap-1 sm:min-w-0">
				<button
					onclick={() => (activeTab = 'content')}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-6 {activeTab ===
					'content'
						? 'bg-white text-[#ed4b72] shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					<Layout size={18} />
					Tuzilma
				</button>
				<button
					onclick={() => (activeTab = 'students')}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-6 {activeTab ===
					'students'
						? 'bg-white text-[#ed4b72] shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					<Users size={18} />
					O'quvchilar
				</button>
				<button
					onclick={() => (activeTab = 'settings')}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-6 {activeTab ===
					'settings'
						? 'bg-white text-[#ed4b72] shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					<Settings size={18} />
					Sozlamalar
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		{#if activeTab === 'content'}
			<div in:fade={{ duration: 200 }} class="space-y-6">
				{@render contentTab()}
			</div>
		{:else if activeTab === 'students'}
			<div in:fade={{ duration: 200 }}>
				{@render studentsTab()}
			</div>
		{:else if activeTab === 'settings'}
			<div in:fade={{ duration: 200 }} class="space-y-8">
				{@render settingsTab()}
				
				{#if adminFooterActions}
					<div class="pt-4 mt-8 border-t border-slate-100">
						{@render adminFooterActions()}
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>

{#snippet contentTab()}
	<div class="flex flex-col gap-6">
		{#each modules as mod (mod.id)}
			<div
				class="rounded-[32px] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md"
			>
				<!-- Module Header -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="flex cursor-pointer items-center justify-between border-b border-slate-50 bg-slate-50/30 p-5 transition-colors hover:bg-slate-50 sm:p-6"
					onclick={() => toggleModule(mod.id)}
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-2xl bg-white font-black text-slate-400 shadow-sm ring-1 ring-slate-100 transition-all duration-300 {isExpanded(
								mod.id
							)
								? 'rotate-180 ring-rose-100'
								: 'rotate-0'}"
						>
							<ChevronDown
								size={20}
								class="transition-colors {isExpanded(mod.id) ? 'text-[#ed4b72]' : 'text-slate-400'}"
							/>
						</div>
						<div>
							<h3
								class="text-lg leading-tight font-black text-slate-800 transition-colors sm:text-xl {isExpanded(
									mod.id
								)
									? 'text-[#ed4b72]'
									: ''}"
							>
								{mod.title}
							</h3>
							<p class="mt-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
								{mod.lessons?.length || 0} ta dars • Modul {mod.order || ''}
							</p>
						</div>
					</div>

					<div class="flex items-center gap-2" onclick={(e) => e.stopPropagation()}>
						{#if adminModuleActions}
							{@render adminModuleActions(mod)}
						{/if}
					</div>
				</div>

				<!-- Lessons List -->
				{#if isExpanded(mod.id)}
					<div transition:slide={{ duration: 300 }} class="border-t border-slate-50 p-3 sm:p-4">
						{#if mod.lessons && mod.lessons.length > 0}
							<div class="flex flex-col gap-2">
								{#each mod.lessons as lesson (lesson.id)}
									<div
										class="group relative flex items-center justify-between rounded-2xl border border-transparent p-3 transition-all hover:border-slate-100 hover:bg-slate-50"
									>
										<div class="flex items-center gap-4">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors group-hover:bg-rose-50 group-hover:text-rose-500"
											>
												<BarChart3 size={20} />
											</div>
											<div>
												<h4 class="line-clamp-1 text-sm font-bold text-slate-700 sm:text-base">
													{lesson.title}
												</h4>
												<span class="text-xs font-semibold text-slate-400 capitalize"
													>{lesson.duration || 0} minut • Video dars</span
												>
											</div>
										</div>

										{#if adminLessonActions}
											<div class="flex items-center gap-1">
												{@render adminLessonActions(lesson, mod)}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{:else}
							<div
								class="flex flex-col items-center justify-center py-8 text-center text-slate-400 italic"
							>
								<p class="text-sm">Hozircha darslar mavjud emas.</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}

		{#if modules.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-slate-200 bg-white p-20 text-center text-slate-400"
			>
				<Layout size={48} class="mb-4 opacity-20" />
				<p class="text-lg font-bold">Modullar hali qo'shilmagan</p>
				<p class="text-sm">Yangi modul qo'shish uchun yuqoridagi tugmani bosing.</p>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet studentsTab()}
	<div class="flex flex-col gap-6">
		<!-- Search & Header -->
		<div
			class="relative flex flex-col gap-4 overflow-hidden rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="relative flex-1">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"
				>
					<Search size={18} strokeWidth={2.5} />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Ism yoki telefon raqami bo'yicha qidirish..."
					class="w-full rounded-2xl border-none bg-slate-100 py-3.5 pl-11 pr-4 text-sm font-bold transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
				/>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-black tracking-widest text-slate-400 uppercase">Jami</span>
				<div class="rounded-xl bg-rose-50 px-3 py-1.5 text-sm font-black text-[#ed4b72]">
					{course.students?.length || 0}
				</div>
			</div>
		</div>

		<!-- Students Table -->
		{#if filteredStudents().length > 0}
			<div class="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm">
				<div class="overflow-x-auto scrollbar-hide">
					<table class="w-full min-w-[600px] border-collapse text-left">
						<thead>
							<tr class="border-b border-slate-50 bg-slate-50/50">
								<th class="px-6 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase"
									>#</th
								>
								<th class="px-6 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase"
									>O'quvchi</th
								>
								<th class="px-6 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase"
									>Telefon</th
								>
								<th
									class="px-6 py-4 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase"
									>Amallar</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-50">
							{#each filteredStudents() as student, i (student.id)}
								<tr class="group transition-colors hover:bg-slate-50/30">
									<td class="px-6 py-4 text-xs font-bold text-slate-400">{i + 1}</td>
									<td class="px-6 py-4">
										<a
											href={resolve(`/admin/students/${student.id}`)}
											class="flex max-w-fit items-center gap-3 transition-transform hover:translate-x-1"
										>
											<div
												class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black ring-4 ring-white shadow-sm transition-all group-hover:ring-[#ed4b72]/10 {getAvatarColor(
													student.id
												)}"
											>
												{getInitials(student)}
											</div>
											<div class="flex flex-col">
												<span
													class="text-sm font-extrabold text-slate-800 transition-colors group-hover:text-[#ed4b72]"
												>
													{student.first_name} {student.last_name}
												</span>
												<span class="text-[11px] font-bold text-slate-400"
													>@{student.username}</span
												>
											</div>
										</a>
									</td>
									<td class="px-6 py-4 text-sm font-bold text-slate-600 font-mono">
										{student.phone_number}
									</td>
									<td class="px-6 py-4 text-right">
										<div class="flex justify-end gap-2">
											<a
												href="tel:{student.phone_number}"
												class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all hover:bg-emerald-50 hover:text-emerald-500"
											>
												<Phone size={16} />
											</a>
											<button
												class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
											>
												<MoreHorizontal size={18} />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else if searchQuery}
			<div
				class="flex flex-col items-center justify-center rounded-[40px] border border-slate-100 bg-white py-20 text-center"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300"
				>
					<Search size={32} />
				</div>
				<p class="text-lg font-bold text-slate-800">Hech kim topilmadi</p>
				<p class="text-sm text-slate-400">"{searchQuery}" so'ziga mos o'quvchi mavjud emas.</p>
			</div>
		{:else}
			<div
				class="flex flex-col items-center justify-center rounded-[40px] border border-slate-100 bg-white py-20 text-center"
			>
				<div
					class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300"
				>
					<Users size={40} />
				</div>
				<h3 class="text-lg font-bold text-slate-800">O'quvchilar ro'yxati bo'sh</h3>
				<p class="mt-1 text-sm text-slate-400">Ushbu kursga hali o'quvchilar qo'shilmagan.</p>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet settingsTab()}
	<form
		method="POST"
		action="?/updateCourse"
		use:enhance={onUpdateCourse}
		class="flex flex-col gap-6"
	>
		<!-- Section: Status & Publishing -->
		<div
			class="relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm"
		>
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-2xl {isPublished
							? 'bg-emerald-50 text-emerald-500'
							: 'bg-amber-50 text-amber-500'}"
					>
						<CheckCircle2 size={20} />
					</div>
					<div>
						<h3 class="text-sm font-black tracking-tight text-slate-800">Publishing Status</h3>
						<p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
							{isPublished ? 'Live on platform' : 'Hidden from students'}
						</p>
					</div>
				</div>
				<button
					type="button"
					onclick={() => (isPublished = !isPublished)}
					class="relative h-7 w-12 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none {isPublished
						? 'bg-emerald-500'
						: 'bg-slate-200'}"
				>
					<div
						class="absolute top-1 left-1 h-5 w-5 transform rounded-full bg-white transition-transform duration-300 {isPublished
							? 'translate-x-5'
							: 'translate-x-0'}"
					></div>
				</button>
				<input type="hidden" name="is_published" value={isPublished} />
			</div>
		</div>

		<!-- Section: Basic Information (UZ) -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div class="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
				<div class="mb-5 flex items-center gap-3 border-b border-slate-50 pb-4">
					<div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#ed4b72]">
						<Globe size={20} />
					</div>
					<h3 class="text-[16px] font-black tracking-tight text-slate-800">O'zbek tilida (UZ)</h3>
				</div>
				<div class="space-y-5">
					<div class="space-y-2">
						<label for="title_uz" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Kurs nomi</label>
						<input
							type="text"
							id="title_uz"
							name="title_uz"
							value={course.title_uz || course.title}
							placeholder="Masalan: Tikuvchilik asoslari"
							class="w-full rounded-2xl border-none bg-slate-100 px-4 py-3.5 text-sm font-bold transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						/>
					</div>
					<div class="space-y-2">
						<label for="description_uz" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Tavsif</label>
						<textarea
							id="description_uz"
							name="description_uz"
							rows="4"
							value={course.description_uz || course.description}
							placeholder="Kurs haqida batafsil ma'lumot..."
							class="min-h-[120px] w-full rounded-2xl border-none bg-slate-100 p-4 text-sm font-bold transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						></textarea>
					</div>
					<div class="space-y-2">
						<label for="level_uz" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Daraja</label>
						<input
							type="text"
							id="level_uz"
							name="level_uz"
							value={course.level_uz || ''}
							placeholder="Masalan: Boshlang'ich"
							class="w-full rounded-2xl border-none bg-slate-100 px-4 py-3.5 text-sm font-bold transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						/>
					</div>
				</div>
			</div>

			<!-- Section: Basic Information (RU) -->
			<div class="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
				<div class="mb-5 flex items-center gap-3 border-b border-slate-50 pb-4">
					<div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
						<Globe size={20} />
					</div>
					<h3 class="text-[16px] font-black tracking-tight text-slate-800">На русском (RU)</h3>
				</div>
				<div class="space-y-5">
					<div class="space-y-2">
						<label for="title_ru" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Название курса</label>
						<input
							type="text"
							id="title_ru"
							name="title_ru"
							value={course.title_ru || ''}
							placeholder="Например: Основы шитья"
							class="w-full rounded-2xl border-none bg-slate-100 px-4 py-3.5 text-sm font-bold transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						/>
					</div>
					<div class="space-y-2">
						<label for="description_ru" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Описание</label>
						<textarea
							id="description_ru"
							name="description_ru"
							rows="4"
							value={course.description_ru || ''}
							placeholder="Подробная информация о курсе..."
							class="min-h-[120px] w-full rounded-2xl border-none bg-slate-100 p-4 text-sm font-bold transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						></textarea>
					</div>
					<div class="space-y-2">
						<label for="level_ru" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Level (RU)</label>
						<input
							type="text"
							id="level_ru"
							name="level_ru"
							value={course.level_ru || ''}
							placeholder="Например: Для начинающих"
							class="w-full rounded-2xl border-none bg-slate-100 px-4 py-3.5 text-sm font-bold transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Section: Technical & Pricing -->
		<div class="rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm">
			<div class="mb-6 flex items-center gap-3">
				<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
					<Tag size={22} />
				</div>
				<h3 class="text-lg font-black tracking-tight text-slate-800">Texnik va Moliyaviy ma'lumotlar</h3>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="space-y-2">
					<label for="duration" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Davomiyligi (minut)</label>
					<div class="relative">
						<input
							type="number"
							id="duration"
							name="duration"
							value={course.duration || 0}
							class="w-full rounded-2xl border-none bg-slate-100 py-3.5 pl-4 pr-10 text-sm font-black transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						/>
					</div>
				</div>
				<div class="space-y-2">
					<label for="price" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Joriy Narx</label>
					<div class="relative">
						<input
							type="text"
							id="price"
							name="price"
							value={course.price || ''}
							placeholder="0.00"
							class="w-full rounded-2xl border-none bg-slate-100 py-3.5 pl-4 pr-10 text-sm font-black transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						/>
					</div>
				</div>
				<div class="space-y-2">
					<label for="old_price" class="ml-1 text-[11px] font-black tracking-widest text-slate-400 uppercase">Eski Narx</label>
					<div class="relative">
						<input
							type="text"
							id="old_price"
							name="old_price"
							value={course.old_price || ''}
							placeholder="0.00"
							class="w-full rounded-2xl border-none bg-slate-100 py-3.5 pl-4 pr-10 text-sm font-black transition-all focus:bg-white focus:ring-4 focus:ring-rose-50"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Sticky bottom bar for mobile/desktop -->
		<div class="sticky bottom-4 z-10 sm:static">
			<button
				type="submit"
				disabled={isSaving}
				class="group flex w-full items-center justify-center gap-3 rounded-[32px] bg-[#ed4b72] py-5 text-lg font-black text-white shadow-2xl shadow-rose-500/30 transition-all hover:bg-[#d93a5f] hover:shadow-rose-500/40 active:scale-[0.98] disabled:opacity-50"
			>
				{#if isSaving}
					<div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
					<span>Saqlanmoqda...</span>
				{:else}
					<Save size={20} />
					<span>O'zgarishlarni saqlash</span>
				{/if}
			</button>
		</div>
	</form>
{/snippet}

<style>
	@reference "tailwindcss";

	:global(body) {
		background-color: #f8fafc;
	}

	/* Grayscale-30 like filter but more premium */
	:global(.grayscale-30) {
		filter: grayscale(0.3) contrast(0.9);
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
