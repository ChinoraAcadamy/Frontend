<!-- /routes/(app)/+layout.svelte -->
<script lang="ts">
	import Sidebar from '$lib/components/layout/admin/Sidebar.svelte';
	import DashboardNavbar from '$lib/components/layout/admin/DashboardNavbar.svelte';
	import { LayoutDashboard, BookOpen, GraduationCap, User } from 'lucide-svelte';
	import SeoMeta from '@/lib/components/ui/SeoMeta.svelte';

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
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
		{ href: '/kurslarim', label: 'Mening kurslarim', icon: BookOpen, exact: false },
		{ href: '/baholar', label: 'Baholar', icon: GraduationCap, exact: false },
		{ href: '/profil', label: 'Profil', icon: User, exact: false }
	];
</script>

<SeoMeta 
	title="Student Dashboard - Chinora Academy"
	robots="noindex, nofollow" 
/>

<div class="admin-shell {collapsed ? 'collapsed' : ''}">
	<Sidebar bind:collapsed bind:mobileOpen user={data.user} navItems={studentNavItems} />

	<div class="admin-body">
		<DashboardNavbar notificationCount={3} bind:mobileOpen user={data.user} />

		<main class="md:admin-content md:p-6">
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
		margin-left: 240px;
		transition: margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
		min-width: 0; /* Overflow muammolarini oldini oladi */
	}

	/* Collapsed holati */
	.admin-shell.collapsed .admin-body {
		margin-left: 72px;
	}

	/* Mobile ekran */
	@media (max-width: 1024px) {
		.admin-body {
			margin-left: 0 !important;
		}
	}
</style>
