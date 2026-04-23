<script>
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/stores';
	import {
		User,
		CheckCircle2,
		Copy,
		BookOpen,
		FileCheck,
		Star,
		Settings,
		ChevronRight,
		LogOut,
		Smartphone,
		Monitor,
		Trash2
	} from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';

	let { data, form } = $props();

	// Use updated profile from form success or default to loaded data
	let profile = $derived(form?.profile || data.profile);
	let isSubmitting = $state(false);
	let activeTab = $state('basic'); // 'basic' or 'devices'

	$effect(() => {
		if (form) {
			if (form.success) {
				toast.success(m.success_saved ? m.success_saved() : 'Muvaffaqiyatli yangilandi');
			} else if (form.error) {
				toast.error(form.error);
			}
			isSubmitting = false;
		}
	});

	const getInitials = (p) => {
		if (!p) return 'CH';
		if (p.first_name || p.last_name) {
			return `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`.toUpperCase();
		}
		return p.username?.substring(0, 2).toUpperCase() || 'CH';
	};

	const copyUsername = async () => {
		if (!profile?.username) return;
		try {
			await navigator.clipboard.writeText(profile.username);
			toast.success(
				m.profile_username_copied ? m.profile_username_copied() : 'Username nusxalandi'
			);
		} catch {
			toast.error(m.error_occurred ? m.error_occurred() : 'Xatolik yuz berdi');
		}
	};

	const parseUserAgent = (ua) => {
		if (!ua) return m.profile_device_unknown();
		if (ua.includes('iPhone') || ua.includes('Android')) return 'Mobile';
		if (ua.includes('Macintosh') || ua.includes('Windows') || ua.includes('Linux'))
			return 'Desktop';
		return 'Device';
	};

	const formatDeviceName = (ua) => {
		if (!ua) return m.profile_device_unknown();
		// Simple parsing logic for common browsers/OS
		if (ua.includes('Chrome')) return 'Chrome';
		if (ua.includes('Firefox')) return 'Firefox';
		if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
		if (ua.includes('Edge')) return 'Edge';
		return ua.split(' ')[0] || m.profile_device_unknown();
	};
</script>

