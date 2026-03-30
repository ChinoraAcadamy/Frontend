<!-- src/lib/components/ui/courses/CourseCard.svelte -->
<script lang="ts">
    import { resolve } from "$app/paths";
    import { Play } from 'lucide-svelte';

    let { 
        title, 
        price, 
        modules, 
        status, 
        image,
        link
    } = $props();

    const isPublished = $derived(status === 'published');
</script>

<div class="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
    
    <!-- Image Section -->
    <div class="relative w-full aspect-video overflow-hidden bg-slate-100">
        <img 
            src={image} 
            alt={title} 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            width="400" 
            height="225"
            loading="lazy"
        />
        
        <!-- Subtle overlay + play icon on hover -->
        <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        
        <a href={resolve(`/admin/courses/${link}`)}  class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-slate-700 rounded-2xl px-3 py-1 text-xs font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Play size={14} class="fill-current" />
            Preview
        </a>

        <!-- Status badge on image -->
        <div class="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-2xl shadow-sm
            {isPublished 
                ? 'bg-emerald-500 text-white' 
                : 'bg-amber-500 text-white'}">
            {status}
        </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-6 flex flex-col">
        <h3 class="text-lg font-semibold text-slate-800 line-clamp-2 leading-tight mb-3 group-hover:text-[#ed4b72] transition-colors">
            {title}
        </h3>

        <p class="text-sm text-slate-500 mb-6 md:mb-0">
            {modules} ta modul
        </p>

        <!-- Price + Button -->
        <div class="mt-auto flex items-end flex-row md:flex-col justify-between">
            <div>
                <span class="text-3xl font-bold text-slate-900">${price}</span>
            </div>

            <a 
                href={resolve(`/admin/courses/${link}`)} 
                class="inline-flex items-center gap-2 bg-[#ed4b72] hover:bg-[#d93a5f] text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 shadow-md shadow-[#ed4b72]/30 md:w-full md:mt-4"
            >
                Batafsil
                <span class="text-lg leading-none">→</span>
            </a>
        </div>
    </div>
</div>