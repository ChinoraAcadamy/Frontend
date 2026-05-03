<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import LanguageSwitcher from '@/lib/components/ui/LanguageSwitcher.svelte';
	import ThemeToggle from '@/lib/components/ui/ThemeToggle.svelte';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
	import A11yPanel from '@/lib/components/ui/A11yPanel.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { user = null, mobileOpen = $bindable(false) } = $props();

	const profileLink = $derived(
		user?.role === 'admin' || user?.role === 'superadmin' ? '/admin/profile' : '/profil'
	);
</script>

<header class="navbar">
	<div class="navbar-left">
		<button
			class="mobile-menu-btn"
			onclick={() => (mobileOpen = true)}
			aria-label={m.admin_menu_open?.() ?? 'Menyuni ochish'}
		>
			<Menu size={20} strokeWidth={2.2} />
		</button>

		{#if page.url.pathname.split('/').filter(Boolean).length > 2}
			<div class="breadcrumb-wrap">
				<Breadcrumb inNavbar={true} />
			</div>
		{/if}
	</div>

	<div class="navbar-right">
		<div class="action-group">
			<LanguageSwitcher variant="minimal" />
			<div class="v-divider"></div>
			<ThemeToggle />
		</div>

		<!-- A11y Panel -->
		<A11yPanel />

		<!-- Avatar -->
		<a href={resolve(profileLink)} class="avatar-link" aria-label={m.menu_profile?.() ?? 'Profil'}>
			<div class="avatar-fallback">
				{(user?.first_name?.[0] || user?.username?.[0] || 'A').toUpperCase()}
			</div>
			<span class="status-dot"></span>
		</a>
	</div>
</header>

<style>
	/* ── Navbar ──────────────────────────────────────── */
	.navbar {
		position: sticky;
		top: 0;
		z-index: 900;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		background: var(--bg-sidebar);
		border-bottom: 1px solid var(--border-main);
		box-shadow: var(--shadow-sm);
		transition:
			background-color 0.3s,
			border-color 0.3s;
	}

	@media (min-width: 1024px) {
		.navbar {
			padding: 0 1.5rem;
		}
	}

	.navbar-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}

	.mobile-menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		border: 1px solid var(--border-light);
		background: var(--bg-input);
		color: var(--text-muted);
		cursor: pointer;
		flex-shrink: 0;
		transition: all 0.2s;
	}

	.mobile-menu-btn:hover {
		background: var(--border-light);
		color: var(--primary);
		border-color: var(--primary);
	}

	@media (min-width: 1024px) {
		.mobile-menu-btn {
			display: none;
		}
	}

	.breadcrumb-wrap {
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}

	.navbar-right {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}

	.action-group {
		display: flex;
		align-items: center;
		background: var(--bg-input);
		border: 1px solid var(--border-main);
		padding: 2px 4px;
		border-radius: 12px;
		gap: 2px;
	}

	.v-divider {
		width: 1px;
		height: 16px;
		background: var(--border-main);
		opacity: 0.6;
	}

	/* Avatar */
	.avatar-link {
		position: relative;
		display: block;
		margin-left: 4px;
		text-decoration: none;
		border-radius: 12px;
		transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.avatar-link:hover {
		transform: scale(1.08) rotate(2deg);
	}

	.avatar-fallback {
		width: 36px;
		height: 36px;
		border-radius: 11px;
		border: 1.5px solid var(--border-main);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: border-color 0.2s;
	}

	.avatar-link:hover .avatar-fallback {
		border-color: var(--primary);
	}

	.avatar-fallback {
		background: linear-gradient(135deg, var(--primary), #c43c66);
		color: #fff;
		font-size: 14px;
		font-weight: 800;
	}

	.status-dot {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: 10px;
		height: 10px;
		background: #22c55e;
		border: 2px solid var(--bg-sidebar);
		border-radius: 50%;
	}
</style>
