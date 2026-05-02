<!-- src/lib/components/dashboard/RecentSubmissions.svelte -->
<script lang="ts">
	let { data = [] } = $props();
</script>

<div class="submissions-card">
	<div class="card-header">
		<h2>Recent Submissions</h2>
	</div>

	<div class="submissions-list">
		{#each data as item (item.id)}
			<div class="submission-item">
				<div class="submission-info">
					<span class="title">{item.title}</span>
					<span class="course">{item.course}</span>
				</div>

				<div class="score">{item.score}</div>

				<span class="status {item.status.toLowerCase()}">
					{item.status}
				</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.submissions-card {
		background: white;
		border-radius: 20px;
		padding: 24px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
		height: 100%;
	}

	.card-header h2 {
		font-size: 18px;
		font-weight: 700;
		margin-bottom: 20px;
	}

	.submission-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.submission-item:last-child {
		border-bottom: none;
	}

	.submission-info {
		flex: 1;
	}

	.title {
		font-weight: 600;
		display: block;
	}

	.course {
		font-size: 13px;
		color: #6b7280;
	}

	.score {
		font-weight: 700;
		margin-right: 16px;
		color: #1a0e13;
	}

	.status {
		padding: 6px 14px;
		border-radius: 9999px;
		font-size: 13px;
		font-weight: 600;
	}

	.status.pending {
		background: #fff7e6;
		color: #d97706;
	}

	.status.graded {
		background: #ecfdf5;
		color: #059669;
	}
</style>