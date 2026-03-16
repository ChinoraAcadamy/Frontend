<script>
	import { CheckCircle, Clock, Sparkles, ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import DOMPurify from 'isomorphic-dompurify';
	import * as m from '$lib/paraglide/messages.js';

	const levels = [
		{
			level: m.level_beginner(),
			title: m.level1_title(),
			duration: m.level1_duration(),
			color: "bg-primary",
			textColor: "text-white",
			modules: [
				{
					title: m.course_module_1_1(),
					subModules: [
						m.course_module_1_1_sub1(),
						m.course_module_1_1_sub2(),
						m.course_module_1_1_sub3(),
						m.course_module_1_1_sub4(),
						m.course_module_1_1_sub5()
					]
				},
				{ title: m.course_module_1_2(), subModules: [] },
				{
					title: m.course_module_1_3(),
					subModules: [
						m.course_module_1_3_sub1(),
						m.course_module_1_3_sub2(),
						m.course_module_1_3_sub3(),
						m.course_module_1_3_sub4(),
						m.course_module_1_3_sub5(),
						m.course_module_1_3_sub6(),
						m.course_module_1_3_sub7()
					]
				},
				{ title: m.course_module_1_4(), subModules: [] },
				{ title: m.course_module_1_5(), subModules: [] },
				{ title: m.course_module_1_6(), subModules: [] }
			],
			bonus: m.level1_bonus()
		},
		{
			level: m.level_intermediate(),
			title: m.level2_title(),
			duration: m.level2_duration(),
			color: "bg-primary/90",
			textColor: "text-white",
			modules: [
				{ title: m.course_module_2_1(), subModules: [] },
				{ title: m.course_module_2_2(), subModules: [] },
				{ title: m.course_module_2_3(), subModules: [] },
				{ title: m.course_module_2_4(), subModules: [] },
				{ title: m.course_module_2_5(), subModules: [] },
				{ title: m.course_module_2_6(), subModules: [] },
				{ title: m.course_module_2_7(), subModules: [] },
				{ title: m.course_module_2_8(), subModules: [] }
			],
			bonus: m.level2_bonus()
		},
		{
			level: m.level_advanced(),
			title: m.level3_title(),
			duration: m.level3_duration(),
			color: "bg-primary/80",
			textColor: "text-white",
			modules: [
				{ title: "Myuller metodikasida ustki kiyimlar asosi moduli", subModules: [] },
				{ title: "Myuller metodikasida yubka va shim moduli", subModules: [] },
				{ title: "Yubka va shim amaliyotlari", subModules: [] },
				{ title: "Ustki kiyimlar uchun yeng moduli", subModules: [] },
				{ title: "Kostyum modellashtirish moduli", subModules: [] },
				{ title: "Palto modellashtirish moduli", subModules: [] },
				{ title: "Yoqalar konstruksiyalari va amaliyoti moduli", subModules: [] },
				{ title: "Astarli liboslarda nostandart figuralar bilan ishlash", subModules: [] },
				{ title: "Klassik astarli kostyumlar bichish tikish texnologiyalari", subModules: [] }
			],
			bonus: m.level3_bonus()
		}
	];

	let openAccordions = $state({});

	function toggleAccordion(levelIndex, moduleIndex) {
		openAccordions[levelIndex] = openAccordions[levelIndex] === moduleIndex ? null : moduleIndex;
	}
</script>

<section id="course-content" class="py-20 bg-gradient-section min-h-screen">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-5xl font-bold mb-6 text-foreground">
        {@html DOMPurify.sanitize(m.course_title())}
      </h2>
      <p class="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
        {m.course_subtitle()}
      </p>
    </div>

    <div class="grid gap-6 max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {#each levels as level, levelIndex (level.level)}
        <div 
          class="w-full bg-card text-card-foreground border border-border rounded-xl shadow-none hover:shadow-sm transition-all duration-300 flex flex-col overflow-hidden 
          {levels.length === 3 && levelIndex === levels.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''}"
        >
          <div class="{level.color} {level.textColor} p-6">
            <div class="flex items-center justify-between mb-3">
              <span class="inline-flex items-center rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-xs font-semibold text-white">
                {level.level}
              </span>
              <div class="flex items-center gap-1 text-sm font-medium">
                <Clock class="w-4 h-4" />
                {level.duration}
              </div>
            </div>
            <h3 class="text-xl font-bold leading-tight">{level.title}</h3>
          </div>

          <div class="p-4 sm:p-6 space-y-4 grow bg-background">
            {#each level.modules as module, moduleIndex (module.title)}
              {#if module.subModules && module.subModules.length > 0}
                <div class="border-b border-border/50 last:border-0 pb-2">
                  <button 
                    onclick={() => toggleAccordion(levelIndex, moduleIndex)}
                    class="flex w-full items-center justify-between py-2 text-sm font-medium transition-all hover:text-primary text-left"
                  >
                    <div class="flex items-center gap-3">
                      <CheckCircle class="w-5 h-5 text-primary shrink-0" />
                      <span class="text-sm text-foreground">{module.title}</span>
                    </div>
                    <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-300 text-muted-foreground {openAccordions[levelIndex] === moduleIndex ? 'rotate-180' : ''}" />
                  </button>
                  
                  {#if openAccordions[levelIndex] === moduleIndex}
                    <div transition:slide={{ duration: 250 }} class="overflow-hidden">
                      <div class="pb-4 pt-1">
                        <ul class="pl-10 pr-2 list-disc text-sm text-muted-foreground space-y-2">
                          {#each module.subModules as sub (sub)}
                            <li>{sub}</li>
                          {/each}
                        </ul>
                      </div>
                    </div>
                  {/if}
                </div>
              {:else}
                <div class="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                  <CheckCircle class="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span class="text-sm text-foreground font-medium">{module.title}</span>
                </div>
              {/if}
            {/each}

            {#if level.bonus}
              <div class="flex items-start gap-3 pt-5 mt-4 border-t border-border">
                <Sparkles class="w-5 h-5 text-primary mt-0.5 shrink-0 animate-pulse" />
                <span class="text-sm text-foreground font-bold">
                  {level.bonus}
                </span>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>