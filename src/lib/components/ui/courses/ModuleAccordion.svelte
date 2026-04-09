<script lang="ts">
    import { ChevronDown } from 'lucide-svelte';
    
    let { title, children, adminActions = undefined } = $props();
    let isOpen = $state(true); // Default holatda ochiq turadi
</script>

<div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
    <div class="flex items-center justify-between p-5 sm:p-6 hover:bg-slate-50 transition-colors">
        <button 
            onclick={() => isOpen = !isOpen} 
            class="flex items-center gap-3 text-left flex-1"
        >
            <ChevronDown 
                size={20} 
                class="text-slate-400 transition-transform duration-300 {isOpen ? 'rotate-180' : ''}" 
            />
            <h3 class="font-bold text-slate-800 text-lg">{title}</h3>
        </button>

        {#if adminActions}
            <div class="flex items-center gap-2 pl-4">
                {@render adminActions()}
            </div>
        {/if}
    </div>
    
    {#if isOpen}
        <div class="px-2 pb-4 sm:px-4 sm:pb-4 space-y-1">
            {@render children()}
        </div>
    {/if}
</div>