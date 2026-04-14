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

    const isPublished = $derived(status === 'published' || status === 'active');

    /** @param {Event} e */
    function handleImageError(e: Event) {
        const target = e.currentTarget as HTMLImageElement;
        target.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
    }

    // Image source fallback
    let displayImage = $derived(image || `https://placehold.co/600x400?text=${encodeURIComponent(title)}`);
</script>

<div class="group bg-white rounded-xl overflow-hidden border-2 border-slate-100 transition-all duration-300 flex flex-col h-full relative hover:border-[#9b1c48]/20">
    
    <!-- Image Section -->
    <div class="relative w-full aspect-video overflow-hidden bg-slate-50 border-b border-slate-100">
        <img 
            src={displayImage} 
            alt={title} 
            class="w-full h-full object-cover transition-transform duration-500"
            width="400" 
            height="225"
            loading="lazy"
            onerror={handleImageError}
        />
        
        <!-- Subtle overlay + play icon on hover -->
        <div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        
        <a href={resolve(`/admin/courses/${link}`)}  class="absolute bottom-3 right-3 bg-white text-[#9b1c48] rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm border border-slate-100">
            <Play size={10} class="fill-current" />
            Preview
        </a>

        <!-- Status badge on image -->
        <div class="absolute top-3 left-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded bg-white/90 backdrop-blur-sm shadow-sm
            {isPublished 
                ? 'text-emerald-600' 
                : 'text-amber-600'}">
            {status}
        </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-5 flex flex-col">
        <h3 class="text-[15px] font-black text-slate-800 line-clamp-2 leading-tight mb-1.5 group-hover:text-[#9b1c48] transition-colors uppercase tracking-tight">
            {title}
        </h3>

        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            {modules} Modules
        </p>

        <!-- Price + Button -->
        <div class="mt-auto flex items-end flex-row justify-between pt-3 border-t border-slate-50">
            <div>
                <span class="text-[18px] font-black text-slate-900">${price}</span>
            </div>

            <a 
                href={resolve(`/admin/courses/${link}`)} 
                class="inline-flex items-center gap-2 bg-[#9b1c48] hover:bg-[#80163a] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
            >
                Edit
                <span class="text-sm leading-none">→</span>
            </a>
        </div>
    </div>
</div>