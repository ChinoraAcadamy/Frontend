<script>
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';
	import { Loader2, ArrowRight, User, LockKeyhole } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	export let form;
	let loading = false;
</script>

<div
	class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FDFBF9] px-4 selection:bg-zinc-900 selection:text-white"
>
	<div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
		<div
			class="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-rose-100/40 blur-[120px]"
		></div>
		<div
			class="absolute top-[50%] -right-[10%] h-[60%] w-[40%] rounded-full bg-orange-50/50 blur-[100px]"
		></div>
	</div>

	<div
		class="relative z-10 w-full max-w-[420px]"
		in:fly={{ y: 30, duration: 800, delay: 100, opacity: 0 }}
	>
		<div class="mb-8 text-center">
			<h1 class="mb-6 text-[10px] font-bold tracking-[0.35em] text-zinc-400 uppercase">
				Chinora Fashion Academy
			</h1>
			<h2 class="text-3xl font-medium tracking-tight text-zinc-900">
				{m.login_title ? m.login_title() : 'Tizimga kirish'}
			</h2>
			<p class="mt-2.5 text-sm text-zinc-500">
				{m.login_subtitle ? m.login_subtitle() : "Davom etish uchun o'z hisobingizga kiring"}
			</p>
		</div>

		<div
			class="rounded-4xl border border-white bg-white/70 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] backdrop-blur-2xl"
		>
			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="space-y-5"
			>
				<div class="space-y-1.5">
					<label
						for="username"
						class="ml-1 text-xs font-semibold tracking-wider text-zinc-600 uppercase"
					>
						Username
					</label>
					<div class="relative flex items-center transition-all focus-within:scale-[1.01]">
						<User class="absolute left-4 h-5 w-5 text-zinc-400" strokeWidth={1.5} />
						<input
							id="username"
							name="username"
							type="text"
							required
							autocomplete="username"
							class="w-full rounded-2xl border border-zinc-200/80 bg-white/50 py-4 pr-4 pl-12 text-sm font-medium text-zinc-900 transition-all outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
							placeholder="Loginingizni kiriting"
						/>
					</div>
				</div>

				<div class="space-y-1.5">
					<label
						for="password"
						class="ml-1 text-xs font-semibold tracking-wider text-zinc-600 uppercase"
					>
						{m.login_password_label ? m.login_password_label() : 'Parol'}
					</label>
					<div class="relative flex items-center transition-all focus-within:scale-[1.01]">
						<LockKeyhole class="absolute left-4 h-5 w-5 text-zinc-400" strokeWidth={1.5} />
						<input
							id="password"
							name="password"
							type="password"
							required
							autocomplete="current-password"
							class="w-full rounded-2xl border border-zinc-200/80 bg-white/50 py-4 pr-4 pl-12 text-sm font-medium text-zinc-900 transition-all outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
							placeholder={m.login_password_placeholder
								? m.login_password_placeholder()
								: 'Parolingizni kiriting'}
						/>
					</div>
				</div>

				{#if form?.error}
					<div
						in:fade={{ duration: 200 }}
						class="rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-center text-sm font-medium text-rose-600"
					>
						{form.error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="group relative mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
				>
					{#if loading}
						<Loader2 class="h-5 w-5 animate-spin" />
						<span>Kuting...</span>
					{:else}
						<span>{m.login_button ? m.login_button() : 'Tizimga kirish'}</span>
						<ArrowRight
							class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
							strokeWidth={2.5}
						/>
					{/if}
				</button>

				<div class="pt-4 text-center">
					<p class="text-xs text-zinc-500">
						Parolni unutdingizmi? <br class="sm:hidden" />
						<span class="font-medium text-zinc-800">Administratorga murojaat qiling.</span>
					</p>
				</div>
			</form>
		</div>

		<div class="mt-12 text-center text-[11px] font-medium tracking-wide text-zinc-400">
			© {new Date().getFullYear()} CHINORA FASHION ACADEMY
		</div>
	</div>
</div>
