<script lang="ts">
	import LessonsRow from "@/lib/components/ui/courses/LessonsRow.svelte";
	import ModuleAccordion from "@/lib/components/ui/courses/ModuleAccordion.svelte";


    // Mock datalar
    const course = {
        title: "Course dars qo'shish",
        description: "Complete course heading thorowring rutrer callonish, and derelation of yangi dars qo'shish.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300&h=200",
        progress: 50,
        stats: { total: 25, watched: 10, remaining: 15 } // Mockupdagi 48 xatosini mantiqan 15 ga to'g'irladim :)
    };

    const modules = [
        {
            title: "Module 1: Introduction",
            lessons: [
                { id: 1, title: "Yangi dars qo'shish", duration: "10B981", status: "completed" },
                { id: 2, title: "Yangi dars qo'shish", duration: "0h 16m", status: "completed" },
                { id: 3, title: "Yangi dars qo'shish", duration: "0h 16m", status: "active" },
                { id: 4, title: "Yangi dars qo'shish", duration: "0h 16m", status: "completed" },
                { id: 5, title: "Yangi Kamal qo'shish", duration: "0h 18m", status: "locked" },
                { id: 6, title: "Yangi Kamal qo'shish", duration: "9CA3AF", status: "locked" },
            ]
        },
        {
            title: "Module 2: Basics",
            lessons: [
                { id: 1, title: "Svelte 5 asoslari", duration: "0h 25m", status: "locked" }
            ]
        }
    ];
</script>

<div class="max-w-5xl mx-auto p-4 md:p-8 min-h-screen bg-[#f8fafc] font-sans">
    
    <div class="mb-6">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Course Detail</p>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800">{course.title}</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <div class="lg:col-span-2 bg-white rounded-[24px] p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center">
            
            <div class="w-full sm:w-36 h-48 sm:h-24 shrink-0 bg-slate-100 rounded-2xl overflow-hidden relative">
                <img 
                    src={course.image} 
                    alt="Course cover" 
                    class="absolute inset-0 w-full h-full object-cover"
                    width="144" 
                    height="96"
                />
            </div>
            
            <div class="flex-1 w-full">
                <h2 class="text-xl font-bold text-slate-800 mb-2">{course.title}</h2>
                <p class="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                </p>
                
                <div class="flex items-center gap-4">
                    <div class="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                            class="bg-[#ed4b72] h-full rounded-full transition-all duration-700 ease-out" 
                            style="width: {course.progress}%">
                        </div>
                    </div>
                    <span class="text-sm font-semibold text-slate-700">{course.progress}%</span>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 class="text-lg font-bold text-slate-800 mb-4">Progress</h3>
            <div class="space-y-3">
                <div class="flex justify-between items-center text-sm">
                    <span class="text-slate-500 font-medium">Total lessons</span>
                    <span class="font-bold text-slate-800">{course.stats.total}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-slate-500 font-medium">Watched</span>
                    <span class="font-bold text-slate-800">{course.stats.watched}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-slate-500 font-medium">Remaining</span>
                    <span class="font-bold text-slate-800">{course.stats.remaining}</span>
                </div>
            </div>
        </div>

    </div>

    <div class="space-y-2">
        {#each modules as mod (mod.title)}
            <ModuleAccordion title={mod.title}>
                {#each mod.lessons as lesson (lesson.id)}
                    <LessonsRow 
                        index={lesson.id} 
                        title={lesson.title} 
                        duration={lesson.duration} 
                        status={lesson.status} 
                    />
                {/each}
            </ModuleAccordion>
        {/each}
    </div>

</div>