<script lang="ts">
    import { resolve } from '$app/paths';
    import { 
        Users, 
        BookOpen, 
        TrendingUp, 
        DollarSign, 
        Award, 
        Plus, 
        Search,
    } from 'lucide-svelte';

    const { data } = $props();

    // Statik ma'lumotlar (Bular ham qachondir API'dan keladi)
    let stats = [
        { title: "Jami shogirdlar", value: data.totalCount ?? 0, change: "+18", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Faol kurslar", value: data.courses?.length ?? 0, change: "+2", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
        { title: "Bu oy daromad", value: "18.4M", change: "+12%", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-100" },
        { title: "O‘rtacha retention", value: "87%", change: "-3%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" }
    ];


    // Reyting uchun o'rinlarni aniqlab beruvchi yordamchi funksiya
    const getMedal = (index) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return index + 1;
    };
</script>

<div class="min-h-screen bg-linear-to-br from-slate-50 to-zinc-100 pt-15">
    <div class="max-w-screen-2xl mx-auto p-6 lg:p-10">

        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div>
                <h1 class="text-4xl font-bold font-tarsk text-foreground">Admin Dashboard</h1>
                <p class="text-muted-foreground mt-2 text-lg">CHINORA FASHION ACADEMY boshqaruvi</p>
            </div>

            <div class="flex items-center gap-4 flex-wrap">
                <div class="relative w-80">
                    <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Shogird, kurs yoki to‘lov izlash..."
                        class="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-2xl focus:outline-none focus:border-primary transition-all"
                    />
                </div>

                <a href={resolve("/admin/courses/create")} class="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-medium shadow-md">
                    <Plus class="w-5 h-5" />
                    Yangi dars qo‘shish
                </a>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {#each stats as stat (stat.title)}
                <div class="bg-white rounded-3xl p-7 shadow-sm border border-white/70">
                    <div class="flex items-center justify-between">
                        <div class="{stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center">
                            <svelte:component this={stat.icon} class="w-6 h-6 {stat.color}" />
                        </div>
                        <span class="text-emerald-500 text-sm font-medium">{stat.change}</span>
                    </div>
                    <p class="text-4xl font-bold mt-6 text-foreground">{stat.value}</p>
                    <p class="text-muted-foreground text-sm mt-1">{stat.title}</p>
                </div>
            {/each}
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div class="xl:col-span-8 bg-white rounded-3xl shadow-sm border border-white/70 p-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-semibold text-slate-800">Top 5 - Eng yaxshi shogirdlar</h2>
                    <span class="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Umumiy reyting</span>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="text-slate-400 text-sm border-b border-slate-100">
                                <th class="pb-3 font-medium px-2 w-12">Pos.</th>
                                <th class="pb-3 font-medium px-2">Shogird</th>
                                <th class="pb-3 font-medium px-2">Ball</th>
                                <th class="pb-3 font-medium px-2">Kurslar soni</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            {#each data.ranking?.slice(0, 5) || [] as user, index (user.id)}
                                <tr class="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50 text-slate-700">
                                    <td class="py-4 px-2">
                                        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-bold">
                                            {getMedal(index)}
                                        </div>
                                    </td>
                                    <td class="py-4 px-2 flex items-center gap-3">
                                        <a href={resolve(`/admin/students/${user.id}`)} class="font-medium text-base">
										{#if user.first_name || user.last_name}
											<span class="font-medium text-base">{user.first_name} {user.last_name}</span>
										{:else}
											<span class="font-medium text-base">{user.username}</span>
										{/if}
										</a>
                                    </td>
                                    <td class="py-4 px-2 font-medium text-emerald-600">{user.total_score ?? 0}</td>
                                    <td class="py-4 px-2 text-slate-500">{user.courses_count ?? 0} ta</td>
                                </tr>
                            {/each}

                            {#if !data.ranking || data.ranking.length === 0}
                                <tr>
                                    <td colspan="4" class="py-8 text-center text-slate-500">
                                        Hozircha reyting ma'lumotlari yo'q
                                    </td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="xl:col-span-4 space-y-8">

                <div class="bg-white rounded-3xl p-8 shadow-sm border border-white/70">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="font-semibold text-xl flex items-center gap-2">
                            <Users class="w-5 h-5 text-primary" /> Yangi shogirdlar
                        </h3>
                        <a href={resolve("/admin/students")} class="text-primary hover:underline text-sm font-medium">Barchasi →</a>
                    </div>
                    
                    <div class="space-y-5">
                        {#each data.students?.slice(0, 5) || [] as student (student.id)}
                            <div class="flex items-center gap-4">
                                <div class="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
									<a href={resolve(`/admin/students/${student.id}`)} class="font-medium text-base">
										{student.first_name?.[0] || '?'}{student.last_name?.[0] || ''}
									</a>
                                </div>
                                <div class="flex-1 overflow-hidden">
									<a href={resolve(`/admin/students/${student.id}`)} class="font-medium text-base">
                                    <p class="font-medium text-sm truncate text-foreground">{student.first_name} {student.last_name}</p>
                                    <p class="text-xs text-muted-foreground mt-0.5">{student.phone_number || student.username}</p>
								</a>
                                </div>
                                <div class="text-right">
                                    <span class="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
                                        {student.total_score ?? 0} ball
                                    </span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="bg-white rounded-3xl p-8 shadow-sm border border-white/70">
                    <h3 class="font-semibold text-xl mb-6">Tez amallar</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <button class="flex flex-col items-center justify-center gap-3 py-6 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                            <Users class="w-7 h-7 text-primary" />
                            <span class="font-medium text-sm text-slate-700">Shogird qo‘shish</span>
                        </button>
                        <button class="flex flex-col items-center justify-center gap-3 py-6 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                            <BookOpen class="w-7 h-7 text-primary" />
                            <span class="font-medium text-sm text-slate-700">Kurs yaratish</span>
                        </button>
                        <button class="flex flex-col items-center justify-center gap-3 py-6 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                            <DollarSign class="w-7 h-7 text-primary" />
                            <span class="font-medium text-sm text-slate-700">To‘lovlar</span>
                        </button>
                        <button class="flex flex-col items-center justify-center gap-3 py-6 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                            <Award class="w-7 h-7 text-primary" />
                            <span class="font-medium text-sm text-slate-700">Sertifikatlar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>