<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { X } from 'lucide-svelte';
    import ModuleForm from '@/lib/components/ui/admin/forms/ModuleForm.svelte';

    let { isOpen = $bindable(false), moduleTarget = null, coursePk = null } = $props();
    let isSubmitting = $state(false);

    function closeModal() {
        isOpen = false;
    }

    function handleSubmit() {
        isSubmitting = true;
        return async ({ update }) => {
            isSubmitting = false;
            closeModal();
            await update();
        };
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" transition:fade={{ duration: 200 }} onclick={closeModal}>
        <div class="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" transition:scale={{ start: 0.95, duration: 200 }} onclick={(e) => e.stopPropagation()}>
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6 shrink-0">
                <h3 class="text-xl font-bold text-slate-800">Modulni tahrirlash</h3>
                <button onclick={closeModal} class="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <!-- Body -->
            <div class="p-5 sm:p-6 overflow-y-auto">
                <ModuleForm 
                    action="?/editModule"
                    {moduleTarget}
                    {coursePk}
                    bind:isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    </div>
{/if}
