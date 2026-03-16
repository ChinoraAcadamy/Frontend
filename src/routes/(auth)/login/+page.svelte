<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

	export let form;
	let loading = false;
</script>

<div class="min-h-screen bg-linear-to-br from-[#F8F4F0] via-[#F1EAE3] to-[#EDE4D9] flex items-center justify-center p-6">
	<div class="w-full max-w-md">
		<!-- Logo / Brand -->
		<!-- <div class="text-center mb-10">
			<div class="inline-flex items-center gap-3 mb-4">
				<div class="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center">
					<span class="text-white text-2xl font-bold font-tarsk">C</span>
				</div>
				<h1 class="text-3xl font-bold font-tarsk tracking-tight text-primary">
					CHINORA
				</h1>
			</div>
			<p class="text-muted-foreground text-sm">Fashion Academy</p>
		</div> -->

		<!-- Card -->
		<div class="backdrop-blur-xl bg-white/80 border border-white/60 shadow-xl rounded-3xl overflow-hidden">
			
			<!-- Header -->
			<div class="px-8 pt-10 pb-6 text-center">
				<h2 class="text-2xl font-semibold text-foreground">
					{m.login_title()}
				</h2>
				<p class="mt-2 text-muted-foreground text-[15px]">
					{m.login_subtitle()}
				</p>
			</div>

			<!-- Form -->
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
				class="px-8 pb-10 space-y-6"
			>
				<div class="space-y-5">
					<!-- Username -->
					<div>
						<label for="username" class="block text-sm font-medium text-foreground/70 mb-1.5">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							required
							class="w-full px-5 py-3.5 bg-white border border-border rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground"
							placeholder="Username kiriting"
						/>
					</div>

					<!-- Password -->
					<div>
						<label for="password" class="block text-sm font-medium text-foreground/70 mb-1.5">
							{m.login_password_label()}
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							class="w-full px-5 py-3.5 bg-white border border-border rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground"
							placeholder={m.login_password_placeholder()}
						/>
					</div>
				</div>

				{#if form?.error}
					<div class="text-destructive text-sm text-center bg-destructive/10 py-3 px-4 rounded-2xl">
						{form.error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="w-full py-4 bg-primary hover:bg-primary/90 text-secondary font-semibold rounded-2xl shadow-lg shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.985]"
				>
					{loading ? 'Kutib turing...' : m.login_button()}
				</button>

				<!-- Qo'shimcha havolalar (kelajakda kerak bo'lsa) -->
				<div class="text-center text-xs text-muted-foreground pt-2">
					Parolni unutdingizmi? 
					<a href={resolve("/register")} class="text-primary hover:underline font-medium">Qayta tiklash</a>
				</div>
			</form>
		</div>

		<!-- Footer text -->
		<p class="text-center text-xs text-muted-foreground mt-8">
			© {new Date().getFullYear()} CHINORA FASHION ACADEMY
		</p>
	</div>
</div>