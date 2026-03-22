<!-- src/lib/components/dashboard/Leaderboard.svelte -->
<script lang="ts">
	let { data = [] } = $props();

	// data misoli: [{ pos, name, score, course, isMe }]
</script>

<div class="leaderboard-card">
	<div class="card-header">
		<h2>Ranking Leaderboard</h2>
	</div>

	<div class="leaderboard-list">
		{#each data as item (item.name)}
			<div class="leaderboard-row {item.isMe ? 'me' : ''}">
				<div class="rank">
					{#if item.pos === 1}
						<span class="trophy">🏆</span>
					{:else if item.pos === 2}
						<span class="trophy">🥈</span>
					{:else if item.pos === 3}
						<span class="trophy">🥉</span>
					{:else}
						<span class="pos">{item.pos}</span>
					{/if}
				</div>

				<div class="avatar">
					<div class="avatar-bg" style="background: {item.avatarColor || '#FF4D8D'}">
						{item.name[0]}
					</div>
				</div>

				<div class="info">
					<span class="name">{item.name}</span>
					<span class="course">{item.course}</span>
				</div>

				<div class="score">
					{item.score}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.leaderboard-card {
		background: white;
		border-radius: 20px;
		padding: 24px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
	}

	.card-header h2 {
		font-size: 18px;
		font-weight: 700;
		color: #1a0e13;
		margin-bottom: 20px;
	}

	.leaderboard-row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px 16px;
		border-radius: 12px;
		transition: all 0.2s;
	}

	.leaderboard-row:hover {
		background: #fdf2f6;
	}

	.leaderboard-row.me {
		background: #fff0f5;
		border: 2px solid #FF4D8D;
	}

	.rank {
		width: 32px;
		font-weight: 700;
		text-align: center;
	}

	.trophy {
		font-size: 22px;
	}

	.avatar-bg {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 700;
		font-size: 16px;
	}

	.info {
		flex: 1;
	}

	.name {
		font-weight: 600;
		display: block;
	}

	.course {
		font-size: 13px;
		color: #6b7280;
	}

	.score {
		font-weight: 700;
		font-size: 18px;
		color: #1a0e13;
	}
</style>