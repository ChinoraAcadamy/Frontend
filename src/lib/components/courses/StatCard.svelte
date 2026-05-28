<script lang="ts">
	let { title, value, isPrimary = false, children } = $props();
</script>

<div
	class="flex h-35 flex-col justify-between rounded-3xl p-5 transition-transform hover:-translate-y-1 sm:p-6
    {isPrimary
		? 'bg-linear-to-br from-[#ed4b72] to-[#de3c61] text-white shadow-lg shadow-rose-900/20'
		: 'border border-border bg-surface text-foreground shadow-sm'}"
>
	<h3
		class="text-[15px] font-semibold {isPrimary ? 'opacity-90' : 'w-20 leading-tight text-muted'}"
	>
		{title}
	</h3>

	<div class="flex items-end justify-between">
		<span class="text-3xl font-bold sm:text-4xl">{value}</span>
		<div class={isPrimary ? 'text-white/80' : 'text-slate-400'}>
			{@render children()}
		</div>
	</div>
</div>
