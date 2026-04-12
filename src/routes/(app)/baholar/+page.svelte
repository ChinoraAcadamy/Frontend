<script>
	import SubmissionList from '@/lib/components/ui/submissions/SubmissionList.svelte';
	import SubmissionSkeleton from '@/lib/components/ui/submissions/SubmissionSkeleton.svelte';

	let { data } = $props();
	(async () => {
		console.log(await data.streamed.submissionsData);
	})();
</script>

<div class="mx-auto max-w-275 px-6 pt-8 pb-12 md:px-4 md:py-6 md:pb-10">
	{#await data.streamed.submissionsData}
		<!-- Loading holatida Skelet ko'rsatamiz -->
		<div class="mb-8">
			<div
				class="mb-1.5 h-4 w-24 animate-pulse rounded-md bg-slate-200 text-[11px] font-bold tracking-[2px] text-[#9b1c48] uppercase"
			></div>
			<div class="mb-6 h-10 w-64 animate-pulse rounded-lg bg-slate-200"></div>

			<div class="inline-flex gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1.5">
				<div class="h-10 w-24 animate-pulse rounded-xl bg-slate-200"></div>
				<div class="h-10 w-24 animate-pulse rounded-xl bg-slate-100"></div>
				<div class="h-10 w-24 animate-pulse rounded-xl bg-slate-100"></div>
			</div>
		</div>

		<SubmissionSkeleton count={4} />
	{:then resolvedData}
		<!-- Ma'lumot tayyor bo'lganda Generic componentni ko'rsatamiz -->
		<SubmissionList
			submissions={resolvedData.results ?? []}
			totalCount={resolvedData.count ?? 0}
			nextPage={resolvedData.next}
			prevPage={resolvedData.previous}
			currentPage={data.currentPage}
			filters={data.filters}
			role="student"
			basePath="/baholar"
		/>
	{/await}
</div>
