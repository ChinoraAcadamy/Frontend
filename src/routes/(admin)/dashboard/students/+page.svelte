<script lang="ts">
    import { Search, Plus, Edit2, Trash2, CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-svelte';
    import { fly, fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import AddStudentModal from '@/lib/components/ui/admin/AddStudentModal.svelte';
    import EditStudentModal from '@/lib/components/ui/admin/EditStudentModal.svelte';

    let { data, form } = $props();

    // --- Modals ---
    let isAddModalOpen  = $state(false);
    let editTarget      = $state<any | null>(null);
    let deleteTarget    = $state<{ id: number; name: string } | null>(null);
    let isDeleting      = $state(false);

    // --- Toast ---
    let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);
    let toastTimer: ReturnType<typeof setTimeout>;

    function showToast(message: string, type: 'success' | 'error') {
        clearTimeout(toastTimer);
        toast = { message, type };
        toastTimer = setTimeout(() => (toast = null), 3500);
    }

    $effect(() => {
        if (form?.createSuccess) { showToast("Student muvaffaqiyatli yaratildi!", 'success'); isAddModalOpen = false; }
        if (form?.createError)   { showToast(form.createError, 'error'); }
        if (form?.updateSuccess) { showToast("Student ma'lumotlari yangilandi!", 'success'); editTarget = null; }
        if (form?.updateError)   { showToast(form.updateError, 'error'); }
        if (form?.deleteSuccess) { showToast("Student o'chirildi!", 'success'); deleteTarget = null; }
        if (form?.deleteError)   { showToast(form.deleteError, 'error'); deleteTarget = null; }
    });

    // --- Helpers ---
    const avatarColors = [
        'bg-pink-500 text-white', 'bg-indigo-500 text-white', 
        'bg-emerald-500 text-white', 'bg-amber-500 text-white', 
        'bg-cyan-500 text-white', 'bg-rose-500 text-white'
    ];
    const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];
    const getInitials = (s: any) => {
        const f = s.first_name?.[0] ?? '';
        const l = s.last_name?.[0]  ?? '';
        return (f + l).toUpperCase() || s.username?.[0]?.toUpperCase() || '?';
    };
    const getFullName = (s: any) =>
        [s.first_name, s.last_name].filter(Boolean).join(' ') || s.username;

    // --- Filters ---
    let searchValue  = $state(data.filters.search);
    let statusFilter = $state(data.filters.isActive);
    let searchTimer: ReturnType<typeof setTimeout>;

    function applyFilters(newPage = 1) {
        const params = new URLSearchParams($page.url.searchParams);
        searchValue  ? params.set('search',    searchValue)  : params.delete('search');
        statusFilter ? params.set('is_active', statusFilter) : params.delete('is_active');
        params.set('page', String(newPage));
        goto(`?${params}`, { keepFocus: true });
    }

    function onSearchInput(e: Event) {
        searchValue = (e.target as HTMLInputElement).value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => applyFilters(), 400);
    }

    function onStatusChange(e: Event) {
        statusFilter = (e.target as HTMLSelectElement).value;
        applyFilters();
    }
</script>

