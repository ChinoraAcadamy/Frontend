<script lang="ts">
    import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
    import { page } from '$app/stores';
    import {
        LayoutDashboard, Users, BookOpen, FileText,
        Settings, LogOut, ChevronRight, X,
        Calendar, GraduationCap, User
    } from 'lucide-svelte';

    let { user, collapsed = $bindable(false), mobileOpen = $bindable(false) } = $props();
	
	// console.log(user)
    let loading = $state(false);
    let currentPath = $derived($page.url.pathname);
    let isAdmin = $derived(user?.role === 'admin' || user?.role === 'superadmin');

    const adminNavItems = [
        { href: '/dashboard/admin',		  label: 'Dashboard',  icon: LayoutDashboard },
        { href: '/dashboard/students',    label: 'Talabalar',  icon: Users           },
        { href: '/dashboard/courses',     label: 'Kurslar',    icon: BookOpen        },
        { href: '/dashboard/submissions', label: 'Arizalar',   icon: FileText        },
        { href: '/dashboard/settings',    label: 'Sozlamalar', icon: Settings        },
    ];

    const studentNavItems = [
        { href: '/dashboard',            label: 'Dashboard',        icon: LayoutDashboard },
        { href: '/dashboard/my-courses', label: 'Mening kurslarim', icon: BookOpen        },
        { href: '/dashboard/calendar',   label: 'Taqvim',           icon: Calendar        },
        { href: '/dashboard/grades',     label: 'Baholar',          icon: GraduationCap   },
        { href: '/dashboard/profile',    label: 'Profil',           icon: User            },
    ];

    let navItems = $derived(isAdmin ? adminNavItems : studentNavItems);

    // Exact match kerak bo'lgan root routelar — boshqalar startsWith bilan tekshiriladi
    const exactRoutes = new Set(['/dashboard', '/dashboard/admin']);

    function isActive(href) {
        if (exactRoutes.has(href)) return currentPath === href;
        return currentPath.startsWith(href);
    }
</script>

