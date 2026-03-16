<script lang="ts">
  import { Settings, X, Palette, RefreshCcw } from 'lucide-svelte';

  // Oyna ochiq/yopiqligini nazorat qilish
  let isOpen = $state(false);

  // Default (Boshlang'ich) ranglar - Sizning kodingizdan olingan
  const defaultTheme = {
    primary: '#1a202c',
    secondary: '#2d3748',
    accent: '#4a5568',
    muted: '#718096',
    background: '#f7fafc',
    foreground: '#2d3748',
  };

  // Hozirgi aktiv tema
  let currentTheme = $state({ ...defaultTheme });

  // 🎨 Professional Tayyor Palitralar (Suggest qilinadigan)
  const palettes = [
    // 1. CHINORA SIGNATURE (Oltin va Qora - rasmda ko'rganimiz)
    {
      name: 'Signature Luxe',
      colors: { primary: '#D4AF37', secondary: '#1A202C', accent: '#E2CB9C', muted: '#718096', background: '#0F172A', foreground: '#F8FAFC' }
    },
    // 2. ROYAL EMERALD (Zümrad - Hashamatli yashil)
    {
      name: 'Royal Emerald',
      colors: { primary: '#064E3B', secondary: '#065F46', accent: '#10B981', muted: '#6EE7B7', background: '#F0FDF4', foreground: '#064E3B' }
    },
    // 3. NORDIC SNOW (Minimalistik Skandinavcha - juda toza)
    {
      name: 'Nordic Snow',
      colors: { primary: '#2D3748', secondary: '#4A5568', accent: '#3182CE', muted: '#A0AEC0', background: '#FFFFFF', foreground: '#1A202C' }
    },
    // 4. ROSE QUARTZ (Moda va Go'zallik uchun - ayollar auditoriyasiga mos)
    {
      name: 'Rose Quartz',
      colors: { primary: '#9F1239', secondary: '#BE123C', accent: '#FB7185', muted: '#FDA4AF', background: '#FFF1F2', foreground: '#4C0519' }
    },
    // 5. DEEP SAHARA (Issiq, qum va yer ranglari)
    {
      name: 'Deep Sahara',
      colors: { primary: '#78350F', secondary: '#92400E', accent: '#D97706', muted: '#FCD34D', background: '#FFFBEB', foreground: '#451A03' }
    },
    // 6. MIDNIGHT VIOLET (Sirli va zamonaviy IT ko'rinishi)
    {
      name: 'Midnight Violet',
      colors: { primary: '#4C1D95', secondary: '#5B21B6', accent: '#8B5CF6', muted: '#C4B5FD', background: '#F5F3FF', foreground: '#1E1B4B' }
    },
    // 7. SLATE & GOLD (O'ta jiddiy va professional akademiya stili)
    {
      name: 'Slate Academy',
      colors: { primary: '#0F172A', secondary: '#334155', accent: '#B45309', muted: '#94A3B8', background: '#F8FAF8', foreground: '#0F172A' }
    },
    // 8. COFFEE & CREAM (Yumshoq, ko'zni charchatmaydigan klassika)
    {
      name: 'Coffee Cream',
      colors: { primary: '#3E2723', secondary: '#4E342E', accent: '#795548', muted: '#D7CCC8', background: '#EFEBE9', foreground: '#1B1111' }
    }
  ];

  const brandPalettes = [
    // ✅ YANGI: Eski Chinora Brand ranglaridan qayta tiklangan
    {
      name: 'Chinora Brand',
      colors: { 
        primary: '#9B1C48',   // Rich Raspberry Burgundy — asosiy brand
        secondary: '#642443', // To'qroq burgundy — hover/secondary
        accent: '#C7A27C',    // Champagne Gold — brand aksent
        muted: '#F4ECE6',     // Warm beige muted
        background: '#FCFAF7',// Sof ivory fon
        foreground: '#1A0E13' // Plum-qora matn
      }
    },
    // ✅ YANGI: Chinora Dark — xuddi shu brand, lekin dark mode
    {
      name: 'Chinora Dark',
      colors: { 
        primary: '#C43C66',   // Rose Red (dark modeda biroz yorug')
        secondary: '#9B1C48', // Asosiy burgundy
        accent: '#C7A27C',    // Champagne gold aksent saqlanadi
        muted: '#2E1F26',     // To'q plum muted
        background: '#120A0E',// Juda to'q plum-qora
        foreground: '#FAF6F1' // Ivory matn
      }
    },
    // existing — saqlab qolindi, lekin nomi aniqlashtirild
    {
      name: 'Chinora Gold',   // (avval: Chinora Signature)
      colors: { 
        primary: '#D4AF37',
        secondary: '#1A202C',
        accent: '#E2CB9C',
        muted: '#718096',
        background: '#0F172A',
        foreground: '#F8FAFC'
      }
    },
    {
      name: 'Chinora Pristine',
      colors: { 
        primary: '#D4AF37', 
        secondary: '#2D3748', 
        accent: '#4A5568', 
        muted: '#718096', 
        background: '#F7FAFC',
        foreground: '#1A202C' 
      }
    },
    {
      name: 'Modern Academy',
      colors: { 
        primary: '#2563EB',
        secondary: '#1E293B', 
        accent: '#60A5FA', 
        muted: '#94A3B8', 
        background: '#FFFFFF', 
        foreground: '#0F172A' 
      }
    },
    {
      name: 'Luxe Hadiya',
      colors: { 
        primary: '#9F1239',
        secondary: '#4C0519', 
        accent: '#FB7185', 
        muted: '#FDA4AF', 
        background: '#FFF1F2', 
        foreground: '#4C0519' 
      }
    },
    {
      name: 'Silk Road',
      colors: { 
        primary: '#B45309',
        secondary: '#78350F', 
        accent: '#F59E0B', 
        muted: '#FCD34D', 
        background: '#FFFBEB', 
        foreground: '#451A03' 
      }
    },
    {
      name: 'Deep Emerald',
      colors: { 
        primary: '#064E3B',
        secondary: '#065F46', 
        accent: '#10B981', 
        muted: '#6EE7B7', 
        background: '#F0FDF4', 
        foreground: '#064E3B' 
      }
    },
    {
      name: 'Midnight Luxe',
      colors: { 
        primary: '#818CF8',
        secondary: '#4F46E5', 
        accent: '#C7D2FE', 
        muted: '#6366F1', 
        background: '#020617', 
        foreground: '#F8FAFC' 
      }
    },
    {
      name: 'Minimal Graphite',
      colors: { 
        primary: '#18181B', 
        secondary: '#27272A', 
        accent: '#52525B', 
        muted: '#A1A1AA', 
        background: '#FAFAFA', 
        foreground: '#09090B' 
      }
    }
  ];

  // Component yuklanganda localStorage'dan o'qib olish va CSS'ga yozish
  $effect(() => {
    // Brauzerda ekanligimizni tekshiramiz
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('chinora-theme');
      if (savedTheme) {
        currentTheme = JSON.parse(savedTheme);
      }
    }
  });

  // currentTheme o'zgarganda CSS o'zgaruvchilarni yangilash va saqlash
  $effect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Tailwind uchun CSS variable'larni inyeksiya qilish
      root.style.setProperty('--color-primary', currentTheme.primary);
      root.style.setProperty('--color-secondary', currentTheme.secondary);
      root.style.setProperty('--color-accent', currentTheme.accent);
      root.style.setProperty('--color-muted', currentTheme.muted);
      root.style.setProperty('--color-background', currentTheme.background);
      root.style.setProperty('--color-foreground', currentTheme.foreground);

      // Kelajak uchun saqlab qo'yish
      localStorage.setItem('chinora-theme', JSON.stringify(currentTheme));
    }
  });

  function applyPalette(paletteColors) {
    currentTheme = { ...paletteColors };
  }

  function resetTheme() {
    currentTheme = { ...defaultTheme };
    localStorage.removeItem('chinora-theme');
  }
