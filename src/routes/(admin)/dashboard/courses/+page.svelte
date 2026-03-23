<script lang="ts">
	import { resolve } from '$app/paths';
	import CourseAdminCard from '@/lib/components/ui/courses/CourseAdminCard.svelte';
    import { Plus, Search } from 'lucide-svelte';

    // Mock data (Svelte 5 state shart emas, agar faqat o'qilsa)
    const courses = [
        { id: 1, title: "Course Thumbnail 1", price: 99, modules: 4, status: "published", image: "https://picsum.photos/400/300?1" },
        { id: 2, title: "Advanced Node.js & MongoDB", price: 149, modules: 12, status: "published", image: "https://picsum.photos/400/300?2" },
        { id: 3, title: "SvelteKit Masterclass", price: 89, modules: 8, status: "draft", image: "https://picsum.photos/400/300?3" },
        { id: 4, title: "UI/UX Premium Design", price: 199, modules: 15, status: "published", image: "https://picsum.photos/400/300?4" },
        { id: 5, title: "GSAP Animations", price: 120, modules: 6, status: "published", image: "https://picsum.photos/400/300?5" },
        { id: 6, title: "Telegram Bot Development", price: 49, modules: 5, status: "draft", image: "https://picsum.photos/400/300?6" },
    ];
</script>

<div class="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-[#f8fafc] font-sans">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Courses List</h1>
            <p class="text-sm text-slate-500 font-medium mt-1">Manage and update your platform's courses</p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-64">
                <Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search courses..." 
                    class="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm outline-none transition-all focus:border-[#ed4b72] focus:ring-[3px] focus:ring-[#ed4b72]/15 shadow-sm"
                />
            </div>

            <a href={resolve('/dashboard/courses/create/')} class="shrink-0 h-11 bg-linear-to-r from-[#ed4b72] to-[#de3c61] text-white px-5 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-rose-200/50">
                <Plus size={20} strokeWidth={2.5} /> 
                <span class="hidden sm:inline">Add Course</span>
            </a>
        </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each courses as course (course.id)}
            <CourseAdminCard 
                title={course.title} 
                price={course.price} 
                modules={course.modules} 
                status={course.status} 
                image={course.image} 
            />
        {/each}
    </div>
</div>