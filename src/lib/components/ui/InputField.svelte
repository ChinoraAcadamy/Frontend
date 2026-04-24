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

<div class="h-18 flex flex-col gap-1.5">
	<label for={id} class="text-sm font-semibold text-main">
		{label}
		{#if readonly}<span class="font-normal text-muted">(Readonly)</span>{/if}
	</label>
    
	<div class="relative flex items-center">
		{#if prefix}
			<span class="absolute left-3 font-medium text-main">{prefix}</span>
		{/if}
        
		<input
			{id}
			{type}
			bind:value
			{placeholder}
			{name}
			disabled={readonly}
			class="h-11 w-full rounded-xl border px-3 text-main transition-all duration-200 outline-none
                   {prefix ? 'pl-16' : ''}
                   {readonly
						? 'border-main bg-muted/5 text-muted cursor-not-allowed'
						: 'border-main bg-card shadow-sm hover:border-primary/30 focus:border-primary focus:ring-[3px] focus:ring-primary/10'}"
		/>
        
		{#if readonly}
			<div class="absolute right-3 text-muted">
				<Lock size={16} strokeWidth={2.5} />
			</div>
		{/if}
    </div>
</div>