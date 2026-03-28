<!-- src/routes/login/+page.svelte -->
<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

	export let form;
	let loading = false;
</script>

<div class="min-h-screen bg-linear-to-br from-[#FDFAF7] via-[#F9F5F0] to-[#F3EDE5] flex items-center justify-center px-5 py-10">
	<div class="w-full max-w-105">

		<!-- Asosiy card -->
		<div
			class="overflow-hidden rounded-3xl border border-white/70 bg-white/85 backdrop-blur-2xl shadow-2xl shadow-black/5 transition-all duration-500 hover:shadow-primary/10"
		>
			<!-- Sarlavha qismi -->
			<div class="px-10 pt-12 pb-8 text-center">
				<h2 class="text-2xl font-semibold tracking-tight text-foreground">
					{m.login_title()}
				</h2>
				<p class="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
					{m.login_subtitle()}
				</p>
			</div>

			<!-- Forma -->
			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						loading = false;
						if (result.type === 'redirect') {
							await invalidateAll();
						}
						await update();
					};
				}}
				class="px-10 pb-12 space-y-7"
			>
				<div class="space-y-6">
					<!-- Username -->
					<div>
						<label
							for="username"
							class="mb-2 block text-sm font-medium text-foreground/80"
						>
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							required
							autocomplete="username"
							class="w-full rounded-2xl border border-border/70 bg-white/70 px-6 py-4 text-base transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
							placeholder="Username kiriting"
						/>
					</div>

					<!-- Parol -->
					<div>
						<label
							for="password"
							class="mb-2 block text-sm font-medium text-foreground/80"
						>
							{m.login_password_label()}
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							autocomplete="current-password"
							class="w-full rounded-2xl border border-border/70 bg-white/70 px-6 py-4 text-base transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
							placeholder={m.login_password_placeholder()}
						/>
					</div>
				</div>

				<!-- Xato xabari -->
				{#if form?.error}
					<div
						class="rounded-2xl bg-destructive/10 px-5 py-3.5 text-center text-sm font-medium text-destructive"
					>
						{form.error}
					</div>
				{/if}

				<!-- Kirish tugmasi -->
				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/95 hover:shadow-primary/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
				>
					{loading ? 'Kuting...' : m.login_button()}
				</button>

				<!-- Qo‘shimcha havola -->
				<div class="pt-3 text-center text-sm text-muted-foreground">
					Parolni unutdingizmi?  
					<a
						href={resolve('/register')}
						class="font-medium text-primary hover:underline transition-colors"
					>
						Qayta tiklash
					</a>
				</div>
			</form>
		</div>

		<!-- Pastki matn -->
		<p class="mt-10 text-center text-xs text-muted-foreground/80">
			© {new Date().getFullYear()} CHINORA FASHION ACADEMY • Barcha huquqlar himoyalangan
		</p>
	</div>
</div>