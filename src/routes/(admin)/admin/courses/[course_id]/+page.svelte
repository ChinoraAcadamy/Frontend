<!-- src/routes/dashboard/admin/courses/[id]/+page.svelte -->
<script>
	import { Plus, BookPlus, AlertTriangle, Trash2, Edit, FileText, Play } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminCourseDetailView from '$lib/components/admin/AdminCourseDetailView.svelte';
	import ModuleEditModal from '$lib/components/admin/ModuleEditModal.svelte';
	import ActionMenu from '$lib/components/admin/ActionMenu.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	// Admin tekshiruvi
	const isAdmin = $derived(data.user?.role === 'admin');
	const checkNotEmptyModule = $derived(data.modules?.length ?? 0);

	let isDeleting = $state(false);

	let isEditModuleModalOpen = $state(false);
	let editModuleTarget = $state(null);

	function openModuleEdit(mod) {
		console.log(mod);
		editModuleTarget = {
			pk: mod.id,
			title_uz: mod.title_uz || '',
			title_ru: mod.title_ru || '',
			description_uz: mod.description_uz || '',
			description_ru: mod.description_ru || '',
			order_index: mod.order_index ?? mod.order ?? 1
		};
		isEditModuleModalOpen = true;
	}

	let isDeleteModalOpen = $state(false);
	let deleteTarget = $state({ type: '', id: null, title: '', moduleId: null });

	function confirmDelete(type, id, title, moduleId = null) {
		deleteTarget = { type, id, title, moduleId };
		isDeleteModalOpen = true;
	}
</script>

<ModuleEditModal
	bind:isOpen={isEditModuleModalOpen}
	moduleTarget={editModuleTarget}
	coursePk={$page.params.course_id}
/>

<Modal
	isOpen={isDeleteModalOpen}
	onClose={() => (isDeleteModalOpen = false)}
	title={m.admin_danger_zone_delete_btn ? m.admin_danger_zone_delete_btn() : 'Tasdiqlash'}
	maxWidth="440px"
