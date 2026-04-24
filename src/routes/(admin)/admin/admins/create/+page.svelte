<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { showToast } from '@/lib/utils/toast.js';
	import InputField from '@/lib/components/ui/InputField.svelte';
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';
	import { UserPlus, User, ShieldCheck, Save, Loader2 } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	let { form } = $props();
	let isSubmitting = $state(false);

	// Client-side validation states
	let username = $state('');
	let password = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let phoneNumber = $state('');

	$effect(() => {
		if (form?.success) {
			showToast(
				m.admin_admin_create_success
					? m.admin_admin_create_success()
					: 'Yangi admin muvaffaqiyatli yaratildi!',
				{ type: 'success' }
			);
			// Clear fields
			username = '';
			password = '';
			firstName = '';
			lastName = '';
			phoneNumber = '';
		}
		if (form?.error) {
			showToast(form.error, { type: 'error' });
		}
	});
</script>

<div class="bg-main min-h-screen pb-20 font-sans md:pb-10">
	<main class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="mb-8" in:fade={{ duration: 400 }}>
			<div class="mb-2 flex items-center gap-3">
				<div class="rounded-xl bg-primary/10 p-2 text-primary">
					<div class="flex h-6 w-6"><UserPlus size={24} /></div>
				</div>
				<h2 class="text-main text-xl font-extrabold">
					{m.admin_admin_create_subtitle
						? m.admin_admin_create_subtitle()
						: "Ma'lumotlarni kiriting"}
				</h2>
			</div>
			<p class="text-sm font-medium text-muted">
				{m.admin_admin_create_desc
					? m.admin_admin_create_desc()
					: 'Platformani boshqarish uchun yangi administrator hisobini yarating.'}
			</p>
		</div>

		<form
			method="POST"
			action="?/createAdmin"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-6"
		>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<!-- Personal Info Card -->
				<div
					class="border-main bg-card col-span-1 space-y-5 rounded-[32px] border p-6 shadow-sm transition-all hover:shadow-md"
					in:fly={{ y: 20, duration: 400, delay: 100 }}
				>
					<div class="border-main/50 mb-4 flex items-center gap-2 border-b pb-3">
						<div class="text-primary">
							<User size={18} />
						</div>
						<h3 class="text-sm font-bold tracking-wider text-muted uppercase">
							{m.admin_admin_create_card_personal
								? m.admin_admin_create_card_personal()
								: "Shaxsiy ma'lumotlar"}
						</h3>
					</div>

					<InputField
						id="first_name"
						name="first_name"
						label={m.admin_student_first_name()}
						bind:value={firstName}
						placeholder={m.admin_admin_create_placeholder_firstname()}
					/>
					<InputField
						id="last_name"
						name="last_name"
						label={m.admin_student_last_name()}
						bind:value={lastName}
						placeholder={m.admin_admin_create_placeholder_lastname()}
					/>
					<PhoneInput
						id="phone_number"
						name="phone_number"
						label={m.admin_student_phone ? m.admin_student_phone() : 'Telefon raqami'}
						bind:value={phoneNumber}
						placeholder="+998 90 123 45 67"
					/>
				</div>

				<!-- Account Config Card -->
				<div
					class="border-main bg-card col-span-1 space-y-5 rounded-[32px] border p-6 shadow-sm transition-all hover:shadow-md"
					in:fly={{ y: 20, duration: 400, delay: 200 }}
				>
					<div class="border-main/50 mb-4 flex items-center gap-2 border-b pb-3">
						<div class="text-primary">
							<ShieldCheck size={18} />
						</div>
						<h3 class="text-sm font-bold tracking-wider text-muted uppercase">
							{m.admin_admin_create_card_account
								? m.admin_admin_create_card_account()
								: 'Hisob sozlamalari'}
						</h3>
					</div>

					<InputField
						id="username"
						name="username"
						label={m.admin_admin_create_label_username
							? m.admin_admin_create_label_username()
							: 'Username *'}
						bind:value={username}
						placeholder={m.admin_admin_create_placeholder_username
							? m.admin_admin_create_placeholder_username()
							: 'Masalan: a.navoiy'}
					/>

					<InputField
						id="password"
						name="password"
						type="password"
						label={m.admin_admin_create_label_password
							? m.admin_admin_create_label_password()
							: 'Parol *'}
						bind:value={password}
						placeholder="••••••••"
					/>

					<div class="border-main rounded-2xl border bg-muted/5 p-4">
						<p class="text-xs leading-relaxed font-medium text-muted">
							{m.admin_admin_create_hint
								? m.admin_admin_create_hint()
								: "* Username kamida 4 ta belgidan iborat bo'lishi va faqat harf yoki raqamlarni o'z ichiga olishi tavsiya etiladi."}
						</p>
					</div>
				</div>
			</div>

			<!-- Form Actions -->
			<div
				class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
				in:fade={{ duration: 400, delay: 300 }}
			>
				<a
					href={resolve('/admin/dashboard')}
					class="border-main bg-card inline-flex h-12 items-center justify-center rounded-2xl border px-8 text-sm font-bold text-muted transition-all hover:bg-muted/5 active:scale-95"
				>
					{m.admin_btn_cancel ? m.admin_btn_cancel() : 'Bekor qilish'}
				</a>
				<button
					type="submit"
					disabled={isSubmitting || !username || !password}
					class="hover:bg-primary-hover inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 size={18} class="animate-spin" />
						{m.admin_btn_saving ? m.admin_btn_saving() : 'Yaratilmoqda...'}
					{:else}
						<Save size={18} />
						{m.admin_btn_save_admin ? m.admin_btn_save_admin() : 'Adminni saqlash'}
					{/if}
				</button>
			</div>
		</form>
	</main>
</div>

<style>
	:global(body) {
		background-color: var(--bg-main);
	}
</style>
