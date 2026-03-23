<script lang="ts">
    let { title, value, isPrimary = false, children } = $props();
</script>

<div class="p-5 sm:p-6 rounded-3xl h-35 flex flex-col justify-between transition-transform hover:-translate-y-1 
    {isPrimary 
        ? 'bg-linear-to-br from-[#ed4b72] to-[#de3c61] text-white shadow-lg shadow-rose-200' 
        : 'bg-white border border-slate-100 shadow-sm text-slate-800'}">
    
    <h3 class="text-[15px] font-semibold {isPrimary ? 'opacity-90' : 'text-slate-700 leading-tight w-20'}">
        {title}
    </h3>
    
    <div class="flex items-end justify-between">
        <span class="text-3xl sm:text-4xl font-bold">{value}</span>
        <div class="{isPrimary ? 'text-white/80' : 'text-slate-400'}">
            {@render children()}
        </div>
    </div>
</div>