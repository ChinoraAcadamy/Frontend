<script lang="ts">
	import { ChevronDown, Search } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	let { modules = [], modulePk = $bindable(null) } = $props();

	let isDropdownOpen = $state(false);
	let searchQuery = $state('');

	let filteredModules = $derived(
		modules.filter((mod) => mod.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function selectModule(id) {
		modulePk = id;
		isDropdownOpen = false;
		searchQuery = '';
	}

	let selectedModule = $derived(modules.find((m) => m.id === modulePk));
</script>

<div class="relative flex flex-col gap-1.5">
	<label for="module" class="pl-0.5 text-[12px] font-bold tracking-wider text-muted uppercase">
		{m.label_modul ? m.label_modul() : 'Modul'}
	</label>
	<button
		type="button"
		onclick={() => (isDropdownOpen = !isDropdownOpen)}
		class="flex w-full items-center justify-between rounded-lg border bg-surface px-4 py-3 transition-colors outline-none
               {isDropdownOpen ? 'border-primary' : 'border-border hover:border-primary/30'}"
	>
		{#if selectedModule}
			<span class="text-sm font-medium text-foreground">{selectedModule.title}</span>
			<input type="hidden" name="module_pk" value={modulePk} />
		{:else}
			<span class="text-sm text-muted/50">
				{m.placeholder_select_module ? m.placeholder_select_module() : 'Modulni tanlang...'}
			</span>
		{/if}
		<ChevronDown
			size={16}
			class="text-muted transition-transform duration-200 {isDropdownOpen ? 'rotate-180' : ''}"
		/>
	</button>

	{#if isDropdownOpen}
		<div
			class="absolute top-[calc(100%+4px)] right-0 left-0 z-50 overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
			transition:slide={{ duration: 150 }}
		>
			<div class="flex items-center gap-2 border-b border-border bg-muted/5 px-3 py-2">
				<Search size={14} class="text-muted" />
				<input
					bind:value={searchQuery}
					placeholder={m.admin_courses_search_placeholder
						? m.admin_courses_search_placeholder()
						: 'Qidirish...'}
					autocomplete="off"
					class="w-full border-none bg-transparent text-xs text-foreground outline-none"
				/>
			</div>
			<div class="max-h-[200px] divide-y divide-border overflow-y-auto">
				{#each filteredModules as module (module.id)}
					<button
						type="button"
						class="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-muted/5"
						onclick={() => selectModule(module.id)}
					>
						<span class="text-xs font-semibold text-foreground">{module.title}</span>
						<span class="text-[10px] font-black text-muted/40 uppercase"
							>{module.lessons_count || 0}</span
						>
					</button>
				{:else}
					<div class="px-4 py-4 text-center text-xs text-muted">
						{m.not_found ? m.not_found() : 'Topilmadi'}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
