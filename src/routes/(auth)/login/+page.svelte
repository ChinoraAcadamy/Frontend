<script>
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';
	import { setLocale, getLocale } from '$lib/paraglide/runtime.js';
	import { browser } from '$app/environment';
	import {
		Loader2,
		ArrowRight,
		User,
		LockKeyhole,
		Globe,
		Phone,
		Send,
		CreditCard,
		Eye,
		EyeOff,
		Smartphone,
		Monitor,
		Trash2,
		AlertTriangle,
		X
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import SeoMeta from '@/lib/components/ui/SeoMeta.svelte';

	let { form } = $props();
	let loading = $state(false);
	let showPassword = $state(false);
	let showDeviceModal = $state(false);
	let terminatingSessionId = $state(null);

	$effect(() => {
		if (form?.isLimitError) {
			showDeviceModal = true;
		}
	});

	const parseUserAgent = (ua) => {
		if (!ua) return m.profile_device_unknown();
		if (ua.includes('iPhone') || ua.includes('Android')) return 'Mobile';
		if (ua.includes('Macintosh') || ua.includes('Windows') || ua.includes('Linux'))
			return 'Desktop';
		return 'Device';
	};

	const formatDeviceName = (ua) => {
		if (!ua) return m.profile_device_unknown();
		if (ua.includes('Chrome')) return 'Chrome';
		if (ua.includes('Firefox')) return 'Firefox';
		if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
		if (ua.includes('Edge')) return 'Edge';
		return ua.split(' ')[0] || m.profile_device_unknown();
	};

	const currentLocale = $derived(browser ? getLocale() : 'uz');

	function handleLocaleChange(newLocale) {
		if (browser) setLocale(newLocale);
	}
</script>

<SeoMeta
	title={m.login_seo_title?.() ?? 'Tizimga kirish - Chinora Academy'}
	description={m.login_seo_desc?.() ??
		"Chinora Academy platformasiga kirish. O'z hisobingizga kiring va o'qishni davom ettiring."}
/>

<div class="root">
	<!-- Ambient background glows -->
	<span class="glow glow-a" aria-hidden="true"></span>
	<span class="glow glow-b" aria-hidden="true"></span>
	<span class="glow glow-c" aria-hidden="true"></span>

	<!-- Grain overlay -->
	<svg class="grain" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
		<filter id="grain-filter">
			<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
			<feColorMatrix type="saturate" values="0" />
			<feBlend in="SourceGraphic" mode="overlay" />
		</filter>
		<rect width="100%" height="100%" filter="url(#grain-filter)" opacity="0.035" />
	</svg>

	<!-- Language switcher -->
	<div class="lang-switcher" in:fly={{ y: -16, duration: 700, delay: 300, opacity: 0 }}>
		{#each ['uz', 'ru'] as lang (lang)}
			<button
				onclick={() => handleLocaleChange(lang)}
				class="lang-btn"
				class:lang-active={currentLocale === lang}
				aria-pressed={currentLocale === lang}
			>
				{lang}
			</button>
		{/each}
	</div>

	<!-- Main layout -->
	<div class="layout" in:fly={{ y: 24, duration: 800, delay: 80, opacity: 0 }}>
		<!-- LEFT: Branding + Form -->
		<div class="left-col">
			<div class="brand" in:fly={{ y: 16, duration: 700, delay: 200, opacity: 0 }}>
				<p class="brand-eyebrow">
					{m.login_academy_name?.() ?? 'Chinora Fashion Academy'}
				</p>
				<h1 class="brand-title">
					{m.login_title?.() ?? 'Tizimga kirish'}
				</h1>
				<p class="brand-sub">
					{m.login_subtitle?.() ?? 'Davom etish uchun hisobingizga kiring'}
				</p>
			</div>

			<div class="form-card" in:fly={{ y: 20, duration: 800, delay: 320, opacity: 0 }}>
				<!-- Decorative top line -->
				<span class="card-topline" aria-hidden="true"></span>

				<form
					method="POST"
					action="?/login"
					use:enhance={() => {
						loading = true;
						return async ({ update, result }) => {
							if (result.type === 'failure' || result.type === 'error') {
								loading = false;
							}
							await update();
						};
					}}
					class="form-body"
				>
					<!-- Device Name Hidden Input -->
					<input type="hidden" name="device_name" value={browser ? navigator.userAgent : ''} />

					<!-- Username field -->
					<div class="field">
						<label for="username" class="field-label">
							{m.login_username_label?.() ?? 'Username'}
						</label>
						<div class="input-wrap">
							<User class="input-icon" size={17} strokeWidth={1.6} />
							<input
								id="username"
								name="username"
								type="text"
								required
								autocomplete="username"
								class="input"
								placeholder={m.login_username_placeholder?.() ?? 'Loginingizni kiriting'}
							/>
						</div>
					</div>

					<!-- Password field -->
					<div class="field">
						<label for="password" class="field-label">
							{m.login_password_label?.() ?? 'Parol'}
						</label>
						<div class="input-wrap">
							<LockKeyhole class="input-icon" size={17} strokeWidth={1.6} />
							<input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								required
								autocomplete="current-password"
								class="input password-input"
								placeholder={m.login_password_placeholder?.() ?? 'Parolingizni kiriting'}
							/>
							<button
								type="button"
								class="eye-btn"
								onclick={() => (showPassword = !showPassword)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{#if showPassword}
									<div in:fade={{ duration: 150 }} class="eye-icon-wrap">
										<EyeOff size={18} strokeWidth={2} />
									</div>
								{:else}
									<div in:fade={{ duration: 150 }} class="eye-icon-wrap">
										<Eye size={18} strokeWidth={2} />
									</div>
								{/if}
							</button>
						</div>
					</div>

					{#if form?.error}
						<div class="error-msg" in:fade={{ duration: 180 }}>
							{form.error}
						</div>
					{/if}

					<button type="submit" disabled={loading} class="submit-btn">
						{#if loading}
							<Loader2 class="spin" size={18} />
							<span>{m.login_loading?.() ?? 'Kuting...'}</span>
						{:else}
							<span>{m.login_button?.() ?? 'Kirish'}</span>
							<ArrowRight class="btn-arrow" size={16} strokeWidth={2.5} />
						{/if}
					</button>

					<p class="forgot-hint">
						{m.login_forgot_password?.() ??
							"Parolni unutdingizmi? Qo'llab-quvvatlash bilan bog'laning."}
					</p>
				</form>
			</div>
		</div>

		<!-- RIGHT: Info cards (desktop) -->
		<div class="right-col">
			<!-- Payment card -->
			<div class="info-card" in:fly={{ x: 24, duration: 800, delay: 420, opacity: 0 }}>
				<div class="info-card-header">
					<span class="info-icon info-icon-dark">
						<CreditCard size={16} strokeWidth={1.8} />
					</span>
					<h2 class="info-card-title">
						{m.login_payment_title?.() ?? "To'lov usullari"}
					</h2>
				</div>
				<div class="payment-pills">
					{#each (m.login_payment_list?.() ?? 'Click, Payme, Uzcard, Humo').split(', ') as method (method)}
						<span class="payment-pill">{method}</span>
					{/each}
				</div>
			</div>

			<!-- Support card -->
			<div class="info-card" in:fly={{ x: 24, duration: 800, delay: 520, opacity: 0 }}>
				<div class="info-card-header">
					<span class="info-icon info-icon-rose">
						<Globe size={16} strokeWidth={1.8} />
					</span>
					<h2 class="info-card-title">
						{m.login_support_help?.() ?? 'Yordam kerakmi?'}
					</h2>
				</div>
				<div class="contact-list">
					<a href="tel:+998338055505" class="contact-item contact-phone">
						<span class="contact-icon-wrap">
							<Phone size={16} strokeWidth={1.8} />
						</span>
						<div>
							<span class="contact-label">{m.login_contact_phone?.() ?? 'Telefon'}</span>
							<span class="contact-value">+998 33 805 55 05</span>
						</div>
					</a>
					<a
						href="https://t.me/chinora_academy"
						target="_blank"
						rel="noopener noreferrer"
						class="contact-item contact-tg"
					>
						<span class="contact-icon-wrap">
							<Send size={16} strokeWidth={1.8} />
						</span>
						<div>
							<span class="contact-label">Telegram</span>
							<span class="contact-value">@chinora_academy</span>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<footer class="footer">
		© {new Date().getFullYear()} Chinora Fashion Academy
	</footer>
</div>

{#if showDeviceModal}
	<div
		class="modal-backdrop"
		transition:fade={{ duration: 250 }}
		onclick={() => (showDeviceModal = false)}
		onkeydown={(e) => e.key === 'Escape' && (showDeviceModal = false)}
		role="button"
		tabindex="-1"
		aria-label="Close modal"
	>
		<div
			class="modal-content"
			transition:fly={{ y: 40, duration: 400, opacity: 0 }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<div class="modal-header">
				<div class="alert-icon-wrap">
					<AlertTriangle size={32} class="text-amber-500" />
				</div>
				<button class="close-btn" onclick={() => (showDeviceModal = false)}>
					<X size={20} />
				</button>
			</div>

			<div class="modal-body">
				<h2 class="modal-title">{m.login_device_limit_title()}</h2>
				<p class="modal-desc">{m.login_device_limit_desc()}</p>

				<div class="device-list">
				{console.log(form)}
					{#each form?.devices || [] as device (device.session_id)}
						<div class="device-card" class:device-current={device.is_current}>
							<div class="device-info">
								<div class="device-icon-wrap">
									{#if parseUserAgent(device.device_name) === 'Mobile'}
										<Smartphone size={20} />
									{:else}
										<Monitor size={20} />
									{/if}
								</div>
								<div class="device-text">
									<h4 class="device-name">
										{formatDeviceName(device.device_name)}
										{#if device.is_current}
											<span class="current-badge">{m.login_device_current_hint()}</span>
										{/if}
									</h4>
									<div class="device-meta">
										<span>{m.login_device_logged_in_at()}</span>
										<span class="meta-value">
											{new Date(device.created_at).toLocaleString(currentLocale, {
												hour: '2-digit',
												minute: '2-digit',
												day: '2-digit',
												month: '2-digit',
												year: 'numeric'
											})}
										</span>
									</div>
								</div>
							</div>

							{#if !device.is_current}
								<form
									method="POST"
									action="?/logoutDevice"
									use:enhance={() => {
										terminatingSessionId = device.session_id;
										return async ({ update, result }) => {
											terminatingSessionId = null;
											if (result.type === 'success') {
												// Optionally close modal or refresh
												showDeviceModal = false;
											}
											await update();
										};
									}}
								>
									<input type="hidden" name="session_id" value={device.session_id} />
									<input type="hidden" name="username" value={form?.username} />
									<input type="hidden" name="password" value={form?.password} />
									<button
										type="submit"
										class="logout-btn"
										disabled={terminatingSessionId === device.session_id}
									>
										{#if terminatingSessionId === device.session_id}
											<Loader2 size={16} class="spin" />
										{:else}
											<Trash2 size={16} />
											<span>{m.login_device_logout_btn()}</span>
										{/if}
									</button>
								</form>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* ─── Reset & Root ─────────────────────────────────────────────── */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.root {
		position: relative;
		min-height: 100svh;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #fdfbfa;
		overflow: hidden;
		padding: 4rem 1.25rem 2rem;
		font-family:
			'Lexend',
			system-ui,
			-apple-system,
			sans-serif;
	}

	/* ─── Ambient Glows ────────────────────────────────────────────── */
	.glow {
		position: absolute;
		border-radius: 50%;
		pointer-events: none;
		will-change: transform;
	}
	.glow-a {
		top: -15%;
		left: -10%;
		width: 60vw;
		height: 60vw;
		background: radial-gradient(circle, rgba(230, 62, 122, 0.12) 0%, transparent 70%);
		filter: blur(80px);
	}
	.glow-b {
		bottom: -15%;
		right: -10%;
		width: 55vw;
		height: 55vw;
		background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
		filter: blur(100px);
	}
	.glow-c {
		top: 40%;
		left: 30%;
		width: 45vw;
		height: 45vw;
		background: radial-gradient(circle, rgba(230, 62, 122, 0.05) 0%, transparent 70%);
		filter: blur(110px);
	}

	/* ─── Grain ────────────────────────────────────────────────────── */
	.grain {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	/* ─── Language Switcher ────────────────────────────────────────── */
	.lang-switcher {
		position: fixed;
		top: 1.5rem;
		right: 1.5rem;
		z-index: 100;
		display: flex;
		gap: 4px;
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(0, 0, 0, 0.05);
		border-radius: 100px;
		padding: 4px;
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
	}
	.lang-btn {
		height: 36px;
		width: 48px;
		border: none;
		border-radius: 100px;
		background: transparent;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #64748b;
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.lang-btn:hover:not(.lang-active) {
		color: #1e293b;
		background: rgba(255, 255, 255, 0.8);
	}
	.lang-active {
		background: #1e293b;
		color: #fff !important;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	/* ─── Layout Grid ──────────────────────────────────────────────── */
	.layout {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1080px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
		align-items: center;
	}

	@media (min-width: 1024px) {
		.layout {
			grid-template-columns: 1fr 1fr;
			gap: 5rem;
		}
	}

	/* ─── Left Column ──────────────────────────────────────────────── */
	.left-col {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* ─── Brand Text ───────────────────────────────────────────────── */
	.brand {
		text-align: center;
	}
	@media (min-width: 1024px) {
		.brand {
			text-align: left;
		}
	}

	.brand-eyebrow {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.35em;
		text-transform: uppercase;
		color: #e63e7a;
		margin-bottom: 1rem;
		text-shadow: 0 0 20px rgba(230, 62, 122, 0.1);
	}
	.brand-title {
		font-size: clamp(2.25rem, 6vw, 3.25rem);
		font-weight: 700;
		letter-spacing: -0.04em;
		color: #0f172a;
		line-height: 1.05;
		margin-bottom: 0.8rem;
	}
	.brand-sub {
		font-size: 1rem;
		color: #64748b;
		line-height: 1.6;
		max-width: 400px;
		margin-inline: auto;
	}
	@media (min-width: 1024px) {
		.brand-sub {
			margin-inline: 0;
		}
	}

	/* ─── Form Card ────────────────────────────────────────────────── */
	.form-card {
		position: relative;
		background: rgba(255, 255, 255, 0.75);
		border: 1px solid rgba(255, 255, 255, 1);
		border-radius: 32px;
		padding: 2.75rem;
		backdrop-filter: blur(32px);
		-webkit-backdrop-filter: blur(32px);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.8) inset,
			0 25px 50px -12px rgba(0, 0, 0, 0.06),
			0 10px 15px -3px rgba(0, 0, 0, 0.03);
		overflow: hidden;
	}
	.card-topline {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, rgba(230, 62, 122, 0.4), transparent);
	}

	/* ─── Form ─────────────────────────────────────────────────────── */
	.form-body {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.field-label {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #475569;
		margin-left: 4px;
	}
	.input-wrap {
		position: relative;
		display: flex;
		align-items: center;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.input-wrap:focus-within {
		transform: scale(1.01);
	}
	:global(.input-icon) {
		position: absolute;
		left: 1.25rem;
		color: #94a3b8;
		pointer-events: none;
		transition: color 0.2s;
	}
	.input-wrap:focus-within :global(.input-icon) {
		color: #e63e7a;
	}
	.input {
		width: 100%;
		padding: 1rem 1.25rem 1rem 3.25rem;
		background: rgba(255, 255, 255, 0.6);
		border: 1.5px solid rgba(226, 232, 240, 0.8);
		border-radius: 18px;
		font-size: 0.95rem;
		color: #1e293b;
		outline: none;
		transition: all 0.25s;
		-webkit-appearance: none;
	}
	.input::placeholder {
		color: #94a3b8;
	}
	.input:focus {
		background: #fff;
		border-color: #e63e7a;
		box-shadow: 0 0 0 4px rgba(230, 62, 122, 0.1);
	}

	.password-input {
		padding-right: 3.5rem;
	}

	.eye-btn {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 12px;
		color: #94a3b8;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 10;
		padding: 0;
	}
	.eye-btn:hover {
		background: rgba(230, 62, 122, 0.08);
		color: #e63e7a;
		transform: translateY(-50%) scale(1.05);
	}
	.eye-btn:active {
		transform: translateY(-50%) scale(0.95);
	}
	.eye-icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.error-msg {
		background: #fff1f2;
		border: 1px solid #fda4af;
		border-radius: 14px;
		padding: 0.85rem 1rem;
		font-size: 0.85rem;
		color: #e11d48;
		text-align: center;
		font-weight: 500;
	}

	/* ─── Submit Button ────────────────────────────────────────────── */
	.submit-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		width: 100%;
		padding: 1.05rem 1.5rem;
		background: #1e293b;
		color: #fff;
		border: none;
		border-radius: 18px;
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		margin-top: 0.5rem;
	}
	.submit-btn::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.05), transparent);
		transform: translateX(-100%);
		transition: transform 0.6s;
	}
	.submit-btn:hover:not(:disabled) {
		background: #0f172a;
		box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
		transform: translateY(-2px);
	}
	.submit-btn:hover:not(:disabled)::after {
		transform: translateX(100%);
	}
	.submit-btn:active:not(:disabled) {
		transform: translateY(0) scale(0.98);
	}
	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	:global(.btn-arrow) {
		transition: transform 0.25s;
	}
	.submit-btn:hover :global(.btn-arrow) {
		transform: translateX(4px);
	}
	:global(.spin) {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.forgot-hint {
		text-align: center;
		font-size: 0.8rem;
		color: #64748b;
		font-weight: 500;
	}

	/* ─── Right Column ─────────────────────────────────────────────── */
	.right-col {
		display: none;
		flex-direction: column;
		gap: 1.5rem;
	}
	@media (min-width: 1024px) {
		.right-col {
			display: flex;
		}
	}

	/* ─── Info Cards ───────────────────────────────────────────────── */
	.info-card {
		background: rgba(255, 255, 255, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.9);
		border-radius: 28px;
		padding: 2rem;
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		box-shadow: 0 15px 40px -15px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}
	.info-card:hover {
		background: rgba(255, 255, 255, 0.7);
		box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.08);
		transform: translateY(-4px);
	}

	.info-card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	.info-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 42px;
		height: 42px;
		border-radius: 14px;
		flex-shrink: 0;
	}
	.info-icon-dark {
		background: #1e293b;
		color: #fff;
		box-shadow: 0 8px 16px -4px rgba(30, 41, 59, 0.2);
	}
	.info-icon-rose {
		background: #e63e7a;
		color: #fff;
		box-shadow: 0 8px 16px -4px rgba(230, 62, 122, 0.3);
	}

	.info-card-title {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: #1e293b;
	}

	/* ─── Payment Pills ────────────────────────────────────────────── */
	.payment-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.payment-pill {
		padding: 0.5rem 1.25rem;
		background: #fff;
		border: 1.5px solid rgba(226, 232, 240, 0.6);
		border-radius: 100px;
		font-size: 0.8rem;
		font-weight: 700;
		color: #475569;
		transition: all 0.25s;
		cursor: default;
	}
	.payment-pill:hover {
		border-color: #e63e7a;
		color: #e63e7a;
		transform: scale(1.05);
	}

	/* ─── Contact Items ────────────────────────────────────────────── */
	.contact-list {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.contact-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: rgba(255, 255, 255, 0.6);
		border: 1.5px solid rgba(226, 232, 240, 0.6);
		border-radius: 20px;
		text-decoration: none;
		transition: all 0.25s;
	}
	.contact-item:hover {
		background: #fff;
		transform: translateX(5px);
		box-shadow: 0 8px 20px -5px rgba(0, 0, 0, 0.05);
	}
	.contact-phone:hover {
		border-color: rgba(230, 62, 122, 0.3);
	}
	.contact-tg:hover {
		border-color: rgba(30, 130, 240, 0.3);
	}

	.contact-icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 14px;
		background: #f8fafc;
		color: #94a3b8;
		flex-shrink: 0;
		transition: all 0.2s;
	}
	.contact-phone:hover .contact-icon-wrap {
		background: #fff1f2;
		color: #e63e7a;
	}
	.contact-tg:hover .contact-icon-wrap {
		background: #f0f9ff;
		color: #0ea5e9;
	}

	.contact-item > div {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.contact-label {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #94a3b8;
	}
	.contact-value {
		font-size: 0.95rem;
		font-weight: 800;
		color: #1e293b;
	}

	/* ─── Mobile Info ─────────── */
	@media (max-width: 1023px) {
		.right-col {
			display: flex !important;
			margin-top: 1rem;
		}
	}

	/* ─── Footer ───────────────────────────────────────────────────── */
	.footer {
		position: relative;
		z-index: 10;
		margin-top: 4rem;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: #94a3b8;
		text-align: center;
	}

	/* ─── Responsive Tweaks ────────────────────────────────────────── */
	@media (max-width: 640px) {
		.root {
			padding: 5rem 1.25rem 3rem;
		}
		.form-card {
			padding: 2rem 1.5rem;
			border-radius: 28px;
		}
		.info-card {
			padding: 1.5rem;
			border-radius: 24px;
		}
		.brand-title {
			font-size: 2.25rem;
		}
	}

	@media (min-width: 641px) and (max-width: 1023px) {
		.layout {
			max-width: 500px;
		}
	}

	/* ─── Device Modal Styles ──────────────────────────────────────── */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.4);
		backdrop-filter: blur(8px);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.modal-content {
		width: 100%;
		max-width: 500px;
		background: #fff;
		border-radius: 32px;
		padding: 2.5rem;
		box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.2);
		position: relative;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}

	.alert-icon-wrap {
		width: 64px;
		height: 64px;
		background: #fffbeb;
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		border: none;
		background: #f8fafc;
		color: #94a3b8;
		cursor: pointer;
		transition: all 0.2s;
	}
	.close-btn:hover {
		background: #f1f5f9;
		color: #1e293b;
		transform: scale(1.05);
	}

	.modal-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #0f172a;
		letter-spacing: -0.02em;
		line-height: 1.2;
		margin-bottom: 1rem;
	}

	.modal-desc {
		font-size: 0.95rem;
		color: #64748b;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.device-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.device-card {
		background: #f8fafc;
		border: 1px solid #f1f5f9;
		border-radius: 20px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: all 0.2s;
	}
	.device-card:hover {
		border-color: #e2e8f0;
		background: #fff;
		box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.05);
	}

	.device-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.device-icon-wrap {
		width: 48px;
		height: 48px;
		background: #fff;
		border: 1px solid #f1f5f9;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #94a3b8;
		flex-shrink: 0;
	}

	.device-text {
		flex: 1;
	}

	.device-name {
		font-size: 1rem;
		font-weight: 700;
		color: #1e293b;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.current-badge {
		font-size: 0.7rem;
		font-weight: 800;
		color: #10b981;
		background: #ecfdf5;
		padding: 0.2rem 0.6rem;
		border-radius: 100px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.device-meta {
		font-size: 0.8rem;
		color: #94a3b8;
		margin-top: 0.25rem;
		display: flex;
		flex-direction: column;
	}
	.meta-value {
		color: #475569;
		font-weight: 600;
	}

	.logout-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.85rem;
		background: #fff1f2;
		color: #e11d48;
		border: none;
		border-radius: 14px;
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}
	.logout-btn:hover:not(:disabled) {
		background: #ffe4e6;
		transform: translateY(-2px);
	}
	.logout-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 480px) {
		.modal-backdrop {
			padding: 0;
			background: #fff;
		}
		.modal-content {
			padding: 1.5rem;
			border-radius: 0;
			height: 100%;
			max-height: 100svh;
			display: flex;
			flex-direction: column;
			box-shadow: none;
		}
		.modal-header {
			margin-bottom: 2rem;
		}
		.modal-title {
			font-size: 1.5rem;
		}
		.modal-body {
			flex: 1;
			overflow-y: auto;
		}
	}
</style>
