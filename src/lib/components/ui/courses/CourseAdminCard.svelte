<script lang="ts">
    import { resolve } from "$app/paths";

    let { 
        title, 
        price, 
        modules, 
        status, 
        image,
        link
    } = $props();

    // Statusga qarab ranglarni dinamik belgilash
    let statusStyles = $derived(
        status === 'published' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border-amber-100'
    );
</script>

<div class="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-slate-200 group flex flex-col h-full relative">
    
    <div class="w-full h-44 sm:h-40 bg-slate-100 relative shrink-0 overflow-hidden">
        <img 
            src={image} 
            alt={title} 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            width="300" height="176" 
            loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <div class="p-5 flex flex-col flex-1 justify-between relative bg-white z-10">
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

        <div class="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3 opacity-100 translate-y-0 transition-all duration-300">
            
            <a 
                href={resolve(`/admin/courses/create/${link}`)} 
                class="flex-1 text-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors duration-200"
            >
                Edit Course
            </a>

            <a 
                href={resolve(`/admin/courses/${link}`)} 
                class="flex-1 text-center py-2.5 px-4 bg-[#FA2E69] hover:bg-[#D81B53] text-white rounded-xl text-sm font-semibold shadow-[0_4px_12px_-4px_rgba(250,46,105,0.4)] transition-all duration-200"
            >
                View
            </a>
        </div>
    </div>
</div>