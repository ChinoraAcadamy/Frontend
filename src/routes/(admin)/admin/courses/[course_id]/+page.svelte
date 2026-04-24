<!-- src/routes/dashboard/admin/courses/[id]/+page.svelte -->
<script>
	import { Plus, BookPlus, AlertTriangle, Trash2, Edit, FileText, Play } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminCourseDetailView from '@/lib/components/ui/admin/AdminCourseDetailView.svelte';
	import ModuleEditModal from '@/lib/components/ui/admin/ModuleEditModal.svelte';
	import ActionMenu from '@/lib/components/ui/admin/ActionMenu.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { data } = $props();

	// Admin tekshiruvi
	const isAdmin = $derived(data.user?.role === 'admin');
	const checkNotEmptyModule = $derived(data.modules.length);

	let isDeleting = $state(false);

	let isEditModuleModalOpen = $state(false);
	let editModuleTarget = $state(null);

	function openModuleEdit(mod) {
		editModuleTarget = {
			pk: mod.id,
			title_uz: mod.title,
			title_ru: mod.title,
			description_uz: mod.description_uz || '',
			description_ru: mod.description_ru || '',
			order_index: mod.order || 1
		};
		isEditModuleModalOpen = true;
	}

	// O'chirish formasi yuborilishidan oldin tasdiq so'rash
	function handleDelete(msg) {
		return async ({ cancel }) => {
			const confirmed = confirm(msg || m.admin_confirm_continue());

			if (!confirmed) {
				cancel(); // Formani yuborishni to'xtatish
				return;
			}

			isDeleting = true;

			return async ({ update, result }) => {
				isDeleting = false;
				if (result.type === 'failure') {
					alert(result.data?.error || m.error_occurred());
				}
				await update();
			};
		};
	}
</script>

<ModuleEditModal
	bind:isOpen={isEditModuleModalOpen}
	moduleTarget={editModuleTarget}
	coursePk={$page.params.course_id}
/>

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
					class="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
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
			<div class="mt-4 overflow-hidden rounded-[32px] border border-red-500/20 bg-surface shadow-sm">
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
					<form
						method="POST"
						action="?/deleteCourse"
						use:enhance={handleDelete(m.admin_danger_zone_confirm())}
					>
						<button
							type="submit"
							disabled={isDeleting}
							class="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 text-base font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-[0.98] disabled:opacity-50"
						>
							<Trash2 size={20} />
							{isDeleting ? m.admin_danger_zone_deleting() : m.admin_danger_zone_delete_btn()}
						</button>
					</form>
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
	<form
		method="POST"
		action="?/deleteModule"
		use:enhance={handleDelete(m.admin_module_delete_confirm())}
		class="w-full lg:w-auto"
	>
		<input type="hidden" name="module_id" value={mod.id} />
		<button type="submit" class="action-menu-item">
			<Trash2 size={18} />
			<span>{m.admin_students_delete()}</span>
		</button>
	</form>
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
	<form
		method="POST"
		action="?/deleteLesson"
		use:enhance={handleDelete(m.admin_lesson_delete_confirm())}
		class="w-full lg:w-auto"
	>
		<input type="hidden" name="module_id" value={mod.id} />
		<input type="hidden" name="lesson_id" value={lesson.id} />
		<button type="submit" class="action-menu-item">
			<Trash2 size={18} />
			<span>{m.admin_students_delete()}</span>
		</button>
	</form>
{/snippet}
