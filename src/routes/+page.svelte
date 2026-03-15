<!-- +page.svelte yoki app/routes/+page.svelte -->

<script>
	import Navbar from "@/lib/components/layout/Navbar.svelte";
	import HeroSection from "@/lib/components/ui/home/HeroSection.svelte";

  // Komponentlarni import qilamiz
  import WhoIsThisFor from '@/lib/components/ui/home/WhoIsThisFor.svelte';
	import AboutInstruction from "@/lib/components/ui/home/AboutInstruction.svelte";

//   import AboutInstructor from '$lib/components/AboutInstructor.svelte';
//   import CourseContent from '$lib/components/CourseContent.svelte';
//   import PricingSection from '$lib/components/PricingSection.svelte';
  // import MatrixChoice from '$lib/components/MatrixChoice.svelte';
//   import FAQ from '$lib/components/FAQ.svelte';
//   import Footer from '$lib/components/Footer.svelte';

  // Agar kerak bo'lsa, onMount yoki boshqa logika shu yerga keladi
  // import { onMount } from 'svelte';

  // onMount(() => {
  //   // masalan analytics, scroll restoration va h.k.
  // });
</script>

<div class="min-h-screen">
  <Navbar />

  <HeroSection />

  <div class="overflow-hidden">
    <WhoIsThisFor />
  </div>

  <AboutInstruction />
  <!-- <div class="overflow-hidden">
    <CourseBenefits />
  </div> -->


</div>

<!-- 
  Agar global stil yoki layout kerak bo'lsa, 
  +layout.svelte ichida <slot /> bilan boshqarish yaxshiroq 
-->