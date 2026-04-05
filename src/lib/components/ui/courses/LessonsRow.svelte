<script>
	import { resolve } from '$app/paths';
	import { CheckCircle2, Lock } from 'lucide-svelte';

	/** @type {{ index: string | number, title: string, duration?: string | number, status?: 'completed' | 'active' | 'locked' | 'available', href?: string }} */
	let { index, title, duration, status = 'available', href } = $props();
</script>

{#snippet rowContent()}
	<div class="flex items-center gap-4 sm:gap-6">
		<span class="text-sm font-medium {status === 'active' ? 'text-rose-100' : 'text-slate-500'}">
			Lesson {index}
		</span>
		<span class="line-clamp-1 text-sm font-semibold sm:text-base">{title}</span>
	</div>

	<div class="flex shrink-0 items-center gap-4">
		{#if status === 'active'}
			<div
				class="rounded-xl bg-white px-5 py-2 text-sm font-bold text-[#ed4b72] shadow-sm transition-transform hover:scale-105"
			>
				Boshlash
			</div>
		{:else}
			{#if duration}
				<span
					class="text-sm font-medium {status === 'locked' ? 'text-slate-400' : 'text-slate-500'}"
				>
					{duration}
				</span>
			{/if}

			<div class="flex w-6 justify-center">
				{#if status === 'completed'}
					<CheckCircle2 size={20} class="text-[#10b981]" />
				{:else if status === 'locked'}
					<Lock size={18} class="text-slate-400" />
				{/if}
			</div>
		{/if}
	</div>
{/snippet}

{#if href}
	<a
		href={resolve(/** @type {any} */ (href))}
		class="flex items-center justify-between rounded-2xl p-3 transition-all duration-300 sm:px-5 sm:py-3.5
        {status === 'active'
			? 'scale-[1.01] bg-linear-to-r from-[#ed4b72] to-[#de3c61] text-white shadow-lg shadow-rose-200/50'
			: 'text-slate-700 hover:bg-slate-50'}"
	>
		{@render rowContent()}
	</a>
{:else}
	<div
		class="flex items-center justify-between rounded-2xl p-3 transition-all duration-300 sm:px-5 sm:py-3.5
        {status === 'active'
			? 'scale-[1.01] bg-linear-to-r from-[#ed4b72] to-[#de3c61] text-white shadow-lg shadow-rose-200/50'
			: 'text-slate-700 hover:bg-slate-50'} 
        {status === 'locked' ? 'pointer-events-none opacity-60' : ''}"
	>
		{@render rowContent()}
	</div>
{/if}
