<script lang="ts">
	import { X } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';

	let { isOpen = false, student = null, onClose } = $props();

	let isSubmitting = $state(false);

	// Form qiymatlarini mahalliy holatda ($state) saqlaymiz.
	// $derived ishlatsak, inputda yozganda muammo bo'lishi mumkin edi.
	let firstName = $state('');
	let lastName = $state('');
	let phoneNumber = $state('');
	let isActive = $state(true);

	$effect(() => {
		if (isOpen && student) {
			firstName = student.first_name ?? '';
			lastName = student.last_name ?? '';
			phoneNumber = student.phone_number ?? student.phone ?? '';
			isActive = student.is_active ?? true;
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
</script>

{#if isOpen && student}
	<div
		class="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="w-full max-w-md overflow-hidden rounded-[24px] border border-main bg-card shadow-2xl"
			transition:fly={{ y: 20, duration: 300, opacity: 0 }}
		>
			<div class="flex items-center justify-between border-b border-main bg-muted/5 p-6">
				<div>
					<h2 class="text-xl font-bold text-main">
						{m.update_info ? m.update_info() : "Ma'lumotlarni yangilash"}
					</h2>
					<p class="mt-1 text-sm font-medium text-muted">@{student.username}</p>
				</div>
				<button
					onclick={onClose}
					class="rounded-full border border-main bg-card p-2 text-muted shadow-sm transition-all hover:bg-muted/10 active:scale-90"
				>
					<X size={18} strokeWidth={2.5} />
				</button>
			</div>

			<form
				method="POST"
				action="?/updateStudent"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="space-y-5 p-6"
			>
				<input type="hidden" name="studentId" value={student.id} />

				<input type="hidden" name="isActive" value={isActive.toString()} />

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<label class="ml-1 text-xs font-bold tracking-wide text-muted uppercase"
							>{m.profile_first_name ? m.profile_first_name() : 'Ism'}</label
						>
						<input
							name="firstName"
							type="text"
							bind:value={firstName}
							placeholder={m.enter_first_name ? m.enter_first_name() : 'Ism kiriting'}
							class="h-12 w-full rounded-xl border border-main bg-muted/5 px-4 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
						/>
					</div>

					<div class="space-y-2">
						<label class="ml-1 text-xs font-bold tracking-wide text-muted uppercase"
							>{m.profile_last_name ? m.profile_last_name() : 'Familiya'}</label
						>
						<input
							name="lastName"
							type="text"
							bind:value={lastName}
							placeholder={m.profile_last_name ? m.profile_last_name() : 'Familiya'}
							class="h-12 w-full rounded-xl border border-main bg-muted/5 px-4 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label class="ml-1 text-xs font-bold tracking-wide text-muted uppercase"
						>{m.profile_phone ? m.profile_phone() : 'Telefon raqam'}</label
					>
					<PhoneInput name="phoneNumber" bind:value={phoneNumber} placeholder={m.placeholder_phone ? m.placeholder_phone() : '+998 90 123 45 67'} />
				</div>

				<div class="flex gap-3 border-t border-main pt-4">
					<button
						type="button"
						onclick={onClose}
						class="flex-1 rounded-xl bg-muted/10 py-3.5 font-bold text-muted transition-all hover:bg-muted/20 active:scale-95"
					>
						{m.admin_students_cancel ? m.admin_students_cancel() : 'Bekor qilish'}
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex-1 rounded-xl bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-60"
					>
						{isSubmitting
							? m.profile_saving
								? m.profile_saving()
								: 'Saqlanmoqda...'
							: m.profile_save
								? m.profile_save()
								: 'Saqlash'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
