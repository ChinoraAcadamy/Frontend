<!-- +page.svelte yoki app/routes/+page.svelte -->

<script>
	import Navbar from "@/lib/components/layout/Navbar.svelte";
	import HeroSection from "@/lib/components/ui/home/HeroSection.svelte";

  // Komponentlarni import qilamiz
  import WhoIsThisFor from '@/lib/components/ui/home/WhoIsThisFor.svelte';
	import AboutInstruction from "@/lib/components/ui/home/AboutInstruction.svelte";
  import CourseContent from "@/lib/components/ui/home/CourseContent.svelte"
  import PricingSection from "@/lib/components/ui/home/PricingSection.svelte";
	import Faq from "@/lib/components/ui/home/Faq.svelte";
  import Footer from "@/lib/components/ui/home/Footer.svelte";
  import SeoMeta from "@/lib/components/ui/SeoMeta.svelte";

  export let data; // +page.server.js dan keladi

</script>

<SeoMeta 
    title="Chinora Academy - Sifatli va zamonaviy ta'lim platformasi" 
    description="Dasturlash, zamonaviy kasblar va tikuvchilik sirlarini Chinora Academy bilan birga o'rganing. Onlayn kurslar orqali mutaxassisga aylaning."
    keywords="dasturlash, tikuvchilik, bichish, onlayn kurslar, ta'lim, chinora academy, modern kasblar"
/>

<div class="min-h-screen">
  
  <Navbar />
  
  <HeroSection />

  <div class="overflow-hidden">
    <WhoIsThisFor />
  </div>

  <AboutInstruction />

  <CourseContent />

  <PricingSection courses={data.courses} />

  <Faq />

  <Footer />


</div>

<!-- 
  Agar global stil yoki layout kerak bo'lsa, 
  +layout.svelte ichida <slot /> bilan boshqarish yaxshiroq 
-->