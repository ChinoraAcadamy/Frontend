<script>
	import { CheckCircle2, Lock } from 'lucide-svelte';
	import { resolve } from '$app/paths';

	/** @type {{ index: string | number, title: string, duration?: string | number, status?: 'completed' | 'active' | 'locked' | 'available', href?: string, adminActions?: import('svelte').Snippet }} */
	let { index, title, duration, status = 'available', href, adminActions = undefined } = $props();
</script>

<div
	class="group relative flex items-center justify-between rounded-2xl transition-all duration-300
    {status === 'active'
		? 'bg-linear-to-r scale-[1.01] from-[#ed4b72] to-[#de3c61] text-white shadow-lg shadow-rose-200/50'
		: 'text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-100'}"
>
	{#if href}
		<a
			href={resolve(/** @type {any} */ (href))}
			class="absolute inset-0 z-10 rounded-2xl"
			aria-label={title}
		></a>
	{/if}

	<div class="pointer-events-none z-20 flex w-full items-center justify-between p-3 sm:px-5 sm:py-3.5">
		<div class="flex items-center gap-4 sm:gap-6">
			<span
				class="text-sm font-medium {status === 'active' ? 'text-rose-100' : 'text-slate-500'}"
			>
				{index}
			</span>
			<span class="line-clamp-1 text-sm font-semibold sm:text-base">{title}</span>
		</div>

		<div class="flex items-center gap-4">
			{#if status === 'active'}
				<div
					class="flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#ed4b72] shadow-sm transition-transform hover:scale-105"
				>
					Boshlash
				</div>
			{:else}
				{#if duration}
					<span
						class="flex items-center text-sm font-medium {status === 'locked'
							? 'text-slate-400'
							: 'text-slate-500'}"
					>
						{duration}
					</span>
				{/if}

				<div class="flex w-6 items-center justify-center">
					{#if status === 'completed'}
						<CheckCircle2 size={20} class="text-[#10b981]" />
					{:else if status === 'locked'}
						<Lock size={18} class="text-slate-400" />
					{/if}
				</div>
			{/if}

			{#if adminActions}
				<div class="pointer-events-auto relative z-30 flex items-center gap-2 border-l border-slate-200 pl-4">
					{@render adminActions()}
				</div>
			{/if}
		</div>
	</div>
</div>
