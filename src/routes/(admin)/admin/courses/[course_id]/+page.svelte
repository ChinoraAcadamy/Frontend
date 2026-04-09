<!-- src/routes/dashboard/admin/courses/[id]/+page.svelte -->
<script>
	import { Plus, BookPlus, AlertTriangle, Trash2, Edit, FileText } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import CourseDetailView from '@/lib/components/ui/courses/CourseDetailView.svelte';
	import ModuleEditModal from '@/lib/components/ui/admin/ModuleEditModal.svelte';

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

<CourseDetailView course={data.course} modules={data.modules}>
	{#snippet adminModuleActions(mod)}
		{#if isAdmin}
			<button onclick={(e) => { e.stopPropagation(); openModuleEdit(mod); }} class="rounded p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-500">
				<Edit size={18} />
			</button>
			<form method="POST" action="?/deleteModule" use:enhance={handleDelete("Rostdan ham bu modulni o'chirmoqchimisiz?")} onsubmit={(e) => e.stopPropagation()}>
				<input type="hidden" name="module_id" value={mod.id}>
				<button type="submit" class="rounded p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500">
					<Trash2 size={18} />
				</button>
			</form>
		{/if}
	{/snippet}

	{#snippet adminLessonActions(lesson, mod)}
		{#if isAdmin}
			<a href={`/admin/courses/${$page.params.course_id}/lesson/${lesson.id}/assignments/create?module_id=${mod.id}`} class="rounded p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500" onclick={(e) => e.stopPropagation()} title="Topshiriq qo'shish">
				<FileText size={18} />
			</a>
			<a href={`/admin/courses/${$page.params.course_id}/lesson/${lesson.id}/edit`} class="rounded p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-500" onclick={(e) => e.stopPropagation()} title="Darsni tahrirlash">
				<Edit size={18} />
			</a>
			<form method="POST" action="?/deleteLesson" use:enhance={handleDelete("Rostdan ham bu darsni o'chirmoqchimisiz?")} onsubmit={(e) => e.stopPropagation()}>
				<input type="hidden" name="module_id" value={mod.id}>
				<input type="hidden" name="lesson_id" value={lesson.id}>
				<button type="submit" class="rounded p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500">
					<Trash2 size={18} />
				</button>
			</form>
		{/if}
	{/snippet}

	{#snippet adminHeaderActions()}
		{#if isAdmin}
			<div class="flex flex-wrap gap-3">
				<a
					href={`/admin/courses/create/${$page.params.course_id}`}
					class="flex items-center gap-2 rounded-2xl bg-[#ed4b72] px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-[#d93a5f]"
				>
					<Plus size={18} />
					Yangi modul qo‘shish
				</a>
				{#if checkNotEmptyModule !== 0}
					<a
						href={`/admin/courses/create/${$page.params.course_id}/lesson`}
						class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 shadow-sm transition-all hover:border-[#ed4b72] hover:text-[#ed4b72]"
					>
						<BookPlus size={18} />
						Yangi dars qo'shish
					</a>
				{/if}
			</div>
		{/if}
	{/snippet}

	{#snippet adminFooterActions()}
		{#if isAdmin}
			<div class="mt-12 rounded-3xl border border-dashed border-red-200 bg-red-50 p-6 sm:p-8">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 class="flex items-center gap-2 text-lg font-bold text-red-700">
							<AlertTriangle size={20} /> Danger Zone (Xavfli hudud)
						</h3>
						<p class="mt-1 text-sm text-red-600/80">
							Diqqat: Kursni o'chirish barcha modullar, darslar va o'quvchilar natijalarini butunlay yo'q qiladi.
						</p>
					</div>
					
					<form method="POST" action="?/deleteCourse" use:enhance={handleDelete("Rostdan ham bu kursni butunlay o'chirmoqchimisiz? Bu amalni ortga qaytarib o'lmaydi.")}>
						<button
							type="submit"
							disabled={isDeleting}
							class="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50 sm:w-auto"
						>
							<Trash2 size={18} />
							{isDeleting ? "O'chirilmoqda..." : "Kursni o'chirish"}
						</button>
					</form>
				</div>
			</div>
		{/if}
	{/snippet}
</CourseDetailView>