{#if mobileOpen}
    <div
        class="mobile-overlay"
        role="button"
        tabindex="-1"
        aria-label="Menyuni yopish"
        onclick={() => (mobileOpen = false)}
        onkeydown={(e) => e.key === 'Escape' && (mobileOpen = false)}
    ></div>
{/if}

<aside class="sidebar" class:collapsed class:mobile-open={mobileOpen}>

    <!-- Logo -->
    <div class="logo">
        <div class="logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C16 4 8 8 8 16C8 20.418 11.582 24 16 24C20.418 24 24 20.418 24 16C24 11.582 20.418 8 16 8"
                    stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="16" cy="16" r="3" fill="white"/>
            </svg>
        </div>

        {#if !collapsed}
            <div class="logo-text">
                <span class="logo-main">Chinora</span>
                <span class="logo-sub">Academy</span>
            </div>
        {/if}

        <button class="mobile-close-btn" aria-label="Yopish" onclick={() => (mobileOpen = false)}>
            <X size={20} />
        </button>
    </div>

    <!-- Navigation -->
    <nav class="nav" aria-label="Asosiy menyu">
        {#each navItems as item (item.href)}
            {@const active = isActive(item.href)}
            <a
                href={resolve(item.href)}
                class="nav-item"
                class:active
                aria-current={active ? 'page' : undefined}
                onclick={() => (mobileOpen = false)}
            >
                <span class="nav-icon">
                    <!-- svelte-ignore svelte_component_deprecated -->
                    <svelte:component this={item.icon} size={20} strokeWidth={active ? 2.5 : 1.8} />
                </span>
                {#if !collapsed}
                    <span class="nav-label">{item.label}</span>
                    {#if active}
                        <ChevronRight size={14} class="nav-arrow" />
                    {/if}
                {/if}
            </a>
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
                        {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Foydalanuvchi'}
                    </span>
                    <span class="user-role">{user?.role ?? 'student'}</span>
                </div>
            {/if}
        </div>

        <form
            method="POST"
            action="/logout"
            use:enhance={() => {
                loading = true;
                return async ({ update }) => { loading = false; await update(); };
            }}
        >
            <button
                type="submit"
                disabled={loading}
                class="logout-btn"
                title="Chiqish"
                aria-label="Tizimdan chiqish"
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
        aria-label={collapsed ? 'Kengaytirish' : "Yig'ish"}
    >
        <span class:rotate-180={!collapsed}>
            <ChevronRight size={16} />
        </span>
    </button>
</aside>

<style>
    .sidebar {
        position: fixed;
        top: 0; left: 0; bottom: 0;
        width: 240px;
        background: #ffffff;
        border-right: 1px solid #f0f0f0;
        display: flex;
        flex-direction: column;
        padding: 20px 14px;
        z-index: 50;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    }
    .sidebar.collapsed { width: 68px; }

    .logo {
        display: flex; align-items: center; gap: 10px;
        padding-bottom: 18px;
        border-bottom: 1px solid #f5f5f5;
        margin-bottom: 14px;
        position: relative; flex-shrink: 0;
    }
    .logo-icon {
        width: 34px; height: 34px;
        background: linear-gradient(135deg, #9b1c48, #c43c66);
        border-radius: 9px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
    }
    .logo-icon svg { width: 18px; height: 18px; }
    .logo-text { display: flex; flex-direction: column; overflow: hidden; white-space: nowrap; min-width: 0; }
    .logo-main  { font-size: 16px; font-weight: 800; color: #1a0e13; line-height: 1.2; }
    .logo-sub   { font-size: 9px; color: #9b1c48; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }

    .mobile-close-btn {
        display: none;
        position: absolute; right: 0;
        background: none; border: none;
        color: #9ca3af; cursor: pointer;
        padding: 4px; border-radius: 6px;
        transition: color 0.15s;
    }
    .mobile-close-btn:hover { color: #1a0e13; }

    .nav {
        flex: 1;
        display: flex; flex-direction: column; gap: 2px;
        overflow-y: auto; overflow-x: hidden;
        scrollbar-width: none;
    }
    .nav::-webkit-scrollbar { display: none; }

    .nav-item {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        color: #6b7280;
        text-decoration: none;
        font-size: 14px; font-weight: 500;
        transition: background 0.15s, color 0.15s;
        white-space: nowrap; overflow: hidden;
    }
    .nav-item:hover  { background: #fdf2f6; color: #9b1c48; }
    .nav-item.active {
        background: linear-gradient(135deg, #9b1c48, #c43c66);
        color: white;
        box-shadow: 0 3px 10px rgba(155, 28, 72, 0.25);
    }

    .nav-icon {
        width: 22px; height: 22px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
    }
    .nav-label { flex: 1; overflow: hidden; text-overflow: ellipsis; }
    :global(.nav-arrow) { opacity: 0.7; flex-shrink: 0; }

    .sidebar-bottom {
        display: flex; align-items: center;
        justify-content: space-between; gap: 8px;
        padding-top: 16px;
        border-top: 1px solid #f5f5f5;
        margin-top: 8px; flex-shrink: 0;
    }

    .user-card {
        display: flex; align-items: center;
        gap: 10px; overflow: hidden; flex: 1; min-width: 0;
    }
    .user-card.centered { justify-content: center; }

    .avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
    .avatar-placeholder {
        width: 34px; height: 34px;
        border-radius: 50%; flex-shrink: 0;
        background: linear-gradient(135deg, #fce7f0, #f9a8c9);
        color: #9b1c48;
        font-size: 13px; font-weight: 700;
        display: flex; align-items: center; justify-content: center;
    }

    .user-info { display: flex; flex-direction: column; min-width: 0; }
    .user-name {
        font-size: 13px; font-weight: 600; color: #1a0e13;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .user-role { font-size: 11px; color: #9b1c48; text-transform: capitalize; font-weight: 500; }

    .logout-btn {
        width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 8px; border: none; background: none;
        color: #9ca3af; cursor: pointer;
        transition: background 0.15s, color 0.15s;
        flex-shrink: 0;
    }
    .logout-btn:hover    { background: #fee2e2; color: #ef4444; }
    .logout-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner {
        display: inline-block;
        width: 14px; height: 14px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .collapse-btn {
        position: absolute; bottom: 24px; right: -13px;
        width: 26px; height: 26px;
        background: white; border: 1px solid #e5e7eb;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        cursor: pointer; color: #6b7280; z-index: 51;
        transition: color 0.15s, box-shadow 0.15s;
    }
    .collapse-btn:hover { color: #9b1c48; box-shadow: 0 4px 12px rgba(155,28,72,0.2); }

    :global(.collapse-btn span.rotate-180) { transform: rotate(180deg); transition: transform 0.3s; }

    /* Collapsed — matn va belgilarni yashirish */
    .sidebar.collapsed .logo-text,
    .sidebar.collapsed .nav-label,
    .sidebar.collapsed .user-info { display: none; }
    :global(.sidebar.collapsed .nav-arrow) { display: none; }

    /* Mobile */
    @media (max-width: 1024px) {
        .sidebar { transform: translateX(-100%); width: 260px !important; }
        .sidebar.mobile-open { transform: translateX(0); }
        .collapse-btn { display: none; }
        .mobile-close-btn { display: flex; }
    }

    .mobile-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.45);
        backdrop-filter: blur(3px);
        z-index: 49;
        animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>