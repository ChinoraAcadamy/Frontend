<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Home, AlertTriangle, ShieldAlert, SearchX, ServerCrash } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';

	// Xatolik turiga qarab mos ikonkalar va matnlar
	const errorConfig = {
		404: {
			icon: SearchX,
			color: 'text-[#ed4b72]',
			bg: 'bg-rose-50',
			title: m.error_page_title_404,
			desc: m.error_page_desc_404
		},
		401: {
			icon: ShieldAlert,
			color: 'text-amber-600',
			bg: 'bg-amber-50',
			title: m.error_page_title_401,
			desc: m.error_page_desc_401
		},
		403: {
			icon: AlertTriangle,
			color: 'text-rose-600',
			bg: 'bg-rose-50',
			title: m.error_page_title_403,
			desc: m.error_page_desc_403
		},
		500: {
			icon: ServerCrash,
			color: 'text-red-600',
			bg: 'bg-red-50',
			title: m.error_page_title_500,
			desc: m.error_page_desc_500
		}
	};

	const status = $derived($page.status);

	// Agar kutilmagan status kelsa, default holatni olamiz
	const info = $derived(
		errorConfig[status] ?? {
			icon: AlertTriangle,
			color: 'text-slate-600',
			bg: 'bg-slate-100',
			title: m.error_page_title_default,
			desc: m.error_page_desc_default
		}
	);
</script>

<div
	class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FCF9F5] p-6 font-sans"
>
	<!-- Decorative elements for premium feel -->
	<div
		class="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#ed4b72]/5 blur-[120px]"
	></div>
	<div
		class="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[#E7CBAA]/20 blur-[120px]"
	></div>

	<div
		class="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-xl rounded-[40px] border border-white bg-white/80 p-8 text-center shadow-2xl shadow-rose-900/5 backdrop-blur-xl duration-700 sm:p-16"
	>
		<div class="mb-10 flex justify-center">
			<div
				class={`flex h-24 w-24 items-center justify-center rounded-[32px] ${info.bg} shadow-xl ring-12 shadow-slate-200/50 ring-white`}
			>
				<info.icon class={`h-12 w-12 ${info.color}`} strokeWidth={1.5} />
			</div>
		</div>

		<div
			class="mb-6 inline-block rounded-full bg-slate-900 px-5 py-2 text-xs font-black tracking-[0.2em] text-white uppercase"
		>
			Error {status}
		</div>

		<h1 class="mb-4 text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl">
			{info.title()}
		</h1>

		<p
			class="mx-auto mb-10 max-w-md text-base leading-relaxed font-medium text-slate-500 sm:text-lg"
		>
			{info.desc()}
		</p>

		{#if $page.error?.message}
			<div
				class="mb-10 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 text-left backdrop-blur-sm"
			>
				<div class="mb-3 flex items-center gap-2">
					<div class="h-1.5 w-1.5 rounded-full bg-[#ed4b72]"></div>
					<p class="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
						{m.error_technical_details()}
					</p>
				</div>
				<div class="rounded-xl border border-slate-100/50 bg-white/50 p-4">
					<code class="font-mono text-sm leading-relaxed break-all text-slate-600">
						{$page.error.message}
					</code>
				</div>
			</div>
		{/if}

		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<button
				onclick={() => history.back()}
				class="group flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 py-4 font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
			>
				<ArrowLeft size={20} class="transition-transform group-hover:-translate-x-1" />
				{m.btn_back()}
			</button>

			<button
				onclick={() => goto(resolve('/'))}
				class="group flex items-center justify-center gap-3 rounded-2xl bg-[#ed4b72] px-8 py-4 font-bold text-white shadow-xl shadow-rose-500/25 transition-all hover:bg-[#d93a5f] active:scale-95"
			>
				<Home size={20} class="transition-transform group-hover:scale-110" />
				{m.btn_home()}
			</button>
		</div>
	</div>
</div>

<style>
	/* Premium Typography */
	h1 {
		font-family: 'Tarsk', 'Inter', sans-serif;
	}
</style>
