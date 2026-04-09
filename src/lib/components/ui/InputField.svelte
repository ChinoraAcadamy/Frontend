<script lang="ts">
    import { Lock } from 'lucide-svelte';

    let { 
        label, 
        id, 
        type = "text", 
        value = $bindable(), 
        placeholder = "", 
        readonly = false,
        prefix = "",
        name=""
    } = $props();
</script>

<div class="flex flex-col gap-1.5 h-18"> <label for={id} class="text-sm font-semibold text-slate-700">
        {label} {#if readonly}<span class="text-slate-400 font-normal">(Readonly)</span>{/if}
    </label>
    
    <div class="relative flex items-center">
        {#if prefix}
            <span class="absolute left-3 text-slate-800 font-medium">{prefix}</span>
        {/if}
        
        <input
            {id}
            {type}
            bind:value
            {placeholder}
            {name}
            disabled={readonly}
            class="w-full h-11 rounded-xl border px-3 text-slate-800 transition-all duration-200 outline-none
                   {prefix ? 'pl-16' : ''}
                   {readonly 
                       ? 'bg-slate-100/70 border-slate-200 text-slate-500 cursor-not-allowed' 
                       : 'bg-white border-slate-200 hover:border-slate-300 focus:border-[#ed4b72] focus:ring-[3px] focus:ring-[#ed4b72]/15 shadow-sm'}"
        />
        
        {#if readonly}
            <div class="absolute right-3 text-slate-400">
                <Lock size={16} strokeWidth={2.5} />
            </div>
        {/if}
    </div>
</div>