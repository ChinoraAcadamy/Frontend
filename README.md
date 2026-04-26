# 🌳 Chinora Academy

**Chinora Academy** — bu zamonaviy ta'lim platformasi bo'lib, o'quvchilar va administratorlar uchun keng ko'lamli imkoniyatlarni taqdim etadi. Loyiha Svelte 5 va zamonaviy texnologiyalar asosida qurilgan bo'lib, foydalanuvchilarga premium tajriba (UX) va yuqori tezlikni va'da qiladi.

---

## 🚀 Loyiha haqida (About)

Chinora Academy loyihasi o'quv jarayonlarini avtomatlashtirish, kurslarni boshqarish va o'quvchilar natijalarini kuzatib borish uchun mo'ljallangan. Platforma ikki asosiy qismdan iborat:
1.  **Student Portal**: O'quvchilar uchun kurslar, reytinglar va shaxsiy natijalar.
2.  **Admin Panel**: Administratorlar uchun foydalanuvchilar, kurslar, to'lovlar va xavfsizlik jurnallarini boshqarish.

---

## ✨ Asosiy Imkoniyatlar (Key Features)

### 👨‍🎓 O'quvchilar uchun:
- **Kurslar**: Interaktiv darslar va video darsliklar (Plyr player yordamida).
- **Reyting (Leaderboard)**: O'quvchilar o'rtasidagi raqobat va natijalar.
- **Shaxsiy Profil**: Erishilgan yutuqlar va darslar tarixi.
- **Xavfsizlik**: Kontentni himoya qilish va DevTools blokirovka tizimi.

### 👨‍💼 Administratorlar uchun:
- **Dashboard**: Umumiy statistika va faollik tahlili.
- **Kurs Boshqaruvi**: Kurslarni tahrirlash, bo'limlar va darslarni qo'shish.
- **Loglar**: Kirish jurnallari (Login logs) va faollik jurnallari (Activity logs).
- **Localization**: Platformani o'zbek, rus va ingliz tillarida boshqarish.

---

## 🛠 Texnologiyalar (Tech Stack)

Loyiha eng so'nggi va kuchli texnologiyalar asosida ishlab chiqilgan:

-   **Frontend**: [Svelte 5](https://svelte.dev/) (Runes architecture)
-   **Meta-framework**: [SvelteKit](https://kit.svelte.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Animations**: [GSAP](https://gsap.com/)
-   **Localization**: [Paraglide-js](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
-   **Icons**: [Lucide Svelte](https://lucide.dev/)
-   **Notifications**: [Svelte Sonner](https://svelte-sonner.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

---

## 👨‍💻 Dasturchilar uchun qo'llanma (Developer Guide)

### 1. O'rnatish (Installation)

Loyihani mahalliy kompyuterda ishga tushirish uchun:

```bash
# Repozitoriyani yuklab olish
git clone <repo-url>
cd chinoraacademy

# Bog'liqliklarni o'rnatish
npm install
```

### 2. Ishga tushirish (Development)

```bash
npm run dev
# yoki
npm run dev -- --open
```

### 3. Build va Production

```bash
# Loyihani yig'ish
npm run build

# Preview qilish
npm run preview
```

---

## 🤖 AI Project Instrumentation (AI Agentlari uchun)

Bu bo'lim AI coding assistantlar (Antigravity, Cursor, etc.) uchun loyihaning o'ziga xosliklarini tushuntiradi:

### ⚙️ Coding Style & Standards:
- **Svelte 5 Runes**: Loyihada faqat Svelte 5 Runes (`$state`, `$derived`, `$effect`, `$props`) ishlatiladi. Eski `export let` yoki `reactive declarations`dan foydalanmang.
- **Localization**: Barcha matnlar `m.language_key()` formatida `src/lib/paraglide/messages.js` orqali o'tilishi kerak. Hardcoded matnlardan foydalanmang.
- **Styling**: Tailwind CSS 4 ishlatilmoqda. `tailwind.config.js` mavjud bo'lsa-da, Tailwind 4 prinsiplariga amal qiling.
- **API integration**: API so'rovlari uchun `src/lib/server/api.js` dagi wrapperlardan foydalaning.

### 📂 Directory Structure:
- `src/routes/(admin)`: Admin panel sahifalari.
- `src/routes/(app)`: Asosiy ilova sahifalari.
- `src/lib/components`: UI komponentlar (shadcn-like style).
- `src/lib/server`: Server-side utilitalar va API logic.
- `messages/`: Tarjima fayllari (JSON).

---

## 📄 Litsenziya

Loyiha shaxsiy mulk hisoblanadi va barcha huquqlar himoyalangan.

---
*Created with ❤️ by Chinora Academy Team*
