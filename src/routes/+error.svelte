<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { ArrowLeft, Home, AlertTriangle, ShieldAlert, SearchX, ServerCrash } from 'lucide-svelte';

    // Xatolik turiga qarab mos ikonkalar va matnlar
    const errorConfig = {
        404: {
            icon: SearchX,
            color: "text-blue-500",
            bg: "bg-blue-50",
            title: "Sahifa topilmadi",
            desc: "Siz qidirayotgan sahifa mavjud emas, manzili o'zgargan yoki butunlay o'chirilgan."
        },
        401: {
            icon: ShieldAlert,
            color: "text-amber-500",
            bg: "bg-amber-50",
            title: "Avtorizatsiya zarur",
            desc: "Bu sahifani ko'rish uchun tizimga kirishingiz kerak."
        },
        403: {
            icon: AlertTriangle,
            color: "text-rose-500",
            bg: "bg-rose-50",
            title: "Ruxsat etilmagan",
            desc: "Sizda bu sahifaga kirish yoki bu amalni bajarish huquqi yo'q."
        },
        500: {
            icon: ServerCrash,
            color: "text-red-500",
            bg: "bg-red-50",
            title: "Server xatosi",
            desc: "Kechirasiz, tizimda vaqtinchalik muammo yuz berdi. Tez orada tuzatamiz."
        }
    };

    const status = $derived($page.status);
    
    // Agar kutilmagan status kelsa, default holatni olamiz
    const info = $derived(
        errorConfig[status] ?? {
            icon: AlertTriangle,
            color: "text-slate-500",
            bg: "bg-slate-100",
            title: "Kutilmagan xatolik",
            desc: "Nimadir noto'g'ri ketdi. Iltimos qayta urinib ko'ring."
        }
    );
</script>

<div class="min-h-screen w-full bg-[#f8fafc] font-sans flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-300">
        
        <div class="flex justify-center mb-6">
            <div class={`w-20 h-20 rounded-2xl flex items-center justify-center ${info.bg} ring-8 ring-white shadow-sm`}>
                <svelte:component this={info.icon} class={`w-10 h-10 ${info.color}`} strokeWidth={1.5} />
            </div>
        </div>

        <div class="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-sm tracking-wide mb-4">
            ERROR {status}
        </div>
        
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 font-tarsk">
            {info.title}
        </h1>
        
        <p class="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
            {info.desc}
        </p>

        {#if $page.error?.message && status === 500}
            <div class="text-left mb-8 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Texnik tafsilot</p>
                <code class="text-sm text-rose-500 font-mono wrap-break-word">{$page.error.message}</code>
            </div>
        {/if}

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
                onclick={() => history.back()} 
                class="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-600 font-medium hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
                <ArrowLeft size={18} />
                Ortga qaytish
            </button>
            
            <button 
                onclick={() => goto('/')} 
                class="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#ed4b72] text-white font-medium hover:bg-[#d93a5f] transition-all shadow-md shadow-[#ed4b72]/20"
            >
                <Home size={18} />
                Bosh sahifa
            </button>
        </div>
    </div>
</div>