</script>

<button 
  onclick={() => isOpen = true}
  class="fixed z-50 p-3 text-white transition-all shadow-2xl bg-primary right-4 bottom-8 rounded-full hover:scale-110 group"
  aria-label="Customize Theme"
>
  <Settings class="w-6 h-6 animate-[spin_4s_linear_infinite] group-hover:animate-none" />
</button>

{#if isOpen}
  <div 
    class="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm transition-opacity"
    onclick={() => isOpen = false}
    aria-hidden="true"
  ></div>
{/if}

<div 
  class="fixed top-0 right-0 z-70 h-full w-80 border-l border-border/50 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto {isOpen ? 'translate-x-0' : 'translate-x-full'}"
>
  <div class="flex items-center justify-between p-6 border-b border-border/50">
    <div class="flex items-center gap-2">
      <Palette class="w-5 h-5 text" />
      <h3 class="font-bold text-foreground">Dizaynni moslash</h3>
    </div>
    <button onclick={() => isOpen = false} class="p-2 transition-colors rounded-full hover:bg-muted/20 text-muted-foreground">
      <X class="w-5 h-5" />
    </button>
  </div>

  <div class="p-6 space-y-8">

  
  <div class="space-y-4">
    <h4 class="text-xs font-black text-primary uppercase tracking-[0.2em] border-l-2 border-primary pl-3">
      Brand Plates
    </h4>
    <div class="grid grid-cols-2 gap-3">
      {#each brandPalettes as palette (palette.name)}
        <button 
          onclick={() => applyPalette(palette.colors)}
          class="group relative flex flex-col gap-2 p-3 text-left transition-all border rounded-xl hover:border-primary border-primary/20 bg-primary/5 hover:bg-primary/10 shadow-sm"
        >
          <span class="text-[10px] font-bold text-foreground/80 uppercase tracking-tighter">
            {palette.name}
          </span>
          <div class="flex h-3 overflow-hidden rounded-full w-full border border-white/10">
            <div class="flex-1" style="background-color: {palette.colors.primary}"></div>
            <div class="flex-1" style="background-color: {palette.colors.secondary}"></div>
            <div class="flex-1" style="background-color: {palette.colors.accent}"></div>
            <div class="flex-1" style="background-color: {palette.colors.background}"></div>
          </div>
        </button>
      {/each}
    </div>

  </div>
    
    <div class="space-y-4">
      <h4 class="text-sm font-semibold text-foreground uppercase tracking-wider">Tayyor palitralar</h4>
      <div class="grid grid-cols-2 gap-3">
        {#each palettes as palette (palette.name)}
          <button 
            onclick={() => applyPalette(palette.colors)}
            class="flex flex-col gap-2 p-3 text-left transition-all border rounded-xl hover:border-primary border-border/50 bg-muted/5 hover:bg-muted/10"
          >
            <span class="text-xs font-medium text-foreground">{palette.name}</span>
            <div class="flex h-4 overflow-hidden rounded-full w-full">
              <div class="flex-1" style="background-color: {palette.colors.primary}"></div>
              <div class="flex-1" style="background-color: {palette.colors.secondary}"></div>
              <div class="flex-1" style="background-color: {palette.colors.accent}"></div>
              <div class="flex-1" style="background-color: {palette.colors.background}"></div>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-semibold text-foreground uppercase tracking-wider">Ranglarni tahrirlash</h4>
        <button 
          onclick={resetTheme}
          class="flex items-center gap-1 text-xs font-medium text-muted hover:text-primary transition-colors"
        >
          <RefreshCcw class="w-3 h-3" /> Qaytarish
        </button>
      </div>

      <div class="space-y-3">
        {#each Object.entries(currentTheme) as [key, value] (key)}
          <div class="flex items-center justify-between p-2 border rounded-lg border-border/50 bg-muted/5">
            <span class="text-sm capitalize text-muted-foreground">{key}</span>
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase text-muted-foreground/70">{value}</span>
              <div class="relative w-8 h-8 rounded-full overflow-hidden shadow-sm border border-border">
                <input 
                  type="color" 
                  bind:value={currentTheme[key]} 
                  class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                  id="color-{key}"
                />
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

  </div>
</div>