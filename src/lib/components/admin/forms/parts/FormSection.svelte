<script lang="ts">
	let { children, title, icon: Icon, extra = null } = $props();
</script>

<div class="rounded-lg border border-border bg-surface p-6">
	<div class="mb-5 flex items-center justify-between border-b border-border pb-4">
		<div class="flex items-center gap-2.5">
			{#if Icon}
				<div class="text-muted">
					<Icon size={18} />
				</div>
			{/if}
			<span class="text-base font-bold text-foreground tracking-tight">{title}</span>
		</div>
		{#if extra}
			{@render extra()}
		{/if}
	</div>

	<div class="space-y-4">
		{@render children()}
	</div>
</div>
