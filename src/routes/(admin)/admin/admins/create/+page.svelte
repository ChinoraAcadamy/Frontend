<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { showToast } from '@/lib/utils/toast.js';
	import InputField from '@/lib/components/ui/InputField.svelte';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import { UserPlus, User, ShieldCheck, ChevronLeft, Save, Loader2 } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

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
			showToast("Yangi admin muvaffaqiyatli yaratildi!", { type: 'success' });
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

<div class="min-h-screen bg-[#f8fafc] pb-20 font-sans md:pb-10">
	<!-- Top Glass Header -->
	<header
		class="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8"
	>
		<div class="mx-auto flex max-w-4xl items-center justify-between">
			<div class="flex items-center gap-2 sm:gap-4">
				<a
					href={resolve('/admin/dashboard')}
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
				>
					<ChevronLeft size={20} />
				</a>
				<div class="min-w-0 flex-1">
					<div class="hidden sm:block">
						<Breadcrumb />
					</div>
					<h1 class="text-base font-bold text-slate-900 line-clamp-1 sm:text-xl">
						Yangi Admin Yaratish
					</h1>
				</div>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="mb-8" in:fade={{ duration: 400 }}>
			<div class="flex items-center gap-3 mb-2">
				<div class="bg-[#ed4b72]/10 p-2 rounded-xl text-[#ed4b72]">
					<UserPlus size={24} />
				</div>
				<h2 class="text-xl font-extrabold text-slate-800">Ma'lumotlarni kiriting</h2>
			</div>
			<p class="text-sm font-medium text-slate-500">
				Platformani boshqarish uchun yangi administrator hisobini yarating.
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
					class="col-span-1 space-y-5 rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md"
					in:fly={{ y: 20, duration: 400, delay: 100 }}
				>
					<div class="flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
						<div class="text-[#ed4b72]">
							<User size={18} />
						</div>
						<h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Shaxsiy ma'lumotlar</h3>
					</div>

					<InputField
						id="first_name"
						name="first_name"
						label="Ism"
						bind:value={firstName}
						placeholder="Masalan: Alisher"
					/>

					<InputField
						id="last_name"
						name="last_name"
						label="Familiya"
						bind:value={lastName}
						placeholder="Masalan: Navoiy"
					/>

					<InputField
						id="phone_number"
						name="phone_number"
						label="Telefon raqami"
						bind:value={phoneNumber}
						placeholder="+998 90 123 45 67"
					/>
				</div>

				<!-- Account Config Card -->
				<div 
					class="col-span-1 space-y-5 rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md"
					in:fly={{ y: 20, duration: 400, delay: 200 }}
				>
					<div class="flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
						<div class="text-[#ed4b72]">
							<ShieldCheck size={18} />
						</div>
						<h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Hisob sozlamalari</h3>
					</div>

					<InputField
						id="username"
						name="username"
						label="Username *"
						bind:value={username}
						placeholder="Masalan: a.navoiy"
					/>

					<InputField
						id="password"
						name="password"
						type="password"
						label="Parol *"
						bind:value={password}
						placeholder="••••••••"
					/>

					<div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
						<p class="text-xs font-medium text-slate-500 leading-relaxed">
							* Username kamida 4 ta belgidan iborat bo'lishi va faqat harf yoki raqamlarni o'z ichiga olishi tavsiya etiladi.
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
					class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
				>
					Bekor qilish
				</a>
				<button
					type="submit"
					disabled={isSubmitting || !username || !password}
					class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#ed4b72] px-8 text-sm font-bold text-white shadow-lg shadow-[#ed4b72]/20 transition-all hover:bg-[#de3c61] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isSubmitting}
						<Loader2 size={18} class="animate-spin" />
						Yaratilmoqda...
					{:else}
						<Save size={18} />
						Adminni saqlash
					{/if}
				</button>
			</div>
		</form>
	</main>
</div>

<style>
	:global(body) {
		background-color: #f8fafc;
	}
</style>
