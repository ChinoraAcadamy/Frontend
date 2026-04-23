<!-- /routes/(app)/+layout.svelte -->
<script lang="ts">
	import Sidebar from '$lib/components/layout/admin/Sidebar.svelte';
	import DashboardNavbar from '$lib/components/layout/admin/DashboardNavbar.svelte';
	import { LayoutDashboard, BookOpen, GraduationCap, User } from 'lucide-svelte';
	import SeoMeta from '@/lib/components/ui/SeoMeta.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';

	let { data, children } = $props();

	// State'larni ota komponentda saqlaymiz
	let collapsed = $state(false);
	let mobileOpen = $state(false);

	// no scroll when menu is open on mobile, and enable it back when menu is closed
	$effect(() => {
		if (mobileOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	});

	const studentNavItems = [
		{ href: '/dashboard', label: m.menu_dashboard(), icon: LayoutDashboard, exact: true },
		{ href: '/kurslarim', label: m.menu_my_courses(), icon: BookOpen, exact: false },
		{ href: '/baholar', label: m.menu_grades(), icon: GraduationCap, exact: false },
		{ href: '/profil', label: m.menu_profile(), icon: User, exact: false }
	];

	const isProfilePage = $derived(page.url.pathname.includes('/profil'));
</script>

<SeoMeta title="Student Dashboard - Chinora Academy" robots="noindex, nofollow" />

<div class="admin-shell {collapsed ? 'collapsed' : ''}">
	<Sidebar bind:collapsed bind:mobileOpen user={data.user} navItems={studentNavItems} />

	<div class="admin-body">
		<DashboardNavbar notificationCount={3} bind:mobileOpen user={data.user} />

		{#if page.url.pathname.split('/').filter(Boolean).length > 1}
			<div class="mobile-breadcrumb-container">
				<Breadcrumb inNavbar={false} />
			</div>
		{/if}

		<main class={isProfilePage ? '' : 'md:admin-content md:p-6'}>
			{@render children()}
		</main>
	</div>
</div>

<style>
	.admin-shell {
		display: flex;
		min-height: 100vh;
		background: #f9fafb; /* Orqa fon rangi */
	}

	.admin-body {
		flex: 1;
		margin-left: 290px;
		transition: margin-left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		display: flex;
		flex-direction: column;
		min-width: 0; /* Overflow muammolarini oldini oladi */
	}

	/* Collapsed holati */
	.admin-shell.collapsed .admin-body {
		margin-left: 90px;
	}

	/* Mobile ekran */
	@media (max-width: 1024px) {
		.admin-body {
			margin-left: 0 !important;
		}
	}

	.mobile-breadcrumb-container {
		display: none;
		position: sticky;
		top: 4rem;
		z-index: 40;
		padding: 0.5rem 1.5rem;
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(240, 240, 240, 0.5);
	}

	@media (max-width: 1023px) {
		.mobile-breadcrumb-container {
			display: block !important;
		}
	}
</style>
