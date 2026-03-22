<!-- src/lib/components/dashboard/ScoreCard.svelte -->
<script lang="ts">
	let { score, max } = $props();
	const percentage = Math.round((score / max) * 100);
</script>

<div class="score-card">
	<div class="score-header">
		<span class="score-title">Total Score</span>
		<span class="score-value">{score}/{max}</span>
	</div>
	<p class="score-subtitle">Umumiy ball</p>
	<div class="progress-bar">
		<div class="progress-fill" style="width: {percentage}%"></div>
	</div>
</div>

<style>
	.score-card {
		background: linear-gradient(135deg, #FF4D8D, #C43C66);
		color: white;
		border-radius: 16px;
		padding: 24px;
	}

	.score-value {
		font-size: 32px;
		font-weight: 800;
	}

	.progress-bar {
		height: 8px;
		background: rgba(255,255,255,0.3);
		border-radius: 9999px;
		margin-top: 16px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: white;
		border-radius: 9999px;
	}
</style>