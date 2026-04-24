<script lang="ts">
	import Sidebar from '$lib/components/layout/admin/Sidebar.svelte';
	import DashboardNavbar from '$lib/components/layout/admin/DashboardNavbar.svelte';
	import {
		LayoutDashboard,
		Users,
		BookOpen,
		FileText,
		Settings,
		ShieldCheck,
		Activity,
		KeyRound
	} from 'lucide-svelte';
	import SeoMeta from '@/lib/components/ui/SeoMeta.svelte';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';

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

	let adminNavItems = $derived([
		{
			href: '/admin/dashboard',
			label: m.admin_nav_dashboard ? m.admin_nav_dashboard() : 'Dashboard',
			icon: LayoutDashboard,
			exact: true
		},
		{
			href: '/admin/students',
			label: m.admin_nav_students ? m.admin_nav_students() : 'Talabalar',
			icon: Users,
			exact: false
		},
		{
			href: '/admin/admins/create',
			label: m.admin_nav_admins ? m.admin_nav_admins() : 'Adminlar',
			icon: ShieldCheck,
			exact: false
		},
		{
			href: '/admin/courses',
			label: m.admin_nav_courses ? m.admin_nav_courses() : 'Kurslar',
			icon: BookOpen,
			exact: false
		},
		{
			href: '/admin/submissions',
			label: m.admin_nav_submissions ? m.admin_nav_submissions() : 'Arizalar',
			icon: FileText,
			exact: false
		},
		{ divider: true, label: m.admin_nav_system_logs ? m.admin_nav_system_logs() : 'System Logs' },
		{
			href: '/admin/logs/activity',
			label: m.admin_nav_activity ? m.admin_nav_activity() : 'Faoliyat',
			icon: Activity,
			exact: false
		},
		{
			href: '/admin/logs/login',
			label: m.admin_nav_login_logs ? m.admin_nav_login_logs() : 'Tizimga kirish',
			icon: KeyRound,
			exact: false
		},
		{
			divider: true,
			label: m.admin_nav_settings_divider ? m.admin_nav_settings_divider() : 'Settings'
		},
		{
			href: '/admin/profile',
			label: m.admin_nav_settings ? m.admin_nav_settings() : 'Sozlamalar',
			icon: Settings,
			exact: false
		}
	]);
</script>

<SeoMeta title="Admin Panel - Chinora Academy" robots="noindex, nofollow" />

<div class="admin-shell {collapsed ? 'collapsed' : ''}">
	<Sidebar bind:collapsed bind:mobileOpen user={data.user} navItems={adminNavItems} />

	<div class="admin-body">
		<DashboardNavbar notificationCount={3} bind:mobileOpen user={data.user} />

		{#if page.url.pathname.split('/').filter(Boolean).length > 2}
			<div class="mobile-breadcrumb-container">
				<Breadcrumb inNavbar={false} />
			</div>
		{/if}

		<main class="md:admin-content">
			{@render children()}
		</main>
	</div>
</div>

<style>
	.admin-shell {
		display: flex;
		min-height: 100vh;
		background: var(--bg-main); /* Orqa fon rangi */
	}

	.admin-body {
		flex: 1;
		margin-left: 272px;
		transition: margin-left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		display: flex;
		flex-direction: column;
		min-width: 0; /* Overflow muammolarini oldini oladi */
	}

	/* Collapsed holati */
	.admin-shell.collapsed .admin-body {
		margin-left: 76px;
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
