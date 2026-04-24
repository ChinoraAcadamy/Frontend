<script>
	import { CheckCircle2, Lock } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

	/** @type {{ index: string | number, title: string, duration?: string | number, status?: 'completed' | 'active' | 'locked' | 'available', href?: string, adminActions?: import('svelte').Snippet }} */
	let { index, title, duration, status = 'available', href, adminActions = undefined } = $props();
</script>

<div
	class="group relative flex items-center justify-between rounded-2xl transition-all duration-300
    {status === 'active'
		? 'bg-linear-to-r scale-[1.01] from-primary to-primary-hover text-white shadow-lg shadow-primary/20'
		: 'text-foreground hover:bg-muted/10 border border-transparent hover:border-border'}"
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
				class="text-sm font-medium {status === 'active' ? 'text-rose-100' : 'text-muted'}"
			>
				{index}
			</span>
			<span class="line-clamp-1 text-sm font-semibold sm:text-base">{title}</span>
		</div>

		<div class="flex items-center gap-4">
			{#if status === 'active'}
				<div
					class="flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm transition-transform hover:scale-105"
				>
					{m.lesson_start()}
				</div>
			{:else}
				{#if duration}
					<span
						class="flex items-center text-sm font-medium {status === 'locked'
							? 'text-muted/60'
							: 'text-muted'}"
					>
						{duration}
					</span>
				{/if}

				<div class="flex w-6 items-center justify-center">
					{#if status === 'completed'}
						<CheckCircle2 size={20} class="text-emerald-500" />
					{:else if status === 'locked'}
						<Lock size={18} class="text-muted/60" />
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
