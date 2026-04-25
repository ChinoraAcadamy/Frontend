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
		Star,
		ShieldCheck,
		X,
		Sparkles,
		TrendingUp,
		Award
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import PhoneInput from '$lib/components/ui/PhoneInput.svelte';

	let isModalOpen = $state(false);
	let isSubmitted = $state(false);
	let isLoading = $state(false);
	let name = $state('');
	let phone = $state('');
	let mounted = $state(false);

	// Countdown
	const nextTargetDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();
		const days = [28, 29, 30];
		const hour = 20,
			minute = 30;
		for (const d of days) {
			const t = new Date(year, month, d, hour, minute, 0);
			if (t.getTime() > now.getTime()) return t;
		}
		return new Date(year, month + 1, days[0], hour, minute, 0);
	};

	let target = nextTargetDate();
	let remaining = $state(target.getTime() - Date.now());

	let td = $derived(Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24))));
	let th = $derived(
		Math.max(0, Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
	);
	let tm = $derived(Math.max(0, Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))));
	let ts = $derived(Math.max(0, Math.floor((remaining % (1000 * 60)) / 1000)));
	let done = $derived(remaining <= 0);

	onMount(() => {
		mounted = true;
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
			toast.error("Iltimos, barcha maydonlarni to'g'ri to'ldiring");
			return;
		}
		isLoading = true;
		await new Promise((r) => setTimeout(r, 1500));
		isLoading = false;
		isSubmitted = true;
		toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
	}

	const benefits = [
		{ icon: Award, text: 'Myuller metodikasi — asos andazani 0 dan professional qurish' },
		{
			icon: Sparkles,
			text: 'Avtorlik "Anor" assimetriya fasonini boshidan oxirigacha modellashtirish'
		},
		{
			icon: TrendingUp,
			text: "Daromadingizni 5x gacha oshirish: narx qo'yish va mijozlar jalb qilish"
		},
		{
			icon: CheckCircle2,
			text: "Raqobatchilardan 10 qadam oldinga o'tadigan konstruksiya sirlari"
		},
		{ icon: Star, text: "Brend uslubida libos tikish va o'z imzoyingizni yaratish" }
	];

	const stats = [
		{ value: '5000+', label: 'Muvaffaqiyatli shogird' },
		{ value: '10 yil', label: 'Professional tajriba' },
		{ value: '100%', label: 'Amaliy darslar' }
	];
</script>

