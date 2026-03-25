<script lang="ts">
    import Sidebar from '$lib/components/layout/admin/Sidebar.svelte';
    import DashboardNavbar from '$lib/components/layout/admin/DashboardNavbar.svelte';

    let { children } = $props();

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
</script>

<div class="admin-shell {collapsed ? 'collapsed' : ''}">
    <Sidebar bind:collapsed bind:mobileOpen />

    <div class="admin-body">
        <DashboardNavbar notificationCount={3} bind:mobileOpen />
        
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

    /* .admin-content { 
        flex: 1; 
        overflow-y: auto; 
    } */

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