<script>
    import { CheckCircle2, Lock } from 'lucide-svelte';
    
    /**
     * @typedef {Object} Props
     * @property {string | number} index
     * @property {string} title
     * @property {string | number} [duration]
     * @property {'completed' | 'active' | 'locked' | 'available'} [status]
     * @property {string} [href]
     */

    /** @type {Props} */
    let { 
        index, 
        title, 
        duration, 
        status = 'locked',
        href = undefined
    } = $props();
</script>

{#snippet rowContent()}
    <div class="flex items-center gap-4 sm:gap-6">
        <span class="text-sm font-medium {status === 'active' ? 'text-rose-100' : 'text-slate-500'}">
            Lesson {index}
        </span>
        <span class="text-sm sm:text-base font-semibold line-clamp-1">{title}</span>
    </div>
    
    <div class="flex items-center gap-4 shrink-0">
        {#if status === 'active'}
            <div class="bg-white text-[#ed4b72] px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform">
                Boshlash
            </div>
        {:else}
            {#if duration}
                <span class="text-sm font-medium {status === 'locked' ? 'text-slate-400' : 'text-slate-500'}">
                    {duration}
                </span>
            {/if}
            
            <div class="w-6 flex justify-center">
                {#if status === 'completed'}
                    <CheckCircle2 size={20} class="text-[#10b981]" />
                {:else if status === 'locked'}
                    <Lock size={18} class="text-slate-400" />
                {/if}
            </div>
        {/if}
    </div>
{/snippet}

{#if href && status !== 'locked'}
    <a {href} class="flex items-center justify-between p-3 sm:px-5 sm:py-3.5 rounded-2xl transition-all duration-300
        {status === 'active' ? 'bg-linear-to-r from-[#ed4b72] to-[#de3c61] text-white shadow-lg shadow-rose-200/50 scale-[1.01]' : 'hover:bg-slate-50 text-slate-700'}">
        {@render rowContent()}
    </a>
{:else}
    <div class="flex items-center justify-between p-3 sm:px-5 sm:py-3.5 rounded-2xl transition-all duration-300
        {status === 'active' ? 'bg-linear-to-r from-[#ed4b72] to-[#de3c61] text-white shadow-lg shadow-rose-200/50 scale-[1.01]' : 'hover:bg-slate-50 text-slate-700'} 
        {status === 'locked' ? 'opacity-60 pointer-events-none' : ''}">
        {@render rowContent()}
    </div>
{/if}