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
		if (!collapsed && mobileOpen) {
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
	// Check if it's exactly the courses list page (ignoring locale prefix if any)
	const isCourseListPage = $derived(
		page.url.pathname.endsWith('/kurslarim') || page.url.pathname.endsWith('/kurslarim/')
	);

	// Nested route ekanligini tekshirish (2 dan chuqur)
	let isNestedRoute = $derived(page.url.pathname.split('/').filter(Boolean).length > 1);
</script>

<SeoMeta title="Student Dashboard - Chinora Academy" robots="noindex, nofollow" />

<div class="admin-shell {collapsed ? 'collapsed' : ''}">
	<Sidebar bind:collapsed bind:mobileOpen user={data.user} navItems={studentNavItems} />

	<div class="admin-body">
		<DashboardNavbar notificationCount={3} bind:mobileOpen user={data.user} />

		{#if isNestedRoute}
			<div class="mobile-bc bg-background">
				<Breadcrumb inNavbar={false} />
			</div>
		{/if}

		<main class={isProfilePage || isCourseListPage ? '' : 'md:admin-content md:p-6'}>
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

	/* Mobile breadcrumb bar */
	.mobile-bc {
		display: none;
		position: sticky;
		top: 64px; /* navbar height */
		z-index: 40;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		/* Yuqori chetda ingichka brand chizig'i */
		box-shadow: inset 0 -1px 0 rgba(250, 46, 105, 0.12);
	}

	@media (max-width: 1023px) {
		.mobile-bc {
			display: block;
		}
	}
</style>
