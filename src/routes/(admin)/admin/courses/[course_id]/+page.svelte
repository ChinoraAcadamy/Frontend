<!-- src/routes/dashboard/admin/courses/[id]/+page.svelte -->
<script>
	import { resolve } from '$app/paths';
	import { Plus, BookPlus, AlertTriangle, Trash2 } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import CourseDetailView from '@/lib/components/ui/courses/CourseDetailView.svelte';

	const { data } = $props();

	// Admin tekshiruvi
	const isAdmin = $derived(data.user?.role === 'admin');
	const checkNotEmptyModule = $derived(data.modules.length);

	let isDeleting = $state(false);

    // O'chirish formasi yuborilishidan oldin tasdiq so'rash
    function handleDelete() {
        return async ({ cancel }) => {
            const confirmed = confirm("Rostdan ham bu kursni butunlay o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.");
            
            if (!confirmed) {
                cancel(); // Formani yuborishni to'xtatish
                return;
            }

            isDeleting = true;

            return async ({ update, result }) => {
                isDeleting = false;
                if (result.type === 'failure') {
                    alert(result.data?.error || "O'chirishda xatolik yuz berdi");
                }
                // Success holatida server o'zi redirect qiladi
                await update();
            };
        };
    }
</script>

<CourseDetailView course={data.course} modules={data.modules}>
	{#snippet adminHeaderActions()}
		{#if isAdmin}
			<div class="flex gap-3">
				<a
					href={resolve(`/admin/courses/create/${$page.params.course_id}`)}
					class="flex items-center gap-2 rounded-2xl bg-[#ed4b72] px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-[#d93a5f]"
				>
					<Plus size={18} />
					Yangi modul qo‘shish
				</a>
				{#if checkNotEmptyModule !== 0}
					<a
						href={resolve(`/admin/courses/create/${$page.params.course_id}/lesson`)}
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
					
					<form method="POST" action="?/deleteCourse" use:enhance={handleDelete()}>
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
