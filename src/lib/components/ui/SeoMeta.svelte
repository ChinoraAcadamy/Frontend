<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [title] - Sahifa sarlavhasi
	 * @property {string} [description] - Sahifa qisqacha tavsifi (max 160 belgi tavsiya etiladi)
	 * @property {string} [keywords] - SEO uchun kalit so'zlar
	 * @property {string} [image] - Open Graph va Twitter card uchun rasm URL manzili
	 * @property {string} [url] - Joriy sahifaning to'liq URL manzili
	 * @property {string} [type] - Open Graph tipi (masalan: website, article)
	 * @property {string} [robots] - Qidiruv botlari harakati (masalan: index, follow yoki noindex, nofollow)
	 */

	/** @type {Props} */
	let {
		title = 'Chinora Academy - Zamonaviy ta`lim platformasi',
		description = 'Chinora Academy bilan eng so`nggi bilimlarni o`zlashtiring. Bizning platformamiz orqali bilim va ko`nikmalaringizni keyingi bosqichga olib chiqing.',
		keywords = 'ta`lim, kurslar, onlayn kurslar, dasturlash, dizayn, akademiya, chinora, o`rganish',
		image = '/images/og-image.jpeg', // odatiy OG rasmini loyihada static/images/ ichiga qo'shish tavsiya qilinadi
		url = 'https://chinora.uz',
		type = 'website',
		robots = 'index, follow'
	} = $props();

	// Title ga har doim loyiha nomini qo'shib qo'yamiz (agar o'zi asosiy title bo'lmasa)
	const fullTitle = title.includes('Chinora Academy') ? title : `${title} | Chinora Academy`;
</script>

<svelte:head>
	<!-- Asosiy SEO Taglari -->
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content={robots} />
	<meta name="author" content="Chinora Academy" />

	<!-- Open Graph (Facebook, Telegram kabi platformalar uchun) -->
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="Chinora Academy" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:site" content="@ChinoraAcademy" />

	<!-- Canonical link -->
	<link rel="canonical" href={url} />
</svelte:head>