<svelte:head>
	<title>Bepul Masterklass | Chinora Academy</title>
	<meta
		name="description"
		content="3 kunda professional tikuvchilik sirlarini o'rganing. Bepul masterklass Ibodullayeva Chinora bilan."
	/>
	<meta property="og:title" content="Bepul Masterklass — Chinora Academy" />
	<meta
		property="og:description"
		content="3 kunda professional tikuvchilik. Bepul. Faqat 50 ta joy."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="lp-root" id="offer-page">
	<!-- ── Urgency Banner ──────────────────────────────── -->
	<div class="lp-banner">
		<span class="lp-banner-dot"></span>
		<span>BEPUL MASTERKLASS — Tikuvchilikda professional yondashuv</span>
		<span class="lp-banner-badge">Faqat 50 joy</span>
	</div>

	<!-- ── Sticky Nav ──────────────────────────────────── -->
	<header class="lp-nav">
		<div class="lp-nav-inner">
			<span class="lp-logo">
				<span class="lp-logo-icon"><Star size={18} fill="currentColor" /></span>
				<span>CHINORA<em>ACADEMY</em></span>
			</span>
			<button onclick={openModal} class="lp-nav-cta"> Joyni band qilish → </button>
		</div>
	</header>

	<main>
		<!-- ── Hero ────────────────────────────────────────── -->
		<section class="lp-hero">
			<!-- Background texture layers -->
			<div class="lp-hero-noise" aria-hidden="true"></div>
			<div class="lp-hero-grid" aria-hidden="true"></div>
			<div class="lp-hero-glow" aria-hidden="true"></div>

			<div class="lp-hero-inner">
				<!-- Left: Content -->
				<div class="lp-content {mounted ? 'lp-content--visible' : ''}">
					<div class="lp-eyebrow">
						<ShieldCheck size={14} />
						Eksklyuziv masterklass
					</div>

					<h1 class="lp-h1">
						<span class="lp-h1-line">3 kunda</span>
						<span class="lp-h1-accent">professional</span>
						<span class="lp-h1-line">tikuvchilik</span>
						<span class="lp-h1-sub">sirlarini oching</span>
					</h1>

					<p class="lp-lead">
						Hisob-kitobli asos andozani <strong>0 dan chizish</strong>, noodatiy fasonlar,
						modellashtirish sirlari va brend uslubida libos tikish — bularning barchasini ushbu
						<strong>bepul</strong> masterklassda bosqichma-bosqich o'rganasiz.
					</p>

					<!-- Instructor card -->
					<div class="lp-instructor">
						<div class="lp-instructor-img-wrap">
							<img
								src="/images/hero_compressed.jpg"
								alt="Ibodullayeva Chinora"
								class="lp-instructor-img"
								loading="eager"
							/>
							<span class="lp-online-badge">
								<span class="lp-online-dot"></span>
								Online hozir
							</span>
						</div>
						<div class="lp-instructor-info">
							<p class="lp-instructor-name">Ibodullayeva Chinora</p>
							<p class="lp-instructor-role">Chinora Academy asoschisi & Master Dizayner</p>
							<p class="lp-instructor-bio">
								10 yildan ortiq tajriba, 5000+ muvaffaqiyatli shogirdlar, o'zining avtorlik
								metodikasi bilan tikuvchilik olamida yangi davr boshlagan mutaxassis.
							</p>
							<!-- Stats inline -->
							<div class="lp-stats-row">
								{#each stats as s (s)}
									<div class="lp-stat">
										<span class="lp-stat-val">{s.value}</span>
										<span class="lp-stat-lbl">{s.label}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Date/Time/Price chips -->
					<div class="lp-chips">
						<div class="lp-chip">
							<Calendar size={16} class="lp-chip-icon" />
							<div>
								<span class="lp-chip-label">Sana</span>
								<span class="lp-chip-val">28–29–30 Noyabr</span>
							</div>
						</div>
						<div class="lp-chip">
							<Clock size={16} class="lp-chip-icon" />
							<div>
								<span class="lp-chip-label">Vaqt</span>
								<span class="lp-chip-val">20:30 Toshkent</span>
							</div>
						</div>
						<div class="lp-chip lp-chip--free">
							<Tag size={16} class="lp-chip-icon" />
							<div>
								<span class="lp-chip-label"><s>999 000 so'm</s></span>
								<span class="lp-chip-val lp-chip-val--free">BEPUL</span>
							</div>
						</div>
					</div>

					<!-- Benefits -->
					<div class="lp-benefits">
						<h2 class="lp-benefits-title">Masterklassda nimalarni o'rganasiz?</h2>
						<ul class="lp-benefit-list">
							{#each benefits as b, i (i)}
								<li class="lp-benefit" style="animation-delay: {i * 80}ms">
									<span class="lp-benefit-icon">
										<b.icon size={14} />
									</span>
									<span>{b.text}</span>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Mobile CTA -->
					<button onclick={openModal} class="lp-cta-btn lp-cta-btn--mobile">
						<Play size={18} fill="currentColor" />
						RO'YXATDAN O'TISH — BEPUL
					</button>
				</div>

				<!-- Right: Registration Card -->
				<aside class="lp-sidebar {mounted ? 'lp-sidebar--visible' : ''}">
					<div class="lp-card">
						<!-- Seats warning -->
						<div class="lp-seats">
							<div class="lp-seats-left">
								<Users size={14} />
								<span>Faqat <strong>50 ta</strong> joy qoldi</span>
							</div>
							<div class="lp-avatars">
								{#each [11, 12, 13, 14] as i (i)}
									<img src={`https://i.pravatar.cc/100?img=${i}`} alt="" class="lp-avatar" />
								{/each}
								<span class="lp-avatar lp-avatar--count">+12</span>
							</div>
						</div>

						<!-- Countdown -->
						<div class="lp-timer">
							<div class="lp-timer-label">
								<Timer size={15} />
								Masterklass boshlanishiga:
							</div>
							{#if done}
								<p class="lp-timer-live">🔴 Efir hozir boshlanmoqda!</p>
							{:else}
								<div class="lp-timer-grid">
									{#each [{ v: td, l: 'Kun' }, { v: th, l: 'Soat' }, { v: tm, l: 'Daq' }, { v: ts, l: 'Son' }] as unit (unit.l)}
										<div class="lp-timer-unit">
											<span class="lp-timer-val">{String(unit.v).padStart(2, '0')}</span>
											<span class="lp-timer-lbl">{unit.l}</span>
										</div>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Price -->
						<div class="lp-price-block">
							<div class="lp-price-row">
								<div>
									<p class="lp-price-was">Odatdagi narx: <s>999 000 so'm</s></p>
									<p class="lp-price-now">BEPUL</p>
								</div>
								<span class="lp-discount-badge">-100%</span>
							</div>
							<p class="lp-price-note">Faqat bugungi taklif — 24 soatdan keyin tugaydi</p>
						</div>

						<!-- CTA -->
						<button onclick={openModal} class="lp-cta-btn">
							<Play size={18} fill="currentColor" />
							RO'YXATDAN O'TISH
						</button>

						<p class="lp-card-note">
							Ro'yxatdan o'tishdan so'ng yopiq Telegram chatga taklif yuboramiz
						</p>

						<!-- Trust logos -->
						<div class="lp-trust">
							{#each [{ src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7jTOVNbVu3I90bSqSpGuoozV5d_e8sDj9Bg&s', alt: 'Payme' }, { src: 'https://hellotour.uz/assets/images/click.png', alt: 'Click' }, { src: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg', alt: 'Visa' }, { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png', alt: 'MC' }] as logo (logo)}
								<img src={logo.src} alt={logo.alt} class="lp-trust-logo" />
							{/each}
						</div>
					</div>
				</aside>
			</div>
		</section>

		<!-- ── Why Section ─────────────────────────────────── -->
		<section class="lp-why">
			<div class="lp-why-inner">
				<div class="lp-section-eyebrow">Nega aynan ushbu masterklass?</div>
				<h2 class="lp-why-title">Nazariya emas — <em>tayyor tizim</em></h2>
				<p class="lp-why-desc">
					Ushbu 3 kunlik dars davomida siz tikuvchilikni shunchaki sevimli mashg'ulotdan
					<strong>professional biznesga aylantirish yo'lini</strong> ko'rasiz. Konstruksiya, texnologiya
					va dizaynni bir tizimda o'rganib, raqobatchilardan 10 qadam oldinga o'tib ketasiz.
				</p>
				<div class="lp-why-stats">
					{#each stats as s (s)}
						<div class="lp-why-stat">
							<span class="lp-why-stat-val">{s.value}</span>
							<span class="lp-why-stat-lbl">{s.label}</span>
						</div>
					{/each}
				</div>
			</div>
			<!-- Bottom CTA -->
			<div class="lp-why-cta">
				<button onclick={openModal} class="lp-cta-btn lp-cta-btn--outline">
					Joyni bepul band qilish →
				</button>
			</div>
		</section>
	</main>

	<!-- ── Footer ──────────────────────────────────────── -->
	<footer class="lp-footer">
		<div class="lp-footer-inner">
			<div class="lp-logo lp-logo--sm">
				<span class="lp-logo-icon"><Star size={14} fill="currentColor" /></span>
				<span>CHINORA<em>ACADEMY</em></span>
			</div>
			<p class="lp-footer-copy">
				© {new Date().getFullYear()} Chinora Academy. Barcha huquqlar himoyalangan.
			</p>
			<nav class="lp-footer-links">
				<a href="https://instagram.com">Instagram</a>
				<a href="https://t.me">Telegram</a>
				<a href="https://youtube.com">YouTube</a>
			</nav>
		</div>
	</footer>

	<!-- ── Modal ───────────────────────────────────────── -->
	{#if isModalOpen}
		<div
			class="lp-modal-backdrop"
			transition:fade={{ duration: 250 }}
			onclick={() => (isModalOpen = false)}
			onkeydown={(e) => e.key === 'Escape' && (isModalOpen = false)}
			role="button"
			tabindex="-1"
		>
			<div
				class="lp-modal"
				transition:scale={{ duration: 380, easing: backOut, start: 0.92 }}
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				tabindex="-1"
			>
				<button onclick={() => (isModalOpen = false)} class="lp-modal-close" aria-label="Yopish">
					<X size={18} />
				</button>

				{#if !isSubmitted}
					<div class="lp-modal-header">
						<div class="lp-modal-icon">
							<Users size={26} />
						</div>
						<h2 class="lp-modal-title" id="modal-title">Ro'yxatdan o'tish</h2>
						<p class="lp-modal-sub">
							Ma'lumotlaringizni qoldiring va yopiq Telegram kanalimizga qo'shiling!
						</p>
					</div>

					<form onsubmit={handleSubmit} class="lp-form">
						<div class="lp-field">
							<label for="reg-name" class="lp-field-label">To'liq ismingiz</label>
							<input
								id="reg-name"
								type="text"
								bind:value={name}
								placeholder="Ismingizni kiriting"
								required
								class="lp-input"
							/>
						</div>
						<div class="lp-field">
							<PhoneInput label="Telefon raqamingiz" id="reg-phone" bind:value={phone} />
						</div>
						<button type="submit" disabled={isLoading} class="lp-submit-btn">
							{#if isLoading}
								<span class="lp-spinner"></span>
								YUBORILMOQDA...
							{:else}
								YUBORISH
							{/if}
						</button>
					</form>
				{:else}
					<div class="lp-success">
						<div class="lp-success-icon">
							<CheckCircle2 size={42} />
						</div>
						<h2 class="lp-modal-title" id="modal-title">Muvaffaqiyatli!</h2>
						<p class="lp-modal-sub">
							Siz muvaffaqiyatli ro'yxatdan o'tdingiz. Endi barcha dars materiallari va havolalar
							joylangan kanalimizga a'zo bo'ling.
						</p>
						<a
							href="https://t.me/+ZlMsl6Ool8k4Zjdi"
							target="_blank"
							rel="noopener noreferrer"
							class="lp-tg-btn"
						>
							<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.014 9.49c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.39l-2.95-.924c-.642-.2-.655-.642.136-.953l11.527-4.448c.536-.194 1.006.13.369.183z"
								/>
							</svg>
							TELEGRAMGA QO'SHILISH
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	/* ── Fonts & Reset ─────────────────────────────────── */
	.lp-root {
		font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
		background: #faf7f2;
		color: #1a0f0a;
		min-height: 100vh;
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
	}

	/* ── Banner ────────────────────────────────────────── */
	.lp-banner {
		background: #9b1c48;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 10px 16px;
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0.03em;
		text-align: center;
		flex-wrap: wrap;
	}

	.lp-banner-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #ffd700;
		animation: blink 1.8s infinite;
		flex-shrink: 0;
	}

	.lp-banner-badge {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 999px;
		padding: 2px 10px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	/* ── Nav ───────────────────────────────────────────── */
	.lp-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(250, 247, 242, 0.88);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(155, 28, 72, 0.1);
	}

	.lp-nav-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.lp-logo {
		display: flex;
		align-items: center;
		gap: 9px;
		text-decoration: none;
		font-size: 17px;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: #1a0f0a;
	}

	.lp-logo em {
		font-style: normal;
		color: #9b1c48;
	}

	.lp-logo--sm {
		font-size: 14px;
	}

	.lp-logo-icon {
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: #9b1c48;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		flex-shrink: 0;
	}

	.lp-nav-cta {
		display: none;
		align-items: center;
		gap: 6px;
		height: 38px;
		padding: 0 1.25rem;
		border-radius: 999px;
		border: none;
		background: #1a0f0a;
		color: #fff;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		transition:
			background 0.15s,
			transform 0.1s;
		font-family: inherit;
	}

	.lp-nav-cta:hover {
		background: #9b1c48;
		transform: scale(1.02);
	}

	@media (min-width: 640px) {
		.lp-nav-cta {
			display: flex;
		}
	}

	/* ── Hero ──────────────────────────────────────────── */
	.lp-hero {
		position: relative;
		overflow: hidden;
	}

	.lp-hero-noise {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
		background-size: 200px;
		pointer-events: none;
		opacity: 0.6;
		z-index: 0;
	}

	.lp-hero-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(155, 28, 72, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(155, 28, 72, 0.04) 1px, transparent 1px);
		background-size: 60px 60px;
		pointer-events: none;
		z-index: 0;
	}

	.lp-hero-glow {
		position: absolute;
		top: -120px;
		right: -120px;
		width: 600px;
		height: 600px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(155, 28, 72, 0.08) 0%, transparent 70%);
		pointer-events: none;
		z-index: 0;
	}

	.lp-hero-inner {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 3.5rem 1.5rem 5rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		align-items: start;
	}

	@media (min-width: 1024px) {
		.lp-hero-inner {
			grid-template-columns: 1fr 420px;
			gap: 4rem;
			padding: 5rem 2rem 6rem;
		}
	}

	/* ── Content (left) ────────────────────────────────── */
	.lp-content > * {
		opacity: 0;
		transform: translateY(18px);
		transition:
			opacity 0.55s ease,
			transform 0.55s ease;
	}

	.lp-content--visible > * {
		opacity: 1;
		transform: none;
	}
	.lp-content--visible > *:nth-child(1) {
		transition-delay: 0.05s;
	}
	.lp-content--visible > *:nth-child(2) {
		transition-delay: 0.12s;
	}
	.lp-content--visible > *:nth-child(3) {
		transition-delay: 0.19s;
	}
	.lp-content--visible > *:nth-child(4) {
		transition-delay: 0.26s;
	}
	.lp-content--visible > *:nth-child(5) {
		transition-delay: 0.33s;
	}
	.lp-content--visible > *:nth-child(6) {
		transition-delay: 0.4s;
	}
	.lp-content--visible > *:nth-child(7) {
		transition-delay: 0.47s;
	}

	/* Eyebrow */
	.lp-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 7px 14px;
		border-radius: 999px;
		border: 1.5px solid rgba(155, 28, 72, 0.25);
		background: rgba(155, 28, 72, 0.06);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #9b1c48;
	}

	/* Title */
	.lp-h1 {
		font-family: 'Playfair Display', Georgia, serif;
		margin: 0;
		line-height: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.lp-h1-line {
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 900;
		color: #1a0f0a;
		letter-spacing: -0.02em;
		display: block;
	}

	.lp-h1-accent {
		font-size: clamp(2.75rem, 7vw, 5rem);
		font-weight: 900;
		font-style: italic;
		color: #9b1c48;
		letter-spacing: -0.02em;
		display: block;
		position: relative;
	}

	.lp-h1-sub {
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 700;
		color: #1a0f0a;
		letter-spacing: -0.02em;
		display: block;
		opacity: 0.8;
	}

	/* Lead */
	.lp-lead {
		font-size: clamp(1rem, 2vw, 1.15rem);
		line-height: 1.7;
		color: #4a3028;
		max-width: 580px;
		margin: 0;
	}

	.lp-lead strong {
		color: #1a0f0a;
	}

	/* Instructor */
	.lp-instructor {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		background: #fff;
		border: 1.5px solid rgba(155, 28, 72, 0.12);
		border-radius: 22px;
		padding: 1.5rem;
		box-shadow: 0 4px 24px rgba(155, 28, 72, 0.06);
		max-width: 620px;
	}

	@media (min-width: 600px) {
		.lp-instructor {
			flex-direction: row;
		}
	}

	.lp-instructor-img-wrap {
		position: relative;
		width: 100%;
		height: 200px;
		border-radius: 14px;
		overflow: hidden;
		flex-shrink: 0;
	}

	@media (min-width: 600px) {
		.lp-instructor-img-wrap {
			width: 160px;
			height: 180px;
		}
	}

	.lp-instructor-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.lp-online-badge {
		position: absolute;
		bottom: 10px;
		left: 10px;
		display: flex;
		align-items: center;
		gap: 5px;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
		color: #fff;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 4px 9px;
		border-radius: 999px;
	}

	.lp-online-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #22c55e;
		animation: blink 1.8s infinite;
	}

	.lp-instructor-name {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.25rem;
		font-weight: 700;
		color: #1a0f0a;
		margin: 0 0 3px;
	}

	.lp-instructor-role {
		font-size: 12.5px;
		font-weight: 700;
		color: #9b1c48;
		margin: 0 0 8px;
		letter-spacing: 0.01em;
	}

	.lp-instructor-bio {
		font-size: 13px;
		line-height: 1.6;
		color: #6b5248;
		margin: 0 0 12px;
	}

	.lp-stats-row {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.lp-stat {
		display: flex;
		flex-direction: column;
	}

	.lp-stat-val {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.25rem;
		font-weight: 900;
		color: #9b1c48;
		line-height: 1;
	}

	.lp-stat-lbl {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #a09090;
	}

	/* Chips */
	.lp-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		max-width: 600px;
	}

	.lp-chip {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		border-radius: 14px;
		background: #fff;
		border: 1.5px solid #ede0d8;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		transition: border-color 0.15s;
	}

	.lp-chip:hover {
		border-color: rgba(155, 28, 72, 0.3);
	}

	.lp-chip--free {
		border-color: rgba(22, 163, 74, 0.25);
	}

	:global(.lp-chip-icon) {
		color: #9b1c48;
		flex-shrink: 0;
	}

	.lp-chip-label {
		display: block;
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a09090;
	}

	.lp-chip-val {
		display: block;
		font-size: 13.5px;
		font-weight: 700;
		color: #1a0f0a;
	}

	.lp-chip-val--free {
		color: #16a34a;
		font-weight: 800;
	}

	/* Benefits */
	.lp-benefits {
		max-width: 600px;
	}

	.lp-benefits-title {
		font-size: 1rem;
		font-weight: 700;
		color: #1a0f0a;
		margin: 0 0 1rem;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.lp-benefits-title::before {
		content: '';
		width: 18px;
		height: 2px;
		background: #9b1c48;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.lp-benefit-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.lp-benefit {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.5;
		color: #3a2520;
		animation: benefitIn 0.4s ease both;
	}

	@keyframes benefitIn {
		from {
			opacity: 0;
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.lp-benefit-icon {
		width: 26px;
		height: 26px;
		border-radius: 8px;
		background: rgba(155, 28, 72, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #9b1c48;
		flex-shrink: 0;
		margin-top: 1px;
	}

	/* ── CTA Button ────────────────────────────────────── */
	.lp-cta-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		height: 58px;
		border-radius: 16px;
		border: none;
		background: #9b1c48;
		color: #fff;
		font-size: 15px;
		font-weight: 800;
		letter-spacing: 0.08em;
		cursor: pointer;
		transition:
			background 0.15s,
			transform 0.12s,
			box-shadow 0.15s;
		box-shadow: 0 6px 28px rgba(155, 28, 72, 0.35);
		font-family: inherit;
		position: relative;
		overflow: hidden;
	}

	.lp-cta-btn::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			105deg,
			transparent 40%,
			rgba(255, 255, 255, 0.15) 50%,
			transparent 60%
		);
		transform: translateX(-100%);
		transition: transform 0.6s ease;
	}

	.lp-cta-btn:hover::after {
		transform: translateX(100%);
	}
	.lp-cta-btn:hover {
		background: #841639;
		box-shadow: 0 8px 36px rgba(155, 28, 72, 0.42);
		transform: translateY(-2px);
	}
	.lp-cta-btn:active {
		transform: scale(0.97);
	}

	.lp-cta-btn--mobile {
		max-width: 480px;
	}

	@media (min-width: 1024px) {
		.lp-cta-btn--mobile {
			display: none;
		}
	}

	.lp-cta-btn--outline {
		background: transparent;
		border: 2px solid #9b1c48;
		color: #9b1c48;
		box-shadow: none;
		width: auto;
		padding: 0 2.5rem;
	}

	.lp-cta-btn--outline:hover {
		background: #9b1c48;
		color: #fff;
		box-shadow: 0 6px 24px rgba(155, 28, 72, 0.3);
	}

	/* ── Sidebar ────────────────────────────────────────── */
	.lp-sidebar {
		opacity: 0;
		transform: translateX(20px);
		transition:
			opacity 0.55s ease 0.3s,
			transform 0.55s ease 0.3s;
	}

	.lp-sidebar--visible {
		opacity: 1;
		transform: none;
	}

	@media (min-width: 1024px) {
		.lp-sidebar {
			position: sticky;
			top: 88px;
		}
	}

	.lp-card {
		background: #fff;
		border-radius: 26px;
		border: 1.5px solid rgba(155, 28, 72, 0.12);
		padding: 1.75rem;
		box-shadow:
			0 16px 56px rgba(155, 28, 72, 0.1),
			0 4px 16px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* Seats */
	.lp-seats {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}

	.lp-seats-left {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12.5px;
		font-weight: 600;
		color: #9b1c48;
		background: rgba(155, 28, 72, 0.07);
		border: 1px solid rgba(155, 28, 72, 0.18);
		padding: 5px 12px;
		border-radius: 999px;
	}

	.lp-seats-left strong {
		font-weight: 800;
	}

	.lp-avatars {
		display: flex;
		align-items: center;
	}

	.lp-avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 2px solid #fff;
		object-fit: cover;
		margin-left: -8px;
	}

	.lp-avatar:first-child {
		margin-left: 0;
	}

	.lp-avatar--count {
		background: #9b1c48;
		color: #fff;
		font-size: 9px;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Timer */
	.lp-timer {
		background: #1a0f0a;
		border-radius: 18px;
		padding: 1.25rem 1.375rem;
		color: #fff;
	}

	.lp-timer-label {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
		margin-bottom: 1rem;
	}

	.lp-timer-live {
		font-size: 1.125rem;
		font-weight: 800;
		color: #9b1c48;
		text-align: center;
		animation: blink 1.2s infinite;
		margin: 0;
	}

	.lp-timer-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}

	.lp-timer-unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.lp-timer-val {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.875rem;
		font-weight: 900;
		line-height: 1;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 10px 6px;
		width: 100%;
		text-align: center;
		letter-spacing: -0.02em;
		transition: background 0.3s;
	}

	.lp-timer-lbl {
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.3);
	}

	/* Price */
	.lp-price-block {
		border-top: 1px solid #f0e8e3;
		border-bottom: 1px solid #f0e8e3;
		padding: 1rem 0;
	}

	.lp-price-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.lp-price-was {
		font-size: 12px;
		color: #a09090;
		margin: 0 0 3px;
	}

	.lp-price-now {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 2.25rem;
		font-weight: 900;
		color: #1a0f0a;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.lp-discount-badge {
		background: #16a34a;
		color: #fff;
		font-size: 12px;
		font-weight: 800;
		padding: 6px 12px;
		border-radius: 10px;
		letter-spacing: 0.04em;
	}

	.lp-price-note {
		font-size: 11.5px;
		color: #a09090;
		margin: 0;
	}

	.lp-card-note {
		font-size: 12px;
		color: #a09090;
		text-align: center;
		margin: 0;
		line-height: 1.5;
	}

	/* Trust */
	.lp-trust {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding-top: 1rem;
		border-top: 1px solid #f0e8e3;
		opacity: 0.4;
		filter: grayscale(1);
	}

	.lp-trust-logo {
		height: 20px;
		object-fit: contain;
	}

	/* ── Why Section ────────────────────────────────────── */
	.lp-why {
		background: #1a0f0a;
		color: #fff;
		padding: 5rem 1.5rem 4rem;
		position: relative;
		overflow: hidden;
	}

	.lp-why::before {
		content: '';
		position: absolute;
		top: -200px;
		left: -200px;
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(155, 28, 72, 0.2) 0%, transparent 70%);
		pointer-events: none;
	}

	.lp-why::after {
		content: '';
		position: absolute;
		bottom: -150px;
		right: -150px;
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(155, 28, 72, 0.15) 0%, transparent 70%);
		pointer-events: none;
	}

	.lp-why-inner {
		position: relative;
		z-index: 1;
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
	}

	.lp-section-eyebrow {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #9b1c48;
		margin-bottom: 1rem;
	}

	.lp-why-title {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3.25rem);
		font-weight: 900;
		margin: 0 0 1.25rem;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.lp-why-title em {
		font-style: italic;
		color: #9b1c48;
	}

	.lp-why-desc {
		font-size: 1.0625rem;
		line-height: 1.75;
		color: rgba(255, 255, 255, 0.55);
		margin: 0 auto 3rem;
		max-width: 640px;
	}

	.lp-why-desc strong {
		color: rgba(255, 255, 255, 0.85);
	}

	.lp-why-stats {
		display: flex;
		justify-content: center;
		gap: 3rem;
		flex-wrap: wrap;
		margin-bottom: 3rem;
	}

	.lp-why-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.lp-why-stat-val {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 2.5rem;
		font-weight: 900;
		color: #9b1c48;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.lp-why-stat-lbl {
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.3);
	}

	.lp-why-cta {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: center;
	}

	/* ── Footer ────────────────────────────────────────── */
	.lp-footer {
		background: #faf7f2;
		border-top: 1px solid rgba(155, 28, 72, 0.1);
		padding: 2.5rem 1.5rem;
	}

	.lp-footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		text-align: center;
	}

	@media (min-width: 768px) {
		.lp-footer-inner {
			flex-direction: row;
			justify-content: space-between;
			text-align: left;
		}
	}

	.lp-footer-copy {
		font-size: 12.5px;
		color: #a09090;
		margin: 0;
	}

	.lp-footer-links {
		display: flex;
		gap: 1.5rem;
	}

	.lp-footer-links a {
		font-size: 13px;
		font-weight: 600;
		color: #a09090;
		text-decoration: none;
		transition: color 0.15s;
	}

	.lp-footer-links a:hover {
		color: #9b1c48;
	}

	/* ── Modal ─────────────────────────────────────────── */
	.lp-modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(10, 5, 3, 0.65);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.lp-modal {
		position: relative;
		width: 100%;
		max-width: 440px;
		background: #fff;
		border-radius: 26px;
		padding: 2.5rem 2rem;
		box-shadow: 0 32px 80px rgba(0, 0, 0, 0.25);
		overflow: hidden;
	}

	.lp-modal::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #9b1c48, #d73a6a);
	}

	.lp-modal-close {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: 1.5px solid #ede0d8;
		background: #faf7f2;
		color: #a09090;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
	}

	.lp-modal-close:hover {
		background: #9b1c48;
		color: #fff;
		border-color: #9b1c48;
	}

	.lp-modal-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.lp-modal-icon {
		width: 60px;
		height: 60px;
		border-radius: 18px;
		background: rgba(155, 28, 72, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #9b1c48;
		margin: 0 auto 1.25rem;
	}

	.lp-modal-title {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.875rem;
		font-weight: 900;
		color: #1a0f0a;
		margin: 0 0 8px;
	}

	.lp-modal-sub {
		font-size: 14px;
		color: #7a6258;
		margin: 0;
		line-height: 1.6;
	}

	/* Form */
	.lp-form {
		display: flex;
		flex-direction: column;
		gap: 1.125rem;
	}

	.lp-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.lp-field-label {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #7a6258;
	}

	.lp-input {
		width: 100%;
		height: 50px;
		padding: 0 16px;
		border-radius: 13px;
		border: 1.5px solid #ede0d8;
		background: #faf7f2;
		font-size: 15px;
		font-weight: 600;
		color: #1a0f0a;
		outline: none;
		transition:
			border-color 0.15s,
			box-shadow 0.15s,
			background 0.15s;
		font-family: inherit;
		box-sizing: border-box;
	}

	.lp-input::placeholder {
		color: #c5b5ae;
		font-weight: 400;
	}

	.lp-input:focus {
		border-color: #9b1c48;
		background: #fff;
		box-shadow: 0 0 0 4px rgba(155, 28, 72, 0.08);
	}

	.lp-submit-btn {
		height: 52px;
		border-radius: 14px;
		border: none;
		background: #1a0f0a;
		color: #fff;
		font-size: 15px;
		font-weight: 800;
		letter-spacing: 0.1em;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		transition:
			background 0.15s,
			transform 0.1s;
		font-family: inherit;
		margin-top: 0.5rem;
	}

	.lp-submit-btn:hover:not(:disabled) {
		background: #9b1c48;
	}
	.lp-submit-btn:active:not(:disabled) {
		transform: scale(0.98);
	}
	.lp-submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.lp-spinner {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2.5px solid rgba(255, 255, 255, 0.25);
		border-top-color: #fff;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	/* Success */
	.lp-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1rem;
		padding: 0.5rem 0;
	}

	.lp-success-icon {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #16a34a;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-shadow: 0 8px 30px rgba(22, 163, 74, 0.3);
	}

	.lp-tg-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		height: 54px;
		border-radius: 14px;
		background: #229ed9;
		color: #fff;
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-decoration: none;
		transition:
			background 0.15s,
			transform 0.1s;
		margin-top: 0.5rem;
	}

	.lp-tg-btn:hover {
		background: #1a8ec4;
		transform: translateY(-1px);
	}

	/* ── Animations ─────────────────────────────────────── */
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ── Global overrides ──────────────────────────────── */
	:global(#offer-page *) {
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: smooth;
	}
</style>
