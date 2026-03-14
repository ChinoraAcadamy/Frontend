<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';

	async function handleRegister() {
		if (!name || !email || !password) {
			error = m.register_error_required();
			return;
		}
		if (password !== confirmPassword) {
			error = m.register_error_password_match();
			return;
		}
		error = '';
		alert(m.register_success()); // demo
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
	<div
		class="w-full max-w-md backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-primary/20"
	>
		<div class="p-8 pb-4 text-center">
			<h1 class="text-3xl font-bold text-foreground tracking-tight">
				{m.register_title()}
			</h1>
			<p class="mt-2 text-muted-foreground">
				{m.register_subtitle()}
			</p>
		</div>

		<form on:submit|preventDefault={handleRegister} class="px-8 pb-8 space-y-6">
			<div>
				<label for="name" class="block text-sm font-medium text-foreground/80 mb-1.5">
					{m.register_name_label()}
				</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					class="w-full px-4 py-3 rounded-lg bg-background/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-foreground placeholder:text-muted-foreground"
					placeholder={m.register_name_placeholder()}
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-foreground/80 mb-1.5">
					{m.register_email_label()}
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full px-4 py-3 rounded-lg bg-background/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-foreground placeholder:text-muted-foreground"
					placeholder={m.register_email_placeholder()}
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-foreground/80 mb-1.5">
					{m.register_password_label()}
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full px-4 py-3 rounded-lg bg-background/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-foreground placeholder:text-muted-foreground"
					placeholder={m.register_password_placeholder()}
				/>
			</div>

			<div>
				<label for="confirm-password" class="block text-sm font-medium text-foreground/80 mb-1.5">
					{m.register_confirm_password_label()}
				</label>
				<input
					id="confirm-password"
					type="password"
					bind:value={confirmPassword}
					required
					class="w-full px-4 py-3 rounded-lg bg-background/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-foreground placeholder:text-muted-foreground"
					placeholder={m.register_confirm_password_placeholder()}
				/>
			</div>

			{#if error}
				<p class="text-destructive text-sm text-center">{error}</p>
			{/if}

			<button
				type="submit"
				class="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-95"
			>
				{m.register_button()}
			</button>

			<p class="mt-6 text-center text-sm text-muted-foreground">
				{m.register_have_account()}
				<a href={resolve("/login")} class="text-primary hover:text-primary/80 font-medium">
					{m.register_login_link()}
				</a>
			</p>
		</form>
	</div>
</div>