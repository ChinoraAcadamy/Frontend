<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';

	let { title, children, adminActions = undefined } = $props();
	let isOpen = $state(true); // Default holatda ochiq turadi
</script>

<div class="mb-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
	<div class="flex items-center justify-between p-5 transition-colors hover:bg-muted/10 sm:p-6">
		<button onclick={() => (isOpen = !isOpen)} class="flex flex-1 items-center gap-3 text-left">
			<ChevronDown
				size={20}
				class="text-muted transition-transform duration-300 {isOpen ? 'rotate-180' : ''}"
			/>
			<h3 class="text-lg font-bold text-foreground">{title}</h3>
		</button>

		{#if adminActions}
			<div class="flex items-center gap-2 pl-4">
				{@render adminActions()}
			</div>
		{/if}
	</div>

	{#if isOpen}
		<div class="space-y-1 px-2 pb-4 sm:px-4 sm:pb-4">
			{@render children()}
		</div>
	{/if}
</div>