>
	<div class="flex flex-col items-center p-2 text-center">
		<div
			class="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-red-100 text-red-600"
		>
			<AlertTriangle size={32} />
		</div>

		<h3 class="mb-2 text-xl font-extrabold text-foreground">Ishonchingiz komilmi?</h3>

		<p class="text-muted-foreground mb-6 text-sm leading-relaxed">
			{#if deleteTarget.type === 'module'}
				Modul <strong>"{deleteTarget.title}"</strong> va uning barcha darslari butunlay o'chib ketadi.
			{:else if deleteTarget.type === 'lesson'}
				Dars <strong>"{deleteTarget.title}"</strong> butunlay o'chib ketadi.
			{:else}
				Kurs <strong>"{deleteTarget.title}"</strong> butunlay o'chib ketadi.
			{/if}
			<br />
			<span class="mt-1 block font-semibold text-red-500">Bu amalni ortga qaytarib bo'lmaydi!</span>
		</p>

		<form
			method="POST"
			action={deleteTarget.type === 'module'
				? '?/deleteModule'
				: deleteTarget.type === 'lesson'
					? '?/deleteLesson'
					: '?/deleteCourse'}
			use:enhance={() => {
				isDeleting = true;
				return async ({ result, update }) => {
					isDeleting = false;
					isDeleteModalOpen = false;
					if (result.type === 'failure') {
						alert(result.data?.error || m.error_occurred());
					}
					await update();
				};
			}}
			class="flex w-full gap-3"
		>
			{#if deleteTarget.type === 'module'}
				<input type="hidden" name="module_id" value={deleteTarget.id} />
			{:else if deleteTarget.type === 'lesson'}
				<input type="hidden" name="module_id" value={deleteTarget.moduleId} />
				<input type="hidden" name="lesson_id" value={deleteTarget.id} />
			{/if}

			<button
				type="button"
				class="flex-1 rounded-xl border border-border bg-surface px-4 py-3 font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
				onclick={() => (isDeleteModalOpen = false)}
				disabled={isDeleting}
			>
				Yo'q, Bekor qilish
			</button>
			<button
				type="submit"
				class="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white shadow-md shadow-red-600/10 transition-all hover:bg-red-700 active:scale-[0.98]"
				disabled={isDeleting}
			>
				{isDeleting ? "O'chirilmoqda..." : "Ha, O'chirish"}
			</button>
		</form>
	</div>
</Modal>

<AdminCourseDetailView course={data.course} modules={data.modules}>
	{#snippet adminModuleActions(mod)}
		{#if isAdmin}
			<ActionMenu label={m.admin_module_actions()}>
				{@render renderModuleEditAction(mod)}
				{@render renderModuleDeleteAction(mod)}
			</ActionMenu>
		{/if}
	{/snippet}

	{#snippet adminLessonActions(lesson, mod)}
		{#if isAdmin}
			<ActionMenu label={m.admin_lesson_actions()}>
				{@render renderLessonViewAction(lesson, mod)}
				{@render renderLessonAssignmentAction(lesson, mod)}
				{@render renderLessonEditAction(lesson, mod)}
				{@render renderLessonDeleteAction(lesson, mod)}
			</ActionMenu>
		{/if}
	{/snippet}

	{#snippet adminHeaderActions()}
		{#if isAdmin}
			<div class="flex items-center gap-2">
				<a
					href={resolve(`/admin/courses/create/${$page.params.course_id}`)}
					title={m.admin_add_module()}
					class="hover:bg-primary-hover flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition-all active:scale-95"
				>
					<Plus size={18} strokeWidth={3} />
					<span class="sm:inline">{m.admin_module_label()}</span>
				</a>
				{#if checkNotEmptyModule !== 0}
					<a
						href={resolve(`/admin/courses/create/${$page.params.course_id}/lesson`)}
						title={m.admin_add_lesson()}
						class="flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-bold text-foreground shadow-sm transition-all hover:border-primary hover:text-primary active:scale-95"
					>
						<BookPlus size={18} />
						<span class="sm:inline">{m.admin_lesson_label()}</span>
					</a>
				{/if}
			</div>
		{/if}
	{/snippet}

	{#snippet adminFooterActions()}
		{#if isAdmin}
			<div
				class="mt-4 overflow-hidden rounded-[32px] border border-red-500/20 bg-surface shadow-sm"
			>
				<div class="border-b border-red-500/10 bg-red-500/5 p-6">
					<h3 class="flex items-center gap-2 text-lg font-black text-red-500">
						<AlertTriangle size={22} />
						{m.admin_danger_zone_title()}
					</h3>
					<p class="mt-2 text-sm font-medium text-red-500/70">
						{m.admin_danger_zone_description()}
					</p>
				</div>

				<div class="p-6">
					<button
						type="button"
						onclick={() => confirmDelete('course', data.course.id, data.course.title)}
						disabled={isDeleting}
						class="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 text-base font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-[0.98] disabled:opacity-50"
					>
						<Trash2 size={20} />
						{isDeleting ? m.admin_danger_zone_deleting() : m.admin_danger_zone_delete_btn()}
					</button>
				</div>
			</div>
		{/if}
	{/snippet}
</AdminCourseDetailView>

<!-- Inline action snippets for cleaner code -->
{#snippet renderModuleEditAction(mod)}
	<button onclick={() => openModuleEdit(mod)} class="action-menu-item">
		<Edit size={18} />
		<span>{m.admin_courses_edit()}</span>
	</button>
{/snippet}

{#snippet renderModuleDeleteAction(mod)}
	<button
		type="button"
		onclick={() => confirmDelete('module', mod.id, mod.title)}
		class="action-menu-item w-full text-left lg:w-auto"
	>
		<Trash2 size={18} />
		<span>{m.admin_students_delete ? m.admin_students_delete() : "O'chirish"}</span>
	</button>
{/snippet}

{#snippet renderLessonViewAction(lesson, mod)}
	<a
		href={resolve(
			`/${isAdmin ? 'admin/courses' : 'kurslarim'}/${$page.params.course_id}/lesson/${lesson.id}?module_id=${mod.id}`
		)}
		class="action-menu-item"
	>
		<Play size={18} />
		<span>{m.admin_courses_preview()}</span>
	</a>
{/snippet}

{#snippet renderLessonAssignmentAction(lesson, mod)}
	<a
		href={resolve(
			`/admin/courses/${$page.params.course_id}/lesson/${lesson.id}/assignments/create?module_id=${mod.id}`
		)}
		class="action-menu-item"
	>
		<FileText size={18} />
		<span>{m.admin_assignment_label()}</span>
	</a>
{/snippet}

{#snippet renderLessonEditAction(lesson, mod)}
	<a
		href={resolve(
			`/admin/courses/${$page.params.course_id}/lesson/${lesson.id}/edit?module_id=${mod.id}`
		)}
		class="action-menu-item"
	>
		<Edit size={18} />
		<span>{m.admin_courses_edit()}</span>
	</a>
{/snippet}

{#snippet renderLessonDeleteAction(lesson, mod)}
	<button
		type="button"
		onclick={() => confirmDelete('lesson', lesson.id, lesson.title, mod.id)}
		class="action-menu-item w-full text-left lg:w-auto"
	>
		<Trash2 size={18} />
		<span>{m.admin_students_delete ? m.admin_students_delete() : "O'chirish"}</span>
	</button>
{/snippet}