<div class="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans">
    <div class="max-w-7xl mx-auto">
        {#if toast}
            <div
                class="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl text-sm font-semibold backdrop-blur-md
                {toast.type === 'success' ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/50' : 'bg-rose-50/90 text-rose-700 border-rose-200/50'}"
                transition:fly={{ x: 50, duration: 400, opacity: 0 }}
            >
                <CheckCircle2 size={20} class={toast.type === 'success' ? 'text-emerald-500' : 'text-rose-500'} />
                {toast.message}
            </div>
        {/if}

        {#if deleteTarget}
            <div
                class="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                transition:fade={{ duration: 200 }}
                role="dialog" aria-modal="true"
            >
                <div class="bg-white rounded-[24px] w-full max-w-sm shadow-2xl p-6 border border-slate-100" transition:fly={{ y: 20, duration: 300 }}>
                    <div class="flex items-center justify-center w-14 h-14 bg-rose-50 rounded-full mb-5 mx-auto ring-4 ring-rose-50/50">
                        <AlertTriangle size={28} class="text-rose-500" />
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 text-center mb-2">Studentni o'chirish</h3>
                    <p class="text-slate-500 text-center text-sm leading-relaxed mb-8 px-2">
                        Haqiqatan ham <span class="font-bold text-slate-800">{deleteTarget.name}</span> ni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
                    </p>
                    <form
                        method="POST" action="?/deleteStudent"
                        use:enhance={() => {
                            isDeleting = true;
                            return async ({ update }) => { isDeleting = false; await update(); };
                        }}
                        class="flex gap-3"
                    >
                        <input type="hidden" name="studentId" value={deleteTarget.id} />
                        <button type="button" onclick={() => deleteTarget = null}
                            class="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95">
                            Bekor qilish
                        </button>
                        <button type="submit" disabled={isDeleting}
                            class="flex-1 py-3 rounded-xl font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-rose-500/30">
                            {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
                        </button>
                    </form>
                </div>
            </div>
        {/if}

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">STUDENTLAR</h1>
                <p class="text-sm font-medium text-slate-500 mt-1">Jami <span class="text-[#ed4b72]">{data.totalCount}</span> ta faol student ro'yxatda</p>
            </div>
            <button onclick={() => isAddModalOpen = true}
                class="group h-12 bg-slate-900 text-white px-6 rounded-2xl font-semibold flex items-center gap-2.5 transition-all hover:bg-[#ed4b72] hover:shadow-xl hover:shadow-[#ed4b72]/30 active:scale-95">
                <Plus size={20} strokeWidth={2.5} class="transition-transform group-hover:rotate-90" /> 
                Yangi qoshish
            </button>
        </div>

        <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="relative flex-1 md:max-w-md group">
                <Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#ed4b72]" />
                <input type="text" placeholder="Ism yoki username orqali qidirish..."
                    value={searchValue} oninput={onSearchInput}
                    class="w-full h-12 pl-11 pr-4 rounded-2xl border-2 border-transparent bg-white shadow-sm text-sm outline-none focus:border-[#ed4b72] focus:bg-white transition-all text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal"
                />
            </div>
            <select value={statusFilter} onchange={onStatusChange}
                class="h-12 px-4 rounded-2xl border-2 border-transparent bg-white shadow-sm text-sm font-medium outline-none focus:border-[#ed4b72] text-slate-700 cursor-pointer transition-all hover:bg-slate-50">
                <option value="">Barcha statuslar</option>
                <option value="true">Faollar (Active)</option>
                <option value="false">Nofaollar (Inactive)</option>
            </select>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left whitespace-nowrap min-w-[900px]">
                    <thead class="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Ism Familiya</th>
                            <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                            <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Telefon</th>
                            <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Kurslar</th>
                            <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                            <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amallar</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        {#if data.students.length === 0}
                            <tr>
                                <td colspan="7" class="py-20 text-center">
                                    <div class="flex flex-col items-center justify-center text-slate-400">
                                        <Search size={48} strokeWidth={1} class="mb-4 opacity-50" />
                                        <p class="text-base font-medium">{data.filters.search ? `"${data.filters.search}" bo'yicha hech narsa topilmadi` : "Hozircha studentlar kiritilmagan"}</p>
                                    </div>
                                </td>
                            </tr>
                        {:else}
                            {#each data.students as student (student.id)}
                                <tr class="hover:bg-slate-50/80 transition-colors group">
                                    <td class="py-4 px-6">
                                        <div class="flex items-center gap-4">
                                            <div class="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shadow-sm {getAvatarColor(student.id)}">
                                                {getInitials(student)}
                                            </div>
                                            <span class="font-bold text-slate-800 text-sm">{getFullName(student)}</span>
                                        </div>
                                    </td>
                                    <td class="py-4 px-6">
                                        <span class="text-sm font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">{student.username}</span>
                                    </td>
                                    <td class="py-4 px-6 text-sm font-medium text-slate-600">{student.phone_number || student.phone || '—'}</td>
                                    <td class="py-4 px-6">
                                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs border border-indigo-100">
                                            {student.courses_count ?? 0}
                                        </span>
                                    </td>
                                    <td class="py-4 px-6 text-sm font-black text-[#ed4b72]">{student.total_score ?? 0}</td>
                                    <td class="py-4 px-6">
                                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                                            {student.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}">
                                            <div class="w-1.5 h-1.5 rounded-full {student.is_active ? 'bg-emerald-500' : 'bg-rose-500'}"></div>
                                            {student.is_active ? 'Faol' : 'Nofaol'}
                                        </div>
                                    </td>
                                    <td class="py-4 px-6 text-right">
                                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {#if student.is_active}
                                                <button
                                                    onclick={() => editTarget = student}
                                                    class="p-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                                                    title="Tahrirlash"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onclick={() => deleteTarget = { id: student.id, name: getFullName(student) }}
                                                    class="p-2.5 bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-all shadow-sm"
                                                    title="O'chirish"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            {/if}
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>

            {#if data.totalCount > data.students.length || data.currentPage > 1}
                <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                    <span class="text-sm font-medium text-slate-500">
                        Sahifa <span class="font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm mx-1">{data.currentPage}</span>
                    </span>
                    <div class="flex items-center gap-2">
                        <button onclick={() => applyFilters(data.currentPage - 1)} disabled={!data.prevPage}
                            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 transition-all shadow-sm
                            {!data.prevPage ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#ed4b72] hover:text-[#ed4b72] active:scale-95'}">
                            <ChevronLeft size={16} /> Ortga
                        </button>
                        <button onclick={() => applyFilters(data.currentPage + 1)} disabled={!data.nextPage}
                            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 transition-all shadow-sm
                            {!data.nextPage ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#ed4b72] hover:text-[#ed4b72] active:scale-95'}">
                            Keyingi <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<AddStudentModal
    isOpen={isAddModalOpen}
    availableCourses={data.courses}
    onClose={() => isAddModalOpen = false}
/>

<EditStudentModal
    isOpen={editTarget !== null}
    student={editTarget}
    onClose={() => editTarget = null}
/>