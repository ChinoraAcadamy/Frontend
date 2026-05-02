<script lang="ts">
    import { ChevronDown, Search } from 'lucide-svelte';
    import { slide } from 'svelte/transition';
    import * as m from '$lib/paraglide/messages.js';

    let { modules = [], modulePk = $bindable(null) } = $props();

    let isDropdownOpen = $state(false);
    let searchQuery = $state('');

    let filteredModules = $derived(
        modules.filter((mod) => mod.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    function selectModule(id) {
        modulePk = id;
        isDropdownOpen = false;
        searchQuery = '';
    }

    let selectedModule = $derived(modules.find((m) => m.id === modulePk));
</script>

<div class="flex flex-col gap-1.5 relative">
    <label for="module" class="text-[12px] font-bold text-muted pl-0.5 uppercase tracking-wider">
        {m.label_modul ? m.label_modul() : 'Modul'}
    </label>
    <button
        type="button"
        onclick={() => (isDropdownOpen = !isDropdownOpen)}
        class="w-full flex items-center justify-between px-4 py-3 bg-surface border rounded-lg transition-colors outline-none
               {isDropdownOpen ? 'border-primary' : 'border-border hover:border-primary/30'}"
    >
        {#if selectedModule}
            <span class="text-sm text-foreground font-medium">{selectedModule.title}</span>
            <input type="hidden" name="module_pk" value={modulePk} />
        {:else}
            <span class="text-sm text-muted/50">
                {m.placeholder_select_module ? m.placeholder_select_module() : 'Modulni tanlang...'}
            </span>
        {/if}
        <ChevronDown size={16} class="text-muted transition-transform duration-200 {isDropdownOpen ? 'rotate-180' : ''}" />
    </button>

    {#if isDropdownOpen}
        <div 
            class="absolute top-[calc(100%+4px)] left-0 right-0 bg-surface rounded-lg border border-border shadow-xl z-50 overflow-hidden" 
            transition:slide={{ duration: 150 }}
        >
            <div class="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/5">
                <Search size={14} class="text-muted" />
                <input
                    bind:value={searchQuery}
                    placeholder={m.admin_courses_search_placeholder ? m.admin_courses_search_placeholder() : 'Qidirish...'}
                    autocomplete="off"
                    class="bg-transparent border-none outline-none text-xs w-full text-foreground"
                />
            </div>
            <div class="max-h-[200px] overflow-y-auto divide-y divide-border">
                {#each filteredModules as module (module.id)}
                    <button 
                        type="button" 
                        class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/5 transition-colors text-left" 
                        onclick={() => selectModule(module.id)}
                    >
                        <span class="text-xs font-semibold text-foreground">{module.title}</span>
                        <span class="text-[10px] font-black text-muted/40 uppercase">{module.lessons_count || 0}</span>
                    </button>
                {:else}
                    <div class="px-4 py-4 text-center text-xs text-muted">
                        {m.not_found ? m.not_found() : 'Topilmadi'}
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
