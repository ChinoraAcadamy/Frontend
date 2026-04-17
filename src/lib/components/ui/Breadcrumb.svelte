<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	// Barcha mavjud sahifalarni olish (Vite build-time magic)
	const pages = import.meta.glob('/src/routes/**/+page.svelte');

	// Sahifa yo'llarini pattern ko'rinishiga o'tkazish
	const validRoutePatterns = new Set(
		Object.keys(pages).map((path) => {
			return (
				path
					.replace('/src/routes', '')
					.replace('/+page.svelte', '')
					.replace(/\/\([^)]+\)/g, '') // (app), (admin) kabi group'larni olib tashlash
					.replace(/\/index$/, '') || '/'
			);
		})
	);

	const staticLabels = {
		kurslarim: 'Mening kurslarim',
		admin: 'Admin',
		courses: 'Kurslar',
		lessons: 'Darslar',
		lesson: 'Dars',
		students: "O'quvchilar",
		profile: 'Profil',
		profil: 'Profil',
		dashboard: 'Dashboard',
		logs: 'Loglar',
		activity: 'Faollik',
		login: 'Kirishlar',
		submissions: 'Topshiriqlar',
		baholar: 'Baholar',
		taqvim: 'Taqvim'
	};

	// segmentni chiroyli qilish uchun fallback
	function formatLabel(segment) {
		if (staticLabels[segment.toLowerCase()]) return staticLabels[segment.toLowerCase()];
		return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	$: segments = $page.url.pathname.split('/').filter(Boolean);

	// Route ID segmentlarini tayyorlash (group'larni olib tashlab)
	$: routeSegments = ($page.route.id || '')
		.replace(/\/\([^)]+\)/g, '')
		.split('/')
		.filter(Boolean);

	$: items = segments.map((seg, i) => {
		const href = '/' + segments.slice(0, i + 1).join('/');
		const routePattern = '/' + routeSegments.slice(0, i + 1).join('/');

		// Dinamik label aniqlash
		let label = formatLabel(seg);

		// Agar bu segment parametr bo'lsa (masalan [id] yoki [lesson_id])
		const isParam = routeSegments[i]?.startsWith('[') && routeSegments[i]?.endsWith(']');
		if (isParam) {
			const paramName = routeSegments[i].slice(1, -1).replace('...', '');

			// $page.data dan mos nomni qidirish
			// 1. Agar dars bo'lsa
			if (paramName.includes('lesson') && $page.data.lesson?.title) {
				label = $page.data.lesson.title;
			}
			// 2. Agar kurs bo'lsa
			else if ((paramName === 'id' || paramName.includes('course')) && $page.data.course?.title) {
				label = $page.data.course.title;
			}
			// 3. Agar student bo'lsa
			else if (paramName.includes('student') || paramName === 'id') {
				if ($page.data.student) {
					label = `${$page.data.student.first_name} ${$page.data.student.last_name}`;
				}
			}
			// 4. Fallback: Agar page.data da title bo'lsa va bu oxirgi segment bo'lsa
			else if (i === segments.length - 1 && $page.data.title) {
				label = $page.data.title;
			}
		}

		return {
			label,
			href,
			isClickable: validRoutePatterns.has(routePattern)
		};
	});
</script>

<!-- Blury background -->
<nav class="breadcrumb bg-background/50 backdrop-blur-sm">
	{#if items.length === 0}
		<span class="current">Dashboard</span>
	{/if}
	{#each items as item, i (item.href)}
		{#if i > 0 && item.isClickable}
			<span class="separator">›</span>
		{/if}

		{#if i !== items.length - 1}
			{#if item.isClickable}
				<a href={resolve(/** @type {any} */ (item.href))} class="link">
					{item.label}
				</a>
			{/if}
		{:else}
			<span class="current">
				{item.label}
			</span>
		{/if}
	{/each}
</nav>

<style>
	@reference "tailwindcss";
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #6b7280;
		margin-bottom: 6px;
		position: sticky;
		top: 70px;
	}

	.separator {
		color: #9ca3af;
		font-weight: 300;
	}

	.link {
		color: #9b1c48;
		text-decoration: none;
		transition: color 0.2s;
	}

	.link:hover {
		text-decoration: underline;
	}

	.current {
		color: #1a0e13;
		font-weight: 600;
	}

	.non-clickable {
		color: #9ca3af;
		cursor: default;
	}
</style>
