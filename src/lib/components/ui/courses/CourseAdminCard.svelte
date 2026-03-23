<script lang="ts">
    let { 
        title, 
        price, 
        modules, 
        status, 
        image 
    } = $props();

    // Statusga qarab ranglarni dinamik belgilash
    let statusStyles = $derived(
        status === 'published' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border-amber-100'
    );
</script>

<div class="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-slate-200 group flex flex-col h-full">
    
    <div class="w-full h-44 sm:h-40 bg-slate-100 relative shrink-0 overflow-hidden">
        <img 
            src={image} 
            alt={title} 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            width="300" height="176" 
            loading="lazy"
        />
        
        <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <div class="p-5 flex flex-col flex-1 justify-between">
        <div>
            <h3 class="text-lg font-bold text-slate-800 mb-1 line-clamp-2 leading-tight">
                {title}
            </h3>
            <p class="text-[13px] font-medium text-slate-500 mb-4">{modules} modules</p>
        </div>
        
        <div class="flex items-end justify-between mt-auto">
            <p class="text-2xl font-black text-slate-900">${price}</p>
            
            <span class="px-3.5 py-1.5 rounded-full text-[13px] font-bold border {statusStyles} capitalize shadow-sm">
                {status}
            </span>
        </div>
    </div>
</div>