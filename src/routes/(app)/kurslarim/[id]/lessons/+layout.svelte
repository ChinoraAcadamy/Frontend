<script lang="ts">
    import { page } from '$app/stores';
    import { resolve } from '$app/paths';
    import { Lock, CheckCircle2, List, ChevronDown, PlayCircle } from 'lucide-svelte';
    import * as m from '$lib/paraglide/messages.js';
    import { getLocale } from '@/lib/paraglide/runtime';

    let { data, children } = $props();

    let showMobileSidebar = $state(false);
</script>

<div class="mx-auto max-w-7xl px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
    <div class="mb-4 h-2"></div>

    <!-- Mobile Sidebar Toggle -->
    <div class="mb-4 block lg:hidden">
        <button
            onclick={() => (showMobileSidebar = !showMobileSidebar)}
            class="border-main bg-card text-main flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-bold shadow-sm transition-colors hover:bg-muted/5"
        >
            <div class="flex items-center gap-2.5">
                <div class="flex items-center justify-center rounded-lg bg-primary/10 p-1.5 text-primary">
                    <List size={18} />
                </div>
                <span>{m.lesson_module_lessons ? m.lesson_module_lessons() : 'Modul darslari'}</span>
            </div>
            <ChevronDown
                size={18}
                class="text-muted transition-transform duration-200 {showMobileSidebar ? 'rotate-180' : ''}"
            />
        </button>
    </div>

    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr]">
        <!-- Left Sidebar: Lessons List -->
        <div class="flex flex-col gap-4 lg:sticky lg:top-6 {showMobileSidebar ? '' : 'mobile-drawer-hide'}">
            {#await data.lazy.moduleData}
                <div class="border-main bg-card flex h-64 flex-col items-center justify-center rounded-3xl border shadow-sm">
                    <div class="h-8 w-8 animate-spin rounded-full border-2 border-muted/20 border-t-primary"></div>
                </div>
            {:then module}
                {#if module}
                    <div class="border-main bg-card flex max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-3xl border shadow-sm">
                        <!-- Sidebar Header -->
                        <div class="border-main border-b bg-muted/5 p-5">
                            <h3 class="line-clamp-2 text-base font-black text-foreground">{module.title}</h3>

                            {#if $page.data.user?.role !== 'admin' && $page.data.user?.role !== 'superadmin'}
                                <div class="mt-3 flex flex-col gap-1.5">
                                    <div class="flex items-center justify-between text-[11px] font-bold text-muted">
                                        <span class="tracking-wider uppercase">{m.progress ? m.progress() : 'Progress'}</span>
                                        <span class="text-primary">{Math.round((module.lessons.filter(l => l.is_completed).length / module.lessons.length) * 100) || 0}%</span>
                                    </div>
                                    <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted/20">
                                        <div class="h-full bg-primary transition-all duration-500" style="width: {(module.lessons.filter(l => l.is_completed).length / module.lessons.length) * 100}%"></div>
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <!-- Sidebar List -->
                        <div class="scrollbar-hide flex-1 overflow-y-auto p-3">
                            <div class="flex flex-col gap-1.5">
                                {#each module.lessons as l (l.id)}
                                    {@const isAdmin = $page.data.user?.role === 'admin' || $page.data.user?.role === 'superadmin'}
                                    {#if l.can_access === false && !isAdmin}
                                        <div class="border-main/50 flex cursor-not-allowed items-center justify-between gap-3 rounded-2xl border bg-muted/5 p-3 opacity-60">
                                            <div class="flex min-w-0 items-start gap-3">
                                                <div class="mt-0.5 shrink-0"><Lock size={18} class="text-muted" /></div>
                                                <div class="flex min-w-0 flex-col">
                                                    <span class="line-clamp-2 text-sm font-bold text-muted">{l.title}</span>
                                                    <span class="mt-0.5 text-xs font-semibold text-muted">{l.duration || 0} {m.assignment_type_text ? (getLocale() === 'uz' ? 'daqiqa' : 'минут') : 'min'}</span>
                                                </div>
                                            </div>
                                            <div class="shrink-0 pl-2"><div class="h-2 w-2 rounded-full bg-muted/20"></div></div>
                                        </div>
                                    {:else}
                                        <a
                                            href={resolve(isAdmin ? `/admin/courses/${$page.params.course_id}/lesson/${l.id}?module_id=${module.id}` : `/kurslarim/${$page.params.id}/lessons/${l.id}?module_id=${module.id}`)}
                                            class="group flex items-center justify-between gap-3 rounded-2xl p-3 transition-colors {l.id.toString() === $page.params.lesson_id ? 'bg-primary/10 shadow-sm ring-1 shadow-primary/20 ring-primary/20' : 'hover:bg-muted/5'}"
                                        >
                                            <div class="flex min-w-0 items-start gap-3">
                                                <div class="mt-0.5 shrink-0">
                                                    {#if l.id.toString() === $page.params.lesson_id}
                                                        <PlayCircle size={18} class="fill-primary text-primary/10" />
                                                    {:else}
                                                        <PlayCircle size={18} class="text-muted/40 transition-colors group-hover:text-muted" />
                                                    {/if}
                                                </div>
                                                <div class="flex min-w-0 flex-col">
                                                    <span class="line-clamp-2 text-sm font-bold {l.id.toString() === $page.params.lesson_id ? 'text-primary' : 'text-muted'}">{l.title}</span>
                                                    <span class="mt-0.5 text-xs font-semibold text-muted">{l.duration || 0} {m.assignment_type_text ? (getLocale() === 'uz' ? 'daqiqa' : 'минут') : 'min'}</span>
                                                </div>
                                            </div>
                                            <div class="shrink-0 pl-2">
                                                {#if l.is_completed}
                                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-success/10"><CheckCircle2 size={12} class="text-success" /></div>
                                                {:else if l.id.toString() === $page.params.lesson_id}
                                                    <div class="h-2 w-2 rounded-full bg-warning shadow-sm shadow-warning/50"></div>
                                                {:else if isAdmin}
                                                    <div class="h-2 w-2 rounded-full bg-muted/20 transition-colors group-hover:bg-muted/30"></div>
                                                {:else}
                                                    <div class="h-2 w-2 rounded-full bg-muted/20 transition-colors group-hover:bg-muted/30"></div>
                                                {/if}
                                            </div>
                                        </a>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                {/if}
            {/await}
        </div>

        <!-- Right Col/Main Content: Rendered via slot/children -->
        <div class="flex min-w-0 flex-col gap-6">
            {@render children()}
        </div>
    </div>
</div>

<style>
    @media (max-width: 1023px) {
        .mobile-drawer-hide {
            display: none;
        }
    }
</style>
