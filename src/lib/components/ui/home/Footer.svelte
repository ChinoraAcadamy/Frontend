<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  import { 
    Phone, 
    Send, 
    Users, 
    Clock, 
    Book, 
    Sparkles, 
    Instagram, 
    Youtube, 
    User 
  } from 'lucide-svelte';
</script>

<footer class="bg-linear-to-b from-[#E4DACD] to-[#F1EAE3] text-foreground pt-16 pb-6">
  <div class="container mx-auto px-6">
    <!-- Title Section -->
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold font-tarsk text-primary">
        CHINORA FASHION ACADEMY
      </h2>
      <p class="text-muted-foreground mt-2">
        Nafislik, uslub va kasbiy o‘sishga ilhom manzili
      </p>
    </div>

    <!-- Main Content - 4 Columns -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12 text-sm">
      
      <!-- Column 1: Biz haqimizda -->
      <div class="space-y-3">
        <h4 class="text-lg font-semibold text-primary">Biz haqimizda</h4>
        <p class="leading-relaxed">
          CHINORA FASHION ACADEMY – tikuvchilik va dizaynni zamonaviy
          uslubda o‘rgatadigan ayollar uchun professional kurslar.
        </p>
      </div>

      <!-- Column 2: Kurs afzalliklari -->
      <div class="space-y-3">
        <h4 class="text-lg font-semibold text-primary">Kurs afzalliklari</h4>
        <ul class="space-y-3">
          <li class="flex items-center gap-3">
            <Users class="w-5 h-5 text-primary shrink-0" />
            <span class="text-base text-foreground">Amaliy mashg‘ulotlar</span>
          </li>
          <li class="flex items-center gap-3">
            <Clock class="w-5 h-5 text-primary shrink-0" />
            <span class="text-base text-foreground">Zamonaviy texnikalar</span>
          </li>
          <li class="flex items-center gap-3">
            <Book class="w-5 h-5 text-primary shrink-0" />
            <span class="text-base text-foreground">Mentor yordamida rivojlanish</span>
          </li>
          <li class="flex items-center gap-3">
            <Sparkles class="w-5 h-5 text-primary shrink-0" />
            <span class="text-base text-foreground">Moslashuvchan jadval</span>
          </li>
        </ul>
      </div>

      <!-- Column 3: Bizni kuzatib boring -->
      <div class="space-y-3">
        <h4 class="text-lg font-semibold text-primary">Bizni kuzatib boring</h4>
        <ul class="space-y-3">
          <li>
            <a
              href="https://www.instagram.com/chinora_fashion_academy?igsh=NmZhdXR3NGJsMmdy"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Instagram class="w-4 h-4 text-primary" />
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://t.me/+ZlMsl6Ool8k4Zjdi"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Send class="w-4 h-4 text-primary" />
              Telegram
            </a>
          </li>
          <li>
            <a
              href="https://youtube.com/@chinora_academy_ad?si=HEfAEVD4VtNOnxdW"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Youtube class="w-4 h-4 text-primary" />
              YouTube
            </a>
          </li>
          <li>
            <a
              href="https://t.me/chinora_academy"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <User class="w-4 h-4 text-primary" />
              Admin
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 4: Aloqa -->
      <div class="space-y-3">
        <h4 class="text-lg font-semibold text-primary">Aloqa</h4>
        <ul class="space-y-3">
          <li>
            <a
              href="tel:+998338055505"
              class="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone class="w-4 h-4 text-primary" />
              +998 33 805 55 05
            </a>
          </li>
          <li>
            <a
              href="https://t.me/chinora_academy"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Send class="w-4 h-4 text-primary" />
              @chinora_academy
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Subfooter -->
    <div class="border-t border-muted pt-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} CHINORA FASHION ACADEMY. Barcha huquqlar himoyalangan.

      <div class="mt-3 text-xs">
        <span class="opacity-70">Developed with ❤️ by </span>
        <a
          href="https://t.me/ideazona"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:underline font-medium"
        >
          Laziz
        </a>
      </div>
    </div>
  </div>
</footer>