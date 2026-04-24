<script>
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import LanguageSwitcher from '@/lib/components/ui/LanguageSwitcher.svelte';
	import ThemeToggle from '@/lib/components/ui/ThemeToggle.svelte';
	import { Menu, X, User, LogIn, ChevronRight } from 'lucide-svelte';
	import { gsap } from 'gsap';

	let isMobileMenuOpen = $state(false);
	let scrolled = $state(false);
	let mobileMenuRef = $state();
	let mobileContentRef = $state();
	let menuTimeline = null;

	// Handle scroll for navbar appearance
	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', () => {
			scrolled = window.scrollY > 20;
		});
	}

	const navLinks = $derived([
		{ id: 'course-content', label: m.nav_courses() },
		{ id: 'about', label: m.nav_about() },
		{ id: 'faq', label: 'FAQ' }
	]);

	function handleAnchorClick(e, id) {
		e.preventDefault();
		closeMenu();

		const el = document.getElementById(id);
		if (el) {
			const yOffset = -100;
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMenu() {
		isMobileMenuOpen = false;
	}

	// Setup GSAP Timeline in $effect or onMount
	$effect(() => {
		if (mobileMenuRef && mobileContentRef && !menuTimeline) {
			menuTimeline = gsap.timeline({ paused: true });
			menuTimeline
				.fromTo(
					mobileMenuRef,
					{ clipPath: 'circle(0% at 100% 0%)', visibility: 'hidden' },
					{
						clipPath: 'circle(150% at 100% 0%)',
						visibility: 'visible',
						duration: 0.8,
						ease: 'power3.inOut'
					}
				)
				.fromTo(
					mobileContentRef.children,
					{ y: 30, opacity: 0 },
					{ y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'power2.out' },
					'-=0.4'
				);
		}
	});

	// Trigger animation when state changes
	$effect(() => {
		if (menuTimeline) {
			if (isMobileMenuOpen) {
				menuTimeline.play();
				document.body.style.overflow = 'hidden';
			} else {
				menuTimeline.reverse();
				document.body.style.overflow = 'auto';
			}
		}
	});

	const isHomePage = $derived($page.url.pathname === '/');
</script>

<div
	class="fixed top-0 right-0 left-0 z-50 flex w-full justify-center transition-all duration-500"
	class:pt-2={!scrolled}
	class:pt-1={scrolled}
>
	<nav
		class="relative flex w-full max-w-7xl items-center justify-between rounded-full border border-border/30 bg-surface/70 px-6 py-1.5 shadow-main backdrop-blur-2xl transition-all duration-500 md:mx-6 md:px-10"
		class:bg-primary={scrolled}
		class:shadow-[0_4px_30px_rgba(155,28,72,0.2)]={scrolled}
		style="overflow: visible !important;"
	>
		<!-- Liquid Background Decor -->
		<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-4xl">
			<div
				class="absolute -top-10 -right-10 h-40 w-40 animate-pulse rounded-full bg-[#ed4b72]/10 blur-3xl"
			></div>
			<div
				class="absolute -bottom-10 -left-10 h-40 w-40 animate-pulse rounded-full bg-[#ed4b72]/15 blur-3xl"
				style="animation-delay: 1s"
			></div>
		</div>

		<!-- Left side: Logo -->
		<a
			href={resolve('/')}
			class="relative z-10 flex items-center transition-transform hover:scale-105 active:scale-95"
		>
			<img src="/logo/chinora-main.png" alt="Chinora Academy" class="logo-img" />
		</a>

		<!-- Center: Nav Links (Desktop) -->
		<div class="desktop-nav items-center gap-10">
			{#each navLinks as link (link.id)}
				<a
					href="#{link.id}"
					class="group relative py-1 text-sm font-black tracking-tight text-foreground transition-colors hover:text-primary"
					onclick={(e) => handleAnchorClick(e, link.id)}
				>
					{link.label}
					<span
						class="absolute -bottom-1 left-0 h-1 w-0 rounded-full bg-linear-to-r from-[#ed4b72] to-[#ff7d9a] transition-all duration-300 group-hover:w-full"
					></span>
				</a>
			{/each}
		</div>

		<!-- Right side Actions -->
		<div class="relative z-50 flex items-center gap-4 md:gap-8" style="overflow: visible;">
			<div class="desktop-nav" style="overflow: visible;">
				{#if !isHomePage}
					<ThemeToggle />
				{/if}
				<LanguageSwitcher variant="minimal" />
			</div>

			{#if $page.data.isAuthenticated}
				<a
					href={resolve('/profil')}
					class="flex items-center gap-2 rounded-full border-2 border-foreground bg-foreground px-6 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-foreground/10 transition-all hover:opacity-90 active:scale-95"
				>
					<User size={16} />
					{m.nav_profile()}
				</a>
			{:else}
				<a
					href={resolve('/login')}
					class="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-[0_8px_20px_rgba(155,28,72,0.3)] transition-all hover:bg-primary-light hover:shadow-[0_12px_24px_rgba(155,28,72,0.4)] active:scale-95"
				>
					<LogIn size={16} />
					{m.nav_login()}
				</a>
			{/if}

			<!-- Mobile Toggle -->
			<button
				type="button"
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					toggleMobileMenu();
				}}
				class="mobile-toggle relative z-50 h-12 w-12 items-center justify-center rounded-2xl bg-surface/50 text-primary transition-all hover:bg-surface hover:shadow-md"
				aria-label="Toggle Menu"
			>
				{#if isMobileMenuOpen}
					<X size={28} />
				{:else}
					<Menu size={28} />
				{/if}
			</button>
		</div>
	</nav>
</div>

<!-- Mobile Menu Overlay (Always in DOM for GSAP) -->
<div
	bind:this={mobileMenuRef}
	class="invisible fixed inset-0 z-100 flex flex-col overflow-hidden bg-background"
	style="clip-path: circle(0% at 100% 0%);"
>
	<!-- Liquid Decor -->
	<div
		class="absolute top-0 right-0 h-[60vh] w-[60vh] translate-x-1/3 -translate-y-1/3 rounded-full bg-[#ed4b72]/10 blur-3xl"
	></div>
	<div
		class="absolute bottom-0 left-0 h-[50vh] w-[50vh] -translate-x-1/3 translate-y-1/3 rounded-full bg-[#ed4b72]/15 blur-3xl"
	></div>

	<!-- Wave Svg Shape -->
	<div class="absolute right-0 bottom-0 left-0 w-full opacity-20">
		<svg viewBox="0 0 1440 320" class="w-full">
			<path
				fill="#ed4b72"
				fill-opacity="1"
				d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
			></path>
		</svg>
	</div>

	<div class="flex items-center justify-between border-b border-rose-50 p-8">
		<img src="/logo/chinora-main.png" alt="Chinora Academy" class="h-16 w-auto" />
		<button
			type="button"
			onclick={closeMenu}
			class="relative z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all active:scale-90"
		>
			<X size={32} />
		</button>
	</div>

	<div
		bind:this={mobileContentRef}
		class="relative z-10 flex flex-1 flex-col justify-center gap-4 px-10"
	>
		{#each navLinks as link (link.id)}
			<a
				href="#{link.id}"
				class="group flex items-center justify-between border-b border-border/50 py-4 transition-all"
				onclick={(e) => handleAnchorClick(e, link.id)}
			>
				<span
					class="text-2xl font-bold tracking-tighter text-foreground transition-colors group-hover:text-primary"
				>
					{link.label}
				</span>
				<ChevronRight
					size={24}
					class="-translate-x-4 text-[#ed4b72] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
				/>
			</a>
		{/each}

		<div class="mt-8 flex flex-col gap-4">
			{#if !$page.data.isAuthenticated}
				<a
					href={resolve('/login')}
					class="flex h-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold tracking-widest text-white uppercase shadow-xl shadow-primary/30 transition-all active:scale-[0.98]"
					onclick={closeMenu}
				>
					<LogIn class="mr-3" size={20} />
					{m.nav_login()}
				</a>
			{:else}
				<a
					href={resolve('/profil')}
					class="flex h-14 items-center justify-center gap-4 rounded-2xl bg-foreground text-lg font-bold tracking-widest text-white uppercase shadow-xl transition-all active:scale-[0.98]"
					onclick={closeMenu}
				>
					<User size={20} />
					{m.nav_profile()}
				</a>
			{/if}

			<div class="flex items-center justify-center gap-4 py-4">
				{#if !isHomePage}
					<ThemeToggle />
				{/if}
				<LanguageSwitcher variant="minimal" />
			</div>
		</div>
	</div>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.logo-img {
		height: 3.5rem; /* Reduced size */
		width: auto;
		transition: transform 0.3s ease;
	}

	.desktop-nav {
		display: none;
	}

	.mobile-toggle {
		display: flex;
	}

	@media (min-width: 1024px) {
		.desktop-nav {
			display: flex;
		}
		.mobile-toggle {
			display: none;
		}
	}

	/* Optional: Paper texture support */
	.fixed[bind\:this='mobileMenuRef'] {
		background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png');
	}
</style>
