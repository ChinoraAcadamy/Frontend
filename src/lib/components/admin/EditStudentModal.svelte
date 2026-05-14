<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/ui/Modal.svelte';
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

<Modal {isOpen} {onClose} maxWidth="450px" noPadding={true}>
	<div class="custom-modal-override flex flex-col">
		<div class="flex items-center justify-between border-b border-main bg-muted/5 p-6 rounded-t-[24px]">
			<div>
				<h2 class="text-xl font-bold text-main">
					{m.update_info ? m.update_info() : "Ma'lumotlarni yangilash"}
				</h2>
				<p class="mt-1 text-sm font-medium text-muted">@{student.username}</p>
			</div>
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
						<label for="edit_fname" class="ml-1 text-xs font-bold tracking-wide text-muted uppercase"
							>{m.profile_first_name ? m.profile_first_name() : 'Ism'}</label
						>
						<input
							id="edit_fname"
							name="firstName"
							type="text"
							bind:value={firstName}
							placeholder={m.enter_first_name ? m.enter_first_name() : 'Ism kiriting'}
							class="h-12 w-full rounded-xl border border-main bg-muted/5 px-4 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
						/>
					</div>

					<div class="space-y-2">
						<label for="edit_lname" class="ml-1 text-xs font-bold tracking-wide text-muted uppercase"
							>{m.profile_last_name ? m.profile_last_name() : 'Familiya'}</label
						>
						<input
							id="edit_lname"
							name="lastName"
							type="text"
							bind:value={lastName}
							placeholder={m.profile_last_name ? m.profile_last_name() : 'Familiya'}
							class="h-12 w-full rounded-xl border border-main bg-muted/5 px-4 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="edit_phone" class="ml-1 text-xs font-bold tracking-wide text-muted uppercase"
						>{m.profile_phone ? m.profile_phone() : 'Telefon raqam'}</label
					>
					<PhoneInput id="edit_phone" name="phoneNumber" bind:value={phoneNumber} placeholder={m.placeholder_phone ? m.placeholder_phone() : '+998 90 123 45 67'} />
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
</Modal>

<style>
	:global(.custom-modal-override) {
		display: flex;
		flex-direction: column;
	}
	:global(.modal-container:has(.custom-modal-override) .close-btn-absolute) {
		display: none;
	}
</style>
