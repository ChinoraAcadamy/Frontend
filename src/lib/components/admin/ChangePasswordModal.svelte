<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { X, Loader2, CheckCircle2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { isOpen, studentName, onClose } = $props();

	let loading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	// Modal har safar ochilganda statelarni tozalaymiz
	$effect(() => {
		if (isOpen) {
			loading = false;
			errorMessage = '';
			successMessage = '';
		}
	});

	// Orqa fonni qulflash (Mobil UX uchun juda muhim)
	$effect(() => {
		if (browser) {
			if (isOpen) document.body.style.overflow = 'hidden';
			else document.body.style.overflow = '';
		}
		return () => {
			if (browser) document.body.style.overflow = '';
		};
	});

	// Form Action natijasini ushlash uchun funksiya
	const handleSubmit = () => {
		loading = true;
		errorMessage = '';
		successMessage = '';

		return async ({ result, update }) => {
			loading = false;
			if (result.type === 'failure') {
				errorMessage = result.data?.error || (m.error_occurred ? m.error_occurred() : 'Xatolik yuz berdi.');
			} else if (result.type === 'success') {
				successMessage = result.data?.message || (m.msg_password_changed ? m.msg_password_changed() : "Muvaffaqiyatli o'zgartirildi.");
				// 1.5 soniyadan keyin modalni avtomatik yopish
				setTimeout(() => {
					onClose();
				}, 1500);
			}
			// Formani tozalash (faqat muvaffaqiyatli bo'lsa)
			await update({ reset: result.type === 'success' });
		};
	};
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
	>
		<div
			class="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-3xl border border-main bg-card shadow-2xl duration-200"
		>
			<div class="flex items-center justify-between border-b border-main px-6 py-4">
				<h3 class="text-lg font-bold text-main">
					{m.modal_change_password_title ? m.modal_change_password_title() : 'Parolni almashtirish'}
				</h3>
				<button
					onclick={onClose}
					class="rounded-full p-1 text-muted transition-colors hover:bg-muted/10 hover:text-main"
				>
					<X size={20} />
				</button>
			</div>

			<form
				method="POST"
				action="?/changePassword"
				use:enhance={handleSubmit}
				class="space-y-5 p-6"
			>
				<p class="text-sm text-muted">
					{m.modal_change_password_subtitle
						? m.modal_change_password_subtitle({ name: studentName })
						: `${studentName} uchun yangi parol kiriting.`}
				</p>

				{#if errorMessage}
					<div
						class="rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm font-medium text-primary"
					>
						{errorMessage}
					</div>
				{/if}

				{#if successMessage}
					<div
						class="flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 p-3 text-sm font-medium text-success"
					>
						<CheckCircle2 size={16} />
						{successMessage}
					</div>
				{/if}

				<div class="space-y-4">
					<div class="space-y-1.5">
						<label for="new_password" class="text-sm font-medium text-main">
							{m.login_password_label ? m.login_password_label() : 'Parol'} *
						</label>
						<input
							type="password"
							id="new_password"
							name="new_password"
							required
							minlength="8"
							class="w-full rounded-xl border border-main bg-muted/5 px-4 py-2.5 text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary"
							placeholder={m.placeholder_min_length ? m.placeholder_min_length() : 'Kamida 8 ta belgi'}
						/>
					</div>

					<div class="space-y-1.5">
						<label for="confirm_password" class="text-sm font-medium text-main">
							{m.label_confirm_password ? m.label_confirm_password() : 'Parolni tasdiqlash'} *
						</label>
						<input
							type="password"
							id="confirm_password"
							name="confirm_password"
							required
							minlength="1"
							class="w-full rounded-xl border border-main bg-muted/5 px-4 py-2.5 text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary"
							placeholder={m.placeholder_password_confirm ? m.placeholder_password_confirm() : 'Parolni qayta kiriting'}
						/>
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={onClose}
						disabled={loading}
						class="rounded-xl px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-muted/10 hover:text-main disabled:opacity-50"
					>
						{m.admin_btn_cancel ? m.admin_btn_cancel() : 'Bekor qilish'}
					</button>
					<button
						type="submit"
						disabled={loading}
						class="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-70"
					>
						{#if loading}
							<Loader2 size={16} class="animate-spin" />
							{m.profile_saving ? m.profile_saving() : 'Saqlanmoqda...'}
						{:else}
							{m.profile_save ? m.profile_save() : 'Saqlash'}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
