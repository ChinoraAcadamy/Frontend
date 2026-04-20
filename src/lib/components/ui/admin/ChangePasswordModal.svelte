<script lang="ts">
	import { enhance } from '$app/forms';
	import { X, Loader2, CheckCircle2 } from 'lucide-svelte';

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

	// Form Action natijasini ushlash uchun funksiya
	const handleSubmit = () => {
		loading = true;
		errorMessage = '';
		successMessage = '';

		return async ({ result, update }) => {
			loading = false;
			if (result.type === 'failure') {
				errorMessage = result.data?.error || 'Xatolik yuz berdi.';
			} else if (result.type === 'success') {
				successMessage = result.data?.message || "Muvaffaqiyatli o'zgartirildi.";
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
			class="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl duration-200"
		>
			<div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
				<h3 class="text-lg font-bold text-slate-800">Parolni almashtirish</h3>
				<button
					onclick={onClose}
					class="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
				<p class="text-sm text-slate-500">
					<span class="font-semibold text-slate-700">{studentName}</span> uchun yangi parol kiriting.
				</p>

				{#if errorMessage}
					<div
						class="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600"
					>
						{errorMessage}
					</div>
				{/if}

				{#if successMessage}
					<div
						class="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-600"
					>
						<CheckCircle2 size={16} />
						{successMessage}
					</div>
				{/if}

				<div class="space-y-4">
					<div class="space-y-1.5">
						<label for="new_password" class="text-sm font-medium text-slate-700"
							>Yangi parol *</label
						>
						<input
							type="password"
							id="new_password"
							name="new_password"
							required
							minlength="8"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-1 focus:ring-[#ed4b72]"
							placeholder="Kamida 8 ta belgi"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="confirm_password" class="text-sm font-medium text-slate-700"
							>Parolni tasdiqlash *</label
						>
						<input
							type="password"
							id="confirm_password"
							name="confirm_password"
							required
							minlength="1"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-1 focus:ring-[#ed4b72]"
							placeholder="Parolni qayta kiriting"
						/>
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={onClose}
						disabled={loading}
						class="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
					>
						Bekor qilish
					</button>
					<button
						type="submit"
						disabled={loading}
						class="flex items-center gap-2 rounded-xl bg-[#ed4b72] px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-rose-200 transition-colors hover:bg-[#de3c61] disabled:opacity-70"
					>
						{#if loading}
							<Loader2 size={16} class="animate-spin" />
							Saqlanmoqda...
						{:else}
							Saqlash
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
