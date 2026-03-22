<script lang="ts">
    import { Search, Bell, Menu } from 'lucide-svelte';

    // mobileOpen $bindable qilinadi, Navbar'dan turib ota state'ni o'zgartirish uchun
    let { user = null, notificationCount = 0, mobileOpen = $bindable(false) } = $props();

    let searchQuery = $state('');
</script>

<header class="dash-navbar">
    <div class="navbar-left">
        <button class="mobile-menu-btn" on:click={() => mobileOpen = true} aria-label="Menyuni ochish">
            <Menu size={24} />
        </button>

        <div class="search-wrapper hidden-on-mobile">
            <Search size={16} class="search-icon" />
            <input
                type="text"
                placeholder="Qidirish..."
                bind:value={searchQuery}
                class="search-input"
            />
        </div>
    </div>

    <div class="navbar-right">
        <button class="notif-btn mobile-search-btn" aria-label="Qidirish">
            <Search size={18} />
        </button>

        <button class="notif-btn" aria-label="Bildirishnomalar">
            <Bell size={18} />
            {#if notificationCount > 0}
                <span class="notif-badge">{notificationCount}</span>
            {/if}
        </button>

        {#if user?.picture}
            <img src={user.picture} alt="avatar" class="nav-avatar" />
        {:else}
            <div class="nav-avatar-placeholder">
                {(user?.first_name?.[0] || user?.username?.[0] || 'A').toUpperCase()}
            </div>
        {/if}
    </div>
</header>

<style>
    .dash-navbar {
        height: 64px;
        background: #ffffff;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 28px;
        position: sticky;
        top: 0;
        z-index: 30;
    }

    .navbar-left {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .mobile-menu-btn {
        display: none; /* Desktopda ko'rinmaydi */
        background: transparent;
        border: none;
        color: #1a0e13;
        cursor: pointer;
        padding: 4px;
    }

    .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    :global(.search-icon) {
        position: absolute;
        left: 14px;
        color: #9ca3af;
        pointer-events: none;
    }

    .search-input {
        width: 280px;
        padding: 9px 16px 9px 40px;
        background: #f9fafb;
        border: 1px solid #f0f0f0;
        border-radius: 12px;
        font-size: 14px;
        color: #1a0e13;
        outline: none;
        transition: all 0.15s;
    }

    .search-input:focus {
        border-color: #C43C66;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(196, 60, 102, 0.08);
    }

    .navbar-right {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notif-btn {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: #f9fafb;
        border: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.15s;
    }

    .notif-btn:hover { background: #fdf2f6; color: #9B1C48; border-color: #f5c0cf; }
    .mobile-search-btn { display: none; }

    .notif-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #9B1C48;
        color: white;
        font-size: 10px;
        font-weight: 700;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
    }

    .nav-avatar, .nav-avatar-placeholder {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid #f0f0f0;
    }

    .nav-avatar-placeholder {
        background: linear-gradient(135deg, #C7A27C, #9B1C48);
        color: white;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Mobile moslashuvchanlik */
    @media (max-width: 1024px) {
        .dash-navbar { padding: 0 16px; }
        .mobile-menu-btn { display: block; }
        .hidden-on-mobile { display: none; }
        .mobile-search-btn { display: flex; }
    }
</style>