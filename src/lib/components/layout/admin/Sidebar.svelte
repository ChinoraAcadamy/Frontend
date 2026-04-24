<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { LogOut, X, PanelLeftClose, PanelLeftOpen, Loader2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		user,
		navItems = [],
		collapsed = $bindable(false),
		mobileOpen = $bindable(false)
	} = $props();

	let loading = $state(false);
	let currentPath = $derived($page.url.pathname);

	function isActive(item) {
		if (!item.href) return false;
		if (item.exact) return currentPath === item.href;
		return currentPath.startsWith(item.href);
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (mobileOpen = false)} />

<!-- Mobile backdrop -->
{#if mobileOpen}
	<div class="mob-backdrop" onclick={() => (mobileOpen = false)} aria-hidden="true"></div>
{/if}

<aside class="sidebar {collapsed ? 'sidebar--collapsed' : ''} {mobileOpen ? 'sidebar--open' : ''}">
	<!-- ── Logo ──────────────────────────────────── -->
	<div class="logo-wrap">
		<a href={resolve('/')} class="logo-link">
			<div class="logo-block">
				<img src="/logo/chinora-secondary.png" alt="Chinora" class="logo-img" />
				{#if !collapsed}
					<span class="logo-text">CHINORA</span>
				{/if}
			</div>
		</a>

		<button class="close-btn" onclick={() => (mobileOpen = false)} aria-label="Yopish">
			<X size={16} />
		</button>
	</div>

	<!-- ── Nav ───────────────────────────────────── -->
	<nav class="nav-scroll">
		{#each navItems as item (item.href || item.label)}
			{#if item.divider}
				<div class="nav-divider">
					{#if !collapsed}
						<span class="nav-divider-label">{item.label}</span>
					{:else}
						<span class="nav-divider-line"></span>
					{/if}
				</div>
			{:else}
				{@const active = isActive(item)}
				{@const Icon = item.icon}
				<a
					href={resolve(item.href)}
					class="nav-item {active ? 'nav-item--active' : ''} {collapsed
						? 'nav-item--collapsed'
						: ''}"
					onclick={() => (mobileOpen = false)}
				>
					<span class="nav-icon-wrap">
						<Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
					</span>

					{#if !collapsed}
						<span class="nav-label">{item.label}</span>
						{#if active}
							<span class="nav-pip"></span>
						{/if}
					{/if}

					{#if collapsed}
						<span class="nav-tooltip">{item.label}</span>
					{/if}
				</a>
			{/if}
		{/each}
	</nav>

	<!-- ── Footer ────────────────────────────────── -->
	<div class="sidebar-footer">
		<!-- Collapse button -->
		<button
			class="collapse-btn {collapsed ? 'collapse-btn--collapsed' : ''}"
			onclick={() => (collapsed = !collapsed)}
			aria-label={collapsed ? 'Kengaytirish' : "Yig'ish"}
		>
			{#if collapsed}
				<PanelLeftOpen size={17} />
			{:else}
				<PanelLeftClose size={17} />
				<span class="collapse-label">{m.sidebar_collapse?.() || "Yig'ish"}</span>
			{/if}
		</button>

		<!-- User card -->
		<div class="user-card {collapsed ? 'user-card--collapsed' : ''}">
			<!-- Avatar -->
			<div class="user-avatar-wrap">
				{#if user?.picture}
					<img src={user.picture} alt="Avatar" class="user-avatar-img" />
				{:else}
					<div class="user-avatar-fallback">
						{user?.username?.[0]?.toUpperCase() || 'U'}
					</div>
				{/if}
				<span class="user-status-dot"></span>
			</div>

			{#if !collapsed}
				<div class="user-info">
					<p class="user-name">{user?.first_name || user?.username || 'Foydalanuvchi'}</p>
					<p class="user-role">{user?.role || 'Admin'}</p>
				</div>
			{/if}

			<form
				method="POST"
				action="/logout"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => await update();
				}}
			>
				<button type="submit" class="logout-btn" title="Chiqish" disabled={loading}>
					{#if loading}
						<Loader2 size={15} class="spin" />
					{:else}
						<LogOut size={15} />
					{/if}
				</button>
			</form>
		</div>
	</div>
</aside>

<style>
	/* ── Backdrop ──────────────────────────────────────── */
	.mob-backdrop {
		position: fixed;
		inset: 0;
		z-index: 800;
		background: rgba(10, 8, 6, 0.45);
		backdrop-filter: blur(3px);
	}

	/* ── Sidebar shell ─────────────────────────────────── */
	.sidebar {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		width: 272px;
		background: var(--bg-sidebar);
		border-right: 1px solid var(--border-main);
		transition:
			width 280ms cubic-bezier(0.4, 0, 0.2, 1),
			transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
			background-color 0.3s ease;
		will-change: width, transform;
		overflow: hidden;
	}

	.sidebar--collapsed {
		width: 76px;
	}

	/* Mobile: off-canvas by default */
	@media (max-width: 1023px) {
		.sidebar {
			transform: translateX(-100%);
			width: 272px !important;
		}
		.sidebar--open {
			transform: translateX(0);
		}
	}

	/* ── Logo area ─────────────────────────────────────── */
	.logo-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.8rem 1rem 0.875rem;
		border-bottom: 1px solid var(--border-light);
		flex-shrink: 0;
	}

	.logo-link {
		flex: 1;
		min-width: 0;
		text-decoration: none;
	}

	.logo-block {
		display: flex;
		align-items: center;
		gap: 10px;
		overflow: hidden;
	}

	.logo-img {
		width: 36px;
		height: 36px;
		object-fit: contain;
		border-radius: 10px;
		background: #9b1c49;
		padding: 4px;
		flex-shrink: 0;
		transition: transform 0.25s ease;
	}

	.logo-link:hover .logo-img {
		transform: rotate(-4deg) scale(1.05);
	}

	.logo-text {
		font-size: 15px;
		font-weight: 800;
		letter-spacing: 0.12em;
		color: var(--text-main);
		white-space: nowrap;
		overflow: hidden;
		opacity: 1;
		transition: opacity 200ms ease;
	}

	.sidebar--collapsed .logo-text {
		opacity: 0;
		pointer-events: none;
	}

	.close-btn {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		border: none;
		background: var(--bg-input);
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	@media (min-width: 1024px) {
		.close-btn {
			display: none;
		}
	}

	/* ── Nav ───────────────────────────────────────────── */
	.nav-scroll {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0.75rem 0.625rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
		scrollbar-width: none;
	}

	.nav-scroll::-webkit-scrollbar {
		display: none;
	}

	/* Divider */
	.nav-divider {
		padding: 0.75rem 0.625rem 0.25rem;
		display: flex;
		align-items: center;
	}

	.nav-divider-label {
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		opacity: 0.7;
	}

	.nav-divider-line {
		display: block;
		width: 100%;
		height: 1px;
		background: var(--border-light);
	}

	/* Nav item */
	.nav-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 0 12px;
		height: 44px;
		border-radius: 12px;
		text-decoration: none;
		color: var(--text-muted);
		transition:
			background 0.15s,
			color 0.15s;
		overflow: hidden;
		white-space: nowrap;
	}

	.nav-item:hover {
		background: var(--border-light);
		color: var(--primary);
	}

	.nav-item--active {
		background: #9b1c48;
		color: #fff;
	}

	.nav-item--active:hover {
		background: #a81f4e;
		color: #fff;
	}

	/* Collapsed: center icon */
	.nav-item--collapsed {
		justify-content: center;
		padding: 0;
		width: 44px;
		margin: 0 auto;
	}

	.nav-icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
	}

	.nav-label {
		flex: 1;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.01em;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav-pip {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.5);
		flex-shrink: 0;
	}

	/* Tooltip for collapsed */
	.nav-tooltip {
		position: absolute;
		left: calc(100% + 12px);
		top: 50%;
		transform: translateY(-50%);
		background: var(--bg-sidebar);
		border: 1px solid var(--border-main);
		color: var(--text-main);
		font-size: 12px;
		font-weight: 600;
		padding: 5px 10px;
		border-radius: 8px;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.15s;
		box-shadow: var(--shadow-main);
		z-index: 100;
	}

	.nav-item--collapsed:hover .nav-tooltip {
		opacity: 1;
	}

	/* ── Footer ────────────────────────────────────────── */
	.sidebar-footer {
		flex-shrink: 0;
		padding: 0.5rem 0.625rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 10px;
		border-top: 1px solid var(--border-light);
	}

	/* Collapse toggle */
	.collapse-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		height: 38px;
		padding: 0 12px;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.2s;
		flex: 1;
		text-align: left;
	}

	.collapse-btn:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.collapse-btn--collapsed {
		width: 55px;
		margin: 0 auto;
		padding: 0;
	}

	.collapse-label {
		font-size: 13px;
		font-weight: 500;
		flex: 1;
		color: inherit;
	}

	/* User card */
	.user-card {
		display: flex;
		align-items: center;
		gap: 10px;
		background: var(--bg-input);
		border: 1px solid var(--border-light);
		border-radius: 16px;
		padding: 8px 10px;
		transition: background 0.15s;
	}

	.user-card:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.user-card--collapsed {
		flex-direction: column;
		padding: 10px 6px;
		gap: 8px;
		align-items: center;
	}

	/* Avatar */
	.user-avatar-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.user-avatar-img,
	.user-avatar-fallback {
		width: 38px;
		height: 38px;
		border-radius: 12px;
		display: block;
	}

	.user-avatar-img {
		object-fit: cover;
	}

	.user-avatar-fallback {
		background: linear-gradient(135deg, rgba(155, 28, 72, 0.5), rgba(155, 28, 72, 0.2));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		font-weight: 800;
		color: #e8aabb;
		border: 1px solid rgba(155, 28, 72, 0.3);
	}

	.user-status-dot {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #22c55e;
		border: 2px solid var(--bg-sidebar);
	}

	/* User info */
	.user-info {
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}

	.user-name {
		font-size: 13.5px;
		font-weight: 700;
		color: var(--text-main);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.user-role {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #e8637a;
		margin: 2px 0 0;
	}

	/* Logout */
	.logout-btn {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		border: 1px solid var(--border-main);
		background: var(--bg-card);
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		flex-shrink: 0;
		transition: all 0.2s;
	}

	.logout-btn:hover:not(:disabled) {
		background: rgba(155, 28, 72, 0.2);
		border-color: rgba(155, 28, 72, 0.4);
		color: #e8637a;
	}

	.logout-btn:disabled {
		cursor: not-allowed;
		color: #e8637a;
	}

	:global(.spin) {
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
