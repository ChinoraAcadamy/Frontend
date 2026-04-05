<script>
    import { enhance } from '$app/forms';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';
    import { Upload, File as FileIcon } from 'lucide-svelte';
    import { fade, slide } from 'svelte/transition';

    /**
     * @typedef {Object} Props
     * @property {any} lesson
     */

    /** @type {Props} */
    let { lesson } = $props();

    // State'lar
    let selectedFile = $state(null);
    let isDragging = $state(false);
    let isSubmitting = $state(false);

    // Fayl yuklash mantig'i
    /** @param {DragEvent} e */
    function handleFileDrop(e) {
        e.preventDefault();
        isDragging = false;
        if (e.dataTransfer?.files?.length) {
            // @ts-ignore
            selectedFile = e.dataTransfer.files[0];
        }
    }

    /** @param {Event} e */
    function handleFileSelect(e) {
        const input = /** @type {HTMLInputElement} */ (e.target);
        if (input.files?.length) {
            // @ts-ignore
            selectedFile = input.files[0];
        }
    }

    /** @param {DragEvent} e */
    function handleDragOver(e) {
        e.preventDefault();
        isDragging = true;
    }

    function handleDragLeave() {
        isDragging = false;
    }

    // Topshiriqni yuborish
    function submitAssignment() {
        isSubmitting = true;
        return async ({ update }) => {
            isSubmitting = false;
            selectedFile = null; // Muvaffaqiyatli bo'lsa tozalaymiz
            await update();
        };
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-800">
    <nav class="flex items-center text-sm font-medium text-slate-500 mb-6">
        <Breadcrumb />
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
                <div class="aspect-video bg-slate-900 relative">
                    <!-- svelte-ignore a11y-media-has-caption -->
                    <video 
                        class="w-full h-full object-cover" 
                        controls 
                        poster={lesson.image}
                        controlsList="nodownload"
                    >
                        <source src={lesson.video_url} type="video/mp4" />
                        Brauzeringiz videoni qo'llab-quvvatlamaydi.
                    </video>
                </div>
            </div>

            <!-- Student only or both? Both can mark as complete but admin doesn't need to -->
            <button class="w-full py-4 px-6 bg-[#FA2E69] hover:bg-[#D81B53] text-white font-semibold rounded-xl shadow-[0_8px_20px_-6px_rgba(250,46,105,0.4)] transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2">
                <span>Darsni yakunlash (Mark as complete)</span>
            </button>

            <div class="pt-2">
                <span class="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1 block">Dars ma'lumotlari</span>
                <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{lesson.title}</h1>
                <p class="text-slate-600 leading-relaxed text-[15px]">
                    {lesson.description}
                </p>
            </div>
        </div>

        {#if lesson.assignments && lesson.assignments.length > 0}
            <div class="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 h-fit sticky top-6">
                
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xl font-bold text-slate-900">{lesson.assignments[0].title}</h2>
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">VASIFA</span>
                </div>
                <p class="text-sm text-slate-500 mb-6">Urinishlar: {lesson.assignments[0].max_attempts} marta (fayl yuklash)</p>

                <form method="POST" action="?/uploadAssignment" use:enhance={submitAssignment} enctype="multipart/form-data">
                    <label 
                        class="relative flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed rounded-xl transition-all duration-200 group cursor-pointer
                        {isDragging ? 'border-[#FA2E69] bg-[#FA2E69]/5' : 'border-slate-300 hover:border-[#FA2E69] hover:bg-slate-50'}"
                        ondragover={handleDragOver}
                        ondragleave={handleDragLeave}
                        ondrop={handleFileDrop}
                        role="presentation"
                    >
                        <input type="file" name="file" class="hidden" onchange={handleFileSelect} required>
                        
                        {#if selectedFile}
                            <div class="flex flex-col items-center text-center" in:fade>
                                <div class="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
                                    <FileIcon size={24} />
                                </div>
                                <span class="text-sm font-semibold text-slate-800 line-clamp-1">{selectedFile.name}</span>
                                <span class="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        {:else}
                            <Upload size={32} strokeWidth={1.5} class="text-slate-400 group-hover:text-[#FA2E69] mb-4 transition-colors" />
                            <span class="text-[15px] font-medium text-slate-700 mb-1">Faylni tortib tashlang</span>
                            <span class="text-xs text-slate-400">yoki tanlash uchun bosing</span>
                        {/if}
                    </label>

                    <button 
                        type="submit" 
                        disabled={!selectedFile || isSubmitting}
                        class="w-full mt-4 py-3 px-6 bg-[#FA2E69] hover:bg-[#D81B53] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-[12px] shadow-[0_6px_16px_-4px_rgba(250,46,105,0.3)] transition-all duration-200"
                    >
                        {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                    </button>
                </form>

                {#if lesson.assignments[0].submissions}
                    <div class="mt-8">
                        <h3 class="text-[15px] font-bold text-slate-900 mb-4">Oldingi urinishlar</h3>
                        
                        <div class="space-y-4">
                            {#each lesson.assignments[0].submissions as sub (sub)}
                                <div class="border-b border-slate-100 last:border-0 pb-4 last:pb-0" transition:slide>
                                    <div class="flex items-center justify-between mb-2 text-[13px]">
                                        <div class="flex items-center gap-4">
                                            <span class="font-medium text-slate-800 text-xs">{new Date().toLocaleDateString('uz-UZ')}</span>
                                        </div>
                                        <div class="flex items-center gap-4">
                                            <span class="font-semibold text-slate-900">{sub.score} / 100</span>
                                            {#if sub.status === 'Pending'}
                                                <span class="px-2.5 py-1 bg-[#FFF9C4] text-[#F57F17] text-xs font-bold rounded-md">Kutilmoqda</span>
                                            {:else if sub.status === 'Graded'}
                                                <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md flex items-center gap-1">
                                                    Baholandi
                                                </span>
                                            {/if}
                                        </div>
                                    </div>

                                    {#if sub.feedback}
                                        <div class="mt-3 bg-slate-50 rounded-lg p-3 relative">
                                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fikr:</span>
                                            <div class="flex gap-2">
                                                <p class="text-xs text-slate-600 font-medium italic mt-1">"{sub.feedback}"</p>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>
