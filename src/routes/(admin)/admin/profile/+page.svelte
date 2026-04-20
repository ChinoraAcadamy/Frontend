<script lang="ts">
	// import InputField from '@/lib/components/ui/InputField.svelte';
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';
	import { User, Shield, Info, Save, Settings as SettingsIcon } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

	let { data, form: serverForm } = $props();

	// Svelte 5 state
	let profileForm = $state({
		firstName: '',
		lastName: '',
		phone: '',
		username: '',
		role: ''
	});

	let isSubmitting = $state(false);

	// Ma'lumotlar kelganda formani to'ldiramiz
	function syncData(user) {
		if (user) {
			profileForm.firstName = user['first_name'] || '';
			profileForm.lastName = user['last_name'] || '';
			profileForm.phone = user['phone_number'] || '';
			profileForm.username = user['username'] || "Noma'lum";
			profileForm.role =
				user['role'] === 'admin'
					? 'Administrator'
					: user['role'] === 'superadmin'
						? 'Super Admin'
						: user['role'] || 'Admin';
		}
	}

	$effect(() => {
		// Lazy load orqali keladigan ma'lumotni kutiladi
		data.lazy.profile.then((user) => {
			if (user) syncData(user);
		});
	});

	$effect(() => {
		if (serverForm?.success) {
			toast.success('Profil muvaffaqiyatli saqlandi!');
			if (serverForm.user) syncData(serverForm.user);
		} else if (serverForm?.error) {
			toast.error(serverForm.error);
		}
	});

	function handleSubmit() {
		isSubmitting = true;
		return async ({ update }) => {
			isSubmitting = false;
			await update();
		};
	}
</script>

<svelte:head>
	<title>Admin Profil | Chinora Academy</title>
</svelte:head>

<div
	class="mx-auto min-h-screen max-w-4xl space-y-6 bg-[#f8fafc] px-4 py-8 font-sans sm:px-6 lg:px-8"
