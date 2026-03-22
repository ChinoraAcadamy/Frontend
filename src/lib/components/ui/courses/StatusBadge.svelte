<script lang="ts">
    let { status } = $props();
</script>

{#if status === 'Pending'}
    <span class="px-3 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-600 border border-amber-200">
        Pending
    </span>
{:else if status === 'Graded'}
    <span class="px-3 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-600 border border-emerald-200">
        Graded
    </span>
{/if}