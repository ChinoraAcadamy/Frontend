<!-- src/lib/components/layout/admin/DashboardMain.svelte -->
<script lang="ts">
	import { Users, BookOpen, FileText, DollarSign } from 'lucide-svelte';

	let {
		stats = {
			totalStudents: 4006,
			activeCourses: 49,
			pendingSubmissions: 223,
			totalRevenue: 326000
		},
		topStudents = [
			{ rank: 1, name: "Anne Smith", score: 60, color: "#FF4D8D" },
			{ rank: 2, name: "Lavid Smith", score: 80, color: "#10B981" },
			{ rank: 3, name: "Maron Shamrad", score: 76, color: "#F59E0B" },
			{ rank: 4, name: "Maria Hankin", score: 80, color: "#EF4444" },
			{ rank: 5, name: "Jelan Smith", score: 76, color: "#6B7280" }
		],
		recentSubmissions = [
			{ title: "Client Submission 1", date: "February 21, 2022", status: "Pending" },
			{ title: "Graded Submission 2", date: "August 13, 2022", status: "Success" },
			{ title: "Recent Submission 3", date: "April 28, 2022", status: "Warning" },
			{ title: "Graded Submission 4", date: "August 27, 2022", status: "Danger" },
			{ title: "Recent Submission 5", date: "January 13, 2022", status: "Pending" }
		]
	} = $props();

	const statusStyles = {
		Pending: { bg: '#FFF7E6', text: '#D97706', label: 'Pending' },
		Success: { bg: '#ECFDF5', text: '#059669', label: 'Success' },
		Warning: { bg: '#FFF7E6', text: '#D97706', label: 'Warning' },
		Danger:  { bg: '#FFF1F2', text: '#E11D48', label: 'Danger' }
	};
</script>

<main class="dash-main">
	<div class="page-header">
		<h1 class="page-title">Dashboard</h1>
	</div>

	<!-- Stats Cards -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon" style="background: #FFF0F5; color: #FF4D8D;">
				<Users size={26} />
			</div>
			<div>
				<p class="stat-label">Total Students</p>
				<p class="stat-value">{stats.totalStudents.toLocaleString()}</p>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon" style="background: #F0FDF8; color: #10B981;">
				<BookOpen size={26} />
			</div>
			<div>
				<p class="stat-label">Active Courses</p>
				<p class="stat-value">{stats.activeCourses}</p>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon" style="background: #FFFBEB; color: #F59E0B;">
				<FileText size={26} />
			</div>
			<div>
				<p class="stat-label">Pending Submissions</p>
				<p class="stat-value">{stats.pendingSubmissions}</p>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon" style="background: #F9FAFB; color: #6B7280;">
				<DollarSign size={26} />
			</div>
			<div>
				<p class="stat-label">Total Revenue</p>
				<p class="stat-value">${stats.totalRevenue.toLocaleString()}</p>
			</div>
		</div>
	</div>

	<!-- Bottom Section -->
	<div class="bottom-row">
		<!-- Top 5 Students -->
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Top 5 Students</h2>
			</div>
			<table class="students-table">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Name</th>
						<th>Score</th>
						<th>Progress</th>
					</tr>
				</thead>
				<tbody>
					{#each topStudents as student (student.rank)}
						<tr>
							<td class="rank">{student.rank}</td>
							<td class="name">
								<div class="avatar" style="background:{student.color}">
									{student.name[0]}
								</div>
								{student.name}
							</td>
							<td class="score">{student.score}</td>
							<td>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {student.score}%; background:{student.color}"></div>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Recent Submissions -->
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Recent Submissions</h2>
			</div>
			<div class="submissions-list">
				{#each recentSubmissions as sub (sub.title)}
					<div class="submission-item">
						<div>
							<p class="sub-title">{sub.title}</p>
							<p class="sub-date">{sub.date}</p>
						</div>
						<span 
							class="status-badge"
							style="background:{statusStyles[sub.status].bg}; color:{statusStyles[sub.status].text}"
						>
							{statusStyles[sub.status].label}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
	/* ==================== MAIN LAYOUT ==================== */
	.dash-main {
		padding: 32px;
		max-width: 1280px;
		margin: 0 auto;
	}

	.page-title {
		font-size: 28px;
		font-weight: 800;
		color: #1a0e13;
		letter-spacing: -0.6px;
	}

	/* Stats */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 20px;
		margin-bottom: 32px;
	}

	.stat-card {
		background: white;
		border: 1px solid #f0f0f0;
		border-radius: 16px;
		padding: 24px;
		display: flex;
		align-items: center;
		gap: 18px;
		transition: all 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px rgba(0,0,0,0.06);
	}

	.stat-icon {
		width: 56px;
		height: 56px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stat-label {
		font-size: 13px;
		color: #9ca3af;
		font-weight: 500;
	}

	.stat-value {
		font-size: 26px;
		font-weight: 800;
		color: #1a0e13;
		margin-top: 4px;
	}

	/* Bottom Row */
	.bottom-row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 24px;
	}

	.card {
		background: white;
		border: 1px solid #f0f0f0;
		border-radius: 16px;
		padding: 24px;
	}

	.card-title {
		font-size: 17px;
		font-weight: 700;
		color: #1a0e13;
		margin-bottom: 20px;
	}

	/* Table */
	.students-table {
		width: 100%;
		border-collapse: collapse;
	}

	.students-table th {
		text-align: left;
		font-size: 12px;
		font-weight: 600;
		color: #9ca3af;
		padding-bottom: 12px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.students-table td {
		padding: 14px 0;
		border-top: 1px solid #f5f5f5;
	}

	.rank { color: #9ca3af; font-weight: 600; width: 40px; }
	.name { display: flex; align-items: center; gap: 12px; font-weight: 500; }
	.avatar {
		width: 32px; height: 32px; border-radius: 50%; color: white;
		display: flex; align-items: center; justify-content: center;
		font-weight: 700; font-size: 13px;
	}
	.score { font-weight: 700; color: #1a0e13; }
	.progress-bar {
		height: 6px; background: #f3f4f6; border-radius: 9999px; overflow: hidden;
	}
	.progress-fill {
		height: 100%; border-radius: 9999px;
	}

	/* Submissions */
	.submissions-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.submission-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.sub-title { font-weight: 600; font-size: 14.5px; }
	.sub-date { font-size: 12.5px; color: #9ca3af; }

	.status-badge {
		padding: 5px 14px;
		border-radius: 9999px;
		font-size: 12px;
		font-weight: 600;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.bottom-row { grid-template-columns: 1fr; }
		.stats-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 640px) {
		.dash-main { padding: 20px; }
		.stats-grid { grid-template-columns: 1fr; }
	}
</style>