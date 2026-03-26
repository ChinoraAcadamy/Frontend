<script lang="ts">
	import CourseCard from "@/lib/components/ui/courses/CourseCard.svelte";
	import StatusBadge from "@/lib/components/ui/courses/StatusBadge.svelte";


    // Mock ma'lumotlar (Svelte 5 state shart emas, chunki faqat o'qish uchun)
    const courses = [
        { id: 1, title: "Course dars qo'shish", progress: 50, lessons: 25 },
        { id: 2, title: "Yangi dars qo'shish", progress: 50, lessons: 25 },
        { id: 3, title: "Yangi dars qo'shish", progress: 50, lessons: 25 },
        { id: 4, title: "Madru dars qo'shish", progress: 50, lessons: 20 },
    ];

    const leaderboard = [
        { pos: 1, name: "Rlem Dak", score: 139, course: "Yangi dars qo'shish", cScore: 160, medal: "🥇" },
        { pos: 2, name: "Ahm Savan", score: 123, course: "Yangi dars qo'shish", cScore: 120, medal: "🥈" },
        { pos: 3, name: "Salom Mar", score: 120, course: "Yangi dars qo'shish", cScore: 100, medal: "🥉", isMe: true },
        { pos: 4, name: "Runal Azan", score: 101, course: "Yangi dars qo'shish", cScore: 107, medal: "🍫" },
    ];

    const submissions = [
        { id: 1, name: "Assignment 1", course: "Course ...", score: 50, status: "Pending" },
        { id: 2, name: "Assignment 2", course: "Yangi K...", score: 60, status: "Graded" },
        { id: 3, name: "Assignment 3", course: "Course ...", score: 80, status: "Graded" },
        { id: 4, name: "Assignment 4", course: "Course ...", score: 40, status: "Graded" },
    ];
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen font-sans">
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-linear-to-r from-[#ed4b72] to-[#de3c61] rounded-3xl p-6 text-white shadow-lg shadow-rose-200">
            <h2 class="text-lg font-medium opacity-90 mb-2">Total Score</h2>
            <div class="text-5xl font-bold mb-1">200<span class="text-3xl opacity-80">/320</span></div>
            <p class="text-sm opacity-90">Umumiy ball</p>
        </div>

        <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
            <h2 class="text-lg font-medium text-slate-600 mb-2">Ranking Position</h2>
            <div class="text-4xl font-bold text-slate-800 mb-1">Reyting 115</div>
            <p class="text-sm text-slate-400">Reyting</p>
        </div>
    </div>

    <section>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-slate-800">Mening kurslarim</h2>
            <button class="text-[#ef4444] text-sm font-medium hover:underline">See all</button>
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {#each courses as course (course.id)}
                <div class="snap-start">
                    <CourseCard
                        title={course.title} 
                        progress={course.progress} 
                        lessons={course.lessons} 
                    />
                </div>
            {/each}
        </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h2 class="text-xl font-bold text-slate-800 mb-6">Ranking Leaderboard</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-slate-400 text-sm border-b border-slate-100">
                            <th class="pb-3 font-medium px-2">Pos.</th>
                            <th class="pb-3 font-medium px-2">Student</th>
                            <th class="pb-3 font-medium px-2">Score</th>
                            <th class="pb-3 font-medium px-2">Course</th>
                            <th class="pb-3 font-medium px-2">Score</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        {#each leaderboard as user (user.name)}
                            <tr class="border-b border-slate-50 last:border-0 transition-colors {user.isMe ? 'bg-gradient-to-r from-[#ef4444] to-[#fb7185] text-white rounded-lg shadow-md' : 'hover:bg-slate-50 text-slate-700'}">
                                <td class="py-3 px-2">
                                    <div class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs">
                                        {user.medal}
                                    </div>
                                </td>
                                <td class="py-3 px-2 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} alt="avatar" class="w-full h-full object-cover"/>
                                    </div>
                                    <span class="font-medium {user.isMe ? 'text-white' : ''}">{user.name}</span>
                                </td>
                                <td class="py-3 px-2 font-medium">{user.score}</td>
                                <td class="py-3 px-2 {user.isMe ? 'text-white/90' : 'text-slate-500'}">{user.course}</td>
                                <td class="py-3 px-2 font-semibold">{user.cScore}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h2 class="text-xl font-bold text-slate-800 mb-6">Recent Submissions</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-slate-400 text-sm border-b border-slate-100">
                            <th class="pb-3 font-medium px-2">Assignment name</th>
                            <th class="pb-3 font-medium px-2">Course</th>
                            <th class="pb-3 font-medium px-2">Score</th>
                            <th class="pb-3 font-medium px-2 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-slate-700">
                        {#each submissions as sub (sub.id)}
                            <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                <td class="py-4 px-2 font-medium text-slate-800">{sub.name}</td>
                                <td class="py-4 px-2 text-slate-500">{sub.course}</td>
                                <td class="py-4 px-2 font-semibold">{sub.score}</td>
                                <td class="py-4 px-2 text-right">
                                    <StatusBadge status={sub.status} />
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>

<style>
    /* Gorizontal scroll bar ni yashirish uchun utility */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>