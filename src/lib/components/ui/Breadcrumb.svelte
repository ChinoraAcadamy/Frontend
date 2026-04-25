<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import { Home } from 'lucide-svelte';

	let { inNavbar = false } = $props();

	const pages = import.meta.glob('/src/routes/**/+page.svelte');

	const validRoutePatterns = new Set(
		Object.keys(pages).map((path) => {
			return (
				path
					.replace('/src/routes', '')
					.replace('/+page.svelte', '')
					.replace(/\/\([^)]+\)/g, '')
					.replace(/\/index$/, '') || '/'
			);
		})
	);

	function formatLabel(segment) {
		const key = `breadcrumb_${segment.toLowerCase()}`;
		if (m[key]) return m[key]();
		return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	let segments = $derived(page.url.pathname.split('/').filter(Boolean));

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

				let label = formatLabel(seg);
				const isParam = routeSegments[i]?.startsWith('[') && routeSegments[i]?.endsWith(']');

				if (isParam) {
					const paramName = routeSegments[i].slice(1, -1).replace('...', '');

					if ((paramName.includes('lesson') || paramName === 'lesson_id') && page.data.lesson?.title) {
						label = page.data.lesson.title;
					} else if ((paramName.includes('module') || paramName === 'module_id') && (page.data.module?.title || page.data.moduleData?.title)) {
						label = page.data.module?.title || page.data.moduleData?.title;
					} else if ((paramName === 'id' || paramName.includes('course') || paramName === 'course_id') && page.data.course?.title) {
						label = page.data.course.title;
					} else if (paramName.includes('student') || paramName === 'student_id') {
						if (page.data.student) {
							label = `${page.data.student.first_name || ''} ${page.data.student.last_name || ''}`.trim() || page.data.student.username;
						}
					} else if (i === segments.length - 1 && page.data.title) {
						label = page.data.title;
					}
				} else {
					if ((seg.toLowerCase() === 'lessons' || seg.toLowerCase() === 'lesson') && (page.data.module?.title || page.data.moduleData?.title)) {
						label = page.data.module?.title || page.data.moduleData?.title;
					}
				}

				return { label, href, isClickable: validRoutePatterns.has(routePattern) };
			})
			.filter((item) => item.href !== '/admin')
	);

	// Dinamik home link (admin vs student)
	let homeHref = $derived(
		page.data.user?.role === 'admin' || page.data.user?.role === 'superadmin'
			? '/admin/dashboard'
			: '/dashboard'
	);

	// Mobile: faqat oxirgi 2 elementni ko'rsatish
	let mobileItems = $derived(items.slice(-2));
	let hasMore = $derived(items.length > 2);
</script>

