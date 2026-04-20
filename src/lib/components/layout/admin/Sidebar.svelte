<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { LogOut, ChevronRight, X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	/** @type {{ user?: any, navItems?: { href?: string, label: string, icon?: any, exact?: boolean, divider?: boolean }[], collapsed?: boolean, mobileOpen?: boolean }} */

	let {
		user,
		navItems = [],
		collapsed = $bindable(false),
		mobileOpen = $bindable(false)
	} = $props();

	let loading = $state(false);
	let currentPath = $derived($page.url.pathname);

	/** @param {{ exact?: boolean, href?: string }} item */
	function isActive(item) {
		if (!item.href) return false;
		if (item.exact) return currentPath === item.href;
		return currentPath.startsWith(item.href);
	}
</script>

{#if mobileOpen}
	<div
		class="mobile-overlay"
		role="button"
		tabindex="-1"
		aria-label={m.menu_close()}
		onclick={() => (mobileOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (mobileOpen = false)}
	></div>
{/if}

<aside class="sidebar" class:collapsed class:mobile-open={mobileOpen}>
	<!-- Logo -->
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

		<button
			class="mobile-close-btn"
			aria-label={m.menu_close()}
			onclick={() => (mobileOpen = false)}
		>
			<X size={20} />
		</button>
	</div>

	<!-- Navigation -->
	<nav class="nav" aria-label={m.admin_main_menu ? m.admin_main_menu() : 'Asosiy menyu'}>
		{#each navItems as item (item.href || item.label)}
			{#if item.divider}
				{#if !collapsed}
					<div class="nav-divider">
						<span class="nav-divider-text">{item.label}</span>
					</div>
				{:else}
					<div class="nav-divider collapsed"></div>
				{/if}
			{:else}
				{@const active = isActive(item)}
				{@const Icon = item.icon}
				<a
					href={resolve(/** @type {any} */ (item.href))}
					class="nav-item"
					class:active
					aria-current={active ? 'page' : undefined}
					onclick={() => (mobileOpen = false)}
				>
					<span class="nav-icon">
						<Icon size={20} strokeWidth={active ? 2.5 : 2} />
					</span>
					{#if !collapsed}
						<span class="nav-label">{item.label}</span>
						{#if active}
							<ChevronRight size={14} class="nav-arrow" />
						{/if}
					{/if}
				</a>
			{/if}
		{/each}
	</nav>

	<!-- Bottom: user + logout -->
	<div class="sidebar-bottom">
		<div class="user-card" class:centered={collapsed}>
			{#if user?.picture}
				<img src={user.picture} alt="{user.username} avatari" class="avatar" />
			{:else}
				<div class="avatar-placeholder" aria-hidden="true">
					{(user?.first_name?.[0] || user?.username?.[0] || 'A').toUpperCase()}
				</div>
			{/if}

			{#if !collapsed}
				<div class="user-info">
					<span class="user-name">
						{[user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
							user?.username ||
							m.rank_student()}
					</span>
					<span class="user-role"
						>{user?.role === 'student' ? m.role_student() : user?.role || 'student'}</span
					>
				</div>
			{/if}
		</div>

		<form
			method="POST"
			action="/logout"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					// Serverdan redirect keladi, shuning uchun loading true qolgani yaxshi
					await update();
				};
			}}
		>
			<button
				type="submit"
				disabled={loading}
				class="logout-btn"
				title={m.menu_logout()}
				aria-label={m.menu_logout()}
			>
				{#if loading}
					<span class="spinner" aria-hidden="true"></span>
				{:else}
					<LogOut size={16} />
				{/if}
			</button>
		</form>
	</div>

	<!-- Collapse toggle (faqat desktop) -->
	<button
		class="collapse-btn"
		onclick={() => (collapsed = !collapsed)}
		aria-label={collapsed ? m.sidebar_expand() : m.sidebar_collapse()}
	>
		<span class:rotate-180={!collapsed}>
			<ChevronRight size={16} />
		</span>
	</button>
</aside>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 250px;
		background: #ffffff;
		border-right: 1px solid rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		padding: 24px 16px;
		z-index: 1000;
		transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
		box-shadow: 2px 0 16px rgba(0, 0, 0, 0.02);
	}
	.sidebar.collapsed {
		width: 76px;
		padding-left: 12px;
		padding-right: 12px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.04);
		margin-bottom: 20px;
		position: relative;
		flex-shrink: 0;
		transition: padding 0.3s ease;
	}
	.logo-icon {
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, #9b1c48, #e54b7c);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(155, 28, 72, 0.25);
	}
	.sidebar.collapsed .logo-icon {
		width: 36px;
		height: 36px;
		margin: 0 auto;
	}

	.logo-icon svg {
		width: 20px;
		height: 20px;
	}
	.logo-text {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		white-space: nowrap;
		min-width: 0;
	}
	.logo-main {
		font-family: 'Inter', sans-serif;
		font-size: 18px;
		font-weight: 800;
		color: #111827;
		line-height: 1.1;
		letter-spacing: -0.5px;
	}
	.logo-sub {
		font-family: 'Inter', sans-serif;
		font-size: 10px;
		color: #9b1c48;
		font-weight: 700;
		letter-spacing: 2.5px;
		text-transform: uppercase;
		margin-top: 2px;
	}

	.mobile-close-btn {
		display: none;
		position: absolute;
		right: 0;
		background: rgba(243, 244, 246, 0.8);
		border: none;
		color: #6b7280;
		cursor: pointer;
		padding: 6px;
		border-radius: 8px;
		transition: all 0.2s;
	}
	.mobile-close-btn:hover {
		color: #111827;
		background: #e5e7eb;
	}

	.nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6px;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: none;
	}
	.nav::-webkit-scrollbar {
		display: none;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 14px;
		border-radius: 12px;
		color: #6b7280;
		text-decoration: none;
		font-size: 14.5px;
		font-weight: 600;
		font-family: 'Inter', sans-serif;
		transition: all 0.2s ease;
		white-space: nowrap;
		overflow: hidden;
		position: relative;
	}

	.nav-divider {
		margin: 16px 0 4px 0;
		padding: 0 14px;
		display: flex;
		align-items: center;
	}
	.nav-divider-text {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: #9ca3af;
	}
	.nav-divider.collapsed {
		margin: 16px auto 8px auto;
		width: 24px;
		height: 1px;
		background: #f3f4f6;
	}

	.nav-item:hover {
		background: #fdf2f6;
		color: #9b1c48;
		transform: translateX(4px);
	}

	.nav-item.active {
		background: linear-gradient(135deg, #9b1c48, #d73a6a);
		color: white;
		box-shadow: 0 6px 14px -4px rgba(155, 28, 72, 0.4);
	}

	.nav-item.active::before {
		content: '';
		position: absolute;
		left: -16px;
		top: 15%;
		bottom: 15%;
		width: 4px;
		border-radius: 0 4px 4px 0;
		background: #e54b7c;
		display: block;
	}
	.sidebar.collapsed .nav-item.active::before {
		left: -12px;
	}

	.nav-icon {
		width: 24px;
		height: 24px;
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
	:global(.nav-arrow) {
		opacity: 0.8;
		flex-shrink: 0;
		transition: transform 0.2s;
	}
	.nav-item.active :global(.nav-arrow) {
		transform: translateX(2px);
	}

	.sidebar-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding-top: 20px;
		border-top: 1px solid rgba(0, 0, 0, 0.04);
		margin-top: 10px;
		flex-shrink: 0;
	}

	.user-card {
		display: flex;
		align-items: center;
		gap: 12px;
		overflow: hidden;
		flex: 1;
		min-width: 0;
		padding: 6px;
		border-radius: 12px;
		transition: background 0.2s;
	}
	.user-card:hover {
		background: #f9fafb;
	}
	.user-card.centered {
		justify-content: center;
		padding: 6px 0;
		background: transparent;
	}

	.avatar {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		object-fit: cover;
		flex-shrink: 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}
	.avatar-placeholder {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		flex-shrink: 0;
		background: linear-gradient(135deg, #fce7f0, #f9a8c9);
		color: #9b1c48;
		font-size: 15px;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(249, 168, 201, 0.4);
	}

	.user-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
		justify-content: center;
	}
	.user-name {
		font-size: 14px;
		font-weight: 700;
		color: #111827;
		font-family: 'Inter', sans-serif;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
	}
	.user-role {
		font-size: 11.5px;
		color: #9b1c48;
		text-transform: capitalize;
		font-weight: 600;
		margin-top: 2px;
	}

	.logout-btn {
		width: 38px;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		border: none;
		background: #fff;
		color: #9ca3af;
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}
	.logout-btn:hover {
		background: #fee2e2;
		color: #ef4444;
		border-color: rgba(239, 68, 68, 0.2);
		transform: scale(1.05);
	}
	.logout-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2.5px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.collapse-btn {
		position: absolute;
		bottom: 28px;
		right: -16px;
		width: 32px;
		height: 32px;
		background: white;
		border: 1px solid #f3f4f6;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
		cursor: pointer;
		color: #6b7280;
		z-index: 1001;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.collapse-btn:hover {
		color: #9b1c48;
		box-shadow: 0 6px 16px rgba(155, 28, 72, 0.15);
		transform: scale(1.05);
	}

	:global(.collapse-btn span.rotate-180) {
		transform: rotate(180deg);
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Collapsed state adjustments */
	.sidebar.collapsed .logo-text,
	.sidebar.collapsed .nav-label,
	.sidebar.collapsed .user-info {
		opacity: 0;
		width: 0;
		display: none;
	}
	:global(.sidebar.collapsed .nav-arrow) {
		display: none;
	}

	.sidebar.collapsed .nav-item {
		padding: 12px;
		justify-content: center;
	}
	.sidebar.collapsed .nav-item:hover {
		transform: translateY(-2px);
	}

	/* Mobile */
	@media (max-width: 1024px) {
		.sidebar {
			transform: translateX(-100%);
			width: 280px !important;
		}
		.sidebar.mobile-open {
			transform: translateX(0);
		}
		.collapse-btn {
			display: none;
		}
		.mobile-close-btn {
			display: flex;
		}
	}

	.mobile-overlay {
		position: fixed;
		inset: 0;
		background: rgba(17, 24, 39, 0.6);
		backdrop-filter: blur(4px);
		z-index: 800;
		animation: fadeIn 0.3s ease-out forwards;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			backdrop-filter: blur(0px);
		}
		to {
			opacity: 1;
			backdrop-filter: blur(4px);
		}
	}
</style>
