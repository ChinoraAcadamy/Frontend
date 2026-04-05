<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	// labelni chiroyli qilish uchun
	function formatLabel(segment) {
		return segment
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}

	$: segments = $page.url.pathname
		.split('/')
		.filter(Boolean);

	$: items = segments.map((seg, i) => {
		return {
			label: formatLabel(seg),
			href: '/' + segments.slice(0, i + 1).join('/')
		};
	});
</script>

<!-- Blury background -->
<nav class="breadcrumb bg-background/50 backdrop-blur-sm">
    {#if items.length === 0}
        <span class="current">Dashboard</span>
    {/if}
	{#each items as item, i (item.href)}
		{#if i > 0}
			<span class="separator">›</span>
		{/if}

		{#if i !== items.length - 1}
			<a href={resolve(/** @type {any} */ (item.href))} class="link">
				{item.label}
			</a>
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
		color: #9B1C48;
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
</style>