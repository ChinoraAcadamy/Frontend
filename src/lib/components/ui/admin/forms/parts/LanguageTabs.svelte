<script lang="ts">
    let { activeTab = $bindable('uz') } = $props();
</script>

<div class="flex items-center gap-1 bg-slate-50 p-1 rounded-md border border-slate-200">
    <button 
        type="button" 
        class="px-3 py-1 rounded text-[11px] font-bold transition-colors {activeTab === 'uz' ? 'bg-[#fa2e69] text-white' : 'text-slate-500 hover:text-slate-700'}" 
        onclick={() => activeTab = 'uz'}
    >
        UZ
    </button>
    <button 
        type="button" 
        class="px-3 py-1 rounded text-[11px] font-bold transition-colors {activeTab === 'ru' ? 'bg-[#fa2e69] text-white' : 'text-slate-500 hover:text-slate-700'}" 
        onclick={() => activeTab = 'ru'}
    >
        RU
    </button>
</div>