>
	<!-- Header Section -->
	<header class="mb-8 flex flex-col gap-2">
		<div class="flex items-center gap-3 text-[#9b1c48]">
			<div class="rounded-lg bg-rose-50 p-2 text-[#9b1c48]">
				<User size={24} />
			</div>
			<h1 class="text-2xl font-black tracking-tight text-slate-900 uppercase">
				Profil Sozlamalari
			</h1>
		</div>
		<p class="text-sm font-medium text-slate-500">
			Shaxsiy ma'lumotlaringizni boshqarish va xavfsizlik sozlamalari.
		</p>
	</header>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
		{#await data.lazy.profile}
			<!-- Loading State for Left Side -->
			<div class="animate-pulse space-y-4">
				<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
					<div class="mb-6 flex flex-col items-center text-center">
						<div class="mb-4 h-20 w-20 rounded-full bg-slate-100"></div>
						<div class="mb-2 h-6 w-32 rounded bg-slate-100"></div>
						<div class="h-3 w-16 rounded bg-slate-100"></div>
					</div>
					<div class="space-y-3 border-t border-slate-50 pt-6">
						<div class="flex items-center justify-between">
							<div class="h-4 w-20 rounded bg-slate-50"></div>
							<div class="h-4 w-12 rounded bg-slate-50"></div>
						</div>
						<div class="flex items-center justify-between">
							<div class="h-4 w-20 rounded bg-slate-50"></div>
							<div class="h-4 w-12 rounded bg-slate-50"></div>
						</div>
					</div>
				</div>
			</div>

			<!-- Loading State for Right Side -->
			<div class="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
				<div class="mb-8 h-6 w-48 rounded bg-slate-100"></div>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					{#each Array(4) as _, i (i)}
						<div class="space-y-2">
							<div class="h-3 w-16 rounded bg-slate-50"></div>
							<div class="h-11 w-full rounded-xl bg-slate-50"></div>
						</div>
					{/each}
				</div>
			</div>
		{:then}
			<!-- Left Side: Role Info & Badges -->
			<div class="space-y-4" in:fade={{ duration: 300 }}>
				<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
					<div class="mb-6 flex flex-col items-center text-center">
						<div
							class="flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-100 bg-slate-50 text-3xl font-black text-slate-400"
						>
							{profileForm.firstName?.[0] || 'A'}
						</div>
						<h2 class="mt-4 text-lg font-bold text-slate-900">
							{profileForm.firstName}
							{profileForm.lastName}
						</h2>
						<span class="mt-1 text-xs font-black tracking-widest text-[#9b1c48] uppercase"
							>@{profileForm.username}</span
						>
					</div>

					<div class="space-y-3 border-t border-slate-50 pt-6">
						<div class="flex items-center justify-between text-sm">
							<span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase"
								>Tizimdagi roli</span
							>
							<div
								class="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-black text-[#9b1c48]"
							>
								<Shield size={12} />
								{profileForm.role}
							</div>
						</div>
						<div class="flex items-center justify-between text-sm">
							<span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase"
								>Status</span
							>
							<div
								class="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-600"
							>
								Faol
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-3xl border border-slate-100 bg-[#9b1c48] p-6 text-white shadow-sm">
					<div class="flex items-center gap-3">
						<Info size={20} class="opacity-80" />
						<h3 class="text-sm font-bold tracking-widest uppercase">Ma'lumot</h3>
					</div>
					<p class="mt-3 text-xs leading-relaxed opacity-80">
						Admin profili orqali siz tizimdagi boshqaruv huquqlariga ega bo'lasiz. Statistika va
						natijalar faqat o'quvchi profili uchun mavjud.
					</p>
				</div>
			</div>

			<!-- Right Side: Edit Form -->
			<div
				class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10"
				in:fade={{ duration: 400 }}
			>
				<div class="mb-8 flex items-center gap-3 border-b border-slate-50 pb-6">
					<SettingsIcon size={20} class="text-slate-400" />
					<h3 class="text-sm font-black tracking-widest text-slate-800 uppercase">
						Ma'lumotlarni tahrirlash
					</h3>
				</div>

				<form
					method="POST"
					action="?/updateProfile"
					use:enhance={handleSubmit}
					class="flex flex-col gap-6"
				>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div class="space-y-1.5">
							<label
								for="first_name"
								class="text-[10px] font-black tracking-widest text-slate-400 uppercase">Ism</label
							>
							<input
								type="text"
								id="first_name"
								name="first_name"
								bind:value={profileForm.firstName}
								placeholder="Ismingiz"
								class="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none focus:border-rose-200 focus:bg-white focus:ring-4 focus:ring-rose-50"
							/>
						</div>

						<div class="space-y-1.5">
							<label
								for="last_name"
								class="text-[10px] font-black tracking-widest text-slate-400 uppercase"
								>Familiya</label
							>
							<input
								type="text"
								id="last_name"
								name="last_name"
								bind:value={profileForm.lastName}
								placeholder="Familiyangiz"
								class="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none focus:border-rose-200 focus:bg-white focus:ring-4 focus:ring-rose-50"
							/>
						</div>

						<div class="space-y-1.5 sm:col-span-2">
							<label
								for="phone_number"
								class="text-[10px] font-black tracking-widest text-slate-400 uppercase"
								>Telefon raqam</label
							>
							<PhoneInput
								id="phone_number"
								name="phone_number"
								bind:value={profileForm.phone}
								placeholder="+998 00 000 00 00"
							/>
						</div>

						<div class="space-y-1.5">
							<label
								for="username"
								class="text-[10px] font-black tracking-widest text-slate-400 uppercase"
								>Foydalanuvchi nomi</label
							>
							<div
								class="flex h-11 items-center rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-400 select-none"
							>
								@{profileForm.username}
							</div>
						</div>

						<div class="space-y-1.5">
							<label
								for="role_display"
								class="text-[10px] font-black tracking-widest text-slate-400 uppercase">Maqom</label
							>
							<div
								class="flex h-11 items-center rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-400 select-none"
							>
								{profileForm.role}
							</div>
						</div>
					</div>

					<div class="mt-8 flex justify-end">
						<button
							type="submit"
							disabled={isSubmitting}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9b1c48] px-8 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-rose-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 sm:w-auto"
						>
							{#if isSubmitting}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"
								></div>
								<span>Saqlanmoqda...</span>
							{:else}
								<Save size={16} />
								<span>O'zgarishlarni saqlash</span>
							{/if}
						</button>
					</div>
				</form>
			</div>
		{/await}
	</div>
</div>

<style>
	:global(body) {
		background-color: #f8fafc;
	}
</style>
