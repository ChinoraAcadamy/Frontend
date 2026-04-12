<script>
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/stores';
    import { FileDown, ChevronLeft, ChevronRight, BookOpen, User } from 'lucide-svelte';
    import { fly } from 'svelte/transition';

    let { 
        submissions = [], 
        totalCount = 0, 
        currentPage = 1, 
        nextPage = null, 
        prevPage = null, 
        filters = { status: 'all' },
        role = 'student',
        basePath = '/baholar' 
    } = $props();
    
    let activeTab = $derived(filters.status);

    const statusConfig = {
        pending:   { label: 'Kutilmoqda', bg: '#FFF8E6', text: '#D97706', border: '#FDE68A' },
        submitted: { label: 'Topshirildi', bg: '#FFF8E6', text: '#D97706', border: '#FDE68A' },
        graded:    { label: 'Baholandi',  bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
        rejected:  { label: 'Rad etildi', bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' },
    };

    function getStatus(status) {
        return statusConfig[status] ?? { label: status, bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function changeTab(newStatus) {
        const url = new URL($page.url);
        url.searchParams.set('status', newStatus);
        url.searchParams.set('page', '1');
        // @ts-ignore
        goto(resolve(`${basePath}?${url.searchParams}`), { keepFocus: true });
    }

    function goToPage(p) {
        const url = new URL($page.url);
        url.searchParams.set('page', String(p));
        // @ts-ignore
        goto(resolve(`${basePath}?${url.searchParams}`), { keepFocus: true });
    }

    const tabs = [
        { key: 'all',     label: 'Hammasi'    },
        { key: 'pending', label: 'Kutilmoqda' },
        { key: 'graded',  label: 'Baholandi'  },
    ];
</script>

<div class="mb-8">
    <div class="text-[11px] font-bold tracking-[2px] text-[#9b1c48] uppercase mb-1.5">
        SUBMISSIONS
    </div>
    <h1 class="text-[34px] max-md:text-[28px] font-extrabold text-[#1a0e13] tracking-tight leading-none mb-6">
        {role === 'admin' ? 'Barcha topshiriqlar' : 'Mening topshiriqlarim'}
    </h1>
    
    <div class="inline-flex max-md:flex max-md:w-full max-md:overflow-x-auto gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 no-scrollbar">
        {#each tabs as tab (tab.key)}
            <button
                class="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 max-md:flex-1 max-md:text-center max-md:whitespace-nowrap
                    {activeTab === tab.key 
                        ? 'bg-linear-to-br from-[#9b1c48] to-[#c43c66] text-white shadow-[0_4px_12px_rgba(155,28,72,0.25)]' 
                        : 'text-slate-500 bg-transparent hover:text-[#1a0e13] hover:bg-slate-100'}"
                onclick={() => changeTab(tab.key)}
            >
                {tab.label}
            </button>
        {/each}
    </div>
</div>

{#if submissions.length === 0}
    <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <BookOpen size={48} strokeWidth={1.5} />
        </div>
        <p class="text-slate-500 text-base font-medium">Hozircha topshiriqlar mavjud emas</p>
    </div>
{:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        {#each submissions as sub, i (sub.id)}
            <div
                class="bg-white border rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 flex flex-col justify-between min-h-35 relative overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1
                    {sub.feedback || sub.score != null 
                        ? 'bg-linear-to-br from-white to-[#fdf2f6] border-[#fce7f3]' 
                        : 'border-slate-100 hover:border-slate-200'}"
                transition:fly={{ y: 20, duration: 400, delay: Math.min(i * 40, 400) }}
            >
                {#if sub.feedback || sub.score != null}
                    <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#9b1c48] to-[#c43c66]"></div>
                    
                    <div class="flex flex-col h-full mt-1">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-sm font-bold text-slate-500 uppercase tracking-[1px]">Natija</span>
                            <div class="bg-white px-4 py-1 rounded-xl shadow-[0_2px_8px_rgba(155,28,72,0.1)] border border-[#fce7f3]">
                                <span class="text-2xl font-extrabold bg-linear-to-br from-[#9b1c48] to-[#c43c66] bg-clip-text text-transparent">
                                    {sub.score ?? 0}
                                </span>
                            </div>
                        </div>
                        
                        {#if role === 'admin'}
                            <div class="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700 bg-white/50 p-2 rounded-lg">
                                <User size={16} class="text-slate-400" />
                                {sub.student?.first_name || ''} {sub.student?.last_name || 'Talaba'}
                            </div>
                        {/if}

                        <div class="flex-1">
                            <div class="text-[12px] font-bold text-[#9b1c48] mb-1.5">O'qituvchi xulosasi</div>
                            {#if sub.feedback}
                                <blockquote class="text-sm text-slate-700 leading-relaxed pl-3 border-l-[3px] border-[#fbcfe8] m-0 italic">
                                    "{sub.feedback}"
                                </blockquote>
                            {:else}
                                <p class="text-[13px] text-slate-400 italic">Xulosa yozilmagan</p>
                            {/if}
                        </div>

                        <div class="mt-4 pt-4 border-t border-[#f43f5e1a] flex justify-between items-center">
                            <span class="text-[12px] text-slate-400 font-semibold line-clamp-1 flex-1">
                                {sub.course_title ?? ''} — {sub.assignment_title ?? ''}
                            </span>
                        </div>
                    </div>
                {:else}
                    {@const st = getStatus(sub.status)}
                    <div class="flex items-start justify-between gap-4 mb-5">
                        <div class="flex-1">
                            <h3 class="text-[17px] font-bold text-[#1a0e13] leading-[1.4] mb-1 line-clamp-2">
                                {sub.course_title ?? 'Kurs'}
                                {#if sub.assignment_title}
                                    <span class="text-slate-400 font-medium">/ {sub.assignment_title}</span>
                                {/if}
                            </h3>
                            <p class="text-[13px] text-slate-500 font-medium line-clamp-1">{sub.lesson_title ?? ''}</p>
                            
                            {#if role === 'admin'}
                                <div class="flex items-center gap-1.5 mt-2.5 text-[13px] font-semibold text-slate-600 bg-slate-50 w-max px-2.5 py-1 rounded-md">
                                    <User size={14} class="text-slate-400" />
                                    {sub.student?.first_name || ''} {sub.student?.last_name || 'Talaba'}
                                </div>
                            {/if}
                        </div>
                        <span
                            class="text-[12px] font-bold px-3.5 py-1.5 rounded-full border whitespace-nowrap tracking-[0.3px]"
                            style="background:{st.bg}; color:{st.text}; border-color:{st.border}"
                        >
                            {st.label}
                        </span>
                    </div>

                    <div class="flex items-center justify-between pt-4 border-t border-dashed border-slate-200 mt-auto">
                        <span class="text-[13px] text-slate-400 font-medium">
                            {formatDate(sub.submitted_at)}
                        </span>
                        
                        <div class="flex flex-row items-center gap-2">
                            {#if sub.file}
                                <a
                                    href={resolve(sub.file)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="flex items-center justify-center w-9.5 h-9.5 rounded-[10px] bg-slate-50 text-slate-500 transition-all duration-200 hover:bg-[#9b1c48] hover:text-white hover:scale-105"
                                    title="Faylni ko'rish"
                                >
                                    <FileDown size={18} />
                                </a>
                            {:else}
                                <span class="flex items-center justify-center w-9.5 h-9.5 rounded-[10px] bg-slate-50 text-slate-500 opacity-30 cursor-not-allowed" title="Fayl yo'q">
                                    <FileDown size={18} />
                                </span>
                            {/if}

                            {#if role === 'admin'}
                                <!-- Admin Baholash tugmasi bu yerga joylashtiriladi (kelajakda ulash orqali ishlashi mumkin) -->
                                <button class="flex items-center justify-center h-9.5 px-4 rounded-[10px] bg-blue-50 text-blue-600 font-semibold text-sm transition-all duration-200 hover:bg-blue-600 hover:text-white">
                                    Baholash
                                </button>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{/if}

{#if totalCount > 10}
    <div class="flex items-center justify-center gap-4 mt-10">
        <button
            onclick={() => goToPage(currentPage - 1)}
            disabled={!prevPage}
            class="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-[#9b1c48] hover:text-[#9b1c48] hover:shadow-[0_2px_8px_rgba(155,28,72,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:shadow-none"
        >
            <ChevronLeft size={16} /> Oldingi
        </button>
        <span class="text-sm text-slate-500 font-semibold bg-slate-100 px-4 py-1.5 rounded-full">
            {currentPage} / {Math.ceil(totalCount / 10)}
        </span>
        <button
            onclick={() => goToPage(currentPage + 1)}
            disabled={!nextPage}
            class="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-[#9b1c48] hover:text-[#9b1c48] hover:shadow-[0_2px_8px_rgba(155,28,72,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:shadow-none"
        >
            Keyingi <ChevronRight size={16} />
        </button>
    </div>
{/if}
