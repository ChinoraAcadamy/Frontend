<script>
    /* eslint-disable no-unused-vars */
    import { fly } from 'svelte/transition';
    let { count = 4 } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
    {#each Array(count) as _, i (i)}
        <div class="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-35 flex flex-col justify-between"
            transition:fly={{ y: 20, duration: 400, delay: i * 40 }}>
            <div class="flex items-start justify-between gap-4 mb-5">
                <div class="flex-1">
                    <div class="h-5 bg-slate-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
                    <div class="h-4 bg-slate-100 rounded-md w-1/2 animate-pulse"></div>
                </div>
                <div class="h-7 w-20 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-dashed border-slate-200">
                <div class="h-4 bg-slate-100 rounded-md w-1/3 animate-pulse"></div>
                <div class="h-9.5 w-9.5 bg-slate-200 rounded-[10px] animate-pulse"></div>
            </div>
        </div>
    {/each}
</div>
