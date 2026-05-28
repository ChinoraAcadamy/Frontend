<script lang="ts">
	let { activeTab = $bindable('uz') } = $props();
</script>

<div class="flex items-center gap-1 rounded-md border border-border bg-muted/10 p-1">
	<button
		type="button"
		class="rounded px-3 py-1 text-[11px] font-bold transition-colors {activeTab === 'uz'
			? 'bg-primary text-white shadow-sm'
			: 'text-muted hover:text-foreground'}"
		onclick={() => (activeTab = 'uz')}
	>
		UZ
	</button>
	<button
		type="button"
		class="rounded px-3 py-1 text-[11px] font-bold transition-colors {activeTab === 'ru'
			? 'bg-primary text-white shadow-sm'
			: 'text-muted hover:text-foreground'}"
		onclick={() => (activeTab = 'ru')}
	>
		RU
	</button>
</div>
