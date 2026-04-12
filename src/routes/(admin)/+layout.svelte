<script lang="ts">
	import Sidebar from '$lib/components/layout/admin/Sidebar.svelte';
	import DashboardNavbar from '$lib/components/layout/admin/DashboardNavbar.svelte';
	import { LayoutDashboard, Users, BookOpen, FileText, Settings, ShieldCheck, Activity, KeyRound } from 'lucide-svelte';
	import SeoMeta from '@/lib/components/ui/SeoMeta.svelte';

	let { data, children } = $props();
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

	const adminNavItems = [
		{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
		{ href: '/admin/students', label: 'Talabalar', icon: Users, exact: false },
		{ href: '/admin/admins/create', label: 'Adminlar', icon: ShieldCheck, exact: false },
		{ href: '/admin/courses', label: 'Kurslar', icon: BookOpen, exact: false },
		{ href: '/admin/submissions', label: 'Arizalar', icon: FileText, exact: false },
		{ divider: true, label: 'System Logs' },
		{ href: '/admin/logs/activity', label: 'Faoliyat', icon: Activity, exact: false },
		{ href: '/admin/logs/login', label: 'Tizimga kirish', icon: KeyRound, exact: false },
		{ divider: true, label: 'Settings' },
		{ href: '/admin/profile', label: 'Sozlamalar', icon: Settings, exact: false }
	];
</script>

<SeoMeta 
	title="Admin Panel - Chinora Academy"
	robots="noindex, nofollow" 
/>

<div class="admin-shell {collapsed ? 'collapsed' : ''}">
	<Sidebar bind:collapsed bind:mobileOpen user={data.user} navItems={adminNavItems} />

	<div class="admin-body">
		<DashboardNavbar notificationCount={3} bind:mobileOpen user={data.user} />

		<main class="md:admin-content">
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
