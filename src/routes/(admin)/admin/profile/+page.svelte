<script lang="ts">
	/* eslint-disable no-unused-vars */
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';
	import {
		User,
		Shield,
		Smartphone,
		Monitor,
		Trash2,
		ChevronRight,
		Loader2,
		Info,
		Settings as SettingsIcon,
		Save,
		MapPin,
		Clock
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { fade, fly, scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';

	let { data, form: serverForm } = $props();

	let profileForm = $state({
		firstName: '',
		lastName: '',
		phone: '',
		username: '',
		role: ''
	});

	let isSubmitting = $state(false);
	let activeTab = $state('basic');
	// Track which device session is being deleted
	let deletingSessionId = $state(null);
	// Local reactive devices list for optimistic removal
	let localDevices = $state(null);

	const parseUserAgent = (ua) => {
		if (!ua) return m.profile_device_unknown();
		if (ua.includes('iPhone') || ua.includes('Android')) return 'Mobile';
		if (ua.includes('Macintosh') || ua.includes('Windows') || ua.includes('Linux'))
			return 'Desktop';
		return 'Desktop';
	};

	const formatDeviceName = (ua) => {
		if (!ua) return m.profile_device_unknown();
		if (ua.includes('Chrome')) return 'Chrome';
		if (ua.includes('Firefox')) return 'Firefox';
		if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
		if (ua.includes('Edge')) return 'Edge';
		return ua.split(' ')[0] || m.profile_device_unknown();
	};

	function syncData(user) {
		if (user) {
			profileForm.firstName = user['first_name'] || '';
			profileForm.lastName = user['last_name'] || '';
			profileForm.phone = user['phone_number'] || '';
			profileForm.username = user['username'] || '';
			profileForm.role = user['role'] || '';
		}
	}

	$effect(() => {
		data.lazy.profile.then((user) => {
			if (user) syncData(user);
		});
	});

	// Sync localDevices once loaded
	$effect(() => {
		data.lazy.devices.then((devices) => {
			if (devices && localDevices === null) {
				localDevices = [...devices];
			}
		});
	});

	$effect(() => {
		if (serverForm?.success) {
			toast.success(
				String(
					serverForm?.message || m.profile_update_success
						? m.profile_update_success()
						: 'Profil saqlandi!'
				)
			);
		} else if (serverForm?.error) {
			toast.error(String(serverForm?.error));
		}
	});

	function handleSubmit() {
		isSubmitting = true;
		return async ({ update }) => {
			isSubmitting = false;
			await update();
		};
	}

	function handleDeviceLogout(sessionId) {
		deletingSessionId = sessionId;
		return async ({ update, result }) => {
			if (result.type === 'success') {
				// Optimistically remove device from local list
				localDevices = localDevices?.filter((d) => d.session_id !== sessionId) ?? null;
				toast.success(String(result.data?.['message'] || m.profile_device_logout_success()));
			} else if (result.type === 'failure') {
				toast.error(String(result.data?.['error'] || m.profile_device_logout_error()));
			}
			deletingSessionId = null;
			await update({ reset: false });
		};
	}
</script>

<svelte:head>
	<title>{m.profile_settings_title ? m.profile_settings_title() : 'Profil Sozlamalari'}</title>
</svelte:head>

<div class="min-h-full w-full bg-[#F4F4F2] px-4 py-6 sm:px-6 lg:px-8">
	<!-- Decorative pattern (absolute but within container) -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden opacity-40" aria-hidden="true">
		<div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/30 blur-3xl"></div>
		<div
			class="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-slate-200/20 blur-3xl"
		></div>
	</div>

	<div class="relative mx-auto max-w-6xl">
		<!-- Header -->
		<header class="mb-8" in:fly={{ y: -16, duration: 400, delay: 50 }}>
			<div class="mb-3 flex items-center gap-3">
				<span class="h-0.5 w-6 rounded-full bg-primary"></span>
				<span class="text-[11px] font-bold tracking-[0.15em] text-primary uppercase">
					{m.profile_settings_title ? m.profile_settings_title() : 'Profil Sozlamalari'}
				</span>
			</div>
			<h1 class="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
				{m.profile_settings_title ? m.profile_settings_title() : 'Profil Sozlamalari'}
			</h1>
			<p class="mt-2 max-w-2xl text-sm font-medium text-slate-500">
				{m.profile_settings_subtitle
					? m.profile_settings_subtitle()
					: "Shaxsiy ma'lumotlaringizni boshqarish va xavfsizlik sozlamalari."}
			</p>
		</header>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] xl:gap-8">
			{#await data.lazy.profile}
				<!-- Skeleton Sidebar -->
				<aside class="flex flex-col gap-6">
					<div
						class="animate-pulse rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm"
					>
						<div class="mx-auto mb-4 h-20 w-20 rounded-full bg-slate-100"></div>
						<div class="mx-auto mb-2 h-6 w-32 rounded-lg bg-slate-100"></div>
						<div class="mx-auto h-4 w-20 rounded-lg bg-slate-50"></div>
					</div>
				</aside>
				<!-- Skeleton Main Content -->
				<div class="animate-pulse rounded-2xl border border-black/5 bg-white p-8 shadow-sm lg:p-12">
					<div class="mb-8 h-8 w-48 rounded-lg bg-slate-100"></div>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						{#each Array(4) as _, i (i)}
							<div class="h-20 rounded-2xl bg-slate-50"></div>
						{/each}
					</div>
				</div>
			{:then}
				<!-- Sidebar -->
				<aside class="flex flex-col gap-6" in:fly={{ x: -20, duration: 380, delay: 80 }}>
					<!-- Avatar Card -->
					<div
						class="group rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm transition-all hover:shadow-md"
					>
						<div class="relative mx-auto mb-4 h-24 w-24">
							<div
								class="absolute inset-0 animate-pulse rounded-full bg-rose-100 transition-transform group-hover:scale-105 group-hover:animate-none"
							></div>
							<div
								class="relative flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-primary to-[#C84270] text-3xl font-black text-white shadow-inner"
							>
								{profileForm.firstName?.[0]?.toUpperCase() || 'A'}
							</div>
						</div>
						<h2 class="text-xl font-bold tracking-tight text-slate-900">
							{profileForm.firstName}
							{profileForm.lastName}
						</h2>
						<span class="mt-1 block text-sm font-bold text-primary">@{profileForm.username}</span>

						<div class="mt-6 flex flex-wrap justify-center gap-2">
							<span
								class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-bold tracking-wider text-primary uppercase"
							>
								<Shield size={12} />
								{profileForm.role}
							</span>
							<span
								class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase"
							>
								<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
								{m.profile_status_active ? m.profile_status_active() : 'Faol'}
							</span>
						</div>
					</div>

					<!-- Navigation -->
					<nav
						class="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white/60 p-2 backdrop-blur-sm"
					>
						<button
							onclick={() => (activeTab = 'basic')}
							class="flex items-center justify-between rounded-xl p-4 transition-all {activeTab ===
							'basic'
								? 'bg-white shadow-sm ring-1 ring-black/5'
								: 'hover:bg-white/50'}"
						>
							<div class="flex items-center gap-3">
								<div
									class="flex h-9 w-9 items-center justify-center rounded-lg {activeTab === 'basic'
										? 'bg-primary text-white'
										: 'bg-slate-100 text-slate-400'}"
								>
									<User size={18} />
								</div>
								<span class="text-xs font-bold tracking-widest text-slate-600 uppercase"
									>{m.profile_basic_info ? m.profile_basic_info() : "Ma'lumotlar"}</span
								>
							</div>
							<ChevronRight
								size={14}
								class="text-slate-300 {activeTab === 'basic'
									? 'translate-x-1 text-primary'
									: ''} transition-all"
							/>
						</button>

						<button
							onclick={() => (activeTab = 'devices')}
							class="flex items-center justify-between rounded-xl p-4 transition-all {activeTab ===
							'devices'
								? 'bg-white shadow-sm ring-1 ring-black/5'
								: 'hover:bg-white/50'}"
						>
							<div class="flex items-center gap-3">
								<div
									class="flex h-9 w-9 items-center justify-center rounded-lg {activeTab ===
									'devices'
										? 'bg-sky-500 text-white'
										: 'bg-slate-100 text-slate-400'}"
								>
									<Smartphone size={18} />
								</div>
								<span class="text-xs font-bold tracking-widest text-slate-600 uppercase"
									>{m.profile_devices_title ? m.profile_devices_title() : 'Qurilmalar'}</span
								>
							</div>
							<div class="flex items-center gap-2">
								{#await data.lazy.devices}
									<div class="h-4 w-6 animate-pulse rounded-full bg-slate-100"></div>
								{:then devices}
									<span
										class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500"
										>{devices?.length || 0}</span
									>
								{/await}
								<ChevronRight
									size={14}
									class="text-slate-300 {activeTab === 'devices'
										? 'translate-x-1 text-sky-500'
										: ''} transition-all"
								/>
							</div>
						</button>
					</nav>

					<!-- Info Card -->
					<div class="rounded-2xl border border-black/5 bg-slate-900 p-6 text-white shadow-lg">
						<div class="mb-4 flex items-center gap-3 text-slate-400">
							<Info size={18} />
							<span class="text-[10px] font-bold tracking-[0.15em] uppercase"
								>{m.profile_info_card_title ? m.profile_info_card_title() : "Ma'lumot"}</span
							>
						</div>
						<p class="text-xs leading-relaxed text-slate-400">
							{m.profile_info_card_desc
								? m.profile_info_card_desc()
								: "Admin profili orqali siz tizimdagi boshqaruv huquqlariga ega bo'lasiz."}
						</p>
					</div>
				</aside>

				<!-- Main Content -->
				<main
					class="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8 lg:p-12"
					in:fly={{ x: 20, duration: 380, delay: 120 }}
				>
					{#if activeTab === 'basic'}
						<div in:fade={{ duration: 180 }}>
							<div class="mb-10 flex items-center gap-4 border-b border-slate-50 pb-8">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-primary"
								>
									<SettingsIcon size={24} />
								</div>
								<div>
									<h3 class="text-lg font-bold tracking-tight text-slate-900">
										{m.profile_edit_details_title
											? m.profile_edit_details_title()
											: "Ma'lumotlarni tahrirlash"}
									</h3>
									<p class="text-sm font-medium text-slate-400">
										Profilingiz ma'lumotlarini bu yerdan yangilashingiz mumkin.
									</p>
								</div>
							</div>

							<form
								method="POST"
								action="?/updateProfile"
								use:enhance={handleSubmit}
								class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2"
							>
								<div class="space-y-2">
									<label
										for="first_name"
										class="text-[10px] font-bold tracking-widest text-slate-400 uppercase"
										>{m.profile_first_name ? m.profile_first_name() : 'Ism'}</label
									>
									<input
										type="text"
										id="first_name"
										name="first_name"
										bind:value={profileForm.firstName}
										placeholder="Ismingiz"
										class="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-900 transition-all outline-none focus:border-rose-200 focus:bg-white focus:ring-4 focus:ring-rose-50"
									/>
								</div>

								<div class="space-y-2">
									<label
										for="last_name"
										class="text-[10px] font-bold tracking-widest text-slate-400 uppercase"
										>{m.profile_last_name ? m.profile_last_name() : 'Familiya'}</label
									>
									<input
										type="text"
										id="last_name"
										name="last_name"
										bind:value={profileForm.lastName}
										placeholder="Familiyangiz"
										class="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-900 transition-all outline-none focus:border-rose-200 focus:bg-white focus:ring-4 focus:ring-rose-50"
									/>
								</div>

								<div class="space-y-2 md:col-span-2">
									<label
										for="phone_number"
										class="text-[10px] font-bold tracking-widest text-slate-400 uppercase"
										>{m.profile_phone_label ? m.profile_phone_label() : 'Telefon raqam'}</label
									>
									<PhoneInput
										id="phone_number"
										name="phone_number"
										bind:value={profileForm.phone}
										placeholder="+998 00 000 00 00"
									/>
								</div>

								<div class="space-y-2">
									<span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase"
										>{m.profile_username_label
											? m.profile_username_label()
											: 'Foydalanuvchi nomi'}</span
									>
									<div
										class="flex h-14 items-center rounded-2xl border border-slate-100 bg-slate-100 px-5 text-sm font-bold text-slate-400 select-none"
									>
										<span class="mr-1 opacity-50">@</span>{profileForm.username}
									</div>
								</div>

								<div class="space-y-2">
									<span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase"
										>{m.profile_role_label ? m.profile_role_label() : 'Maqom'}</span
									>
									<div
										class="flex h-14 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-100 px-5 text-sm font-bold text-slate-400 select-none"
									>
										<Shield size={16} class="opacity-50" />
										{profileForm.role}
									</div>
								</div>

								<div class="mt-4 flex justify-end md:col-span-2">
									<button
										type="submit"
										disabled={isSubmitting}
										class="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-10 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-rose-900/10 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-rose-900/20 active:translate-y-0 disabled:opacity-50 md:w-auto"
									>
										{#if isSubmitting}
											<Loader2 size={18} class="animate-spin" />
											<span>{m.profile_saving ? m.profile_saving() : 'Saqlanmoqda...'}</span>
										{:else}
											<Save size={18} />
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
						<div in:fade={{ duration: 180 }}>
							<div class="mb-10 flex items-center gap-4 border-b border-slate-50 pb-8">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500"
								>
									<Smartphone size={24} />
								</div>
								<div>
									<h3 class="text-lg font-bold tracking-tight text-slate-900">
										{m.profile_devices_title ? m.profile_devices_title() : 'Qurilmalar'}
									</h3>
									<p class="text-sm font-medium text-slate-400">
										Faol sessiyalaringizni boshqaring.
									</p>
								</div>
							</div>

							<div class="flex flex-col gap-4">
								{#await data.lazy.devices}
									{#each Array(2) as _, i (i)}
										<div class="h-24 animate-pulse rounded-2xl bg-slate-50"></div>
									{/each}
								{:then}
									{#if localDevices !== null}
										{#each localDevices.filter((d) => d.is_active) as device (device.session_id)}
											<div
												class="group flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:border-rose-200 hover:shadow-lg sm:flex-row sm:items-center {device.is_current
													? 'ring-2 ring-primary/10'
													: ''}"
											>
												<div class="flex items-center gap-5">
													<div
														class="flex h-14 w-14 items-center justify-center rounded-2xl transition-all {device.is_current
															? 'bg-primary text-white shadow-lg shadow-rose-900/20'
															: 'bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-primary'}"
													>
														{#if parseUserAgent(device.device_name) === 'Mobile'}
															<Smartphone size={24} />
														{:else}
															<Monitor size={24} />
														{/if}
													</div>
													<div>
														<div class="flex flex-wrap items-center gap-2">
															<span class="font-bold text-slate-900"
																>{formatDeviceName(device.device_name)}</span
															>
															{#if device.is_current}
																<span
																	class="rounded-full bg-primary px-2 py-0.5 text-[8px] font-black tracking-widest text-white uppercase"
																	>{m.profile_device_current()}</span
																>
															{:else}
																<span
																	class="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-black tracking-widest text-emerald-600 uppercase"
																	>{m.profile_device_active()}</span
																>
															{/if}
														</div>
														<div
															class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-slate-400"
														>
															<span class="flex items-center gap-1"
																><MapPin size={12} /> {device.ip_address}</span
															>
															<span class="flex items-center gap-1"
																><Clock size={12} />
																{new Date(device.last_seen_at).toLocaleDateString(
																	$page?.data?.lang || 'uz',
																	{
																		month: 'short',
																		day: 'numeric',
																		hour: '2-digit',
																		minute: '2-digit'
																	}
																)}</span
															>
														</div>
													</div>
												</div>

												{#if !device.is_current}
													<form
														method="POST"
														action="?/logoutDevice"
														use:enhance={() => handleDeviceLogout(device.session_id)}
														class="w-full sm:w-auto"
													>
														<input type="hidden" name="session_id" value={device.session_id} />
														<button
															type="submit"
															disabled={deletingSessionId === device.session_id}
															class="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white text-slate-400 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 sm:w-11"
															title={m.profile_device_logout()}
														>
															{#if deletingSessionId === device.session_id}
																<Loader2 size={18} class="animate-spin" />
															{:else}
																<Trash2 size={18} />
																<span class="text-xs font-bold tracking-wider uppercase sm:hidden"
																	>O'chirish</span
																>
															{/if}
														</button>
													</form>
												{/if}
											</div>
										{/each}

										{#if localDevices.filter((d) => d.is_active).length === 0}
											<div class="flex flex-col items-center justify-center py-20 text-slate-300">
												<Monitor size={48} strokeWidth={1} />
												<p class="mt-4 text-sm font-bold tracking-widest uppercase">
													Faol qurilmalar yo'q
												</p>
											</div>
										{/if}
									{/if}
								{/await}
							</div>
						</div>
					{/if}
				</main>
			{/await}
		</div>
	</div>
</div>

<style>
	/* All major styling moved to Tailwind classes for best compatibility and performance */
	:global(body) {
		background-color: #f4f4f2 !important;
	}
</style>
