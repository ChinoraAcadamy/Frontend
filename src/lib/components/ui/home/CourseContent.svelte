<script>
  import { CheckCircle, Clock, Sparkles, ChevronDown } from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  const levels = [
    {
      level: "Boshlang‘ich",
      title: "Asosiy tikuvchilik ko‘nikmalari",
      duration: "8 hafta",
      color: "bg-primary",
      textColor: "text-white",
      modules: [
        {
          title: "Bolalar va kattalar ssos andazasi va uni qo'llash",
          subModules: [
            "Bolalardan o'lcham olish va bolalar asos andazasini tayyorlash.",
            "Bolalar uchun asos andazadan foydalanib koketkali libos bichib tikish.",
            "Standart va nostandart qomatli ayollardan o'lcham olish sirlari.",
            "Qolibdek ayollar asos andazasini tayyorlash",
            "Asos andazadan foydalanib primoy ko'ylak bichib tikish.",
          ]
        },
        {
          title: "Chok va cho'ntak turlari",
          subModules: []
        },
        {
          title: "Yeng moduli",
          subModules: [
            "Oson usulda yeng tayyorlash texnikasi",
            "Qolibdek yeng asosini tayyorlash",
            "Yeng asosini matoga qo'yib bichish va tikish. Yengni proymaga o'rnatish",
            "Lola yeng va balon yeng modellashtirish va bichib tikish",
            "o'zbekcha kostyum yoqa konstruksiyasi, bichib tikish texnologiyasi",
            "Aylana yoqa konstruksiyasi va bichib tikish texnologiyasi",
            "Mujskoy rubashka yoqa"
          ]
        },
        {
          title: "Yoqalar moduli",
          subModules: [
            "o'zbekcha kostyum yoqa konstruksiyasi, bichib tikish texnologiyasi",
            "Aylana yoqa konstruksiyasi va bichib tikish texnologiyasi",
            "Mujskoy rubashka yoqa"
          ]
        },
        {
          title: "Modellashtirish va amaliy mashg'ulotlar",
          subModules: [
            "o'zbekcha koketkali ko'ylak bichib tikish.",
            "6 klenli ko'ylak bichib tikish texnologiyasi",
            "Kilot, shalvar, lozim bichib tikish texnologiyasi.",
            "abaya bichib tikish texnologiyasi"
          ]
        },
        {
          title: "Murakkab bichimli liboslar bichish",
          subModules: [
            "klassik shim andazasini tayyorlash",
            "klassik shim bichib tikish",
            "kostyum uchuna andaza tayyorlash",
            "klassik kostyum bichib tikish."
          ]
        },
      ],
      bonus: "Bonus: Maqsad qo'yish va rivojlanish seminari!"
    },
    {
      level: "O‘rta",
      title: "Murakkab fasonlar va dizayn",
      duration: "16 hafta",
      color: "bg-primary/90",
      textColor: "text-white",
      modules: [
        {
          title: "Jahon standartidagi bazaviy asoslar konstruksiyasi va ulardan texnikas",
          subModules: [
            "Ayollar qomatida toʻg'ri o'lcham olish sirlari: Standart va nostandart qommatdan o'lcham olish",
            "2 ta o'lcham bilan mijozni ko'rmasdan razmer chiqarish",
            "Myuller metodikasi asosida tor liboslar uchun bazaviy asos tayyorlash",
            "Myuller metodikasi asosida o'rta keng va keng liboslar uchun bazaviy asos tayyorlash",
            "Korreksiya va kontrol darsi",
            "Tor libos asosidan keng libos modellashtirish",
            "Ko'krak vitechkali va ko'krak vetichkasiz 2 xil kofta bluzkalar uchun bazaviy asos andaza tayyorlash"
          ]
        },
        {
          title: "Jahon standartida tikish texnologiyalari",
          subModules: [
            "Chok turlari, to'g'ri tikish texnologiyasi",
            "Zamok turlari va ularni tikish texnologiyasi",
            "Cho'ntak turlari va ularni tikish texnologiyasi",
            "Yoqalar turlari va plankalar bilan ishlash",
            "Fazoviy yoqalar, ularning konstruksiyasi (30 xilga yaqin) va tikish texnologiyasi",
          ]
        },
        {
          title: "Modellashtirish (ayollar ko'ylagi va bluzkalar)",
          subModules: [
            "Vetichka madellashtirish nazariy va amaliy (10 xil)",
            "15 xil brend libos konstruksiyasini tayyorlash. + 1 ta amaliy dars",
            "10 xil klenli ko'ylak modellashtirish nazariy va amaliy",
            "10 xil brend libos modellashtirish + 1 ta amaliy dars",
            "10 xil bluzka modellashtirish",
            "Ro'mol yoqali va kostyum yoqali ko'ylak konstruksiyasi",
            "Ko'ylak-bruk konstruksiyasi"
          ]
        },
        {
          title: "Yeng mavzusi",
          subModules: [
            "Oson usulda qolibdek turadigan yeng asosini modellashtirish",
            "Myuller metodikasi asosida yeng andazasini qurish",
            "Yeng asosini qurishda muhim omillar va kontrol qilish",
            "Ikki chokli yenglar",
            "Yenglarni modellashtirish konstruksiyalari va kitobda ko'rsatilmagan trend yenglarni modellashtirish",
            "Yengni amaliyotda bichib tikish",
            "Yeng va proyma bog'liqligi",
            "Reglan yeng konstruksiyasi",
            "Reglan yeng bichib tikish",
            "Proymasi kengaytirilgan yeng konstruksiyasi",
            "Yaxlit yeng va ularni modellashtirsh",
          ]
        },
        {
          title: "Nostandarst qomatlar bilan ishlash",
          subModules: [
            "Ayollar qomati turlari va ularga obraz yartishi",
            "Ko'kragi katta kekkaygan gavda bilan ishlash",
            "Bukchaygan figura bilan ishlash",
            "Buksasi katta figura bilan ishlash",
            "Qorni katta figura bilan ishlash"
          ]
        },
        {
          title: "Oqshom liboslari. Drapirovka",
          subModules: [
            "Korset andaza asosini tayyorlash",
            "Klassik korset modellashtirish va bichib tikish",
            "Yelkali korset modellashtirish va bichib tikish",
            "Ko'krakdan pastda turuvchi korset modellashtirish va bichib tikish",
            "Chashkali korset",
            "Drapirovka nazariy va amaliy",
            "Ansambl va baza ko'ylak bichib tikish"
          ]
        },
        {
          title: "Dizaynerlik. Eskiz chizish",
          subModules: [
            "Dizaynerlaga xos xususiyatlar",
            "Moda etaplari",
            "Moda bilan contact",
            "Figura chizish",
            "Figura ustida libos chizish"
          ]
        },
        {
          title: "Psixologik darslar",
          subModules: [
            "Maqsad qo'yish va harakat qilish (3 ta dars)",
            "Mijozlar bilan munosabat (1 ta dars)",
            "Mijoz stilini hal qilish va o'rganish",
            "Ranglar bilan ishlash",
            "Mato fakturalari bilan tanishish",
            "Tikuvchilik sohasiga oid biznes g'oyalar",
            "Shaxsiy brend qurishni boshlash"
          ]
        },
        {
          title: "Marketing va brending asoslari",
          subModules: []
        }
      ],
      bonus: "Bonus modul: Shaxsiy brending va ijtimoiy tarmoqlarda marketing"
    },
    {
      level: "Yuqori",
      title: "Professional darajaga chiqish",
      duration: "10 hafta",
      color: "bg-primary/80",
      textColor: "text-white",
      modules: [
        {
          title: "Myuller metodikasida ustki kiyimlar asosi moduli",
          subModules: []
        },
        {
          title: "Myuller metodikasida yubka va shim moduli",
          subModules: []
        },
        {
          title: "Yubka va shim amaliyotlari",
          subModules: []
        },
        {
          title: "Ustki kiyimlar uchun yeng moduli",
          subModules: []
        },
        {
          title: "Kostyum modellashtirish moduli",
          subModules: []
        },
        {
          title: "Palto modellashtirish moduli",
          subModules: []
        },
        {
          title: "Yoqalar konstruksiyalari va amaliyoti moduli",
          subModules: []
        },
        {
          title: "Astarli liboslarda nostandart figuralar bilan ishlash",
          subModules: []
        },
        {
          title: "Klassik astarli kostyumlar bichish tikish texnologiyalari",
          subModules: []
        },
      ],
      bonus: "Palto bichish tikish texnologiyalari"
    },
  ];

  // Svelte 5 bilan Accordion uchun state (Qaysi modullar ochiqligini saqlash)
  // type="single" mantig'i uchun: bitta level ichida faqat bittasi ochiq turadi
  let openAccordions = $state({});

  function toggleAccordion(levelIndex, moduleIndex) {
    if (openAccordions[levelIndex] === moduleIndex) {
      // Agar ochiq bo'lsa, yopamiz
      openAccordions[levelIndex] = null;
    } else {
      // Yoki yangisini ochamiz (qolganlarini avtomat yopib)
      openAccordions[levelIndex] = moduleIndex;
    }
  }
</script>

<section id="course-content" class="py-20 bg-gradient-section">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-5xl font-bold mb-6 text-foreground">
        Kurs <span class="text-primary">tarkibi</span>
      </h2>
      <p class="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
        Har bir bosqich alohida maqsadga yo'naltirilgan va amaliy natijalar beradi
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