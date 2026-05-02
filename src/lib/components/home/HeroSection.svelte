<!-- src/lib/components/HeroSection.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as m from "$lib/paraglide/messages.js"
  import { gsap } from 'gsap';
  import { Plus } from 'lucide-svelte'; // agar lucide-svelte ishlatayotgan bo'lsangiz

  let section;

  onMount(() => {
    // GSAP context yaratamiz va scope ni section ga bog'laymiz
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.out' } });

      // Title
      tl.fromTo(
        '.hero-title',
        { y: -120, rotate: -5, opacity: 1, scale: 1.05 },
        { y: 0, rotate: 0, opacity: 1, scale: 1, ease: 'elastic.out(1, 0.6)' }
      );

      // Highlight
      tl.fromTo(
        '.hero-highlight',
        { x: -200, skewX: 8, rotate: 2, opacity: 0 },
        { x: 0, skewX: 0, rotate: 0, opacity: 1, ease: 'back.out(1.7)' },
        '-=0.5'
      );

      // Subtitle
      tl.fromTo(
        '.hero-subtitle',
        { y: 100, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, ease: 'elastic.out(1.2, 0.5)' },
        '-=0.3'
      );

      // Button
      tl.fromTo(
        '.hero-btn',
        { x: -500, skewX: 7, rotate: 2, z: -200 },
        { x: 0, skewX: 0, rotate: 0, z: 0, ease: 'back.out(1.5)' },
        '-=0.2'
      );
    }, section); // ← scope section elementiga bog'langan

    return () => {
      ctx.revert(); // cleanup - Svelte'da onDestroy ga o'xshash
    };
  });

  function handleScroll(id) {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // navbar height taxminan
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  onDestroy(() => {
    // qo'shimcha tozalash kerak bo'lsa shu yerga
  });
</script>

<svelte:head>
  <title>{m.home_head_title()}</title>
  <meta name="description" content={m.home_head_description()} />
</svelte:head>

<section
  bind:this={section}
  class="header-background min-h-screen flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 overflow-hidden"
>
  <div class="flex-1 max-w-2xl text-left z-10">
    <h1
      class="hero-title text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-6 mt-32 sm:mt-20 md:mt-0 text-foreground"
      style="font-family: tarsk, sans-serif; font-weight: 600; line-height: 1.3;"
    >
      {m.hero_title_part1()} <br />
      <span class="hero-highlight block text-primary">
        {m.hero_title_part2()} <span class="text-[#C7A27C]">{m.hero_title_part3()}</span>
        <br />
        {m.hero_title_highlight()}
      </span>
    </h1>

    <p class="hero-subtitle text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
      {@html m.hero_subtitle({ income: `<span class="font-semibold text-primary">${m.hero_income_highlight()}</span>` })}
    </p>

    <button
      on:click={() => handleScroll('course-content')}
      class="hero-btn group mt-10 flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-light md:px-8 md:py-4"
    >
      <span
        class="bg-background text-primary relative flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45"
      >
        <Plus size={18} strokeWidth={2.5} />
      </span>
      {m.hero_button()}
    </button>

  </div>
</section>

<style>
  /* Agar kerak bo'lsa, bu yerga qo'shimcha stil yozishingiz mumkin */
</style>