<script>
	/* eslint-disable no-unused-vars */
	import { fly } from 'svelte/transition';
	let { count = 4 } = $props();
</script>

<div class="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
	{#each Array(count) as _, i (i)}
		<div
			class="flex min-h-35 flex-col justify-between rounded-[20px] border border-border bg-surface p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
			transition:fly={{ y: 20, duration: 400, delay: i * 40 }}
		>
			<div class="mb-5 flex items-start justify-between gap-4">
				<div class="flex-1">
					<div class="mb-2 h-5 w-3/4 animate-pulse rounded-md bg-muted/10"></div>
					<div class="h-4 w-1/2 animate-pulse rounded-md bg-muted/5"></div>
				</div>
				<div class="h-7 w-20 animate-pulse rounded-full bg-muted/10"></div>
			</div>
			<div class="flex items-center justify-between border-t border-dashed border-border pt-4">
				<div class="h-4 w-1/3 animate-pulse rounded-md bg-muted/5"></div>
				<div class="h-9.5 w-9.5 animate-pulse rounded-[10px] bg-muted/10"></div>
			</div>
		</div>
	{/each}
</div>
