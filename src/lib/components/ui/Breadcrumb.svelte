<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state'; // Use Svelte 5 state
	import * as m from '$lib/paraglide/messages.js';

	let { inNavbar = false } = $props();

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

	// segmentni chiroyli qilish uchun fallback
	function formatLabel(segment) {
		const key = `breadcrumb_${segment.toLowerCase()}`;
		if (m[key]) return m[key]();
		return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	let segments = $derived(page.url.pathname.split('/').filter(Boolean));

	// Route ID segmentlarini tayyorlash (group'larni olib tashlab)
	let routeSegments = $derived(
		(page.route.id || '')
			.replace(/\/\([^)]+\)/g, '')
			.split('/')
			.filter(Boolean)
	);

	let items = $derived(
		segments
			.map((seg, i) => {
				const href = '/' + segments.slice(0, i + 1).join('/');
				const routePattern = '/' + routeSegments.slice(0, i + 1).join('/');

				// Dinamik label aniqlash
				let label = formatLabel(seg);

				// Agar bu segment parametr bo'lsa (masalan [id] yoki [lesson_id])
				const isParam = routeSegments[i]?.startsWith('[') && routeSegments[i]?.endsWith(']');

				if (isParam) {
					const paramName = routeSegments[i].slice(1, -1).replace('...', '');

					// 1. Agar dars bo'lsa
					if (
						(paramName.includes('lesson') || paramName === 'lesson_id') &&
						page.data.lesson?.title
					) {
						label = page.data.lesson.title;
					}
					// 2. Agar modul bo'lsa (parametr sifatida)
					else if (
						(paramName.includes('module') || paramName === 'module_id') &&
						(page.data.module?.title || page.data.moduleData?.title)
					) {
						label = page.data.module?.title || page.data.moduleData?.title;
					}
					// 3. Agar kurs bo'lsa
					else if (
						(paramName === 'id' || paramName.includes('course') || paramName === 'course_id') &&
						page.data.course?.title
					) {
						label = page.data.course.title;
					}
					// 4. Agar student bo'lsa
					else if (paramName.includes('student') || paramName === 'student_id') {
						if (page.data.student) {
							label = `${page.data.student.first_name || ''} ${page.data.student.last_name || ''}`.trim();
							if (!label) label = page.data.student.username;
						}
					}
					// 5. Fallback: Agar page.data da title bo'lsa va bu oxirgi segment bo'lsa
					else if (i === segments.length - 1 && page.data.title) {
						label = page.data.title;
					}
				} else {
					// Segment parametr bo'lmasa ham (masalan "lessons" static segmenti)
					// Uni modul nomi bilan almashtirishimiz mumkin, agar modul ma'lumotlari bo'lsa
					if (
						(seg.toLowerCase() === 'lessons' || seg.toLowerCase() === 'lesson') &&
						(page.data.module?.title || page.data.moduleData?.title)
					) {
						label = page.data.module?.title || page.data.moduleData?.title;
					}
				}

				return {
					label,
					href,
					isClickable: validRoutePatterns.has(routePattern)
				};
			})
			.filter((item) => item.href !== '/admin')
	);
</script>

<!-- Blury background -->
<nav class="breadcrumb backdrop-blur-sm {inNavbar ? 'in-navbar' : ''}">
	{#if items.length === 0}
		<span class="current truncate-item"
			>{m.breadcrumb_dashboard ? m.breadcrumb_dashboard() : 'Dashboard'}</span
		>
	{/if}
	{#each items as item, i (item.href)}
		{#if i > 0 && item.isClickable}
			<span class="separator">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-3 w-3"><path d="m9 18 6-6-6-6"></path></svg
				>
			</span>
		{/if}

		{#if i !== items.length - 1}
			{#if item.isClickable}
				<a href={resolve(/** @type {any} */ (item.href))} class="link truncate-item">
					{item.label}
				</a>
			{/if}
		{:else}
			<span class="current truncate-item" title={item.label}>
				{item.label}
			</span>
		{/if}
	{/each}
</nav>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 13px;
		font-weight: 500;
		color: #64748b;
	}

	.in-navbar {
		margin-bottom: 0;
		background: transparent;
		box-shadow: none;
		border: none;
		padding: 0;
		max-width: 450px; /* Desktop limitation */
	}

	/* Logic for mobile hide in Navbar */
	@media (max-width: 1023px) {
		.in-navbar {
			display: none !important;
		}
	}

	.truncate-item {
		max-width: 160px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: middle;
	}

	.separator {
		color: #cbd5e1;
		display: flex;
		align-items: center;
		opacity: 0.7;
		flex-shrink: 0;
	}

	.link {
		color: #64748b;
		text-decoration: none;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		padding: 4px 6px;
		border-radius: 8px;
		flex-shrink: 1;
	}

	.link:hover {
		color: #9b1c48;
		background: rgba(155, 28, 72, 0.05);
	}

	.current {
		color: #1e293b;
		font-weight: 700;
		padding: 4px 6px;
		letter-spacing: -0.01em;
		flex-shrink: 1;
	}

	@media (max-width: 640px) {
		.breadcrumb {
			font-size: 12px;
			gap: 2px;
		}
		.truncate-item {
			max-width: 120px;
		}
	}
</style>
