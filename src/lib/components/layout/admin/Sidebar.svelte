<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { LogOut, X, PanelLeftClose, PanelLeftOpen } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		user,
		navItems = [],
		collapsed = $bindable(false),
		mobileOpen = $bindable(false)
	} = $props();

	let loading = $state(false);
	let currentPath = $derived($page.url.pathname);

	function isActive(item) {
		if (!item.href) return false;
		if (item.exact) return currentPath === item.href;
		return currentPath.startsWith(item.href);
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (mobileOpen = false)} />

{#if mobileOpen}
	<div
		class="fixed inset-0 z-800 bg-slate-900/30 backdrop-blur-sm lg:hidden"
		onclick={() => (mobileOpen = false)}
		aria-hidden="true"
	></div>
{/if}

<aside
	class="fixed top-0 bottom-0 left-0 z-1000 flex flex-col border-r border-slate-100 bg-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
    {collapsed ? 'w-[90px] px-3' : 'w-[290px] px-5'} 
    {mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
>
	<div
		class="relative flex items-center justify-center transition-all duration-300 {collapsed
			? 'py-3'
			: 'py-4'}"
	>
		<a href={resolve('/')} class="group relative flex w-full items-center justify-center">
			<div
				class="relative flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out
                {collapsed ? 'h-[52px] w-[52px] rounded-[20px]' : 'h-20 w-full rounded-[28px]'} 
                bg-linear-to-br from-[#9b1c48] to-[#d73a6a] shadow-lg shadow-rose-900/20"
			>
				<div
					class="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				></div>

				<div class="relative z-10 flex items-center justify-center gap-3 px-4">
					<img
						src="/logo/chinora-secondary.png"
						alt="Logo"
						class="h-9 w-9 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
					/>
					{#if !collapsed}
						<span class="text-xl font-black tracking-tight text-white transition-all duration-300">
							CHINORA
						</span>
					{/if}
				</div>
			</div>
		</a>

		<button
			class="absolute top-8 -right-2 rounded-full bg-white p-2 text-slate-400 shadow-lg lg:hidden"
			onclick={() => (mobileOpen = false)}
		>
			<X size={18} />
		</button>
	</div>

	<nav
		class="no-scrollbar flex flex-1 flex-col overflow-y-auto pb-4 transition-all {collapsed
			? 'gap-1'
			: 'gap-2'}"
	>
		{#each navItems as item (item.href || item.label)}
			{#if item.divider}
				<div class="my-3 flex items-center px-4">
					{#if !collapsed}
						<span class="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase"
							>{item.label}</span
						>
					{:else}
						<div class="h-px w-full bg-slate-100"></div>
					{/if}
				</div>
			{:else}
				{@const active = isActive(item)}
				{@const Icon = item.icon}
				<a
					href={resolve(item.href)}
					class="group relative flex items-center justify-center gap-4 rounded-2xl transition-all duration-300
                    {collapsed ? 'mx-auto h-[52px] w-[52px] p-3' : 'w-full px-4 py-3.5'}
                    {active
						? 'bg-[#9b1c48] text-white shadow-lg shadow-rose-900/15'
						: 'text-slate-500 hover:bg-slate-50 hover:text-[#9b1c48]'}"
					onclick={() => (mobileOpen = false)}
				>
					<div
						class="flex shrink-0 items-center justify-center transition-transform duration-300 group-active:scale-90"
					>
						<Icon size={22} strokeWidth={active ? 2.5 : 2} />
					</div>

					{#if !collapsed}
						<span class="flex-1 truncate text-[15px] font-semibold">{item.label}</span>
						{#if active}
							<div class="h-1.5 w-1.5 rounded-full bg-white/60"></div>
						{/if}
					{/if}

					{#if collapsed}
						<div
							class="absolute left-full z-50 ml-4 hidden rounded-md bg-slate-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white group-hover:block"
						>
							{item.label}
						</div>
					{/if}
				</a>
			{/if}
		{/each}
	</nav>

	<div class="mt-auto flex flex-col transition-all {collapsed ? 'gap-2 pb-6' : 'gap-4 pb-8'}">
		<button
			class="flex items-center justify-center gap-3 px-4 py-2 text-slate-400 transition-all hover:text-[#9b1c48]"
			onclick={() => (collapsed = !collapsed)}
		>
			{#if collapsed}
				<PanelLeftOpen size={20} />
			{:else}
				<div class="flex w-full items-center gap-3">
					<PanelLeftClose size={20} />
					<span class="text-sm font-medium">{m.sidebar_collapse?.() || "Yig'ish"}</span>
				</div>
			{/if}
		</button>

		<div
			class="relative flex items-center border border-slate-100 bg-slate-50/70 transition-all duration-300
            {collapsed
				? 'mx-auto w-[60px] flex-col gap-2 rounded-[32px] p-2'
				: 'flex-row gap-3 rounded-[24px] p-2.5'}"
		>
			<div class="relative flex shrink-0 items-center justify-center">
				{#if user?.picture}
					<img
						src={user.picture}
						alt="Avatar"
						class="h-11 w-11 rounded-full object-cover shadow-sm transition-all duration-500"
					/>
				{:else}
					<div
						class="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-rose-100 to-rose-200 text-lg font-bold text-[#9b1c48] shadow-sm"
					>
						{user?.username?.[0]?.toUpperCase() || 'U'}
					</div>
				{/if}
				<div
					class="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"
				></div>
			</div>

			{#if !collapsed}
				<div class="min-w-0 flex-1 transition-all duration-300">
					<p class="text-[14px] font-bold text-slate-900">
						{user?.first_name || user?.username || 'Foydalanuvchi'}
					</p>
					<p class="text-[11px] font-semibold tracking-wider text-rose-600 uppercase">
						{user?.role || 'Admin'}
					</p>
				</div>
			{/if}

			<form
				method="POST"
				action="/logout"
				class="flex w-full shrink-0 justify-center"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => await update();
				}}
			>
				<button
					type="submit"
					class="border-slate-150 flex items-center justify-center rounded-[14px] border bg-white text-slate-400 shadow-sm transition-all hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600
                    {collapsed ? 'h-10 w-10' : 'h-10 w-10'}"
					title="Chiqish"
				>
					{#if loading}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-rose-600 border-t-transparent"
						></div>
					{:else}
						<LogOut size={16} strokeWidth={2.5} />
					{/if}
				</button>
			</form>
		</div>
	</div>
</aside>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	aside {
		will-change: width, transform;
	}
</style>
