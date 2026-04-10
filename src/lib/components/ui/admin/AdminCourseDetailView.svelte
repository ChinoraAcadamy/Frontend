<script lang="ts">
	import { ChevronLeft, Layout, ListChecks, Users, BarChart3, Settings, ChevronDown } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import Breadcrumb from '@/lib/components/ui/Breadcrumb.svelte';

	let {
		course,
		modules = [],
		adminHeaderActions = undefined,
		adminFooterActions = undefined,
		adminModuleActions = undefined,
		adminLessonActions = undefined
	} = $props();

	let activeTab = $state('content'); // content, students, settings
	let expandedModules = $state({});

	// Modullarni boshqarish: default holatda birinchisini ochib qo'yamiz
	$effect(() => {
		if (modules.length > 0 && Object.keys(expandedModules).length === 0) {
			expandedModules[modules[0].id] = true;
		}
	});

	function toggleModule(id) {
		expandedModules[id] = !expandedModules[id];
	}

	function isExpanded(id) {
		return !!expandedModules[id];
	}
</script>

<div class="min-h-screen bg-[#f8fafc] pb-20 font-sans lg:pb-10">
	<!-- Sticky Glass Header -->
	<header
		class="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<div class="flex items-center gap-2 sm:gap-4">
				<a
					href={resolve('/admin/courses')}
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
				>
					<ChevronLeft size={20} />
				</a>
				<div class="min-w-0 flex-1">
					<div class="hidden sm:block">
						<Breadcrumb />
					</div>
					<h1 class="text-base font-bold text-slate-900 line-clamp-1 sm:text-xl">
						{course.title}
					</h1>
				</div>
			</div>

			<div class="flex items-center justify-end gap-1.5 sm:gap-2">
				{#if adminHeaderActions}
					{@render adminHeaderActions()}
				{/if}
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Course Dashboard Cards -->
		<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Course Preview -->
			<div class="col-span-1 overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:col-span-2 flex gap-4 items-center">
				<div class="relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                    <img
						src={course.img || `https://placehold.co/600x400?text=${encodeURIComponent(course.title)}`}
						alt="Course"
						class="absolute inset-0 h-full w-full object-cover"
					/>
                </div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
                            {course.is_published ? 'Active' : 'Draft'}
                        </span>
                        <span class="text-xs font-medium text-slate-400">• Created {new Date().toLocaleDateString()}</span>
                    </div>
                    <h2 class="text-lg font-extrabold text-slate-800 line-clamp-1">{course.title}</h2>
                    <p class="text-xs text-slate-500 line-clamp-2 mt-1">{course.description}</p>
                </div>
			</div>

			<!-- Quick Stats -->
			<div class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#ed4b72]">
                    <Layout size={24} />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-tight">Modules</p>
                    <p class="text-2xl font-black text-slate-800">{modules.length}</p>
                </div>
            </div>

            <div class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-[#ed4b72] transition-colors">
                    <ListChecks size={24} />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-tight">Lessons</p>
                    <p class="text-2xl font-black text-slate-800">{course.lessons_count || 0}</p>
                </div>
            </div>
		</div>

		<!-- Content Tabs (App-like navigation) -->
		<div class="mb-6 flex w-full overflow-x-auto rounded-2xl bg-slate-100 p-1 scrollbar-hide sm:w-fit">
			<div class="flex min-w-full gap-1 sm:min-w-0">
				<button
					onclick={() => (activeTab = 'content')}
					class="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-6 {activeTab ===
					'content'
						? 'bg-white text-[#ed4b72] shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					<Layout size={18} />
					Tuzilma
				</button>
				<button
					onclick={() => (activeTab = 'students')}
					class="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-6 {activeTab ===
					'students'
						? 'bg-white text-[#ed4b72] shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					<Users size={18} />
					O'quvchilar
				</button>
				<button
					onclick={() => (activeTab = 'settings')}
					class="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-6 {activeTab ===
					'settings'
						? 'bg-white text-[#ed4b72] shadow-sm'
						: 'text-slate-500 hover:text-slate-700'}"
				>
					<Settings size={18} />
					Sozlamalar
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		{#if activeTab === 'content'}
			<div in:fade={{ duration: 200 }} class="space-y-6">
				{@render contentTab()}
			</div>
		{:else if activeTab === 'students'}
            <div in:fade={{ duration: 200 }} class="flex flex-col items-center justify-center py-20 text-center">
                <div class="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Users size={40} />
                </div>
                <h3 class="text-xl font-bold text-slate-800">Ushbu bo'lim tez orada qo'shiladi</h3>
                <p class="text-slate-500 max-w-sm mt-2">O'quvchilar ro'yxati va ularning o'zlashtirish ko'rsatkichlarini shu yerda boshqarish imkoniyati bo'ladi.</p>
            </div>
        {:else if activeTab === 'settings'}
            <div in:fade={{ duration: 200 }}>
                 {#if adminFooterActions}
                    {@render adminFooterActions()}
                {/if}
            </div>
		{/if}
	</main>
</div>

{#snippet contentTab()}
	<div class="flex flex-col gap-6">
		{#each modules as mod (mod.id)}
			<div class="rounded-[32px] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
				<!-- Module Header -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div 
					class="flex items-center justify-between border-b border-slate-50 p-5 sm:p-6 bg-slate-50/30 cursor-pointer transition-colors hover:bg-slate-50"
					onclick={() => toggleModule(mod.id)}
				>
					<div class="flex items-center gap-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-white font-black text-slate-400 shadow-sm ring-1 ring-slate-100 transition-all duration-300 {isExpanded(mod.id) ? 'rotate-180 ring-rose-100' : 'rotate-0'}">
							<ChevronDown size={20} class="transition-colors {isExpanded(mod.id) ? 'text-[#ed4b72]' : 'text-slate-400'}" />
						</div>
						<div>
							<h3 class="text-lg font-black text-slate-800 sm:text-xl leading-tight transition-colors {isExpanded(mod.id) ? 'text-[#ed4b72]' : ''}">{mod.title}</h3>
							<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
								{mod.lessons?.length || 0} ta dars • Modul {mod.order || ''}
							</p>
						</div>
					</div>
					
					<div class="flex items-center gap-2" onclick={(e) => e.stopPropagation()}>
						{#if adminModuleActions}
							{@render adminModuleActions(mod)}
						{/if}
					</div>
				</div>

				<!-- Lessons List -->
				{#if isExpanded(mod.id)}
					<div transition:slide={{ duration: 300 }} class="p-3 sm:p-4 border-t border-slate-50">
					{#if mod.lessons && mod.lessons.length > 0}
						<div class="flex flex-col gap-2">
							{#each mod.lessons as lesson (lesson.id)}
								<div class="group relative flex items-center justify-between rounded-2xl border border-transparent p-3 transition-all hover:border-slate-100 hover:bg-slate-50">
									<div class="flex items-center gap-4">
										<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors group-hover:bg-rose-50 group-hover:text-rose-500">
											<BarChart3 size={20} />
										</div>
										<div>
											<h4 class="text-sm font-bold text-slate-700 sm:text-base line-clamp-1">{lesson.title}</h4>
											<span class="text-xs font-semibold text-slate-400 capitalize">{lesson.duration || 0} minut • Video dars</span>
										</div>
									</div>

									{#if adminLessonActions}
										<div class="flex items-center gap-1">
											{@render adminLessonActions(lesson, mod)}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-8 text-center text-slate-400 italic">
                             <p class="text-sm">Hozircha darslar mavjud emas.</p>
                        </div>
					{/if}
				</div>
				{/if}
			</div>
		{/each}

        {#if modules.length === 0}
            <div class="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-slate-200 bg-white p-20 text-center text-slate-400">
                <Layout size={48} class="mb-4 opacity-20" />
                <p class="text-lg font-bold">Modullar hali qo'shilmagan</p>
                <p class="text-sm">Yangi modul qo'shish uchun yuqoridagi tugmani bosing.</p>
            </div>
        {/if}
	</div>
{/snippet}

<style>
	@reference "tailwindcss";

	:global(body) {
		background-color: #f8fafc;
	}

    /* Grayscale-30 like filter but more premium */
    :global(.grayscale-30) {
        filter: grayscale(0.3) contrast(0.9);
    }

	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
