<script lang="ts">
    import { X } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';
    import { enhance } from '$app/forms';

    let { isOpen = false, student = null, onClose } = $props();

    let isSubmitting = $state(false);

    // Form qiymatlarini mahalliy holatda ($state) saqlaymiz.
    // $derived ishlatsak, inputda yozganda muammo bo'lishi mumkin edi.
    let firstName   = $state('');
    let lastName    = $state('');
    let phoneNumber = $state('');
    let isActive    = $state(true);

    // Qachonki modal ochilsa va student props kelsa, qiymatlarni to'ldiramiz.
    $effect(() => {
        if (isOpen && student) {
            firstName   = student.first_name ?? '';
            lastName    = student.last_name ?? '';
            phoneNumber = student.phone_number ?? student.phone ?? '';
            isActive    = student.is_active ?? true;
        }
    });
</script>

{#if isOpen && student}
    <div
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
        role="dialog"
        aria-modal="true"
    >
        <div
            class="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden"
            transition:fly={{ y: 20, duration: 300, opacity: 0 }}
        >
            <div class="flex items-center justify-between p-6 bg-slate-50/50 border-b border-slate-100">
                <div>
                    <h2 class="text-xl font-bold text-slate-800">Ma'lumotlarni yangilash</h2>
                    <p class="text-sm font-medium text-slate-500 mt-1">@{student.username}</p>
                </div>
                <button
                    onclick={onClose}
                    class="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-slate-400 hover:text-slate-600 transition-all shadow-sm active:scale-90"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>
            </div>

            <form
                method="POST"
                action="?/updateStudent"
                use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        isSubmitting = false;
                        await update();
                    };
                }}
                class="p-6 space-y-5"
            >
                <input type="hidden" name="studentId" value={student.id} />
                
                <input type="hidden" name="isActive" value={isActive.toString()} />

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Ism</label>
                        <input
                            name="firstName"
                            type="text"
                            bind:value={firstName}
                            placeholder="Ism kiriting"
                            class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/10 transition-all text-sm font-medium text-slate-800"
                        />
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Familiya</label>
                        <input
                            name="lastName"
                            type="text"
                            bind:value={lastName}
                            placeholder="Familiya"
                            class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/10 transition-all text-sm font-medium text-slate-800"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Telefon raqam</label>
                    <input
                        name="phoneNumber"
                        type="text"
                        bind:value={phoneNumber}
                        placeholder="+998901234567"
                        class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/10 transition-all text-sm font-medium text-slate-800"
                    />
                </div>

                <div class="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onclick={onClose}
                        class="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        class="flex-1 py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-[#ed4b72] transition-all disabled:opacity-60 shadow-lg shadow-slate-900/20 hover:shadow-[#ed4b72]/30 active:scale-95"
                    >
                        {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}