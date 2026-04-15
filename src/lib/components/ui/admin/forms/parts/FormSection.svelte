<script lang="ts">
	let { children, title, icon: Icon, extra = null } = $props();
</script>

<div class="rounded-lg border border-slate-200 bg-white p-6">
	<div class="mb-5 flex items-center justify-between border-b border-slate-50 pb-4">
		<div class="flex items-center gap-2.5">
			{#if Icon}
				<div class="text-slate-400">
					<Icon size={18} />
				</div>
			{/if}
			<span class="text-base font-bold text-slate-700 tracking-tight">{title}</span>
		</div>
		{#if extra}
			{@render extra()}
		{/if}
	</div>

	<div class="space-y-4">
		{@render children()}
	</div>
</div>
