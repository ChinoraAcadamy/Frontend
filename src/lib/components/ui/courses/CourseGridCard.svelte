<script lang="ts">
	// @ts-nocheck

    import { Lock } from 'lucide-svelte';

    // Props: qatiy tiplar va default qiymatlar
    let {
        id,
        title,
        subtitle,
        image,
        progress = 0,
        modules = 0,
        lessons = 0,
        status = 'active', // 'active' | 'completed' | 'locked'
        onContinue // Tugma bosilganda ishlaydigan funksiya
    } = $props();

    // Holatlarni hisoblash (Derived states)
    let isLocked = $derived(status === 'locked');
    let isCompleted = $derived(status === 'completed');

    // Statusga qarab progress bar rangini belgilash
    let progressColor = $derived(
        isCompleted ? 'bg-[#10b981]' : 'bg-[#ed4b72]'
    );
</script>

<div class="relative bg-white rounded-3xl p-5 border flex flex-col h-70 transition-all duration-300 shadow-sm
    {isLocked 
        ? 'bg-slate-400/10 border-slate-200' 
        : 'border-slate-100 hover:-translate-y-1 hover:shadow-md'}">
    
    {#if isLocked}
        <div class="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <Lock size={56} class="text-white drop-shadow-lg -mt-8" strokeWidth={2} />
        </div>
        <div class="absolute top-4 right-4 bg-slate-400/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg z-20 backdrop-blur-sm">
            Bloklangan
        </div>
    {/if}

    <div class="relative z-10 flex-1 flex flex-col {isLocked ? 'opacity-40 grayscale' : ''}">
        
        <div class="flex gap-4 items-start mb-4">
            <div class="w-20 h-20 shrink-0 rounded-2xl bg-slate-200 overflow-hidden relative">
                <img 
                    src={image} 
                    alt={title} 
                    class="w-full h-full object-cover" 
                    width="80" height="80" 
                    loading="lazy"
                    onerror={(e) => (e.currentTarget.src = `https://placehold.co/600x400?text=${encodeURIComponent(title)}`)}
                />
            </div>
            <div class="flex-1 mt-1">
                <h3 class="font-bold text-[17px] text-slate-800 leading-tight line-clamp-3">
                    {title}
                </h3>
            </div>
        </div>

        <div class="mt-auto mb-4">
            <h4 class="font-bold text-[15px] text-slate-800 mb-2 truncate">{subtitle}</h4>
            <div class="flex items-center gap-3">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        class="h-full rounded-full {progressColor} transition-all duration-1000 ease-out" 
                        style="width: {progress}%">
                    </div>
                </div>
                <span class="text-[13px] font-bold text-slate-700 shrink-0 w-8 text-right">
                    {progress}%
                </span>
            </div>
        </div>

        <div class="flex items-center justify-between text-[13px] font-semibold text-slate-500 mb-5">
            <span>{modules} Modules</span>
            <span>{lessons} Lessons</span>
        </div>
    </div>

    <button
        onclick={() => onContinue(id)}
        disabled={isLocked}
        class="relative z-30 w-full h-11 rounded-xl font-bold transition-colors flex items-center justify-center shrink-0
            {isLocked
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-[#ed4b72] hover:bg-[#de3c61] text-white shadow-sm shadow-rose-200'}"
    >
        {isLocked ? 'Bloklangan' : 'Davom etish'}
    </button>

</div>