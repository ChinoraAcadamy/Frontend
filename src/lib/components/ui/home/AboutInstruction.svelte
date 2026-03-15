<script lang="ts">
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { CheckCircle, Award, Users, Globe, GraduationCap } from 'lucide-svelte';

  // Svelte 5 Runes - onMount va onDestroy o'rniga $effect ishlatamiz
  let section = $state<HTMLElement | null>(null);
  let loaded = $state(false);

  const achievements = [
    { icon: Users, text: "500+ muvaffaqiyatli shogird" },
    { icon: Globe, text: "8 yillik tajriba" },
    { icon: Award, text: "Diplom sertifikatlar" },
    { icon: CheckCircle, text: "98% muvaffaqiyat darajasi" },
    { icon: GraduationCap, text: "Professional jahon standartiga mos metodika" },
  ];

  const stats = [
    { number: "20,000+", label: "Instagram izdoshlari" },
    { number: "1,000+", label: "YouTube obunachilar" },
    { number: "5,000+", label: "Telegram a'zolar" },
    { number: "100%", label: "Natija kafolati" },
    { number: "15+", label: "Master-klasslar" },
    { number: "50+", label: "Moda loyihalari" },
  ];

  const instructorImage = '/images/hero.jpg';

  // Svelte 5 da Lifecycle hooklari
  $effect(() => {
    if (!section) return;
    
    gsap.registerPlugin(ScrollTrigger);

    // eslint-disable-next-line no-unused-vars
    const ctx = gsap.context((self) => {
      // Bitta Timeline ochib, animatsiyalarni zanjir qilib ulaymiz (smooth chiqishi uchun)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        }
      });

      tl.from('.instructor-image', { x: -50, opacity: 0, duration: 1, ease: 'power3.out' })
        .from('.instructor-heading', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
        .from('.achievement-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, "-=0.4")
        .from('.stats-card', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, "-=0.4");
    }, section);

    // Component unmount bo'lganda tozalash (onDestroy o'rniga)
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  });
</script>

<svelte:head>
  <link rel="preload" as="image" href={instructorImage} fetchpriority="high" />
</svelte:head>

<section bind:this={section} id="about" class="py-20 bg-background overflow-hidden">
  <div class="container mx-auto px-6">
    <div class="max-w-6xl mx-auto">
      
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-foreground instructor-heading">
          Kurs asoschisi <span class="text-primary">Ibodullayeva Chinora</span>
        </h2>
        <p class="text-lg text-muted-foreground max-w-3xl mx-auto">
          8 yildan ortiq tajribaga ega tikuvchilik va dizaynerlik ustozasi.
          O‘zining noyob metodikasi va Müller andazalari orqali yuzlab
          shogirdlarni moda sanoatida muvaffaqiyatga yetaklagan.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        <div class="relative instructor-image">
          <div class="relative rounded-2xl overflow-hidden group aspect-4/5 md:aspect-3/4 bg-muted/30">
            
            {#if !loaded}
              <div class="absolute inset-0 bg-linear-to-r from-muted via-muted/60 to-muted animate-[shimmer_2s_infinite] bg-size-[200%_100%] z-10"></div>
            {/if}

            <img
              src={instructorImage}
              alt="Ibodullayeva Chinora - Tikuvchilik ustozasi"
              class="w-full h-full object-cover transition-all duration-700 ease-out {loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}"
              onload={() => loaded = true} 
              fetchpriority="high"
              loading="eager"
              decoding="sync"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          </div>

          <div class="absolute -bottom-6 -right-4 md:-right-6 bg-primary text-accent-red-foreground p-4 rounded-full shadow-xl z-20 hover:scale-110 transition-transform">
            <Award class="w-8 h-8 text-[#e2cb9c]" />
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <h3 class="text-2xl font-bold mb-4 text-foreground">
              Professional tikuvchilik va dizaynerlik ustozasi
            </h3>
            <p class="text-muted-foreground leading-relaxed mb-6">
              Chinora opa tikuvchilikdan tashqari professional tafakkur va
              bozor strategiyalarini o‘rgatadi. Uning metodikasi shogirdlarga
              o‘z moda brendlarini yaratish va xalqaro bozorda raqobatlashish
              imkonini beradi.
            </p>

            <div class="flex flex-wrap gap-4">
              {#each achievements as achievement (achievement.text)}
                <div class="flex items-center gap-3 w-full sm:w-[48%] achievement-item">
                  <div class="text-primary bg-primary/10 p-2 rounded-lg">
                    <svelte:component this={achievement.icon} class="w-5 h-5" />
                  </div>
                  <span class="text-foreground font-medium text-sm">
                    {achievement.text}
                  </span>
                </div>
              {/each}
            </div>
          </div>

          <div class="stats-card w-full border border-border/50 shadow-sm pt-6 bg-linear-to-br from-background via-muted/20 to-muted/40 rounded-2xl">
            <div class="p-6 w-full">
              <h4 class="text-lg font-bold mb-6 text-foreground text-center">
                Ijtimoiy tarmoqlarda faol
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {#each stats as stat (stat.label)}
                  <div class="text-center group">
                    <div class="text-2xl font-black text-primary mb-1 group-hover:scale-105 transition-transform">{stat.number}</div>
                    <div class="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<style>
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>