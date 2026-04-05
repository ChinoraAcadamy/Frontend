<script lang="ts">
    let { 
        title, 
        image = "https://via.placeholder.com/150", 
        progress = 0, 
        lessons = 0 
    } = $props();
</script>

<div class="min-w-[240px] shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
    <div class="flex gap-3 items-center">
        <div class="w-16 h-12 shrink-0 bg-slate-100 rounded-lg overflow-hidden">
            <img src={image} alt={title} class="w-full h-full object-cover" width="64" height="48" />
        </div>
        <h3 class="font-semibold text-slate-800 text-sm leading-tight line-clamp-2">{title}</h3>
    </div>
    
    <div class="mt-2">
        <div class="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
            <div 
                class="bg-[#ef4444] h-1.5 rounded-full transition-all duration-500 ease-out" 
                style="width: {progress}%">
            </div>
        </div>
        <div class="flex justify-between text-[13px] text-slate-500 font-medium">
            <span>{progress}%</span>
            <span>{lessons} lessons</span>
        </div>
    </div>
</div>