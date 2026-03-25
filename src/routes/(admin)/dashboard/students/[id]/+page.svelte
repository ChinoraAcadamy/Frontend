<script lang="ts">
    import ChangePasswordModal from '@/lib/components/ui/admin/ChangePasswordModal.svelte';
    import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
    import {
        UserCog, Key, UserMinus, UserCheck,
        Trophy, BookOpen, FileText, ExternalLink,
        Lock, Unlock, Trash2, CheckCircle2
    } from 'lucide-svelte';

    // Prop orqali serverdan (load funksiyasidan) kelayotgan datani olamiz
    let { data } = $props();

    // Haqiqiy datani state ga bog'laymiz
    let student = $state(data.student);

    let activeTab = $state('Hammasi');
    let isChangePasswordOpen = $state(false);

    // Sanalarni formatlash uchun yordamchi funksiyalar
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Noma'lum";
        return new Date(dateString).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatShortDate = (dateString: string | null) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
    };

    const formatLastLogin = (dateString: string | null) => {
        if (!dateString) return "Hech qachon kirmagan";
        return new Date(dateString).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    // Bosh harflarni olish (Ism va familiya bo'lmasa qotib qolmasligi uchun)
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
    };
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen font-sans">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
            <Breadcrumb />
        </div>

        <div class="flex flex-wrap gap-3">
            <button class="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[#ed4b72] font-semibold text-sm hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm">
                Kursga Biriktirish
            </button>

            <button
                onclick={() => isChangePasswordOpen = true}
                class="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
                <Key size={16} /> Parol
            </button>

            <button class="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center gap-2 shadow-sm">
                <UserCog size={16} /> Tahrirlash
            </button>

            <button
                onclick={() => student.is_active = !student.is_active}
                class="px-5 py-2.5 rounded-2xl bg-white border font-semibold text-sm transition-all flex items-center gap-2 shadow-sm
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

        <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div class="w-24 h-24 rounded-full bg-gradient-to-r from-[#ed4b72] to-[#de3c61] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-rose-200 shrink-0 overflow-hidden">
                {#if student.picture}
                    <img src={student.picture} alt="Avatar" class="w-full h-full object-cover"/>
                {:else}
                    {getInitials(student.first_name, student.last_name)}
                {/if}
            </div>
            <div class="text-center sm:text-left space-y-2 w-full">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h1 class="text-2xl font-bold text-slate-800">{student.first_name} {student.last_name}</h1>
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-bold w-max mx-auto sm:mx-0 {student.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}">
                        {student.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                </div>
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <p class="text-slate-500 font-medium">@{student.username}</p>
                    {#if student.phone_number}
                        <span class="text-slate-300">•</span>
                        <p class="text-slate-500 font-medium text-sm">{student.phone_number}</p>
                    {/if}
                </div>
                <div class="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-slate-400 font-medium pt-2">
                    <span class="flex items-center gap-1"><BookOpen size={14}/> Qo'shilgan: {formatDate(student.created_at)}</span>
                    <span class="flex items-center gap-1"><CheckCircle2 size={14}/> Oxirgi kirish: {formatLastLogin(student.last_login)}</span>
                </div>
            </div>
        </div>

        <div class="bg-gradient-to-r from-[#ed4b72] to-[#de3c61] rounded-3xl p-6 text-white shadow-lg shadow-rose-200 flex flex-col justify-center relative overflow-hidden">
            <Trophy class="absolute right-[-20px] bottom-[-20px] text-white/10 w-40 h-40" strokeWidth={1} />
            <div class="relative z-10">
                <h2 class="text-lg font-medium opacity-90 mb-2">Total Score</h2>
                <div class="text-5xl font-bold mb-1">{student.total_score}</div>
                <p class="text-sm opacity-90">Umumiy yig'ilgan ball</p>
            </div>
        </div>

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div class="lg:col-span-2 space-y-6">

            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-slate-800">Kurslar ({student.courses_count})</h2>
                    <button class="text-[#ed4b72] text-sm font-medium hover:underline flex items-center gap-1">
                        + Kurs qo'shish
                    </button>
                </div>
                
                <div class="flex flex-col gap-2">
                    {#if student.courses && student.courses.length > 0}
                        {#each student.courses as course (course.id)}
                            <div class="p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div class="flex items-center gap-4 w-full sm:w-auto">
                                    <div class="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/50 flex items-center justify-center text-slate-400">
                                        <BookOpen size={24} />
                                    </div>
                                    <div class="w-full">
                                        <h4 class="font-bold text-slate-800">{course.title}</h4>
                                        <div class="flex items-center gap-3 mt-2">
                                            <div class="w-full sm:w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div class="h-full bg-[#10B981] transition-all duration-500" style="width: {course.progress}%"></div>
                                            </div>
                                            <span class="text-xs font-bold text-slate-500">{course.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                                    <span class="text-xs text-slate-400 font-medium hidden sm:block">
                                        {formatShortDate(course.enrolled_at)}
                                    </span>
                                    <div class="flex items-center gap-2">
                                        <button class="p-2.5 rounded-xl bg-white border transition-all shadow-sm
                                            {course.is_blocked ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-slate-200 text-orange-500 hover:bg-orange-50 hover:border-orange-200'}" 
                                            title={course.is_blocked ? "Blokdan chiqarish" : "Bloklash"}>
                                            {#if course.is_blocked}
                                                <Lock size={16} />
                                            {:else}
                                                <Unlock size={16} />
                                            {/if}
                                        </button>
                                        <button class="p-2.5 rounded-xl bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm" title="Kursdan chiqarish">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                            <p class="text-slate-400 text-sm font-medium">Student hech qanday kursga biriktirilmagan.</p>
                        </div>
                    {/if}
                </div>
            </div>

            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <h2 class="text-xl font-bold text-slate-800">Topshiriqlar ({student.submissions_count})</h2>
                    <div class="flex bg-slate-100 p-1 rounded-xl w-max">
                        {#each ['Hammasi', 'Kutilmoqda', 'Baholandi'] as tab (tab)}
                            <button
                                onclick={() => activeTab = tab}
                                class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all {activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"
                            >
                                {tab}
                            </button>
                        {/each}
                    </div>
                </div>
                
                {#if student.submissions && student.submissions.length > 0}
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="text-slate-400 text-sm border-b border-slate-100">
                                    <th class="pb-3 font-medium px-2">Topshiriq</th>
                                    <th class="pb-3 font-medium px-2">Kurs</th>
                                    <th class="pb-3 font-medium px-2">Sana</th>
                                    <th class="pb-3 font-medium px-2 text-right">Natija</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm text-slate-700">
                                {#each student.submissions as submission (submission.id)}
                                    <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group">
                                        <td class="py-4 px-2">
                                            <div class="flex items-center gap-3">
                                                <div class="p-2 rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors">
                                                    <FileText size={16} />
                                                </div>
                                                <span class="font-medium text-slate-800">{submission.title || 'Noma\'lum'}</span>
                                            </div>
                                        </td>
                                        <td class="py-4 px-2 text-slate-500">{submission.course_name || '-'}</td>
                                        <td class="py-4 px-2 text-slate-500">{formatShortDate(submission.date)}</td>
                                        <td class="py-4 px-2 text-right">
                                            <div class="flex items-center justify-end gap-3">
                                                </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {:else}
                    <div class="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                        <FileText class="mx-auto text-slate-300 mb-2" size={32} />
                        <p class="text-slate-400 text-sm font-medium">Topshiriqlar hozircha mavjud emas.</p>
                    </div>
                {/if}
            </div>

        </div>

        <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
                <h2 class="text-lg font-medium text-slate-600 mb-2">Reyting o'rni</h2>
                <div class="text-4xl font-bold text-slate-800 mb-1">Top 15%</div>
                <p class="text-sm text-slate-400">Jami studentlar orasida</p>
            </div>

            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h2 class="text-lg font-bold text-slate-800 mb-4">Platforma eslatmasi</h2>
                <div class="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-3">
                    <CheckCircle2 size={20} class="text-blue-500 shrink-0 mt-0.5" />
                    <p class="text-sm leading-relaxed text-blue-700/80">
                        Student barcha kurslarni 80% dan yuqori natija bilan yakunlasa, unga avtomatik sertifikat generatsiya qilinadi.
                    </p>
                </div>
            </div>
        </div>

    </div>
</div>

<ChangePasswordModal
    isOpen={isChangePasswordOpen}
    studentName="{student.first_name} {student.last_name}"
    onClose={() => isChangePasswordOpen = false}
/>