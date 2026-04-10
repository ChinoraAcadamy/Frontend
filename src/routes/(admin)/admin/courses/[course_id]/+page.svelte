<!-- src/routes/dashboard/admin/courses/[id]/+page.svelte -->
<script>
	import { Plus, BookPlus, AlertTriangle, Trash2, Edit, FileText, Play } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminCourseDetailView from '@/lib/components/ui/admin/AdminCourseDetailView.svelte';
	import ModuleEditModal from '@/lib/components/ui/admin/ModuleEditModal.svelte';
	import ActionMenu from '@/lib/components/ui/admin/ActionMenu.svelte';

	const { data } = $props();

	// Admin tekshiruvi
	const isAdmin = $derived(data.user?.role === 'admin');
	const checkNotEmptyModule = $derived(data.modules.length);

	let isDeleting = $state(false);

	let isEditModuleModalOpen = $state(false);
	let editModuleTarget = $state(null);

	function openModuleEdit(mod) {
		editModuleTarget = { pk: mod.id, title_uz: mod.title, title_ru: mod.title, description_uz: mod.description_uz || '', description_ru: mod.description_ru || '', order_index: mod.order || 1 };
		isEditModuleModalOpen = true;
	}

    // O'chirish formasi yuborilishidan oldin tasdiq so'rash
    function handleDelete(msg) {
        return async ({ cancel }) => {
            const confirmed = confirm(msg || "Davom etishni xohlaysizmi?");
            
            if (!confirmed) {
                cancel(); // Formani yuborishni to'xtatish
                return;
            }

            isDeleting = true;

            return async ({ update, result }) => {
                isDeleting = false;
                if (result.type === 'failure') {
                    alert(result.data?.error || "Xatolik yuz berdi");
                }
                await update();
            };
        };
    }
</script>

<ModuleEditModal bind:isOpen={isEditModuleModalOpen} moduleTarget={editModuleTarget} coursePk={$page.params.course_id} />

<AdminCourseDetailView course={data.course} modules={data.modules}>
	{#snippet adminModuleActions(mod)}
		{#if isAdmin}
            <ActionMenu label="Modul amallari">
                {@render renderModuleEditAction(mod)}
                {@render renderModuleDeleteAction(mod)}
            </ActionMenu>
		{/if}
	{/snippet}

	{#snippet adminLessonActions(lesson, mod)}
		{#if isAdmin}
            <ActionMenu label="Dars amallari">
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
					class="flex h-10 items-center gap-2 rounded-xl bg-[#ed4b72] px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#d93a5f] active:scale-95"
				>
					<Plus size={18} strokeWidth={3} />
					<span class="hidden sm:inline">Modul</span>
				</a>
				{#if checkNotEmptyModule !== 0}
					<a
						href={resolve(`/admin/courses/create/${$page.params.course_id}/lesson`)}
						class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-[#ed4b72] hover:text-[#ed4b72] active:scale-95"
					>
						<BookPlus size={18} />
						<span class="hidden sm:inline">Dars</span>
					</a>
				{/if}
			</div>
		{/if}
	{/snippet}

	{#snippet adminFooterActions()}
		{#if isAdmin}
			<div class="mt-4 overflow-hidden rounded-[32px] border border-red-100 bg-white shadow-sm">
                <div class="bg-red-50/50 p-6 border-b border-red-50">
                    <h3 class="flex items-center gap-2 text-lg font-black text-red-700">
                        <AlertTriangle size={22} /> Danger Zone
                    </h3>
                    <p class="mt-2 text-sm font-medium text-red-600/70">
                        Kursni o'chirish barcha ma'lumotlarni (modullar, darslar, natijalar) butunlay yo'q qiladi. Bu amalni ortga qaytarib bo'lmaydi.
                    </p>
                </div>
				
				<div class="p-6">
					<form method="POST" action="?/deleteCourse" use:enhance={handleDelete("Rostdan ham bu kursni butunlay o'chirmoqchimisiz?")}>
						<button
							type="submit"
							disabled={isDeleting}
							class="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 text-base font-bold text-white shadow-lg shadow-red-200/50 transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50"
						>
							<Trash2 size={20} />
							{isDeleting ? "O'chirilmoqda..." : "Kursni butunlay o'chirish"}
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
        <span>Tahrirlash</span>
    </button>
{/snippet}

{#snippet renderModuleDeleteAction(mod)}
    <form method="POST" action="?/deleteModule" use:enhance={handleDelete("Modulni o'chirish?")} class="w-full lg:w-auto">
        <input type="hidden" name="module_id" value={mod.id}>
        <button type="submit" class="action-menu-item">
            <Trash2 size={18} />
            <span>O'chirish</span>
        </button>
    </form>
{/snippet}


{#snippet renderLessonViewAction(lesson, mod)}
    <a href={resolve(`/kurslarim/${$page.params.course_id}/lessons/${lesson.id}?module_id=${mod.id}`)} class="action-menu-item">
        <Play size={18} />
        <span>Ko'rish</span>
    </a>
{/snippet}

{#snippet renderLessonAssignmentAction(lesson, mod)}
    <a href={resolve(`/admin/courses/${$page.params.course_id}/lesson/${lesson.id}/assignments/create?module_id=${mod.id}`)} class="action-menu-item">
        <FileText size={18} />
        <span>Topshiriq</span>
    </a>
{/snippet}

{#snippet renderLessonEditAction(lesson, mod)}
    <a href={resolve(`/admin/courses/${$page.params.course_id}/lesson/${lesson.id}/edit?module_id=${mod.id}`)} class="action-menu-item">
        <Edit size={18} />
        <span>Tahrirlash</span>
    </a>
{/snippet}

{#snippet renderLessonDeleteAction(lesson, mod)}
    <form method="POST" action="?/deleteLesson" use:enhance={handleDelete("Darsni o'chirish?")} class="w-full lg:w-auto">
        <input type="hidden" name="module_id" value={mod.id}>
        <input type="hidden" name="lesson_id" value={lesson.id}>
        <button type="submit" class="action-menu-item">
            <Trash2 size={18} />
            <span>O'chirish</span>
        </button>
    </form>
{/snippet}
