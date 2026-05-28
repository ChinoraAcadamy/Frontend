<script lang="ts">
	let { status } = $props();
</script>

{#if status === 'Pending'}
	<span
		class="rounded-md border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600"
	>
		Pending
	</span>
{:else if status === 'Graded'}
	<span
		class="rounded-md border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600"
	>
		Graded
	</span>
{/if}
