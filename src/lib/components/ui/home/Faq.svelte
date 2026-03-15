<script>
  import { Plus } from 'lucide-svelte';
  import { CreditCard, Phone, Send } from 'lucide-svelte';

  const faqs = [
    {
      question: "Kurs faqat boshlovchilar uchunmi?",
      answer: "Yo‘q, kursimiz har bir darajadagi o‘quvchilar uchun mo‘ljallangan. Siz 0 dan boshlaysiz va malaka oshirishgacha yetib borasiz. Har bir bosqichda sizga yordam beramiz."
    },
    {
      question: "Videodarslarni qayerdan ko‘raman?",
      answer: "Videodarslarni Telegram va yopiq platformamiz orqali tomosha qilasiz. Istalgan vaqtda ko‘rib, qayta mashq qilishingiz mumkin. Siz uchun qulaylik yaratilgan."
    },
    {
      question: "To‘lov bo‘lib-bo‘lib qilsam bo‘ladimi?",
      answer: "Albatta, admin bilan bog‘lanib bo‘lib-bo‘lib to‘lash shartlarini olishingiz mumkin. Sizga mos va qulay variantlarni taklif qilamiz."
    }
  ];

  let openItem;

  function toggle(value) {
    openItem = openItem === value ? null : value;
  }
</script>

<section id="faq" class="py-20 bg-gradient-section">
  <div class="container mx-auto px-6">
    <!-- Title -->
    <div class="mb-16 text-center">
      <h2 class="text-4xl md:text-5xl font-bold mb-6 text-foreground">
        Tez-tez <span class="text-primary">so'raladigan savollar</span>
      </h2>
      <p class="text-lg text-muted-foreground max-w-3xl mx-auto">
        Sizning barcha savollaringizga javob berish uchun eng ko'p so'raladigan savollarni to'pladik
      </p>
    </div>

    <!-- FAQ Accordion -->
    <div class="max-w-4xl mx-auto space-y-4">
      {#each faqs as faq, index ( faq.question )}
        <div class="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
          <!-- Trigger -->
          <button
            on:click={() => toggle(`faq-${index}`)}
            class="flex w-full items-center justify-between px-8 py-6 text-left font-semibold text-foreground text-lg hover:bg-muted/50 transition-colors"
          >
            <span>{faq.question}</span>
            
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300
                        {openItem === `faq-${index}` ? 'rotate-45 bg-primary text-white' : ''}">
              <Plus class="h-5 w-5" />
            </div>
          </button>

          <!-- Content -->
          {#if openItem === `faq-${index}`}
            <div class="px-8 pb-8 border-t pt-2 text-base leading-relaxed text-muted-foreground">
              {faq.answer}
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Payment & Contact Section -->
    <div class="mt-20">
      <div class="mx-auto max-w-4xl text-center">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          
          <!-- To‘lov usullari -->
          <div class="flex flex-col items-center">
            <div class="flex items-center gap-3 text-primary mb-3">
              <CreditCard class="h-6 w-6" />
              <span class="font-semibold text-lg">To‘lov usullari</span>
            </div>
            <p class="text-muted-foreground">
              Click, Payme, Uzcard, Humo
            </p>
          </div>

          <!-- Telefon -->
          <a
            href="tel:+998338055505"
            class="flex flex-col items-center group"
          >
            <div class="flex items-center gap-3 text-primary mb-3">
              <Phone class="h-6 w-6" />
              <span class="font-semibold text-lg group-hover:underline">+998 33 805 55 05</span>
            </div>
            <p class="text-sm text-muted-foreground">Tez bog‘lanish</p>
          </a>

          <!-- Telegram -->
          <a
            href="https://t.me/chinora_academy"
            target="_blank"
            class="flex flex-col items-center group"
          >
            <div class="flex items-center gap-3 text-primary mb-3">
              <Send class="h-6 w-6" />
              <span class="font-semibold text-lg group-hover:underline">@chinora_academy</span>
            </div>
            <p class="text-sm text-muted-foreground">Telegram orqali yozing</p>
          </a>

        </div>
      </div>
    </div>
  </div>
</section>