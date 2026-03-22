<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import {
		LayoutDashboard,
		Users,
		BookOpen,
		FileText,
		Settings,
		LogOut,
		ChevronRight,
		X
	} from 'lucide-svelte';

	let loading = $state(false);

	// State'lar ota elementdan keladi va o'zgarsa yuqoriga xabar beradi
	let { user = null, collapsed = $bindable(false), mobileOpen = $bindable(false) } = $props();

	const navItems = [
		{ href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/dashboard/admin/students', label: 'Talabalar', icon: Users },
		{ href: '/dashboard/admin/courses', label: 'Kurslar', icon: BookOpen },
		{ href: '/dashboard/admin/submissions', label: 'Arizalar', icon: FileText },
		{ href: '/dashboard/admin/settings', label: 'Sozlamalar', icon: Settings }
	];

	let currentPath = $derived($page.url.pathname);

	function isActive(href) {
		if (href === '/dashboard/admin') return currentPath === '/dashboard/admin';
		return currentPath.startsWith(href);
	}
</script>

{#if mobileOpen}
	<div class="mobile-overlay" on:click={() => (mobileOpen = false)}></div>
{/if}

<aside class="sidebar {collapsed ? 'collapsed' : ''} {mobileOpen ? 'mobile-open' : ''}">
	<div class="logo">
		<div class="logo-icon">
			<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M16 4C16 4 8 8 8 16C8 20.418 11.582 24 16 24C20.418 24 24 20.418 24 16C24 11.582 20.418 8 16 8"
					stroke="white"
					stroke-width="2.5"
					stroke-linecap="round"
				/>
				<circle cx="16" cy="16" r="3" fill="white" />
			</svg>
		</div>
		{#if !collapsed}
			<div class="logo-text">
				<span class="logo-main">Chinora</span>
				<span class="logo-sub">Academy</span>
			</div>
		{/if}

		<button class="mobile-close-btn" on:click={() => (mobileOpen = false)}>
			<X size={24} />
		</button>
	</div>

	<nav class="nav">
		{#each navItems as item (item.href)}
			{@const active = isActive(item.href)}
			<a
				href={resolve(item.href)}
				class="nav-item {active ? 'active' : ''}"
				on:click={() => (mobileOpen = false)}
			>
				<span class="nav-icon">
					<svelte:component this={item.icon} size={20} strokeWidth={active ? 2.5 : 1.8} />
				</span>
				{#if !collapsed}
					<span class="nav-label">{item.label}</span>
				{/if}
				{#if active && !collapsed}
					<ChevronRight size={16} class="nav-arrow" />
				{/if}
			</a>
		{/each}
	</nav>

	<div class="sidebar-bottom">
		<div class="user-card">
			{#if user?.picture}
				<img src={user.picture} alt="avatar" class="avatar" />
			{:else}
				<div class="avatar-placeholder">
					{(user?.first_name?.[0] || user?.username?.[0] || 'A').toUpperCase()}
				</div>
			{/if}
			{#if !collapsed}
				<div class="user-info">
					<span class="user-name">{user?.first_name || user?.username || 'Admin'}</span>
					<span class="user-role">{user?.role || 'admin'}</span>
				</div>
			{/if}
		</div>
		<form
			method="POST"
			action="/logout"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<button type="submit" disabled={loading} class='logout-btn' title="Chiqish">
				<LogOut size={16} />
			</button>
		</form>
	</div>

	<button class="collapse-btn" on:click={() => (collapsed = !collapsed)}>
		<ChevronRight size={18} class={collapsed ? 'rotate-180' : ''} />
	</button>
</aside>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 240px;
		background: #ffffff;
		border-right: 1px solid #f0f0f0;
		display: flex;
		flex-direction: column;
		padding: 24px 16px;
		z-index: 50;
		transition:
			transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.sidebar.collapsed {
		width: 72px;
	}

	.mobile-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 49;
		backdrop-filter: blur(4px);
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-bottom: 20px;
		border-bottom: 1px solid #f5f5f5;
		margin-bottom: 16px;
		position: relative;
	}

	.logo-icon {
		width: 36px;
		height: 36px;
		background: linear-gradient(135deg, #9b1c48, #c43c66);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.logo-text {
		display: flex;
		flex-direction: column;
		white-space: nowrap;
		overflow: hidden;
	}
	.logo-main {
		font-size: 17px;
		font-weight: 800;
		color: #1a0e13;
	}
	.logo-sub {
		font-size: 9.5px;
		color: #9b1c48;
		font-weight: 600;
		letter-spacing: 1.8px;
		text-transform: uppercase;
	}

	.mobile-close-btn {
		display: none;
		position: absolute;
		right: 0;
		background: transparent;
		border: none;
		color: #6b7280;
		cursor: pointer;
	}

	.nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		border-radius: 12px;
		color: #6b7280;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.nav-item:hover {
		background: #fdf2f6;
		color: #9b1c48;
	}
	.nav-item.active {
		background: linear-gradient(135deg, #9b1c48, #c43c66);
		color: white;
	}
	.nav-icon {
		width: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.nav-label {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sidebar-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 20px;
		border-top: 1px solid #f5f5f5;
		margin-top: auto;
	}

	.user-card {
		display: flex;
		align-items: center;
		gap: 12px;
		overflow: hidden;
	}
	.avatar,
	.avatar-placeholder {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.avatar-placeholder {
		background: #f0fdf4;
		color: #166534;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
	}
	.user-info {
		display: flex;
		flex-direction: column;
		white-space: nowrap;
	}
	.user-name {
		font-size: 14px;
		font-weight: 600;
		color: #1a0e13;
	}
	.user-role {
		font-size: 11px;
		color: #6b7280;
		text-transform: capitalize;
	}

	.logout-btn {
		color: #9ca3af;
		padding: 8px;
		border-radius: 8px;
		transition: 0.2s;
		flex-shrink: 0;
	}
	.logout-btn:hover {
		background: #fee2e2;
		color: #ef4444;
	}

	.collapse-btn {
		position: absolute;
		bottom: 28px;
		right: -14px;
		background: white;
		border: 1px solid #e5e7eb;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		z-index: 51;
		cursor: pointer;
		color: #6b7280;
	}

	.sidebar.collapsed .logo-text,
	.sidebar.collapsed .nav-label,
	.sidebar.collapsed .user-info {
		display: none;
	}
	.sidebar.collapsed .nav-arrow {
		display: none;
	}

	/* Mobile Styles */
	@media (max-width: 1024px) {
		.sidebar {
			transform: translateX(-100%);
			width: 260px;
		}
		.sidebar.mobile-open {
			transform: translateX(0);
		}
		.collapse-btn {
			display: none;
		} /* Mobileda collapse tugmasi kerak emas */
		.mobile-close-btn {
			display: block;
		}
	}
</style>
