<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Calendar,
		Clock,
		Tag,
		CheckCircle2,
		Users,
		Timer,
		Play,
		ShieldCheck,
		X,
		Sparkles,
		TrendingUp,
		Award,
		Star,
		ArrowRight
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { fade, scale, fly } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';
	import PhoneInput from '$lib/components/ui/PhoneInput.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();
	const mc = $derived(data.masterclass);

	let isModalOpen = $state(false);
	let isSubmitted = $state(false);
	let isLoading = $state(false);
	let name = $state('');
	let phone = $state('');
	let mounted = $state(false);

	const nextTargetDate = () => {
		const now = new Date();
		const hour = mc.countdown_hour ?? 20;
		const minute = mc.countdown_minute ?? 30;
		if (!mc.countdown_days) return new Date();
		const parts = mc.countdown_days.split(',').map((p) => p.trim());
		const isNumeric = parts.every((p) => !isNaN(parseInt(p)) && p.length <= 2);
		if (!isNumeric) {
			let t = new Date(mc.countdown_days);
			if (isNaN(t.getTime())) t = new Date(`${mc.countdown_days}, ${now.getFullYear()}`);
			if (!isNaN(t.getTime())) {
				t.setHours(hour, minute, 0, 0);
				return t;
			}
		}
		const days = parts.map((d) => parseInt(d)).filter((d) => !isNaN(d));
		const year = mc.countdown_year || now.getFullYear();
		const month = mc.countdown_month ? mc.countdown_month - 1 : now.getMonth();
		for (const d of days) {
			const t = new Date(year, month, d, hour, minute, 0);
			if (t.getTime() > now.getTime()) return t;
		}
		if (mc.countdown_month)
			return new Date(year, month, days[days.length - 1] || 1, hour, minute, 0);
		return new Date(year, month + 1, days[0] || 1, hour, minute, 0);
	};

	let target = $derived(nextTargetDate());
	let remaining = $state(0);
	let td = $derived(Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24))));
	let th = $derived(
		Math.max(0, Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
	);
	let tm = $derived(Math.max(0, Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))));
	let ts = $derived(Math.max(0, Math.floor((remaining % (1000 * 60)) / 1000)));
	let done = $derived(remaining <= 0);

	onMount(() => {
		mounted = true;
		remaining = target.getTime() - Date.now();
		const iv = setInterval(() => {
			remaining = target.getTime() - Date.now();
		}, 1000);
		return () => clearInterval(iv);
	});

	function openModal() {
		isModalOpen = true;
		isSubmitted = false;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim() || phone.length < 12) {
			toast.error(m.toast_validation_error());
			return;
		}
		isLoading = true;
		await new Promise((r) => setTimeout(r, 1500));
		isLoading = false;
		isSubmitted = true;
		toast.success(m.toast_success());
	}

	const benefitIcons = [Award, Sparkles, TrendingUp, CheckCircle2, Star];

	const stats = $derived([
		{ value: mc.stat_students ?? '5000+', labelKey: 'stat_students_label' },
		{ value: mc.stat_experience ?? '10 yil', labelKey: 'stat_experience_label' },
		{ value: mc.stat_practical ?? '100%', labelKey: 'stat_practical_label' }
	]);

	function formatPrice(price) {
		return new Intl.NumberFormat('uz-UZ').format(price) + ' ' + m.price_label();
	}
</script>

