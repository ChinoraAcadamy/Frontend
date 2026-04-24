<script>
	import SubmissionList from '@/lib/components/ui/submissions/SubmissionList.svelte';
	import SubmissionSkeleton from '@/lib/components/ui/submissions/SubmissionSkeleton.svelte';

	let { data } = $props();
</script>

<div class="mx-auto max-w-7xl px-6 pt-8 pb-12 md:px-8 md:py-8 md:pb-10">
	{#await data.streamed.submissionsData}

		<!-- Loading holatida Skelet ko'rsatamiz -->
		<div class="mb-8">
			<div
				class="mb-1.5 h-4 w-24 animate-pulse rounded-md bg-muted/10 text-[11px] font-bold tracking-[2px] text-primary uppercase"
			></div>
			<div class="mb-6 h-10 w-64 animate-pulse rounded-lg bg-muted/10"></div>

			<div class="inline-flex gap-1 rounded-2xl border border-border bg-muted/5 p-1.5">
				<div class="h-10 w-24 animate-pulse rounded-xl bg-muted/10"></div>
				<div class="h-10 w-24 animate-pulse rounded-xl bg-muted/5"></div>
				<div class="h-10 w-24 animate-pulse rounded-xl bg-muted/5"></div>
			</div>
		</div>

		<SubmissionSkeleton count={6} />
	{:then resolvedData}
		<!-- Ma'lumot tayyor bo'lganda Generic componentni Admin rejimida ko'rsatamiz -->
		<SubmissionList
			submissions={resolvedData.results ?? []}
			totalCount={resolvedData.count ?? 0}
			nextPage={resolvedData.next}
			prevPage={resolvedData.previous}
			currentPage={data.currentPage}
			filters={data.filters}
			role="admin"
			basePath="/admin/submissions"
		/>
	{/await}
</div>
