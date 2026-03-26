<script lang="ts">
    import { navigating } from '$app/stores';

    let progress = $state(0);
    let visible = $state(false);
    let timer: ReturnType<typeof setInterval>;

    // $navigating o'zgarishini kuzatamiz
    $effect(() => {
        if ($navigating) {
            // Yangi sahifaga o'tish boshlandi
            visible = true;
            progress = 15; // Boshlang'ich siljish
            
            clearInterval(timer);
            
            // Progressni sekin-asta oshirib boramiz
            timer = setInterval(() => {
                if (progress >= 90) {
                    clearInterval(timer);
                } else {
                    // 90% ga yaqinlashgan sari sekinlashadi
                    const increment = (100 - progress) * 0.1;
                    progress += increment;
                }
            }, 300);
        } else {
            // Yuklanish tugadi (Backenddan javob keldi)
            clearInterval(timer);
            if (visible) {
                progress = 100; // Oxirigacha to'ldiramiz
                
                // Yo'qolish animatsiyasi uchun biroz kutamiz
                setTimeout(() => {
                    visible = false;
                    
                    // To'liq yo'qolgandan keyin progressni 0 ga qaytaramiz
                    setTimeout(() => {
                        progress = 0;
                    }, 300); 
                }, 400); 
            }
        }
    });
</script>

<div 
    class="fixed top-0 left-0 h-1 z-[9999] transition-all ease-out pointer-events-none"
    style="
        width: {progress}%; 
        opacity: {visible ? 1 : 0};
        background-color: #ed4b72;
        box-shadow: 0 0 10px #ed4b72, 0 0 5px #ed4b72;
        transition-duration: {progress === 100 ? '400ms' : '300ms'};
    "
>
    {#if progress > 0 && progress < 100 && visible}
        <div class="absolute right-0 top-0 h-full w-20 bg-white opacity-40 blur-[2px] shadow-[0_0_10px_white]"></div>
    {/if}
</div>