<svelte:head>
	<title>{mc.title_line1} {mc.title_line2} | Chinora Academy</title>
	<meta name="description" content={mc.lead_text} />
	<meta property="og:title" content={`${mc.title_line1} ${mc.title_line2}`} />
	<meta property="og:description" content={mc.lead_text} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="root">
	<!-- ── Banner ─────────────────────────────────── -->
	{#if mc.banner_top}
		<div class="banner">
			<div class="banner-track">
				<span class="banner-dot"></span>
				<span class="banner-text">{mc.banner_top}</span>
				<span class="banner-sep">·</span>
				<span class="banner-text">{@html m.seats_left({ n: String(mc.remaining_seats) })}</span>
				<span class="banner-sep">·</span>
				<span class="banner-dot"></span>
				<span class="banner-text">{mc.banner_top}</span>
				<span class="banner-sep">·</span>
				<span class="banner-text">{@html m.seats_left({ n: String(mc.remaining_seats) })}</span>
				<span class="banner-sep">·</span>
			</div>
		</div>
	{/if}

	<!-- ── Nav ────────────────────────────────────── -->
	<header class="nav">
		<div class="nav-inner">
			<a href="/" class="logo" aria-label="Chinora Academy">
				<div class="logo-text">
					<span class="logo-top">CHINORA</span>
					<span class="logo-btm">ACADEMY</span>
				</div>
			</a>
			<div class="nav-right">
				<button onclick={openModal} class="nav-cta">
					<span>{m.nav_cta()}</span>
				</button>
			</div>
		</div>
	</header>

	<main>
		<!-- ── Hero ───────────────────────────────────── -->
		<section class="hero">
			<div class="hero-bg" aria-hidden="true">
				<div class="hero-grain"></div>
				<div class="hero-glow-1"></div>
				<div class="hero-glow-2"></div>
				<div class="hero-lines"></div>
			</div>

			<div class="hero-inner">
				<!-- LEFT -->
				<div class="hero-left {mounted ? 'hero-left--in' : ''}">
					<div class="eyebrow">
						<ShieldCheck size={13} strokeWidth={2.5} />
						<span>{mc.eyebrow_badge || m.eyebrow()}</span>
					</div>

					<h1 class="h1">
						<span class="h1-plain">{mc.title_line1}</span>
						{#if mc.title_line1_italic}
							<em class="h1-em">{mc.title_line1_italic}</em>
						{/if}
						<span class="h1-plain">{mc.title_line2}</span>
						{#if mc.title_subtitle}
							<span class="h1-sub">{mc.title_subtitle}</span>
						{/if}
					</h1>

					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<p class="lead">{@html mc.lead_text}</p>

					<!-- Instructor -->
					<div class="instructor">
						<div class="instructor-photo-wrap">
							<img
								src={mc.instructor_photo || '/images/hero_compressed.jpg'}
								alt={mc.instructor_name}
								class="instructor-photo"
								loading="eager"
							/>
							<span class="live-badge">
								<span class="live-dot"></span>
								{m.instructor_online()}
							</span>
						</div>
						<div class="instructor-body">
							<p class="instructor-name">{mc.instructor_name}</p>
							<p class="instructor-role">{mc.instructor_title}</p>
							<p class="instructor-bio">{mc.instructor_bio}</p>
							<div class="instructor-stats">
								{#each stats as s (s.value)}
									<div class="istat">
										<span class="istat-val">{s.value}</span>
										<span class="istat-lbl">{m[s.labelKey]?.() ?? ''}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Chips -->
					<div class="chips">
						<div class="chip">
							<Calendar size={15} strokeWidth={2} class="chip-icon" />
							<div>
								<span class="chip-lbl">{m.chip_date_label()}</span>
								<span class="chip-val">{mc.dates}</span>
							</div>
						</div>
						<div class="chip">
							<Clock size={15} strokeWidth={2} class="chip-icon" />
							<div>
								<span class="chip-lbl">{m.chip_time_label()}</span>
								<span class="chip-val">{mc.time} {mc.timezone}</span>
							</div>
						</div>
						<div class="chip {mc.is_free ? 'chip--free' : ''}">
							<Tag size={15} strokeWidth={2} class="chip-icon" />
							<div>
								<span class="chip-lbl">
									{#if mc.is_free}<s>{formatPrice(mc.original_price)}</s
										>{:else}{m.chip_price_label()}{/if}
								</span>
								<span class="chip-val {mc.is_free ? 'chip-val--free' : ''}">
									{mc.is_free ? m.chip_price_free() : formatPrice(mc.original_price)}
								</span>
							</div>
						</div>
					</div>

					<!-- Benefits -->
					{#if mc.benefits?.length > 0}
						<div class="benefits">
							<p class="benefits-title">{mc.benefits_section_title || m.benefits_title()}</p>
							<ul class="benefit-list">
								{#each mc.benefits as b, i (b.id || i)}
									<li class="benefit" style="animation-delay:{i * 70}ms">
										<span class="benefit-dot"></span>
										<span>{b.text}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<button onclick={openModal} class="cta cta--mobile">
						<Play size={16} fill="currentColor" />
						<span>{m.mobile_cta()}</span>
					</button>
				</div>

				<!-- RIGHT: card -->
				<aside class="card-col {mounted ? 'card-col--in' : ''}">
					<div class="card">
						<!-- Seats -->
						<div class="card-seats">
							<div class="seats-pill">
								<Users size={13} strokeWidth={2} />
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<span>{@html m.seats_left({ n: String(mc.remaining_seats) })}</span>
							</div>
							<div class="avatars">
								{#each [11, 12, 13, 14] as i (i)}
									<img src={`https://i.pravatar.cc/100?img=${i}`} alt="" class="av" />
								{/each}
								<span class="av av--more">+12</span>
							</div>
						</div>

						<!-- Timer -->
						<div class="timer">
							<div class="timer-head">
								<Timer size={13} strokeWidth={2} />
								<span>{m.timer_label()}</span>
							</div>
							{#if done}
								<p class="timer-live">{m.timer_live()}</p>
							{:else}
								<div class="timer-grid">
									{#each [{ v: td, l: m.timer_days() }, { v: th, l: m.timer_hours() }, { v: tm, l: m.timer_minutes() }, { v: ts, l: m.timer_seconds() }] as u (u.l)}
										<div class="tunit">
											<span class="tval">{String(u.v).padStart(2, '0')}</span>
											<span class="tlbl">{u.l}</span>
										</div>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Price -->
						<div class="price-block">
							<div class="price-row">
								<div>
									<p class="price-was">{m.price_was()} <s>{formatPrice(mc.original_price)}</s></p>
									<p class="price-now">
										{mc.is_free ? m.chip_price_free() : formatPrice(mc.original_price)}
									</p>
								</div>
								{#if mc.is_free}
									<span class="discount-tag">−100%</span>
								{/if}
							</div>
							<p class="price-note">{m.price_note()}</p>
						</div>

						<!-- CTA -->
						<button onclick={openModal} class="cta">
							<Play size={16} fill="currentColor" />
							<span>{m.cta_register()}</span>
						</button>

						<p class="card-note">{m.card_note()}</p>

						<!-- Trust -->
						<div class="trust">
							{#each [{ src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7jTOVNbVu3I90bSqSpGuoozV5d_e8sDj9Bg&s', alt: 'Payme' }, { src: 'https://hellotour.uz/assets/images/click.png', alt: 'Click' }, { src: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg', alt: 'Visa' }, { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png', alt: 'MC' }] as logo (logo.alt)}
								<img src={logo.src} alt={logo.alt} class="trust-logo" />
							{/each}
						</div>
					</div>
				</aside>
			</div>
		</section>

		<!-- ── Why ────────────────────────────────────── -->
		<section class="why">
			<div class="why-bg" aria-hidden="true"></div>
			<div class="why-inner">
				<span class="why-eyebrow">{m.why_eyebrow()}</span>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<h2 class="why-title">{@html mc.why_title || m.why_title()}</h2>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<p class="why-desc">{@html mc.why_description || m.why_desc()}</p>
				<div class="why-stats">
					{#each stats as s (s.value)}
						<div class="wstat">
							<span class="wstat-val">{s.value}</span>
							<span class="wstat-lbl">{m[s.labelKey]?.() ?? ''}</span>
						</div>
					{/each}
				</div>
				<button onclick={openModal} class="cta cta--outline">{m.why_cta()}</button>
			</div>
		</section>
	</main>

	<!-- ── Footer ─────────────────────────────────── -->
	<footer class="footer">
		<div class="footer-inner">
			<div class="logo logo--sm">
				<div class="logo-text">
					<span class="logo-top">CHINORA</span>
					<span class="logo-btm">ACADEMY</span>
				</div>
			</div>
			<p class="footer-copy">{m.footer_copy({ year: String(new Date().getFullYear()) })}</p>
			<nav class="footer-links">
				<a href="https://instagram.com">Instagram</a>
				<a href="https://t.me">Telegram</a>
				<a href="https://youtube.com">YouTube</a>
			</nav>
		</div>
	</footer>

	<!-- ── Modal ──────────────────────────────────── -->
	{#if isModalOpen}
		<div
			class="modal-backdrop"
			transition:fade={{ duration: 220 }}
			onclick={() => (isModalOpen = false)}
			onkeydown={(e) => e.key === 'Escape' && (isModalOpen = false)}
			role="button"
			tabindex="-1"
		>
			<div
				class="modal"
				transition:scale={{ duration: 360, easing: backOut, start: 0.93 }}
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				tabindex="-1"
			>
				<button
					onclick={() => (isModalOpen = false)}
					class="modal-close"
					aria-label={m.modal_close_aria()}
				>
					<X size={16} strokeWidth={2.5} />
				</button>

				{#if !isSubmitted}
					<div class="modal-header">
						<div class="modal-icon"><Users size={24} strokeWidth={2} /></div>
						<h2 class="modal-title" id="modal-title">{m.modal_register_title()}</h2>
						<p class="modal-sub">{m.modal_sub()}</p>
					</div>
					<form onsubmit={handleSubmit} class="mform">
						<div class="mfield">
							<label for="reg-name" class="mfield-lbl">{m.field_name_label()}</label>
							<input
								id="reg-name"
								type="text"
								bind:value={name}
								placeholder={m.field_name_placeholder()}
								required
								class="minput"
							/>
						</div>
						<div class="mfield">
							<PhoneInput label={m.field_phone_label()} id="reg-phone" bind:value={phone} />
						</div>
						<button type="submit" disabled={isLoading} class="msub-btn">
							{#if isLoading}
								<span class="spinner"></span>
								{m.submit_loading()}
							{:else}
								{m.submit_idle()}
							{/if}
						</button>
					</form>
				{:else}
					<div class="modal-success" in:fly={{ y: 12, duration: 300, easing: cubicOut }}>
						<div class="success-icon"><CheckCircle2 size={38} strokeWidth={2} /></div>
						<h2 class="modal-title" id="modal-title">{m.success_title()}</h2>
						<p class="modal-sub">{m.success_sub()}</p>
						<a
							href={mc.telegram_invite_link || 'https://t.me/+ZlMsl6Ool8k4Zjdi'}
							target="_blank"
							rel="noopener noreferrer"
							class="tg-btn"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.014 9.49c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.39l-2.95-.924c-.642-.2-.655-.642.136-.953l11.527-4.448c.536-.194 1.006.13.369.183z"
								/>
							</svg>
							{m.success_tg_btn()}
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	/* ── Tokens ───────────────────────────────────────────── */
	:root {
		--brand: #9b1c48;
		--brand-dark: #7d1539;
		--brand-mid: rgba(155, 28, 72, 0.12);
		--brand-glow: rgba(155, 28, 72, 0.18);
		--ink: #140b0e;
		--ink-2: #3d2029;
		--ink-3: #6b4550;
		--muted: #a08890;
		--cream: #faf6f1;
		--cream-2: #f3ede6;
		--white: #ffffff;
		--border: rgba(155, 28, 72, 0.13);
		--r-sm: 10px;
		--r-md: 16px;
		--r-lg: 22px;
		--r-xl: 28px;
		--shadow-card: 0 4px 6px rgba(155, 28, 72, 0.04), 0 20px 48px rgba(155, 28, 72, 0.09);
		--shadow-cta: 0 6px 24px rgba(155, 28, 72, 0.32);
		--font-serif: 'Cormorant Garamond', Georgia, serif;
		--font-sans: 'Outfit', system-ui, sans-serif;
	}

	/* ── Base ─────────────────────────────────────────────── */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.root {
		font-family: var(--font-sans);
		background: var(--cream);
		color: var(--ink);
		min-height: 100svh;
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
	}

	/* ── Banner ───────────────────────────────────────────── */
	.banner {
		background: var(--brand);
		height: 34px;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.banner-track {
		display: flex;
		align-items: center;
		gap: 14px;
		white-space: nowrap;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: rgba(255, 255, 255, 0.92);
		animation: marquee 22s linear infinite;
		padding-left: 100%;
	}

	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	.banner-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #ffd700;
		flex-shrink: 0;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.5;
			transform: scale(0.8);
		}
	}

	.banner-sep {
		color: rgba(255, 255, 255, 0.3);
		font-size: 10px;
	}

	/* ── Nav ──────────────────────────────────────────────── */
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(250, 246, 241, 0.88);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--border);
	}

	.nav-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 66px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	/* Logo */
	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		flex-shrink: 0;
	}

	.logo-img {
		width: 50px;
		height: 50px;
		border-radius: 13px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.logo-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.logo-img--sm {
		width: 38px;
		height: 38px;
		border-radius: 10px;
	}
	.logo--sm {
		gap: 8px;
	}

	.logo-text {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}

	.logo-top {
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.14em;
		color: var(--ink);
	}

	.logo-btm {
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.14em;
		color: var(--brand);
	}

	@media (max-width: 380px) {
		.logo-img {
			width: 40px;
			height: 40px;
			border-radius: 11px;
		}
		.logo-top,
		.logo-btm {
			font-size: 12px;
		}
	}

	/* Nav right */
	.nav-right {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.lang-wrap {
		flex-shrink: 0;
		overflow: visible;
	}

	.nav-cta {
		align-items: center;
		gap: 6px;
		height: 38px;
		padding: 0 18px;
		border-radius: 999px;
		border: none;
		background: var(--ink);
		color: #fff;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		transition:
			background 0.18s,
			transform 0.12s;
		white-space: nowrap;
	}

	.nav-cta:hover {
		background: var(--brand);
		transform: scale(1.02);
	}
	.nav-cta:active {
		transform: scale(0.97);
	}

	@media (min-width: 560px) {
		.nav-cta {
			display: flex;
		}
	}

	/* ── Hero ─────────────────────────────────────────────── */
	.hero {
		position: relative;
		overflow: hidden;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.hero-grain {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E");
		background-size: 220px;
		opacity: 0.7;
	}

	.hero-glow-1 {
		position: absolute;
		top: -200px;
		right: -150px;
		width: 700px;
		height: 700px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(155, 28, 72, 0.07) 0%, transparent 65%);
	}

	.hero-glow-2 {
		position: absolute;
		bottom: -100px;
		left: -100px;
		width: 500px;
		height: 500px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(155, 28, 72, 0.04) 0%, transparent 65%);
	}

	.hero-lines {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(155, 28, 72, 0.035) 1px, transparent 1px),
			linear-gradient(90deg, rgba(155, 28, 72, 0.035) 1px, transparent 1px);
		background-size: 56px 56px;
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 1.5rem 4.5rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
		align-items: start;
	}

	@media (min-width: 1024px) {
		.hero-inner {
			grid-template-columns: 1fr 400px;
			gap: 4rem;
			padding: 4.5rem 2rem 6rem;
		}
	}

	/* ── Hero Left entrance ───────────────────────────────── */
	.hero-left > * {
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 0.5s ease,
			transform 0.5s ease;
	}
	.hero-left--in > * {
		opacity: 1;
		transform: none;
	}
	.hero-left--in > *:nth-child(1) {
		transition-delay: 0.04s;
	}
	.hero-left--in > *:nth-child(2) {
		transition-delay: 0.1s;
	}
	.hero-left--in > *:nth-child(3) {
		transition-delay: 0.16s;
	}
	.hero-left--in > *:nth-child(4) {
		transition-delay: 0.22s;
	}
	.hero-left--in > *:nth-child(5) {
		transition-delay: 0.28s;
	}
	.hero-left--in > *:nth-child(6) {
		transition-delay: 0.34s;
	}
	.hero-left--in > *:nth-child(7) {
		transition-delay: 0.4s;
	}

	.hero-left {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	/* Eyebrow */
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 6px 14px;
		border-radius: 999px;
		border: 1.5px solid rgba(155, 28, 72, 0.22);
		background: rgba(155, 28, 72, 0.055);
		font-size: 11.5px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--brand);
		width: fit-content;
	}

	/* H1 */
	.h1 {
		font-family: var(--font-serif);
		display: flex;
		flex-direction: column;
		gap: 2px;
		line-height: 1.05;
	}

	.h1-plain {
		font-size: clamp(2.4rem, 5.5vw, 4.25rem);
		font-weight: 700;
		color: var(--ink);
		letter-spacing: -0.01em;
	}

	.h1-em {
		font-size: clamp(2.65rem, 6.5vw, 4.75rem);
		font-weight: 700;
		font-style: italic;
		color: var(--brand);
		letter-spacing: -0.01em;
	}

	.h1-sub {
		font-size: clamp(1.5rem, 3.5vw, 2.75rem);
		font-weight: 600;
		color: var(--ink-2);
		letter-spacing: -0.01em;
		opacity: 0.75;
	}

	/* Lead */
	.lead {
		font-size: clamp(0.95rem, 1.8vw, 1.1rem);
		line-height: 1.75;
		color: var(--ink-3);
		max-width: 560px;
	}

	:global(.lead strong) {
		color: var(--ink);
		font-weight: 700;
	}

	/* Instructor card */
	.instructor {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		background: var(--white);
		border: 1.5px solid var(--border);
		border-radius: var(--r-xl);
		padding: 1.375rem;
		box-shadow: var(--shadow-card);
		max-width: 600px;
	}

	@media (min-width: 560px) {
		.instructor {
			flex-direction: row;
			align-items: flex-start;
		}
	}

	.instructor-photo-wrap {
		position: relative;
		width: 100%;
		height: 260px;
		border-radius: var(--r-lg);
		overflow: hidden;
		flex-shrink: 0;
	}

	@media (min-width: 560px) {
		.instructor-photo-wrap {
			width: 148px;
			height: 168px;
		}
	}

	.instructor-photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top center;
		display: block;
	}

	.live-badge {
		position: absolute;
		bottom: 9px;
		left: 9px;
		display: flex;
		align-items: center;
		gap: 5px;
		background: rgba(10, 5, 3, 0.7);
		backdrop-filter: blur(6px);
		color: #fff;
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 3px 9px;
		border-radius: 999px;
	}

	.live-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #22c55e;
		animation: pulse 1.8s ease-in-out infinite;
	}

	.instructor-name {
		font-family: var(--font-serif);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--ink);
		margin-bottom: 3px;
	}

	.instructor-role {
		font-size: 12px;
		font-weight: 700;
		color: var(--brand);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 8px;
	}

	.instructor-bio {
		font-size: 12.5px;
		line-height: 1.65;
		color: var(--ink-3);
		margin-bottom: 12px;
	}

	.instructor-stats {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.istat {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.istat-val {
		font-family: var(--font-serif);
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--brand);
		line-height: 1;
	}

	.istat-lbl {
		font-size: 9px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	/* Chips */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.chip {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		background: var(--white);
		border: 1.5px solid var(--cream-2);
		border-radius: var(--r-md);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
		transition: border-color 0.15s;
	}

	.chip:hover {
		border-color: var(--border);
	}
	.chip--free {
		border-color: rgba(22, 163, 74, 0.2);
	}

	:global(.chip-icon) {
		color: var(--brand);
		flex-shrink: 0;
	}

	.chip-lbl {
		display: block;
		font-size: 9px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--muted);
	}

	.chip-val {
		display: block;
		font-size: 13px;
		font-weight: 700;
		color: var(--ink);
	}

	.chip-val--free {
		color: #16a34a;
	}

	/* Benefits */
	.benefits-title {
		font-size: 13px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--brand);
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.benefits-title::before {
		content: '';
		width: 20px;
		height: 2px;
		background: var(--brand);
		flex-shrink: 0;
	}

	.benefit-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.benefit {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.55;
		color: var(--ink-2);
		opacity: 0;
		animation: benefitIn 0.35s ease forwards;
	}

	@keyframes benefitIn {
		from {
			opacity: 0;
			transform: translateX(-6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.benefit-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--brand);
		flex-shrink: 0;
		margin-top: 6px;
	}

	/* ── CTA Button ───────────────────────────────────────── */
	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		height: 54px;
		border-radius: var(--r-lg);
		border: none;
		background: var(--brand);
		color: #fff;
		font-family: var(--font-sans);
		font-size: 14.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		cursor: pointer;
		box-shadow: var(--shadow-cta);
		transition:
			background 0.18s,
			transform 0.12s,
			box-shadow 0.18s;
		position: relative;
		overflow: hidden;
	}

	.cta::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			105deg,
			transparent 35%,
			rgba(255, 255, 255, 0.12) 50%,
			transparent 65%
		);
		transform: translateX(-100%);
		transition: transform 0.55s ease;
	}

	.cta:hover {
		background: var(--brand-dark);
		transform: translateY(-2px);
		box-shadow: 0 10px 32px rgba(155, 28, 72, 0.38);
	}
	.cta:hover::after {
		transform: translateX(100%);
	}
	.cta:active {
		transform: scale(0.98);
	}

	.cta--mobile {
		margin-top: 0.5rem;
		max-width: 500px;
	}

	@media (min-width: 1024px) {
		.cta--mobile {
			display: none;
		}
	}

	.cta--outline {
		background: transparent;
		border: 2px solid var(--brand);
		color: var(--brand);
		box-shadow: none;
		width: auto;
		padding: 0 2.5rem;
	}

	.cta--outline:hover {
		background: var(--brand);
		color: #fff;
		box-shadow: var(--shadow-cta);
	}

	/* ── Card (right sidebar) ─────────────────────────────── */
	.card-col {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.55s ease 0.25s,
			transform 0.55s ease 0.25s;
	}

	.card-col--in {
		opacity: 1;
		transform: none;
	}

	@media (min-width: 1024px) {
		.card-col {
			position: sticky;
			top: 90px;
		}
	}

	.card {
		background: var(--white);
		border-radius: var(--r-xl);
		border: 1.5px solid var(--border);
		padding: 1.5rem;
		box-shadow: var(--shadow-card);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	@media (min-width: 480px) {
		.card {
			padding: 1.75rem;
		}
	}

	@media (max-width: 1023px) {
		.card-col {
			max-width: 520px;
			margin-inline: auto;
			width: 100%;
		}
	}

	/* Seats */
	.card-seats {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		flex-wrap: wrap;
	}

	.seats-pill {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--brand);
		background: var(--brand-mid);
		padding: 5px 13px;
		border-radius: 999px;
		flex-shrink: 0;
	}

	.avatars {
		display: flex;
	}

	.av {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 2.5px solid var(--white);
		object-fit: cover;
		margin-left: -8px;
	}

	.av:first-child {
		margin-left: 0;
	}

	.av--more {
		background: var(--brand);
		color: #fff;
		font-size: 9px;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-sans);
	}

	/* Timer */
	.timer {
		background: var(--ink);
		border-radius: var(--r-lg);
		padding: 1.1rem 1.25rem;
		color: #fff;
	}

	@media (min-width: 480px) {
		.timer {
			padding: 1.375rem 1.5rem;
			border-radius: var(--r-xl);
		}
	}

	.timer-head {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 10.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.35);
		margin-bottom: 1rem;
	}

	.timer-live {
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--brand);
		text-align: center;
		animation: pulse 1.2s ease-in-out infinite;
	}

	.timer-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 7px;
	}

	.tunit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	.tval {
		font-family: var(--font-serif);
		font-size: clamp(1.4rem, 3.5vw, 1.85rem);
		font-weight: 700;
		line-height: 1;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 10px;
		padding: clamp(7px, 1.8vw, 11px) 4px;
		width: 100%;
		text-align: center;
	}

	.tlbl {
		font-size: 8.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.25);
	}

	/* Price */
	.price-block {
		border-top: 1px solid var(--cream-2);
		border-bottom: 1px solid var(--cream-2);
		padding: 1.1rem 0;
	}

	.price-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.price-was {
		font-size: 12px;
		color: var(--muted);
		margin-bottom: 4px;
	}

	.price-now {
		font-family: var(--font-serif);
		font-size: clamp(1.9rem, 4vw, 2.4rem);
		font-weight: 700;
		color: var(--ink);
		line-height: 1;
	}

	.discount-tag {
		background: #16a34a;
		color: #fff;
		font-size: 12px;
		font-weight: 800;
		padding: 5px 11px;
		border-radius: 9px;
		letter-spacing: 0.03em;
		flex-shrink: 0;
	}

	.price-note {
		font-size: 11.5px;
		color: var(--muted);
		margin-top: 6px;
	}

	.card-note {
		font-size: 11.5px;
		color: var(--muted);
		text-align: center;
		line-height: 1.55;
	}

	/* Trust */
	.trust {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding-top: 0.875rem;
		border-top: 1px solid var(--cream-2);
		opacity: 0.45;
		filter: grayscale(1);
	}

	.trust-logo {
		height: clamp(14px, 2.5vw, 20px);
		object-fit: contain;
		flex-shrink: 1;
		max-width: 20%;
	}

	/* ── Why ──────────────────────────────────────────────── */
	.why {
		position: relative;
		background: var(--ink);
		color: #fff;
		padding: 5.5rem 1.5rem 5rem;
		overflow: hidden;
	}

	.why-bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse at 20% 50%, rgba(155, 28, 72, 0.18) 0%, transparent 60%),
			radial-gradient(ellipse at 80% 50%, rgba(155, 28, 72, 0.12) 0%, transparent 55%);
		pointer-events: none;
	}

	.why-inner {
		position: relative;
		z-index: 1;
		max-width: 740px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	.why-eyebrow {
		font-size: 10.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--brand);
	}

	.why-title {
		font-family: var(--font-serif);
		font-size: clamp(2.25rem, 5vw, 3.75rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}

	:global(.why-title em) {
		font-style: italic;
		color: var(--brand);
	}

	.why-desc {
		font-size: 1.05rem;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.5);
		max-width: 620px;
	}

	:global(.why-desc strong) {
		color: rgba(255, 255, 255, 0.82);
		font-weight: 600;
	}

	.why-stats {
		display: flex;
		justify-content: center;
		gap: 3.5rem;
		flex-wrap: wrap;
		margin: 0.75rem 0 0.5rem;
	}

	.wstat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.wstat-val {
		font-family: var(--font-serif);
		font-size: clamp(2.25rem, 5vw, 3rem);
		font-weight: 700;
		color: var(--brand);
		line-height: 1;
	}

	.wstat-lbl {
		font-size: 9.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.25);
	}

	/* ── Footer ───────────────────────────────────────────── */
	.footer {
		background: var(--cream);
		border-top: 1px solid var(--cream-2);
		padding: 2.5rem 1.5rem;
	}

	.footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		text-align: center;
	}

	@media (min-width: 768px) {
		.footer-inner {
			flex-direction: row;
			justify-content: space-between;
			text-align: left;
		}
	}

	.footer-copy {
		font-size: 12px;
		color: var(--muted);
	}

	.footer-links {
		display: flex;
		gap: 1.5rem;
	}
	.footer-links a {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--muted);
		text-decoration: none;
		transition: color 0.15s;
	}
	.footer-links a:hover {
		color: var(--brand);
	}

	/* ── Modal ────────────────────────────────────────────── */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(8, 3, 2, 0.72);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.modal {
		position: relative;
		width: 100%;
		max-width: 440px;
		background: var(--white);
		border-radius: var(--r-xl);
		padding: 2.5rem 2rem;
		box-shadow: 0 32px 80px rgba(0, 0, 0, 0.22);
		overflow: hidden;
	}

	.modal::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--brand), #d73a6a);
	}

	.modal-close {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1.5px solid var(--cream-2);
		background: var(--cream);
		color: var(--muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
	}

	.modal-close:hover {
		background: var(--brand);
		color: #fff;
		border-color: var(--brand);
	}

	.modal-header {
		text-align: center;
		margin-bottom: 1.75rem;
	}

	.modal-icon {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		background: var(--brand-mid);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--brand);
		margin: 0 auto 1.1rem;
	}

	.modal-title {
		font-family: var(--font-serif);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--ink);
		margin-bottom: 6px;
		line-height: 1.15;
	}

	.modal-sub {
		font-size: 13.5px;
		color: var(--ink-3);
		line-height: 1.6;
	}

	/* Form */
	.mform {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}
	.mfield {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.mfield-lbl {
		font-size: 10.5px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--muted);
	}

	.minput {
		width: 100%;
		height: 50px;
		padding: 0 15px;
		border-radius: var(--r-md);
		border: 1.5px solid var(--cream-2);
		background: var(--cream);
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 500;
		color: var(--ink);
		outline: none;
		transition:
			border-color 0.15s,
			box-shadow 0.15s,
			background 0.15s;
		box-sizing: border-box;
	}

	.minput::placeholder {
		color: var(--muted);
		font-weight: 400;
	}
	.minput:focus {
		border-color: var(--brand);
		background: var(--white);
		box-shadow: 0 0 0 3px rgba(155, 28, 72, 0.1);
	}

	.msub-btn {
		height: 52px;
		border-radius: var(--r-md);
		border: none;
		background: var(--ink);
		color: #fff;
		font-family: var(--font-sans);
		font-size: 14.5px;
		font-weight: 700;
		letter-spacing: 0.05em;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		transition:
			background 0.15s,
			transform 0.1s;
		margin-top: 0.25rem;
	}

	.msub-btn:hover:not(:disabled) {
		background: var(--brand);
	}
	.msub-btn:active:not(:disabled) {
		transform: scale(0.98);
	}
	.msub-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.25);
		border-top-color: #fff;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Success */
	.modal-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.875rem;
		padding: 0.5rem 0;
	}

	.success-icon {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: #16a34a;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-shadow: 0 8px 28px rgba(22, 163, 74, 0.28);
	}

	.tg-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		height: 52px;
		border-radius: var(--r-md);
		background: #229ed9;
		color: #fff;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 700;
		text-decoration: none;
		transition:
			background 0.15s,
			transform 0.1s;
		margin-top: 0.5rem;
	}

	.tg-btn:hover {
		background: #1a8ec4;
		transform: translateY(-1px);
	}

	/* ── Global ───────────────────────────────────────────── */
	:global(#offer-page *, #offer-page *::before, #offer-page *::after) {
		box-sizing: border-box;
	}
</style>
