<script lang="ts">
    import { resolve } from "$app/paths";
    import { Play, Edit2, LayoutList } from 'lucide-svelte';

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
    function handleImageError(e) {
        const target = e.currentTarget;
        target.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
    }

    // Image source fallback
    let displayImage = $derived(image || `https://placehold.co/600x400?text=${encodeURIComponent(title)}`);
</script>

<div class="group bg-white rounded-xl overflow-hidden border-2 border-slate-100 transition-all duration-300 flex flex-col lg:flex-row items-center p-3 gap-4 hover:border-[#9b1c48]/20">
    <!-- Image -->
    <div class="relative h-16 w-full lg:w-28 shrink-0 overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
        <img 
            src={displayImage} 
            alt={title} 
            class="w-full h-full object-cover"
            loading="lazy"
            onerror={handleImageError}
        />
        <div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded bg-white/90 backdrop-blur-sm
            {isPublished 
                ? 'text-emerald-600' 
                : 'text-amber-600'}">
            {status}
        </div>
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
        <div class="flex-1 min-w-0 w-full">
            <h3 class="line-clamp-1 text-[14px] font-black text-slate-800 uppercase tracking-tight group-hover:text-[#9b1c48] transition-colors">
                {title}
            </h3>
            <div class="flex items-center gap-3 mt-1">
                <span class="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <LayoutList size={10} />
                    {modules} Modules
                </span>
                <span class="text-[10px] font-bold text-slate-200">|</span>
                <span class="text-[14px] font-black text-slate-900">${price}</span>
            </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 w-full lg:w-auto shrink-0">
            <a 
                href={resolve(`/admin/courses/${link}`)} 
                class="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100"
            >
                <Play size={10} class="fill-current" />
                Preview
            </a>
            <a 
                href={resolve(`/admin/courses/${link}`)} 
                class="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-[#9b1c48] hover:bg-[#80163a] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
            >
                <Edit2 size={10} />
                Edit
            </a>
        </div>
    </div>
</div>
