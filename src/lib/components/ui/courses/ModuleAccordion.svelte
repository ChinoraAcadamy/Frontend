<script lang="ts">
    import { ChevronDown } from 'lucide-svelte';
    
    let { title, children } = $props();
    let isOpen = $state(true); // Default holatda ochiq turadi
</script>

<div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
    <button 
        onclick={() => isOpen = !isOpen} 
        class="w-full flex items-center gap-3 p-5 sm:p-6 text-left hover:bg-slate-50 transition-colors"
    >
        <ChevronDown 
            size={20} 
            class="text-slate-400 transition-transform duration-300 {isOpen ? 'rotate-180' : ''}" 
        />
        <h3 class="font-bold text-slate-800 text-lg">{title}</h3>
    </button>
    
    {#if isOpen}
        <div class="px-2 pb-4 sm:px-4 sm:pb-4 space-y-1">
            {@render children()}
        </div>
    {/if}
</div>