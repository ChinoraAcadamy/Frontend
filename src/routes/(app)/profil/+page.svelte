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
		Trash2,
		MapPin,
		Clock,
		Loader2
	} from 'lucide-svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';

	let { data, form } = $props();

	let profile = $derived(form?.profile || data.profile);
	let isSubmitting = $state(false);
	let activeTab = $state('basic');
	let terminatingSessions = $state({});

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
		if (!ua) return m.profile_device_unknown?.() ?? 'Unknown';
		if (ua.includes('iPhone') || ua.includes('Android')) return 'Mobile';
		if (ua.includes('Macintosh') || ua.includes('Windows') || ua.includes('Linux'))
			return 'Desktop';
		return 'Device';
	};

	const formatDeviceName = (ua) => {
		if (!ua) return m.profile_device_unknown?.() ?? 'Unknown';
		if (ua.includes('Chrome')) return 'Chrome';
		if (ua.includes('Firefox')) return 'Firefox';
		if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
		if (ua.includes('Edge')) return 'Edge';
		return ua.split(' ')[0] || (m.profile_device_unknown?.() ?? 'Unknown');
	};

	const activeDevices = $derived(data.devices?.filter((d) => d.is_active) ?? []);
</script>

<svelte:head>
	<title>{m.profile_title ? m.profile_title() : 'Profil'} | Chinora Academy</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="page-root">
	<!-- ─── HERO ─────────────────────────────────── -->
	<header class="hero">
		<div class="hero-noise" aria-hidden="true"></div>
		<div class="hero-ring hero-ring-1" aria-hidden="true"></div>
		<div class="hero-ring hero-ring-2" aria-hidden="true"></div>

		<div class="hero-inner" in:fly={{ y: 28, duration: 700, easing: cubicOut }}>
			<div class="avatar-wrap">
				<div class="avatar">{getInitials(profile)}</div>
				<span class="avatar-badge" title="Verified">
					<CheckCircle2 size={12} strokeWidth={2.5} />
				</span>
			</div>

			<div class="hero-text">
				<h1 class="hero-name">
					{#if profile?.first_name || profile?.last_name}
						{profile?.first_name || ''} {profile?.last_name || ''}
					{:else}
						{m.role_student ? m.role_student() : "O'quvchi"}
					{/if}
				</h1>

				<button class="username-chip" onclick={copyUsername} aria-label="Copy username">
					<span>@{profile?.username}</span>
					<Copy size={11} strokeWidth={2.5} />
				</button>
			</div>
		</div>
	</header>

	<!-- ─── STATS ─────────────────────────────────── -->
	<section class="stats-row" in:fly={{ y: 20, duration: 600, delay: 80, easing: cubicOut }}>
		<div class="stat-item">
			<span class="stat-icon stat-icon-amber"><Star size={14} strokeWidth={2} /></span>
			<span class="stat-value">{profile?.total_score ?? '0'}</span>
			<span class="stat-label">{m.profile_total_score ? m.profile_total_score() : 'Ball'}</span>
		</div>
		<div class="stat-divider" aria-hidden="true"></div>
		<div class="stat-item">
			<span class="stat-icon stat-icon-sky"><BookOpen size={14} strokeWidth={2} /></span>
			<span class="stat-value">{profile?.courses_count ?? '0'}</span>
			<span class="stat-label">{m.profile_courses ? m.profile_courses() : 'Kurslar'}</span>
		</div>
		<div class="stat-divider" aria-hidden="true"></div>
		<div class="stat-item">
			<span class="stat-icon stat-icon-emerald"><FileCheck size={14} strokeWidth={2} /></span>
			<span class="stat-value">{profile?.submissions_count ?? '0'}</span>
			<span class="stat-label"
				>{m.profile_total_submissions ? m.profile_total_submissions() : 'Topshiriqlar'}</span
			>
		</div>
	</section>

	<!-- ─── BODY ─────────────────────────────────── -->
	<div class="body-grid" in:fly={{ y: 16, duration: 600, delay: 160, easing: cubicOut }}>
		<!-- SIDEBAR -->
		<aside class="sidebar">
			<p class="sidebar-section-label">
				<Settings size={13} strokeWidth={2.5} />
				{m.profile_settings ? m.profile_settings() : 'Sozlamalar'}
			</p>

			<nav class="sidebar-nav">
				<button
					class="nav-item {activeTab === 'basic' ? 'nav-item--active' : ''}"
					onclick={() => (activeTab = 'basic')}
				>
					<span class="nav-icon {activeTab === 'basic' ? 'nav-icon--pink' : ''}">
						<User size={16} strokeWidth={2} />
					</span>
					<span class="nav-label"
						>{m.profile_basic_info ? m.profile_basic_info() : "Ma'lumotlar"}</span
					>
					<ChevronRight
						size={14}
						class="nav-chevron {activeTab === 'basic' ? 'nav-chevron--active' : ''}"
						strokeWidth={2.5}
					/>
				</button>

				<button
					class="nav-item {activeTab === 'devices' ? 'nav-item--active nav-item--active-blue' : ''}"
					onclick={() => (activeTab = 'devices')}
				>
					<span class="nav-icon {activeTab === 'devices' ? 'nav-icon--blue' : ''}">
						<Smartphone size={16} strokeWidth={2} />
					</span>
					<span class="nav-label"
						>{m.profile_devices_title ? m.profile_devices_title() : 'Qurilmalar'}</span
					>
					{#if activeDevices.length > 0}
						<span class="nav-badge">{activeDevices.length}</span>
					{/if}
				</button>
			</nav>

			<div class="sidebar-footer">
				{#if profile?.created_at}
					<div class="member-since">
						<Clock size={12} strokeWidth={2} />
						<span
							>{new Date(profile.created_at).toLocaleDateString($page?.data?.lang || 'uz', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})}</span
						>
					</div>
				{/if}

				<form action="/auth/logout" method="POST">
					<button class="logout-btn" type="submit">
						<LogOut size={15} strokeWidth={2} />
						<span>{m.menu_logout ? m.menu_logout() : 'Chiqish'}</span>
					</button>
				</form>
			</div>
		</aside>

		<!-- CONTENT -->
		<section class="content-panel">
			{#if activeTab === 'basic'}
				<div in:fade={{ duration: 180 }}>
					<div class="panel-header">
						<h2 class="panel-title">
							{m.profile_basic_info ? m.profile_basic_info() : "Asosiy ma'lumotlar"}
						</h2>
						<p class="panel-desc">
							{m.profile_settings_desc
								? m.profile_settings_desc()
								: "Shaxsiy ma'lumotlaringizni tahrirlang"}
						</p>
					</div>

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
						class="profile-form"
					>
						<div class="form-row">
							<div class="form-field">
								<label for="first_name" class="field-label">
									{m.profile_first_name_label ? m.profile_first_name_label() : 'Ism'}
								</label>
								<input
									type="text"
									id="first_name"
									name="first_name"
									value={profile?.first_name || ''}
									class="field-input"
									placeholder="Ali"
									required
								/>
							</div>
							<div class="form-field">
								<label for="last_name" class="field-label">
									{m.profile_last_name_label ? m.profile_last_name_label() : 'Familiya'}
								</label>
								<input
									type="text"
									id="last_name"
									name="last_name"
									value={profile?.last_name || ''}
									class="field-input"
									placeholder="Toirov"
									required
								/>
							</div>
						</div>

						<div class="form-field">
							<label for="phone_number" class="field-label">
								{m.profile_phone_label ? m.profile_phone_label() : 'Telefon'}
							</label>
							<PhoneInput
								id="phone_number"
								name="phone_number"
								bind:value={profile.phone_number}
								placeholder="+998 90 123 45 67"
								variant="flat"
							/>
						</div>

						<div class="form-actions">
							<button type="submit" disabled={isSubmitting} class="save-btn">
								{#if isSubmitting}
									<span class="btn-spinner" aria-hidden="true"></span>
									<span>{m.profile_saving ? m.profile_saving() : 'Saqlanmoqda...'}</span>
								{:else}
									<span>{m.profile_save_changes ? m.profile_save_changes() : 'Saqlash'}</span>
								{/if}
							</button>
						</div>
					</form>
				</div>
			{:else if activeTab === 'devices'}
				<div in:fade={{ duration: 180 }}>
					<div class="panel-header">
						<h2 class="panel-title">
							{m.profile_devices_title ? m.profile_devices_title() : 'Qurilmalar'}
						</h2>
						<p class="panel-desc">
							{m.profile_devices_desc ? m.profile_devices_desc() : 'Faol sessiyalaringiz'}
						</p>
					</div>

					<div class="device-list">
						{#each activeDevices as device (device.session_id)}
							<div
								class="device-card {device.is_current ? 'device-card--current' : ''}"
								in:scale={{ duration: 200, start: 0.97, easing: cubicOut }}
							>
								<div class="device-left">
									<div
										class="device-icon-wrap {device.is_current ? 'device-icon-wrap--active' : ''}"
									>
										{#if parseUserAgent(device.device_name) === 'Mobile'}
											<Smartphone size={18} strokeWidth={2} />
										{:else}
											<Monitor size={18} strokeWidth={2} />
										{/if}
									</div>

									<div class="device-info">
										<div class="device-name-row">
											<span class="device-name">{formatDeviceName(device.device_name)}</span>
											{#if device.is_current}
												<span class="badge badge-current"
													>{m.profile_device_current ? m.profile_device_current() : 'Joriy'}</span
												>
											{:else if device.is_active}
												<span class="badge badge-active"
													>{m.profile_device_active ? m.profile_device_active() : 'Faol'}</span
												>
											{/if}
										</div>
										<div class="device-meta">
											{#if device.ip_address}
												<span class="meta-chip">
													<MapPin size={10} strokeWidth={2} />
													{device.ip_address}
												</span>
											{/if}
											{#if device.last_seen_at}
												<span class="meta-chip">
													<Clock size={10} strokeWidth={2} />
													{new Date(device.last_seen_at).toLocaleDateString(
														$page?.data?.lang || 'uz',
														{ month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
													)}
												</span>
											{/if}
										</div>
									</div>
								</div>

								{#if !device.is_current}
									<form
										action="?/logoutDevice"
										method="POST"
										use:enhance={() => {
											terminatingSessions[device.session_id] = true;
											return async ({ update, result }) => {
												delete terminatingSessions[device.session_id];
												if (result.type === 'success') {
													toast.success(
														String(
															result.data?.['message'] ||
																(m.profile_device_logout_success
																	? m.profile_device_logout_success()
																	: 'Chiqarildi')
														)
													);
												} else if (result.type === 'failure') {
													toast.error(
														String(
															result.data?.['error'] ||
																(m.profile_device_logout_error
																	? m.profile_device_logout_error()
																	: 'Xatolik')
														)
													);
												}
												await update();
											};
										}}
									>
										<input type="hidden" name="session_id" value={device.session_id} />
										<button
											type="submit"
											class="device-remove-btn"
											disabled={terminatingSessions[device.session_id]}
											title={m.profile_device_logout ? m.profile_device_logout() : 'Chiqarish'}
										>
											{#if terminatingSessions[device.session_id]}
												<Loader2 size={15} strokeWidth={2} class="animate-spin" />
											{:else}
												<Trash2 size={15} strokeWidth={2} />
											{/if}
										</button>
									</form>
								{/if}
							</div>
						{/each}

						{#if activeDevices.length === 0}
							<div class="empty-devices">
								<Monitor size={32} strokeWidth={1.5} />
								<p>Faol qurilmalar topilmadi</p>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</section>
	</div>
</div>

<style>
	/* ─── Tokens ──────────────────────────────────────────────────── */
	:root {
		--brand: #fa2e69;
		--brand-dark: #d41f55;
		--brand-light: #fff0f5;
		--brand-mid: #ffd6e5;
		--ink-900: #0d0d12;
		--ink-700: #2a2a35;
		--ink-500: #5c5c70;
		--ink-300: #9898ac;
		--ink-100: #ededf5;
		--ink-50: #f7f7fb;
		--white: #ffffff;
		--sky: #0ea5e9;
		--emerald: #10b981;
		--amber: #f59e0b;
		--radius-sm: 10px;
		--radius-md: 16px;
		--radius-lg: 24px;
		--radius-xl: 32px;
		--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
		--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
		--shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06);
		--font-display: system-ui, sans-serif;
		--font-body: 'DM Sans', system-ui, sans-serif;
	}

	/* ─── Reset ─────────────────────────────────────────────────── */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* ─── Root ───────────────────────────────────────────────────── */
	.page-root {
		min-height: 100svh;
		background: var(--ink-50);
		font-family: var(--font-body);
		color: var(--ink-700);
	}

	/* ─── Hero ───────────────────────────────────────────────────── */
	.hero {
		position: relative;
		background: var(--brand);
		padding: 3.5rem 1.5rem 5rem;
		overflow: hidden;
		contain: layout style;
	}
	.hero-noise {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
		background-size: 200px;
		pointer-events: none;
		opacity: 0.6;
	}
	.hero-ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.1);
		pointer-events: none;
	}
	.hero-ring-1 {
		width: 420px;
		height: 420px;
		top: -160px;
		right: -100px;
	}
	.hero-ring-2 {
		width: 280px;
		height: 280px;
		bottom: -80px;
		left: -60px;
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		max-width: 960px;
		margin-inline: auto;
		display: flex;
		align-items: center;
		gap: 1.75rem;
	}

	/* Avatar */
	.avatar-wrap {
		position: relative;
		flex-shrink: 0;
	}
	.avatar {
		width: 88px;
		height: 88px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		border: 2.5px solid rgba(255, 255, 255, 0.35);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 800;
		color: #fff;
		letter-spacing: -0.02em;
		backdrop-filter: blur(8px);
	}
	.avatar-badge {
		position: absolute;
		bottom: 3px;
		right: 3px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--emerald);
		border: 2px solid var(--brand);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	/* Hero text */
	.hero-text {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.hero-name {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 800;
		color: #fff;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}
	.username-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: rgba(255, 255, 255, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 100px;
		padding: 0.35rem 0.9rem;
		font-size: 0.78rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition:
			background 0.2s,
			transform 0.15s;
		width: fit-content;
	}
	.username-chip:hover {
		background: rgba(255, 255, 255, 0.22);
		transform: translateY(-1px);
	}
	.username-chip:active {
		transform: scale(0.97);
	}

	/* ─── Stats ─────────────────────────────────────────────────── */
	.stats-row {
		max-width: 960px;
		margin-inline: auto;
		margin-top: -2.25rem;
		margin-bottom: 0;
		background: var(--white);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		display: flex;
		align-items: stretch;
		overflow: hidden;
		position: relative;
		z-index: 10;
		mx: 1.5rem;
		margin-left: max(1.5rem, calc((100% - 960px) / 2));
		margin-right: max(1.5rem, calc((100% - 960px) / 2));
	}

	.stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		padding: 1.5rem 1rem;
	}
	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-sm);
		margin-bottom: 0.25rem;
	}
	.stat-icon-amber {
		background: #fef3c7;
		color: var(--amber);
	}
	.stat-icon-sky {
		background: #e0f2fe;
		color: var(--sky);
	}
	.stat-icon-emerald {
		background: #d1fae5;
		color: var(--emerald);
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--ink-900);
		letter-spacing: -0.04em;
		line-height: 1;
	}
	.stat-label {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--ink-300);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	.stat-divider {
		width: 1px;
		background: var(--ink-100);
		align-self: stretch;
		margin-block: 1rem;
	}

	/* ─── Body Grid ──────────────────────────────────────────────── */
	.body-grid {
		max-width: 960px;
		margin-inline: auto;
		margin-top: 1.75rem;
		padding-inline: 1.5rem;
		padding-bottom: 4rem;
		display: grid;
		grid-template-columns: 240px 1fr;
		gap: 1.5rem;
		align-items: start;
	}
	@media (max-width: 768px) {
		.body-grid {
			grid-template-columns: 1fr;
		}
	}

	/* ─── Sidebar ────────────────────────────────────────────────── */
	.sidebar {
		background: var(--white);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: sticky;
		top: 1.5rem;
	}
	.sidebar-section-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--ink-300);
		padding: 0 0.25rem;
		margin-bottom: 0.25rem;
	}
	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0.875rem;
		border-radius: var(--radius-md);
		border: none;
		background: transparent;
		cursor: pointer;
		transition:
			background 0.18s,
			transform 0.12s;
		text-align: left;
		width: 100%;
	}
	.nav-item:hover {
		background: var(--ink-50);
	}
	.nav-item:active {
		transform: scale(0.98);
	}
	.nav-item--active {
		background: var(--brand-light) !important;
	}
	.nav-item--active-blue {
		background: #eff6ff !important;
	}

	.nav-icon {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9px;
		background: var(--ink-100);
		color: var(--ink-300);
		flex-shrink: 0;
		transition:
			background 0.18s,
			color 0.18s;
	}
	.nav-icon--pink {
		background: var(--brand-mid);
		color: var(--brand);
	}
	.nav-icon--blue {
		background: #dbeafe;
		color: #2563eb;
	}

	.nav-label {
		flex: 1;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-700);
	}
	.nav-item--active .nav-label {
		color: var(--ink-900);
	}

	:global(.nav-chevron) {
		color: var(--ink-100);
		transition:
			color 0.18s,
			transform 0.18s;
		flex-shrink: 0;
	}
	:global(.nav-chevron--active) {
		color: var(--brand) !important;
	}

	.nav-badge {
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.15rem 0.5rem;
		border-radius: 100px;
		background: var(--ink-100);
		color: var(--ink-500);
	}

	.sidebar-footer {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid var(--ink-100);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.member-since {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.72rem;
		color: var(--ink-300);
		padding-inline: 0.25rem;
	}

	.logout-btn {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		padding: 0.7rem 0.875rem;
		border-radius: var(--radius-md);
		border: none;
		background: transparent;
		color: #e11d48;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.18s;
	}
	.logout-btn:hover {
		background: #fff1f2;
	}

	/* ─── Content Panel ──────────────────────────────────────────── */
	.content-panel {
		background: var(--white);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		padding: 2.25rem 2rem;
		min-height: 400px;
	}
	@media (max-width: 480px) {
		.content-panel {
			padding: 1.5rem 1.25rem;
		}
	}

	.panel-header {
		margin-bottom: 2rem;
	}
	.panel-title {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 800;
		color: var(--ink-900);
		letter-spacing: -0.02em;
		margin-bottom: 0.35rem;
	}
	.panel-desc {
		font-size: 0.85rem;
		color: var(--ink-300);
		font-weight: 400;
	}

	/* ─── Form ───────────────────────────────────────────────────── */
	.profile-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
	}
	@media (max-width: 540px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-300);
	}
	.field-input {
		width: 100%;
		padding: 0.85rem 1rem;
		background: var(--ink-50);
		border: 1.5px solid var(--ink-100);
		border-radius: var(--radius-md);
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--ink-900);
		outline: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s,
			background 0.2s;
		-webkit-appearance: none;
		appearance: none;
	}
	.field-input::placeholder {
		color: var(--ink-100);
	}
	.field-input:hover {
		border-color: var(--ink-300);
	}
	.field-input:focus {
		background: var(--white);
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(250, 46, 105, 0.1);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		padding-top: 0.75rem;
		border-top: 1px solid var(--ink-100);
		margin-top: 0.5rem;
	}
	.save-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.85rem 2.25rem;
		background: var(--brand);
		color: #fff;
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.15s,
			box-shadow 0.2s;
		box-shadow: 0 4px 14px rgba(250, 46, 105, 0.25);
	}
	.save-btn:hover:not(:disabled) {
		background: var(--brand-dark);
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(250, 46, 105, 0.3);
	}
	.save-btn:active:not(:disabled) {
		transform: scale(0.98);
	}
	.save-btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.btn-spinner {
		width: 15px;
		height: 15px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.75s linear infinite;
		flex-shrink: 0;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ─── Devices ────────────────────────────────────────────────── */
	.device-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.device-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 1.25rem;
		background: var(--ink-50);
		border: 1.5px solid var(--ink-100);
		border-radius: var(--radius-md);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.device-card:hover {
		border-color: var(--ink-300);
		box-shadow: var(--shadow-sm);
	}
	.device-card--current {
		background: var(--brand-light);
		border-color: rgba(250, 46, 105, 0.2);
		border-left: 3px solid var(--brand);
	}

	.device-left {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
		min-width: 0;
	}

	.device-icon-wrap {
		width: 42px;
		height: 42px;
		border-radius: var(--radius-sm);
		background: var(--white);
		border: 1px solid var(--ink-100);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ink-300);
		flex-shrink: 0;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.device-icon-wrap--active {
		background: var(--brand);
		border-color: var(--brand);
		color: #fff;
	}

	.device-info {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-width: 0;
	}

	.device-name-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.device-name {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--ink-900);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.badge {
		font-size: 0.6rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.2rem 0.55rem;
		border-radius: 100px;
	}
	.badge-current {
		background: var(--brand);
		color: #fff;
	}
	.badge-active {
		background: #d1fae5;
		color: #065f46;
	}

	.device-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.meta-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--ink-300);
	}

	.device-remove-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		border: none;
		background: transparent;
		color: var(--ink-300);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background 0.18s,
			color 0.18s,
			transform 0.12s;
	}
	.device-remove-btn:hover {
		background: #fff1f2;
		color: #e11d48;
	}
	.device-remove-btn:active {
		transform: scale(0.92);
	}

	.empty-devices {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 3rem 1rem;
		color: var(--ink-100);
		font-size: 0.85rem;
		font-weight: 500;
	}

	/* ─── Global overrides ───────────────────────────────────────── */
	:global(body) {
		background-color: var(--ink-50) !important;
	}
</style>
