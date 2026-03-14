<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

	let email = '';
	let password = '';
	let error = '';

	async function handleLogin() {
		// Bu yerda haqiqiy API chaqiruvi bo'ladi (masalan fetch('/api/login'))
		// Hozircha demo
		if (!email || !password) {
			error = m.login_error_required();
			return;
		}
		error = '';
		alert(m.login_success()); // demo
		// goto('/profile');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
	<div
		class="w-full max-w-md backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-primary/20"
	>
		<!-- Header -->
		<div class="p-8 pb-4 text-center">
			<h1 class="text-3xl font-bold text-foreground tracking-tight">
				{m.login_title()}
			</h1>
			<p class="mt-2 text-muted-foreground">
				{m.login_subtitle()}
			</p>
		</div>

		<!-- Form -->
		<form on:submit|preventDefault={handleLogin} class="px-8 pb-8 space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium text-foreground/80 mb-1.5">
					{m.login_email_label()}
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full px-4 py-3 rounded-lg bg-background/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-foreground placeholder:text-muted-foreground"
					placeholder={m.login_email_placeholder()}
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-foreground/80 mb-1.5">
					{m.login_password_label()}
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full px-4 py-3 rounded-lg bg-background/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-foreground placeholder:text-muted-foreground"
					placeholder={m.login_password_placeholder()}
				/>
			</div>

			<!-- Error -->
			{#if error}
				<p class="text-destructive text-sm text-center">{error}</p>
			{/if}

			<!-- Submit -->
			<button
				type="submit"
				class="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-95"
			>
				{m.login_button()}
			</button>

			<!-- Divider -->
			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-border/50" />
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-card/30 text-muted-foreground backdrop-blur-sm rounded-full">
						{m.login_or()}
					</span>
				</div>
			</div>

			<!-- Google button (demo) -->
			<button
				type="button"
				class="w-full py-3 px-4 bg-background border border-border rounded-lg font-medium text-foreground hover:bg-muted/50 transition-all flex items-center justify-center gap-3"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.46 3.09-7.8z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.75 20.99 6.98 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
						fill="#FBBC05"
					/>
					<path
						d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.98 0 2.75 2.01.96 5.34l4.55 2.45C6.42 5.02 9 4.98 12 4.98z"
						fill="#EA4335"
					/>
				</svg>
				{m.login_google()}
			</button>

			<!-- Register link -->
			<p class="mt-6 text-center text-sm text-muted-foreground">
				{m.login_no_account()}
				<a href={resolve("/register")} class="text-primary hover:text-primary/80 font-medium">
					{m.login_register_link()}
				</a>
			</p>
		</form>
	</div>
</div>