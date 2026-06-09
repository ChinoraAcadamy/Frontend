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
		X
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { fade, scale, fly } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';
	import PhoneInput from '$lib/components/ui/PhoneInput.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
	import { SvelteDate } from 'svelte/reactivity';

	let { data } = $props();
	const mc = $derived(data.masterclass);

	let isModalOpen = $state(false);
	let isSubmitted = $state(false);
	let isLoading = $state(false);
	let name = $state('');
	let phone = $state('');
	let mounted = $state(false);

	const nextTargetDate = () => {
		const now = new SvelteDate();
		const hour = mc.countdown_hour ?? 20;
		const minute = mc.countdown_minute ?? 30;
		if (!mc.countdown_days) return new SvelteDate();
		const parts = mc.countdown_days.split(',').map((p) => p.trim());

		// Parse ISO-formatted dates (YYYY-MM-DD)
		const parsedDates = parts
			.map((p) => {
				if (/^\d{4}-\d{2}-\d{2}$/.test(p)) {
					const [y, m, d] = p.split('-').map(Number);
					return new SvelteDate(y, m - 1, d, hour, minute, 0);
				}
				return null;
			})
			.filter((d) => d !== null && !isNaN(d.getTime()));

		if (parsedDates.length > 0) {
			for (const t of parsedDates) {
				if (t.getTime() > now.getTime()) return t;
			}
			return parsedDates[parsedDates.length - 1];
		}

		// Fallback for legacy formats
		const isNumeric = parts.every((p) => !isNaN(parseInt(p)) && p.length <= 2);
		if (!isNumeric) {
			let t = new SvelteDate(mc.countdown_days);
			if (isNaN(t.getTime())) t = new SvelteDate(`${mc.countdown_days}, ${now.getFullYear()}`);
			if (!isNaN(t.getTime())) {
				t.setHours(hour, minute, 0, 0);
				return t;
			}
		}
		const days = parts.map((d) => parseInt(d)).filter((d) => !isNaN(d));
		const year = mc.countdown_year || now.getFullYear();
		const month = mc.countdown_month ? mc.countdown_month - 1 : now.getMonth();
		for (const d of days) {
			const t = new SvelteDate(year, month, d, hour, minute, 0);
			if (t.getTime() > now.getTime()) return t;
		}
		if (mc.countdown_month)
			return new SvelteDate(year, month, days[days.length - 1] || 1, hour, minute, 0);
		return new SvelteDate(year, month + 1, days[0] || 1, hour, minute, 0);
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
		
		try {
			const formData = new FormData();
			formData.append('name', name);
			formData.append('phone', phone);
			formData.append('mc_title', `${mc.title_line1} ${mc.title_line2}`);

			const response = await fetch('?/register', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				console.error('Registration failed:', response.statusText);
			}
		} catch (err) {
			console.error('Registration action request failed:', err);
		}

		isLoading = false;
		isSubmitted = true;
		toast.success(m.toast_success());
	}

	// const benefitIcons = [Award, Sparkles, TrendingUp, CheckCircle2, Star];

	const stats = $derived([
		{ value: data.memberCount ?? '5000+', labelKey: 'stat_students_label' },
		{
			value: mc.stat_experience ?? `${new Date().getFullYear() - 2018}+ yil`,
			labelKey: 'stat_experience_label'
		},

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
	<link rel="stylesheet" href="/css/masterclass.css" />
	{#if mc.target_code}
		{@html mc.target_code}
	{/if}
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
			<a href={resolve('/')} class="logo" aria-label="Chinora Academy">
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
									{#if mc.is_free}
										<p class="price-was">{m.price_was()} <s>{formatPrice(mc.original_price)}</s></p>
									{/if}
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
							href={resolve(mc.telegram_invite_link || 'https://t.me/+ZlMsl6Ool8k4Zjdi')}
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


