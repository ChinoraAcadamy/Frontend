<script>
    import { fade, fly } from 'svelte/transition';
    import { X, Star, MessageSquare, Send, AlertCircle } from 'lucide-svelte';
    import { enhance } from '$app/forms';

    let { 
        isOpen = false, 
        submission = null, 
        onClose = () => {}, 
        formAction = '?/gradeSubmission',
        loading = false,
        enhanceAction = null
    } = $props();

    let score = $state(0);
    let feedback = $state('');
    let error = $state('');

    // Update internal state when submission changes
    $effect(() => {
        if (submission) {
            score = submission.score ?? 0;
            feedback = submission.feedback ?? '';
        }
    });

    function handleClose() {
        if (!loading) {
            onClose();
            error = '';
        }
    }

    function validateScore(val) {
        if (val < 0) score = 0;
        if (val > 10) score = 10;
    }
</script>

{#if isOpen}
    <!-- Background Overlay -->
    <div 
        class="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 md:p-6"
        transition:fade={{ duration: 300 }}
        onclick={handleClose}
        onkeydown={(e) => e.key === 'Escape' && handleClose()}
        role="presentation"
        aria-hidden="true"
    >
        <!-- Modal Content -->
        <div 
            class="bg-white w-full max-w-[500px] rounded-[32px] md:rounded-[24px] shadow-2xl overflow-hidden relative flex flex-col outline-none"
            transition:fly={{ y: 100, duration: 400, opacity: 1 }}
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            aria-labelledby="modal-title"
        >
            <!-- Decorative Header Gradient -->
            <div class="h-2 bg-linear-to-r from-[#9b1c48] via-[#c43c66] to-[#9b1c48] opacity-80"></div>

            <div class="p-8 max-md:p-6">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 id="modal-title" class="text-2xl font-extrabold text-[#1a0e13] tracking-tight mb-1">
                            Baholash
                        </h2>
                        <p class="text-sm text-slate-500 font-medium">
                            {submission?.student?.first_name} {submission?.student?.last_name} topshirig'i
                        </p>
                    </div>
                    <button 
                        class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
                        onclick={handleClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form 
                    method="POST" 
                    action={formAction}
                    use:enhance={enhanceAction}
                    class="space-y-6"
                >
                    <input type="hidden" name="id" value={submission?.id} />

                    <!-- Score Input -->
                    <div class="group">
                        <label for="score" class="flex items-center gap-2 text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1">
                            <Star size={14} class="text-[#9b1c48]" />
                            Baho (0-10)
                        </label>
                        <div class="relative">
                            <input 
                                type="number" 
                                id="score" 
                                name="score"
                                min="0" 
                                max="10" 
                                step="1"
                                bind:value={score}
                                oninput={(e) => validateScore(e.currentTarget.value)}
                                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-xl font-bold text-[#1a0e13] focus:border-[#9b1c48]/30 focus:bg-white focus:ring-4 focus:ring-[#9b1c48]/5 transition-all outline-hidden appearance-none"
                                required
                            />
                            <div class="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold pointer-events-none">
                                / 10
                            </div>
                        </div>
                    </div>

                    <!-- Feedback Input -->
                    <div>
                        <label for="feedback" class="flex items-center gap-2 text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1">
                            <MessageSquare size={14} class="text-[#9b1c48]" />
                            Izoh (ixtiyoriy)
                        </label>
                        <textarea 
                            id="feedback" 
                            name="feedback"
                            bind:value={feedback}
                            placeholder="Talaba uchun maslahat yoki xulosa yozing..."
                            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-[15px] font-medium text-slate-700 min-h-[120px] focus:border-[#9b1c48]/30 focus:bg-white focus:ring-4 focus:ring-[#9b1c48]/5 transition-all outline-hidden resize-none"
                        ></textarea>
                    </div>

                    {#if error}
                        <div class="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-semibold animate-shake" transition:fade>
                            <AlertCircle size={18} class="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    {/if}

                    <!-- Submit Button -->
                    <button 
                        type="submit"
                        disabled={loading}
                        class="w-full bg-linear-to-r from-[#9b1c48] to-[#c43c66] text-white py-4.5 rounded-2xl font-bold text-base shadow-[0_10px_25px_rgba(155,28,72,0.25)] hover:shadow-[0_15px_35px_rgba(155,28,72,0.35)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {#if loading}
                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Yuborilmoqda...</span>
                        {:else}
                            <Send size={18} />
                            <span>Baholashni tasdiqlash</span>
                        {/if}
                    </button>
                </form>
            </div>

            <!-- Bottom Note -->
            <div class="bg-slate-50 p-6 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <AlertCircle size={16} class="text-slate-400" />
                </div>
                <p class="text-[12px] text-slate-500 font-medium leading-tight">
                    Baholashdan so'ng topshiriq holati avtomatik ravishda <span class="font-bold text-[#9b1c48]">"Baholandi"</span> ga o'zgaradi.
                </p>
            </div>
        </div>
    </div>
{/if}

<style>
    :global(body.modal-open) {
        overflow: hidden;
    }

    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }
    .animate-shake {
        animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }
</style>
