<script lang="ts">
    import { enhance } from '$app/forms';
    import { X, Loader2, CheckCircle2 } from 'lucide-svelte';

    let { isOpen, studentName, onClose } = $props();

    let loading = $state(false);
    let errorMessage = $state('');
    let successMessage = $state('');

    // Modal har safar ochilganda statelarni tozalaymiz
    $effect(() => {
        if (isOpen) {
            loading = false;
            errorMessage = '';
            successMessage = '';
        }
    });

    // Form Action natijasini ushlash uchun funksiya
    const handleSubmit = () => {
        loading = true;
        errorMessage = '';
        successMessage = '';

        return async ({ result, update }) => {
            loading = false;
            if (result.type === 'failure') {
                errorMessage = result.data?.error || "Xatolik yuz berdi.";
            } else if (result.type === 'success') {
                successMessage = result.data?.message || "Muvaffaqiyatli o'zgartirildi.";
                // 1.5 soniyadan keyin modalni avtomatik yopish
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
            // Formani tozalash (faqat muvaffaqiyatli bo'lsa)
            await update({ reset: result.type === 'success' });
        };
    };
</script>

{#if isOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 class="text-lg font-bold text-slate-800">Parolni almashtirish</h3>
                <button onclick={onClose} class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
                    <X size={20} />
                </button>
            </div>

            <form method="POST" action="?/changePassword" use:enhance={handleSubmit} class="p-6 space-y-5">
                <p class="text-sm text-slate-500">
                    <span class="font-semibold text-slate-700">{studentName}</span> uchun yangi parol kiriting.
                </p>

                {#if errorMessage}
                    <div class="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                        {errorMessage}
                    </div>
                {/if}

                {#if successMessage}
                    <div class="p-3 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 size={16} /> {successMessage}
                    </div>
                {/if}

                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <label for="new_password" class="text-sm font-medium text-slate-700">Yangi parol *</label>
                        <input 
                            type="password" 
                            id="new_password" 
                            name="new_password" 
                            required 
                            minlength="8"
                            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed4b72] focus:ring-1 focus:ring-[#ed4b72] transition-all bg-slate-50 focus:bg-white"
                            placeholder="Kamida 8 ta belgi"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <label for="confirm_password" class="text-sm font-medium text-slate-700">Parolni tasdiqlash *</label>
                        <input 
                            type="password" 
                            id="confirm_password" 
                            name="confirm_password" 
                            required 
                            minlength="1"
                            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed4b72] focus:ring-1 focus:ring-[#ed4b72] transition-all bg-slate-50 focus:bg-white"
                            placeholder="Parolni qayta kiriting"
                        />
                    </div>
                </div>

                <div class="pt-4 flex justify-end gap-3">
                    <button 
                        type="button" 
                        onclick={onClose}
                        disabled={loading}
                        class="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Bekor qilish
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        class="px-5 py-2.5 text-sm font-medium text-white bg-[#ed4b72] hover:bg-[#de3c61] rounded-xl transition-colors shadow-sm shadow-rose-200 flex items-center gap-2 disabled:opacity-70"
                    >
                        {#if loading}
                            <Loader2 size={16} class="animate-spin" />
                            Saqlanmoqda...
                        {:else}
                            Saqlash
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}