<svelte:head>
	<title>{m.profile_title ? m.profile_title() : 'Profil'} | Chinora Academy</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Hero Section: Brand Identity -->
	<header class="relative h-64 w-full overflow-hidden bg-[#FA2E69] sm:h-80">
		<!-- Background Pattern -->
		<div
			class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"
		></div>

		<!-- Floating Shapes for Aesthetic -->
		<div class="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
		<div class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/5 blur-3xl"></div>

		<div
			class="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white"
		>
			<div in:fly={{ y: 20, duration: 600 }} class="relative">
				<div
					class="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#FA2E69] text-3xl font-black tracking-tighter shadow-2xl"
				>
					{getInitials(profile)}
				</div>
				<div
					class="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#FA2E69] bg-emerald-500 shadow-lg"
				>
					<CheckCircle2 size={14} class="text-white" />
				</div>
			</div>

			<h1
				in:fly={{ y: 10, delay: 100, duration: 600 }}
				class="mt-4 text-3xl font-black tracking-tight uppercase sm:text-4xl"
			>
				{profile?.first_name || ''}
				{profile?.last_name || ''}
				{#if !profile?.first_name && !profile?.last_name}{m.role_student
						? m.role_student()
						: "O'quvchi"}{/if}
			</h1>

			<button
				onclick={copyUsername}
				class="mt-2 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-white/20"
			>
				<span>@{profile?.username}</span>
				<Copy size={12} />
			</button>
		</div>
	</header>

	<!-- Main Content: Full Width Sections -->
	<main class="mx-auto w-full max-w-5xl">
		<!-- Stats Row: High Density Flat Design -->
		<div class="grid grid-cols-1 border-b border-slate-100 sm:grid-cols-3">
			<div
				class="flex flex-col items-center justify-center border-b border-slate-100 p-8 sm:border-r sm:border-b-0"
			>
				<span
					class="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
				>
					<Star size={14} class="text-amber-400" />
					{m.profile_total_score ? m.profile_total_score() : 'Umumiy Ball'}
				</span>
				<span class="mt-2 text-4xl font-black tracking-tighter text-slate-900"
					>{profile?.total_score || '0'}</span
				>
			</div>

			<div
				class="flex flex-col items-center justify-center border-b border-slate-100 p-8 sm:border-r sm:border-b-0"
			>
				<span
					class="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
				>
					<BookOpen size={14} class="text-sky-500" />
					{m.profile_courses ? m.profile_courses() : 'Kurslar soni'}
				</span>
				<span class="mt-2 text-4xl font-black tracking-tighter text-slate-900"
					>{profile?.courses_count || '0'}</span
				>
			</div>

			<div class="flex flex-col items-center justify-center p-8">
				<span
					class="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
				>
					<FileCheck size={14} class="text-emerald-500" />
					{m.profile_total_submissions ? m.profile_total_submissions() : 'Topshiriqlar'}
				</span>
				<span class="mt-2 text-4xl font-black tracking-tighter text-slate-900"
					>{profile?.submissions_count || '0'}</span
				>
			</div>
		</div>

		<!-- Settings Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
			<!-- Left: Navigation / Quick Info -->
			<div class="border-slate-100 bg-slate-50/50 p-8 lg:border-r">
				<h2
					class="flex items-center gap-2 text-sm font-black tracking-widest text-[#FA2E69] uppercase"
				>
					<Settings size={18} />
					{m.profile_settings ? m.profile_settings() : 'Sozlamalar'}
				</h2>
				<p class="mt-2 text-sm leading-relaxed font-medium text-slate-500">
					{m.profile_settings_desc
						? m.profile_settings_desc()
						: "Bu yerda siz o'zingizning shaxsiy ma'lumotlaringizni tahrirlashingiz mumkin."}
				</p>

				<nav class="mt-8 flex flex-col gap-2">
					<button
						onclick={() => (activeTab = 'basic')}
						class="flex w-full items-center justify-between rounded-lg border p-4 transition-all {activeTab ===
						'basic'
							? 'border-l-4 border-slate-200 border-l-[#FA2E69] bg-white shadow-sm'
							: 'border-transparent bg-white/50 hover:bg-white'}"
					>
						<div class="flex items-center gap-3">
							<div
								class="rounded p-2 transition-colors {activeTab === 'basic'
									? 'bg-rose-50 text-rose-500'
									: 'bg-slate-100 text-slate-400'}"
							>
								<User size={18} />
							</div>
							<span
								class="text-sm font-bold tracking-wide uppercase transition-colors {activeTab ===
								'basic'
									? 'text-slate-900'
									: 'text-slate-500'}"
								>{m.profile_basic_info ? m.profile_basic_info() : "Asosiy ma'lumotlar"}</span
							>
						</div>
						<ChevronRight
							size={18}
							class="text-slate-300 transition-transform {activeTab === 'basic'
								? 'translate-x-1 rotate-90 sm:rotate-0'
								: ''}"
						/>
					</button>

					<button
						onclick={() => (activeTab = 'devices')}
						class="flex w-full items-center justify-between rounded-lg border p-4 transition-all {activeTab ===
						'devices'
							? 'border-l-4 border-slate-200 border-l-sky-500 bg-white shadow-sm'
							: 'border-transparent bg-white/50 hover:bg-white'}"
					>
						<div class="flex items-center gap-3">
							<div
								class="rounded p-2 transition-colors {activeTab === 'devices'
									? 'bg-sky-50 text-sky-500'
									: 'bg-slate-100 text-slate-400'}"
							>
								<Smartphone size={18} />
							</div>
							<span
								class="text-sm font-bold tracking-wide uppercase transition-colors {activeTab ===
								'devices'
									? 'text-slate-900'
									: 'text-slate-500'}"
								>{m.profile_devices_title ? m.profile_devices_title() : 'Qurilmalar'}</span
							>
						</div>
						<span
							class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-400"
							>{data.devices?.filter((d) => d.is_active).length || 0}</span
						>
					</button>

					<form action="/auth/logout" method="POST" class="mt-4">
						<button
							class="group flex w-full items-center gap-3 rounded-lg p-4 text-rose-600 transition-colors hover:bg-rose-50"
						>
							<LogOut size={18} class="transition-transform group-hover:translate-x-1" />
							<span class="text-xs font-black tracking-widest uppercase"
								>{m.menu_logout ? m.menu_logout() : 'Tizimdan chiqish'}</span
							>
						</button>
					</form>
				</nav>
			</div>

			<!-- Right: Form Content -->
			<div class="p-8 sm:p-12">
				{#if activeTab === 'basic'}
					<div in:fade={{ duration: 200 }}>
						<form
							action="?/updateProfile"
							method="POST"
							use:enhance={() => {
								isSubmitting = true;
								return async ({ update }) => {
									await update({ reset: false });
									isSubmitting = false;
								};
							}}
							class="flex flex-col gap-8"
						>
							<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
								<!-- Input Field -->
								<div class="flex flex-col gap-3">
									<label
										for="first_name"
										class="text-[10px] font-black tracking-[0.25em] text-slate-400 uppercase"
										>{m.profile_first_name_label ? m.profile_first_name_label() : 'ISMINGIZ'}</label
									>
									<div class="group relative">
										<input
											type="text"
											id="first_name"
											name="first_name"
											value={profile?.first_name || ''}
											class="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-bold text-slate-900 transition-colors outline-none group-hover:border-slate-300 placeholder:text-slate-300 focus:border-[#FA2E69]"
											placeholder={m.profile_placeholder_fname
												? m.profile_placeholder_fname()
												: 'Ali'}
											required
										/>
									</div>
								</div>

								<!-- Input Field -->
								<div class="flex flex-col gap-3">
									<label
										for="last_name"
										class="text-[10px] font-black tracking-[0.25em] text-slate-400 uppercase"
										>{m.profile_last_name_label
											? m.profile_last_name_label()
											: 'FAMILIYANGIZ'}</label
									>
									<div class="group relative">
										<input
											type="text"
											id="last_name"
											name="last_name"
											value={profile?.last_name || ''}
											class="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-bold text-slate-900 transition-colors outline-none group-hover:border-slate-300 placeholder:text-slate-300 focus:border-[#FA2E69]"
											placeholder={m.profile_placeholder_lname
												? m.profile_placeholder_lname()
												: 'Toirov'}
											required
										/>
									</div>
								</div>
							</div>

							<!-- Phone Field -->
							<div class="flex flex-col gap-3">
								<label
									for="phone_number"
									class="text-[10px] font-black tracking-[0.25em] text-slate-400 uppercase"
									>{m.profile_phone_label ? m.profile_phone_label() : 'TELEFON RAQAMINGIZ'}</label
								>
								<div class="group relative">
									<PhoneInput
										id="phone_number"
										name="phone_number"
										bind:value={profile.phone_number}
										placeholder="+998 90 123 45 67"
										variant="flat"
									/>
								</div>
							</div>

							<div
								class="mt-6 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-10 sm:flex-row"
							>
								<div class="flex flex-col">
									<span class="text-[10px] font-black tracking-widest text-slate-300 uppercase"
										>{m.profile_membership_date
											? m.profile_membership_date()
											: "A'zolik sanasi"}</span
									>
									{#if profile?.created_at}
										<span class="text-sm font-bold text-slate-500"
											>{new Date(profile.created_at).toLocaleDateString($page?.data?.lang || 'uz', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}</span
										>
									{/if}
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									class="w-full rounded-full bg-[#FA2E69] px-12 py-4 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 sm:w-auto"
								>
									{#if isSubmitting}
										<span>{m.profile_saving ? m.profile_saving() : 'Kutilmoqda...'}</span>
									{:else}
										<span
											>{m.profile_save_changes
												? m.profile_save_changes()
												: "O'zgarishlarni saqlash"}</span
										>
									{/if}
								</button>
							</div>
						</form>
					</div>
				{:else if activeTab === 'devices'}
					<div in:fade={{ duration: 200 }}>
						<div class="mb-8">
							<h3 class="text-xl font-black tracking-tight text-slate-900 uppercase">
								{m.profile_devices_title()}
							</h3>
							<p class="mt-2 text-sm font-medium text-slate-500">
								{m.profile_devices_desc()}
							</p>
						</div>

						<div class="grid grid-cols-1 gap-4">
							{#each data.devices.filter((d) => d.is_active) as device (device.session_id)}
								<div
									class="group relative flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:border-[#FA2E69]/30 hover:shadow-xl hover:shadow-rose-600/5 {device.is_current
										? 'border-l-4 border-l-[#FA2E69] bg-rose-50/10'
										: ''}"
								>
									<div class="flex items-center gap-5">
										<div
											class="flex h-12 w-12 items-center justify-center rounded-xl transition-colors {device.is_current
												? 'bg-[#FA2E69] text-white'
												: 'bg-slate-100 text-slate-400 group-hover:bg-rose-50 group-hover:text-[#FA2E69]'}"
										>
											{#if parseUserAgent(device.device_name) === 'Mobile'}
												<Smartphone size={22} />
											{:else}
												<Monitor size={22} />
											{/if}
										</div>

										<div class="flex flex-col">
											<div class="flex items-center gap-2">
												<span class="text-sm font-black tracking-wide text-slate-900 uppercase">
													{formatDeviceName(device.device_name)}
												</span>
												{#if device.is_current}
													<span
														class="rounded-full bg-[#FA2E69] px-2 py-0.5 text-[8px] font-black tracking-widest text-white uppercase"
													>
														{m.profile_device_current()}
													</span>
												{:else if device.is_active}
													<span
														class="rounded-full bg-emerald-500 px-2 py-0.5 text-[8px] font-black tracking-widest text-white uppercase"
													>
														{m.profile_device_active()}
													</span>
												{/if}
											</div>
											<div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
												<span class="text-[10px] font-bold text-slate-400">
													{m.profile_device_ip()}
													<span class="text-slate-600">{device.ip_address}</span>
												</span>
												<span class="text-[10px] font-bold text-slate-400">
													{m.profile_device_last_seen()}
													<span class="text-slate-600">
														{new Date(device.last_seen_at).toLocaleDateString(
															$page?.data?.lang || 'uz',
															{
																month: 'short',
																day: 'numeric',
																hour: '2-digit',
																minute: '2-digit'
															}
														)}
													</span>
												</span>
											</div>
										</div>
									</div>

									{#if !device.is_current}
										<form
											action="?/logoutDevice"
											method="POST"
											use:enhance={() => {
												return async ({ update, result }) => {
													if (result.type === 'success') {
														toast.success(
															result.data?.message || m.profile_device_logout_success()
														);
													} else if (result.type === 'failure') {
														toast.error(result.data?.error || m.profile_device_logout_error());
													}
													await update();
												};
											}}
										>
											<input type="hidden" name="session_id" value={device.session_id} />
											<button
												type="submit"
												class="flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-90"
												title={m.profile_device_logout()}
											>
												<Trash2 size={18} />
											</button>
										</form>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>

<style>
	:global(body) {
		background-color: white !important;
	}

	/* Brand Typography Overrides */
	:global(.admin-body) {
		font-family: 'Lexend', 'Inter', system-ui, sans-serif !important;
	}
</style>
