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
		UploadCloud
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { fade, slide } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

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
	let imgPreview = $state(course?.img || null);

	function handleImageChange(e) {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			imgPreview = URL.createObjectURL(file);
		}
	}

	const onUpdateCourse = () => {
		isSaving = true;
		return async ({ result, update }) => {
			isSaving = false;
			if (result.type === 'success') {
				toast.success(
					m.msg_course_updated ? m.msg_course_updated() : 'Kurs muvaffaqiyatli yangilandi'
				);
			} else if (result.type === 'failure') {
				toast.error(result.data?.error || m.error_occurred());
			}

			await update();
		};
	};

	$effect(() => {
		isPublished = course.is_published;
	});

	// Handle initial tab from sessionStorage (to support "Edit" vs "Preview" without URL params)
	$effect(() => {
		const storedTab = sessionStorage.getItem('admin_course_detail_tab');
		if (
			storedTab &&
			(storedTab === 'content' || storedTab === 'students' || storedTab === 'settings')
		) {
			activeTab = storedTab;
			sessionStorage.removeItem('admin_course_detail_tab');
		}
	});
</script>

<div class="min-h-screen bg-background pb-20 font-sans lg:pb-10">
	<!-- Sticky Glass Header -->
	<header
		class="sticky top-0 z-40 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<div class="flex items-center gap-2 sm:gap-4">
				<a
					href={resolve('/admin/courses')}
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted/10 text-muted transition-colors hover:bg-muted/20"
				>
					<ChevronLeft size={20} />
				</a>
				<div class="min-w-0 flex-1">
					<h1 class="line-clamp-1 text-base font-bold text-foreground sm:text-xl">
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
				class="col-span-1 flex items-center gap-4 overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-sm sm:col-span-2"
			>
				<div
					class="relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl bg-muted/10 shadow-inner"
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
							class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-500 uppercase ring-1 ring-emerald-500/20 ring-inset"
						>
							{course.is_published
								? m.admin_courses_status_published()
								: m.admin_courses_status_draft()}
						</span>
						<span class="text-xs font-medium text-muted"
							>• {m.date_created_at({ date: new Date().toLocaleDateString() })}</span
						>
					</div>
					<h2 class="line-clamp-1 text-lg font-extrabold text-foreground">{course.title}</h2>
					<p class="mt-1 line-clamp-2 text-xs text-muted">{course.description}</p>
				</div>
			</div>

			<!-- Quick Stats -->
			<div
				class="flex items-center gap-4 rounded-3xl border border-border bg-surface p-5 shadow-sm"
			>
				<div
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
				>
					<Layout size={24} />
				</div>
				<div>
					<p class="text-xs font-bold tracking-tight text-muted uppercase">
						{m.admin_courses_modules()}
					</p>
					<p class="text-2xl font-black text-foreground">{modules.length}</p>
				</div>
			</div>

			<div
				class="flex items-center gap-4 rounded-3xl border border-border bg-surface p-5 shadow-sm"
			>
				<div
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/10 text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary"
				>
					<ListChecks size={24} />
				</div>
				<div>
					<p class="text-xs font-bold tracking-tight text-muted uppercase">
						{m.lessons_label()}
					</p>
					<p class="text-2xl font-black text-foreground">{course.lessons_count || 0}</p>
				</div>
			</div>
		</div>

		<!-- Content Tabs (App-like navigation) -->
		<div
			class="scrollbar-hide mb-6 flex w-full overflow-x-auto rounded-2xl bg-muted/10 p-1 sm:w-fit"
		>
			<div class="flex min-w-full gap-1 sm:min-w-0">
				<button
					onclick={() => (activeTab = 'content')}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-6 {activeTab ===
					'content'
						? 'bg-surface text-primary shadow-sm'
						: 'text-muted hover:text-foreground'}"
				>
					<Layout size={18} />
					{m.tab_structure()}
				</button>
				<button
					onclick={() => (activeTab = 'students')}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-6 {activeTab ===
					'students'
						? 'bg-surface text-primary shadow-sm'
						: 'text-muted hover:text-foreground'}"
				>
					<Users size={18} />
					{m.tab_students()}
				</button>
				<button
					onclick={() => (activeTab = 'settings')}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-6 {activeTab ===
					'settings'
						? 'bg-surface text-primary shadow-sm'
						: 'text-muted hover:text-foreground'}"
				>
					<Settings size={18} />
					{m.tab_settings()}
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
					<div class="mt-8 border-t border-border pt-4">
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
				class="rounded-[32px] border border-border bg-surface shadow-sm transition-all hover:shadow-md"
			>
				<!-- Module Header -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="flex cursor-pointer items-center justify-between border-b border-border p-5 transition-colors sm:p-6"
					onclick={() => toggleModule(mod.id)}
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface font-black text-muted shadow-sm ring-1 ring-border transition-all duration-300 {isExpanded(
								mod.id
							)
								? 'rotate-180 ring-primary/20'
								: 'rotate-0'}"
						>
							<ChevronDown
								size={20}
								class="transition-colors {isExpanded(mod.id) ? 'text-primary' : 'text-muted'}"
							/>
						</div>
						<div>
							<h3
								class="text-lg leading-tight font-black text-foreground transition-colors sm:text-xl {isExpanded(
									mod.id
								)
									? 'text-primary'
									: ''}"
							>
								{mod.title}
							</h3>
							<p class="mt-0.5 text-[10px] font-bold tracking-wider text-muted uppercase">
								{m.text_lessons_count({ count: mod.lessons?.length || 0 })} • {m.label_modul()}
								{mod.order || ''}
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
					<div transition:slide={{ duration: 300 }} class="border-t border-border p-3 sm:p-4">
						{#if mod.lessons && mod.lessons.length > 0}
							<div class="flex flex-col gap-2">
								{#each mod.lessons as lesson (lesson.id)}
									<div
										class="group relative flex items-center justify-between rounded-2xl border border-transparent p-3 transition-all hover:border-border hover:bg-muted/5"
									>
										<div class="flex items-center gap-4">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/10 text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary"
											>
												<BarChart3 size={20} />
											</div>
											<div>
												<h4 class="line-clamp-1 text-sm font-bold text-foreground sm:text-base">
													{lesson.title}
												</h4>
												<span class="text-xs font-semibold text-muted capitalize"
													>{lesson.duration || 0} {m.min_label()} • {m.text_video_lesson()}</span
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
								class="flex flex-col items-center justify-center py-8 text-center text-muted italic"
							>
								<p class="text-sm">{m.text_no_lessons()}</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}

		{#if modules.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-border bg-surface p-20 text-center text-muted"
			>
				<Layout size={48} class="mb-4 opacity-20" />
				<p class="text-lg font-bold text-foreground">{m.text_no_modules()}</p>
				<p class="text-sm">{m.text_add_module_hint()}</p>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet studentsTab()}
	<div class="flex flex-col gap-6">
		<!-- Search & Header -->
		<div
			class="relative flex flex-col gap-4 overflow-hidden rounded-[32px] border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="relative flex-1">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted"
				>
					<Search size={18} strokeWidth={2.5} />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder={m.placeholder_student_search()}
					class="w-full rounded-2xl border-none bg-muted/10 py-3.5 pr-4 pl-11 text-sm font-bold text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
				/>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-xs font-black tracking-widest text-muted uppercase">
					{m.label_total()}
				</span>
				<div class="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-black text-primary">
					{course.students?.length || 0}
				</div>
			</div>
		</div>

		<!-- Students Table -->
		{#if filteredStudents().length > 0}
			<div class="overflow-hidden rounded-[32px] border border-border bg-surface shadow-sm">
				<div class="scrollbar-hide overflow-x-auto">
					<table class="w-full min-w-[600px] border-collapse text-left">
						<thead>
							<tr class="border-b border-border bg-muted/5">
								<th class="px-6 py-4 text-[10px] font-black tracking-widest text-muted uppercase"
									>#</th
								>
								<th class="px-6 py-4 text-[10px] font-black tracking-widest text-muted uppercase"
									>{m.label_student()}</th
								>
								<th class="px-6 py-4 text-[10px] font-black tracking-widest text-muted uppercase"
									>{m.admin_students_col_phone()}</th
								>
								<th
									class="px-6 py-4 text-right text-[10px] font-black tracking-widest text-muted uppercase"
									>{m.admin_students_col_actions()}</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-border">
							{#each filteredStudents() as student, i (student.id)}
								<tr class="group transition-colors hover:bg-muted/5">
									<td class="px-6 py-4 text-xs font-bold text-muted">{i + 1}</td>
									<td class="px-6 py-4">
										<a
											href={resolve(`/admin/students/${student.id}`)}
											class="flex max-w-fit items-center gap-3 transition-transform hover:translate-x-1"
										>
											<div
												class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black shadow-sm ring-4 ring-surface transition-all group-hover:ring-primary/10 {getAvatarColor(
													student.id
												)}"
											>
												{getInitials(student)}
											</div>
											<div class="flex flex-col">
												<span
													class="text-sm font-extrabold text-foreground transition-colors group-hover:text-primary"
												>
													{student.first_name}
													{student.last_name}
												</span>
												<span class="text-[11px] font-bold text-muted">@{student.username}</span>
											</div>
										</a>
									</td>
									<td class="px-6 py-4 font-mono text-sm font-bold text-foreground opacity-80">
										{student.phone_number}
									</td>
									<td class="px-6 py-4 text-right">
										<div class="flex justify-end gap-2">
											<a
												href="tel:{student.phone_number}"
												class="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/10 text-muted transition-all hover:bg-emerald-500/10 hover:text-emerald-500"
											>
												<Phone size={16} />
											</a>
											<button
												class="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/10 text-muted transition-all hover:bg-muted/20 hover:text-foreground"
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
				class="flex flex-col items-center justify-center rounded-[40px] border border-border bg-surface py-20 text-center"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/10 text-muted"
				>
					<Search size={32} />
				</div>
				<p class="text-lg font-bold text-foreground">
					{m.msg_no_students_found()}
				</p>
				<p class="text-sm text-muted">
					{m.msg_no_students_found_desc({ query: searchQuery })}
				</p>
			</div>
		{:else}
			<div
				class="flex flex-col items-center justify-center rounded-[40px] border border-border bg-surface py-20 text-center"
			>
				<div
					class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/10 text-muted"
				>
					<Users size={40} />
				</div>
				<h3 class="text-lg font-bold text-foreground">
					{m.msg_students_list_empty()}
				</h3>
				<p class="mt-1 text-sm text-muted">
					{m.msg_students_list_empty_desc()}
				</p>
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
		enctype="multipart/form-data"
	>
		<!-- Section: Course Image -->
		<div class="rounded-[32px] border border-border bg-surface p-6 shadow-sm">
			<div class="mb-5 flex items-center justify-between border-b border-border pb-4">
				<div class="flex flex-col">
					<h3 class="text-[16px] font-black tracking-tight text-foreground">
						{m.label_course_image()}
					</h3>
					<p class="text-[11px] font-bold tracking-widest text-muted uppercase">
						{m.text_recommended_size()}
					</p>
				</div>
			</div>

			<div
				class="group relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-border bg-muted/5 transition-colors hover:border-primary/50 hover:bg-primary/5"
			>
				<input
					type="file"
					id="img"
					name="img"
					accept="image/*"
					class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
					onchange={handleImageChange}
				/>

				{#if imgPreview}
					<img
						src={imgPreview}
						alt="Preview"
						class="absolute inset-0 z-0 h-full w-full object-cover"
					/>
					<div
						class="absolute inset-0 z-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<span
							class="rounded-full bg-surface/95 px-5 py-2.5 text-sm font-bold text-foreground shadow-xl transition-transform hover:scale-105"
							>{m.btn_change_image()}</span
						>
					</div>
				{:else}
					<div class="pointer-events-none flex flex-col items-center p-6 text-center text-muted">
						<div
							class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface shadow-sm ring-1 ring-border transition-all group-hover:ring-primary/20"
						>
							<UploadCloud
								size={32}
								class="text-muted transition-colors group-hover:text-primary"
							/>
						</div>
						<span class="text-[15px] font-bold text-foreground">{m.text_upload_image()}</span>
						<span class="mt-2 text-[11px] font-bold tracking-widest text-muted uppercase"
							>{m.text_file_types_hint()}</span
						>
					</div>
				{/if}
			</div>
		</div>

		<!-- Section: Status & Publishing -->
		<div
			class="relative overflow-hidden rounded-[32px] border border-border bg-surface p-6 shadow-sm"
		>
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-2xl {isPublished
							? 'bg-emerald-500/10 text-emerald-500'
							: 'bg-amber-500/10 text-amber-500'}"
					>
						<CheckCircle2 size={20} />
					</div>
					<div>
						<h3 class="text-sm font-black tracking-tight text-foreground">
							{m.label_course_status()}
						</h3>
						<p class="text-[11px] font-bold tracking-widest text-muted uppercase">
							{isPublished ? m.text_live_on_platform() : m.text_hidden_from_students()}
						</p>
					</div>
				</div>

				<button
					type="button"
					onclick={() => (isPublished = !isPublished)}
					class="relative h-7 w-12 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none {isPublished
						? 'bg-emerald-500'
						: 'bg-muted/20'}"
				>
					<div
						class="absolute top-1 left-1 h-5 w-5 transform rounded-full bg-surface transition-transform duration-300 {isPublished
							? 'translate-x-5'
							: 'translate-x-0'}"
					></div>
				</button>
				<input type="hidden" name="is_published" value={isPublished} />
			</div>
		</div>

		<!-- Section: Basic Information (UZ) -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div class="rounded-[32px] border border-border bg-surface p-6 shadow-sm">
				<div class="mb-5 flex items-center gap-3 border-b border-border pb-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"
					>
						<Globe size={20} />
					</div>
					<h3 class="text-[16px] font-black tracking-tight text-foreground">
						{m.label_lang_uz()}
					</h3>
				</div>
				<div class="space-y-5">
					<div class="space-y-2">
						<label
							for="title_uz"
							class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
							>{m.label_course_title_uz()}</label
						>
						<input
							type="text"
							id="title_uz"
							name="title_uz"
							value={course.title_uz || course.title}
							placeholder={m.placeholder_course_title_uz()}
							class="w-full rounded-2xl border-none bg-muted/10 px-4 py-3.5 text-sm font-bold text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
						/>
					</div>
					<div class="space-y-2">
						<label
							for="description_uz"
							class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
							>{m.label_course_desc_uz()}</label
						>
						<textarea
							id="description_uz"
							name="description_uz"
							rows="4"
							value={course.description_uz || course.description}
							placeholder={m.placeholder_lesson_desc_uz()}
							class="min-h-[120px] w-full rounded-2xl border-none bg-muted/10 p-4 text-sm font-bold text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
						></textarea>
					</div>
					<div class="space-y-2">
						<label
							for="level_uz"
							class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
							>{m.label_course_level_uz()}</label
						>
						<input
							type="text"
							id="level_uz"
							name="level_uz"
							value={course.level_uz || ''}
							placeholder={m.placeholder_course_level_uz()}
							class="w-full rounded-2xl border-none bg-muted/10 px-4 py-3.5 text-sm font-bold text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
						/>
					</div>
				</div>
			</div>

			<!-- Section: Basic Information (RU) -->
			<div class="rounded-[32px] border border-border bg-surface p-6 shadow-sm">
				<div class="mb-5 flex items-center gap-3 border-b border-border pb-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500"
					>
						<Globe size={20} />
					</div>
					<h3 class="text-[16px] font-black tracking-tight text-foreground">
						{m.label_lang_ru()}
					</h3>
				</div>
				<div class="space-y-5">
					<div class="space-y-2">
						<label
							for="title_ru"
							class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
							>{m.label_course_title_ru()}</label
						>
						<input
							type="text"
							id="title_ru"
							name="title_ru"
							value={course.title_ru || ''}
							placeholder={m.placeholder_course_title_ru()}
							class="w-full rounded-2xl border-none bg-muted/10 px-4 py-3.5 text-sm font-bold text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
						/>
					</div>
					<div class="space-y-2">
						<label
							for="description_ru"
							class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
							>{m.label_course_desc_ru()}</label
						>
						<textarea
							id="description_ru"
							name="description_ru"
							rows="4"
							value={course.description_ru || ''}
							placeholder={m.placeholder_lesson_desc_ru()}
							class="min-h-[120px] w-full rounded-2xl border-none bg-muted/10 p-4 text-sm font-bold text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
						></textarea>
					</div>
					<div class="space-y-2">
						<label
							for="level_ru"
							class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
							>{m.label_course_level_ru()}</label
						>
						<input
							type="text"
							id="level_ru"
							name="level_ru"
							value={course.level_ru || ''}
							placeholder={m.placeholder_course_level_ru()}
							class="w-full rounded-2xl border-none bg-muted/10 px-4 py-3.5 text-sm font-bold text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Section: Technical & Pricing -->
		<div class="rounded-[40px] border border-border bg-surface p-8 shadow-sm">
			<div class="mb-6 flex items-center gap-3">
				<div
					class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500"
				>
					<Tag size={22} />
				</div>
				<h3 class="text-lg font-black tracking-tight text-foreground">
					{m.section_technical_financial()}
				</h3>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="space-y-2">
					<label
						for="duration"
						class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
						>{m.label_duration_minutes()}</label
					>
					<div class="relative">
						<input
							type="number"
							id="duration"
							name="duration"
							value={course.duration || 0}
							class="w-full rounded-2xl border-none bg-muted/10 py-3.5 pr-10 pl-4 text-sm font-black text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
						/>
					</div>
				</div>
				<div class="space-y-2">
					<label
						for="price"
						class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
						>{m.label_current_price()}</label
					>
					<div class="relative">
						<input
							type="text"
							id="price"
							name="price"
							value={course.price || ''}
							placeholder="0.00"
							class="w-full rounded-2xl border-none bg-muted/10 py-3.5 pr-10 pl-4 text-sm font-black text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
						/>
					</div>
				</div>
				<div class="space-y-2">
					<label
						for="old_price"
						class="ml-1 text-[11px] font-black tracking-widest text-muted uppercase"
						>{m.label_old_price_settings()}</label
					>
					<div class="relative">
						<input
							type="text"
							id="old_price"
							name="old_price"
							value={course.old_price || ''}
							placeholder="0.00"
							class="w-full rounded-2xl border-none bg-muted/10 py-3.5 pr-10 pl-4 text-sm font-black text-foreground transition-all focus:bg-surface focus:ring-4 focus:ring-primary/5"
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
				class="group hover:bg-primary-hover flex w-full items-center justify-center gap-3 rounded-[32px] bg-primary py-5 text-lg font-black text-white shadow-2xl shadow-primary/30 transition-all hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-50"
			>
				{#if isSaving}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
					></div>
					<span>{m.profile_saving()}</span>
				{:else}
					<Save size={20} />
					<span>{m.profile_save_changes()}</span>
				{/if}
			</button>
		</div>
	</form>
{/snippet}

<style>
	@reference "tailwindcss";

	:global(body) {
		background-color: var(--bg-main);
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