<!-- Desktop: inNavbar holati -->
{#if inNavbar}
	<nav class="bc-desktop" aria-label="Breadcrumb">
		<a href={resolve(/** @type {any} */ (homeHref))} class="bc-home" aria-label="Dashboard">
			<Home size={13} strokeWidth={2.5} />
		</a>
		{#each items as item, i (item.href)}
			<span class="bc-sep" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="10" height="10">
					<path d="m9 18 6-6-6-6"/>
				</svg>
			</span>
			{#if i !== items.length - 1}
				{#if item.isClickable}
					<a href={resolve(/** @type {any} */(item.href))} class="bc-link">{item.label}</a>
				{/if}
			{:else}
				<span class="bc-current" title={item.label}>{item.label}</span>
			{/if}
		{/each}
	</nav>

<!-- Mobile: sticky bar holati -->
{:else}
	<nav class="bc-mobile" aria-label="Breadcrumb">
		<div class="bc-mobile-inner">
			<!-- Agar oldin ko'proq element bo'lsa, orqaga o'tish uchun -->
			{#if hasMore}
				{@const backItem = items[items.length - 2]}
				{#if backItem?.isClickable}
					<a href={resolve(/** @type {any} */(backItem.href))} class="bc-back-btn" aria-label="Back">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
							<path d="m15 18-6-6 6-6"/>
						</svg>
					</a>
				{/if}
			{:else}
				<a href={resolve(/** @type {any} */(homeHref))} class="bc-back-btn" aria-label="Dashboard">
					<Home size={14} strokeWidth={2.5} />
				</a>
			{/if}

			<!-- Trail -->
			<div class="bc-trail">
				{#if hasMore}
					<span class="bc-trail-dots" aria-hidden="true">···</span>
					<span class="bc-trail-sep" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="10" height="10">
							<path d="m9 18 6-6-6-6"/>
						</svg>
					</span>
				{/if}

				{#each mobileItems as item, i (item.href)}
					{#if i > 0}
						<span class="bc-trail-sep" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="10" height="10">
								<path d="m9 18 6-6-6-6"/>
							</svg>
						</span>
					{/if}

					{#if i !== mobileItems.length - 1 && item.isClickable}
						<a href={resolve(/** @type {any} */(item.href))} class="bc-trail-link">{item.label}</a>
					{:else if i === mobileItems.length - 1}
						<span class="bc-trail-current" title={item.label}>{item.label}</span>
					{/if}
				{/each}
			</div>
		</div>
	</nav>
{/if}

<style>
	/* ─── Desktop (inNavbar) ────────────────────────────────────── */
	.bc-desktop {
		display: flex;
		align-items: center;
		gap: 2px;
		max-width: 450px;
		flex-wrap: nowrap;
		overflow: hidden;
	}

	@media (max-width: 1023px) {
		.bc-desktop {
			display: none;
		}
	}

	.bc-home {
		display: flex;
		align-items: center;
		color: #94a3b8;
		padding: 4px;
		border-radius: 6px;
		transition: color 0.15s;
		flex-shrink: 0;
		text-decoration: none;
	}
	.bc-home:hover { color: #9b1c48; }

	.bc-sep {
		color: #cbd5e1;
		display: flex;
		align-items: center;
		flex-shrink: 0;
		opacity: 0.6;
	}

	.bc-link {
		font-size: 13px;
		font-weight: 500;
		color: #64748b;
		text-decoration: none;
		padding: 3px 6px;
		border-radius: 6px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 140px;
		transition: color 0.15s, background 0.15s;
	}
	.bc-link:hover { color: #9b1c48; background: rgba(155, 28, 72, 0.05); }

	.bc-current {
		font-size: 13px;
		font-weight: 700;
		color: #1e293b;
		padding: 3px 6px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 160px;
		letter-spacing: -0.01em;
	}

	/* ─── Mobile bar ────────────────────────────────────────────── */
	.bc-mobile {
		width: 100%;
	}

	.bc-mobile-inner {
		display: flex;
		align-items: center;
		gap: 0;
		height: 44px;
		padding-inline: 1rem;
	}

	/* Back / Home button */
	.bc-back-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: rgba(155, 28, 72, 0.07);
		color: #9b1c48;
		text-decoration: none;
		flex-shrink: 0;
		transition: background 0.15s, transform 0.12s;
		margin-right: 10px;
	}
	.bc-back-btn:hover { background: rgba(155, 28, 72, 0.12); }
	.bc-back-btn:active { transform: scale(0.93); }

	/* Trail */
	.bc-trail {
		display: flex;
		align-items: center;
		gap: 3px;
		overflow: hidden;
		flex: 1;
		min-width: 0;
	}

	.bc-trail-dots {
		font-size: 13px;
		font-weight: 700;
		color: #94a3b8;
		letter-spacing: 0.05em;
		flex-shrink: 0;
		line-height: 1;
	}

	.bc-trail-sep {
		display: flex;
		align-items: center;
		color: #cbd5e1;
		flex-shrink: 0;
	}

	.bc-trail-link {
		font-size: 13px;
		font-weight: 500;
		color: #64748b;
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100px;
		flex-shrink: 1;
		padding: 2px 4px;
		border-radius: 5px;
		transition: color 0.15s;
	}
	.bc-trail-link:hover { color: #9b1c48; }

	.bc-trail-current {
		font-size: 13px;
		font-weight: 700;
		color: #0f172a;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
		letter-spacing: -0.01em;
	}
</style>