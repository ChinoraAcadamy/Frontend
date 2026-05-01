<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		Users,
		BookOpen,
		TrendingUp,
		DollarSign,
		Plus,
		Search,
		Activity,
		Bell,
		CheckCircle2,
		ArrowUpRight,
		ArrowDownRight,
		BarChart3,
		Zap,
		ShieldCheck,
		FileText,
		ChevronRight,
		Layers,
		Star,
		LogOut,
		LogIn,
		Lock,
		ShieldAlert,
		Trash2,
		Edit3,
		UserPlus,
		CheckSquare
	} from 'lucide-svelte';
	import LeaderboardTable from '@/lib/components/ui/dashboard/LeaderboardTable.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	const now = new Date();
	const hour = now.getHours();
	const greeting =
		hour < 12
			? (m.admin_dash_greeting_morning?.() ?? 'Xayrli tong')
			: hour < 17
				? (m.admin_dash_greeting_afternoon?.() ?? 'Xayrli kun')
				: (m.admin_dash_greeting_evening?.() ?? 'Xayrli kech');

	const statConfig = [
		{
			key: 'totalCount',
			title: m.admin_dash_total_students?.() ?? 'Jami shogirdlar',
			change: '+18',
			trend: 'up',
			icon: Users,
			accent: '#9b1c48',
			accentBg: 'rgba(155,28,72,0.08)',
			desc: m.admin_dash_stats_vs_prev_month?.() ?? "O'tgan oyga nisbatan"
		},
		{
			key: 'coursesCount',
			title: m.admin_dash_active_courses?.() ?? 'Faol kurslar',
			change: '+2',
			trend: 'up',
			icon: BookOpen,
			accent: '#0ea5e9',
			accentBg: 'rgba(14,165,233,0.08)',
			desc: m.admin_dash_stats_new_courses?.() ?? "Yangi kurslar qo'shildi"
		},
		{
			title: m.admin_dash_monthly_income?.() ?? 'Bu oy daromad',
			value: '18.4M',
			change: '+12%',
			trend: 'up',
			icon: DollarSign,
			accent: '#16a34a',
			accentBg: 'rgba(22,163,74,0.08)',
			desc: m.admin_dash_stats_currency?.() ?? "So'm"
		},
		{
			title: m.admin_dash_avg_retention?.() ?? "O'rtacha retention",
			value: '87%',
			change: '-3%',
			trend: 'down',
			icon: TrendingUp,
			accent: '#f59e0b',
			accentBg: 'rgba(245,158,11,0.08)',
			desc: m.admin_dash_stats_retention_desc?.() ?? 'Kurs oxiriga yetish'
		}
	];

	const quickActions = [
		{
			label: m.admin_dash_add_student?.() ?? "Shogird qo'shish",
			icon: Users,
			href: '/admin/students',
			color: '#9b1c48'
		},
		{
			label: m.admin_dash_add_course_qa?.() ?? 'Kurs yaratish',
			icon: BookOpen,
			href: '/admin/courses/create',
			color: '#0ea5e9'
		},
		{
			label: m.admin_dash_qa_submissions?.() ?? 'Topshiriqlar',
			icon: FileText,
			href: '/admin/submissions',
			color: '#8b5cf6'
		},
		{
			label: m.admin_dash_qa_activity?.() ?? 'Faoliyat',
			icon: Activity,
			href: '/admin/logs/activity',
			color: '#ec4899'
		}
	];

	const systemAlerts = [
		{
			level: 'info',
			text: m.admin_dash_system_alert_new_mc?.() ?? "Yangi masterclass ro'yxatdan o'tish ochiq",
			icon: Bell
		},
		{
			level: 'ok',
			text: m.admin_dash_system_alert_all_ok?.() ?? 'Barcha tizim servicelar ishlayapti',
			icon: ShieldCheck
		}
	];

	const getActionConfig = (action) => {
		const safeAction = (action || '').toUpperCase();
		const map = {
			CREATE: {
				label: m.admin_logs_act_created?.() ?? 'Yaratildi',
				icon: Plus,
				color: '#16a34a'
			},
			UPDATE: {
				label: m.admin_logs_act_updated?.() ?? 'Yangilandi',
				icon: Edit3,
				color: '#0ea5e9'
			},
			DELETE: {
				label: m.admin_logs_act_deleted?.() ?? "O'chirildi",
				icon: Trash2,
				color: '#dc2626'
			},
			LOGOUT: {
				label: m.admin_logs_act_logout?.() ?? 'Tizimdan chiqish',
				icon: LogOut,
				color: '#f59e0b'
			},
			LOGIN: {
				label: m.admin_logs_act_login?.() ?? 'Tizimga kirish',
				icon: LogIn,
				color: '#16a34a'
			},
			SUBMISSION_CREATED: {
				label: m.admin_logs_act_sub_created?.() ?? 'Topshiriq yubordi',
				icon: FileText,
				color: '#8b5cf6'
			},
			SUBMISSION_GRADED: {
				label: m.admin_logs_act_sub_graded?.() ?? 'Topshiriq baholandi',
				icon: CheckCircle2,
				color: '#9b1c48'
			},
			LESSON_COMPLETED: {
				label: m.admin_logs_act_lesson_comp?.() ?? 'Darsni tugatdi',
				icon: CheckSquare,
				color: '#10b981'
			},
			STUDENT_DEACTIVATED: {
				label: m.admin_logs_act_student_deact?.() ?? 'Talaba faolsizlantirildi',
				icon: ShieldAlert,
				color: '#dc2626'
			},
			PASSWORD_CHANGED: {
				label: m.admin_logs_act_pwd_changed?.() ?? "Parol o'zgartirildi",
				icon: Lock,
				color: '#f59e0b'
			},
			ADMIN_CREATED: {
				label: m.admin_logs_act_admin_created?.() ?? 'Admin yaratildi',
				icon: UserPlus,
				color: '#16a34a'
			},
			ENROLLMENT_CREATED: {
				label: m.admin_logs_act_enroll_created?.() ?? "Kursga a'zo qilindi",
				icon: UserPlus,
				color: '#0ea5e9'
			},
			COURSE_CREATED: {
				label: m.admin_logs_act_course_created?.() ?? 'Kurs yaratildi',
				icon: BookOpen,
				color: '#16a34a'
			},
			COURSE_UPDATED: {
				label: m.admin_logs_act_course_updated?.() ?? 'Kurs yangilandi',
				icon: Edit3,
				color: '#0ea5e9'
			}
		};

		return (
			map[safeAction] || {
				label: action?.replace(/_/g, ' ') || (m.admin_dash_qa_activity?.() ?? 'Faoliyat'),
				icon: Activity,
				color: '#8a7a82'
			}
		);
	};

	const formatRelativeTime = (dateString) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const diffMs = now.getTime() - date.getTime();
		const diffMin = Math.floor(diffMs / 60000);

		if (diffMin < 1) return m.time_now?.() ?? 'Hozir';
		if (diffMin < 60) return `${diffMin} ${m.unit_min?.() ?? 'daq'}`;
		const diffHr = Math.floor(diffMin / 60);
		if (diffHr < 24) return `${diffHr} ${m.unit_hour?.() ?? 'soat'}`;
		return date.toLocaleDateString();
	};

	let searchQuery = $state('');
</script>

<div class="dash">
	<!-- ── Header ───────────────────────────── -->
	<div class="dash-header">
		<div class="dash-header-inner">
			<div class="header-left">
				<p class="greeting-label">{greeting}, Admin 👋</p>
				<h1 class="dash-title text-foreground">{m.admin_dash_title?.() ?? 'Dashboard'}</h1>
				<p class="dash-sub">{m.admin_dash_subtitle?.() ?? 'CHINORA FASHION ACADEMY boshqaruvi'}</p>
			</div>

			<div class="header-right">
				<!-- Search -->
				<div class="search-wrap">
					<Search size={15} strokeWidth={2} class="search-icon" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder={m.admin_dash_search_placeholder?.() ?? 'Izlash...'}
						class="search-input"
					/>
				</div>

				<!-- Notifications -->
				<button class="notif-btn" aria-label="Bildirishnomalar">
					<Bell size={17} strokeWidth={2} />
					<span class="notif-dot"></span>
				</button>

				<!-- Add course CTA -->
				<a href={resolve('/admin/courses/create')} class="header-cta">
					<Plus size={16} strokeWidth={2.5} />
					<span>{m.admin_dash_add_course?.() ?? 'Yangi kurs'}</span>
				</a>
			</div>
		</div>

		<!-- System alerts strip -->
		<div class="alerts-strip">
			{#each systemAlerts as alert (alert.level)}
				<div class="alert-chip alert-chip--{alert.level}">
					<alert.icon size={12} strokeWidth={2.5} />
					<span>{alert.text}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="dash-body">
		<!-- ── Stats grid ────────────────────── -->
		<section class="stats-grid">
			{#await data.lazy.stats}
				{#each statConfig as c (c.title)}
					<div class="stat-card stat-card--skeleton">
						<div class="skel skel-icon"></div>
						<div class="skel skel-val"></div>
						<div class="skel skel-lbl"></div>
					</div>
				{/each}
			{:then statsData}
				{#each statConfig as c (c.title)}
					<div class="stat-card" style="--accent:{c.accent};--accent-bg:{c.accentBg}">
						<div class="stat-top">
							<div class="stat-icon-wrap">
								<c.icon size={20} strokeWidth={2} />
							</div>
							<div class="stat-trend stat-trend--{c.trend}">
								{#if c.trend === 'up'}
									<ArrowUpRight size={13} strokeWidth={2.5} />
								{:else}
									<ArrowDownRight size={13} strokeWidth={2.5} />
								{/if}
								<span>{c.change}</span>
							</div>
						</div>
						<p class="stat-val">{'key' in c ? (statsData?.[c.key] ?? 0) : c.value}</p>
						<p class="stat-title">{c.title}</p>
						<p class="stat-desc">{c.desc}</p>
					</div>
				{/each}
			{/await}
		</section>

		<!-- ── Main 2-col ────────────────────── -->
		<div class="main-grid">
			<!-- LEFT: Leaderboard -->
			<div class="main-left">
				<div class="section-card">
					<div class="section-head">
						<div class="section-head-left">
							<div class="section-icon" style="--c:#9b1c48">
								<Star size={15} strokeWidth={2} />
							</div>
							<div>
								<h2 class="section-title">{m.admin_dash_ranking_title?.() ?? 'Reyting jadvali'}</h2>
								<p class="section-sub">{m.admin_dash_ranking_sub?.() ?? 'Eng faol shogirdlar'}</p>
							</div>
						</div>
						<a href={resolve('/admin/students')} class="section-link">
							{m.admin_dash_view_all?.() ?? 'Barchasi'}
						</a>
					</div>

					{#await data.lazy.ranking}
						<div class="loading-state">
							<div class="spinner"></div>
						</div>
					{:then ranking}
						<LeaderboardTable rankingData={ranking} isAdmin={true} currentUserId={data.user?.id} />
					{/await}
				</div>
			</div>

			<!-- RIGHT: sidebar panels -->
			<div class="main-right">
				<!-- Quick actions -->
				<div class="section-card">
					<div class="section-head">
						<div class="section-head-left">
							<div class="section-icon" style="--c:#0ea5e9">
								<Zap size={15} strokeWidth={2} />
							</div>
							<div>
								<h2 class="section-title">{m.admin_dash_quick_actions?.() ?? 'Tez amallar'}</h2>
								<p class="section-sub">{m.admin_dash_qa_desc?.() ?? 'Tez-tez ishlatiladigan'}</p>
							</div>
						</div>
					</div>
					<div class="qa-grid">
						{#each quickActions as qa (qa.label)}
							<a href={resolve(qa.href)} class="qa-item" style="--qc:{qa.color}">
								<div class="qa-icon">
									<qa.icon size={17} strokeWidth={2} />
								</div>
								<span class="qa-label">{qa.label}</span>
							</a>
						{/each}
					</div>
				</div>

				<!-- New students -->
				<div class="section-card">
					<div class="section-head">
						<div class="section-head-left">
							<div class="section-icon" style="--c:#16a34a">
								<Users size={15} strokeWidth={2} />
							</div>
							<div>
								<h2 class="section-title">{m.admin_dash_new_students?.() ?? 'Yangi shogirdlar'}</h2>
								<p class="section-sub">
									{m.admin_dash_new_students_sub?.() ?? "Oxirgi qo'shilganlar"}
								</p>
							</div>
						</div>
						<a href={resolve('/admin/students')} class="section-link">
							{m.admin_dash_view_all?.() ?? 'Barchasi'}
						</a>
					</div>

					<div class="student-list">
						{#await data.lazy.newStudents}
							{#each Array(4) as _, i (i)}
								<div class="student-item">
									<div class="skel skel-avatar"></div>
									<div class="skel-lines">
										<div class="skel skel-name"></div>
										<div class="skel skel-phone"></div>
									</div>
								</div>
							{/each}
						{:then students}
							{#each students?.slice(0, 5) || [] as s (s.id)}
								<a
									href={resolve(`/admin/students/${s.id}`)}
									class="student-item student-item--link"
								>
									<div class="student-av">
										{s.first_name?.[0] ?? '?'}{s.last_name?.[0] ?? ''}
									</div>
									<div class="student-info">
										<p class="student-name">{s.first_name} {s.last_name}</p>
										<p class="student-meta">{s.phone_number || s.username}</p>
									</div>
									<span class="student-score">
										{s.total_score ?? 0}
										{m.admin_dash_points?.() ?? 'ball'}
									</span>
								</a>
							{/each}
						{/await}
					</div>
				</div>

				<!-- Recent activity -->
				<div class="section-card">
					<div class="section-head">
						<div class="section-head-left">
							<div class="section-icon" style="--c:#8b5cf6">
								<Activity size={15} strokeWidth={2} />
							</div>
							<div>
								<h2 class="section-title">
									{m.admin_dash_recent_activity_title?.() ?? "So'nggi faoliyat"}
								</h2>
								<p class="section-sub">
									{m.admin_dash_recent_activity_sub?.() ?? 'Tizim hodisalari'}
								</p>
							</div>
						</div>
						<a href={resolve('/admin/logs/activity')} class="section-link">
							{m.admin_dash_more?.() ?? "Ko'proq"}
							<ChevronRight size={14} strokeWidth={2.5} />
						</a>
					</div>
					<div class="activity-list">
						{#await data.lazy.activityLogs}
							{#each Array(5) as _, i (i)}
								<div class="act-item act-item--skeleton">
									<div class="skel skel-icon-sm"></div>
									<div class="act-body">
										<div class="skel skel-line-sm"></div>
										<div class="skel skel-line-xs"></div>
									</div>
								</div>
							{/each}
						{:then logs}
							{#each logs?.slice(0, 5) || [] as log (log.id)}
								{@const config = getActionConfig(log.action)}
								<div class="act-item">
									<div class="act-icon" style="--ac:{config.color}">
										<config.icon size={13} strokeWidth={2} />
									</div>
									<div class="act-body">
										<p class="act-text">{config.label}</p>
										<p class="act-name">{log.user_name || 'System'}</p>
									</div>
									<span class="act-time">{formatRelativeTime(log.created_at)}</span>
								</div>
							{:else}
								<p class="empty-msg">
									{m.admin_logs_activity_not_found?.() ?? 'Faoliyat topilmadi'}
								</p>
							{/each}
						{/await}
					</div>
				</div>
			</div>
		</div>

		<!-- ── Bottom row ─────────────────────── -->
		<div class="bottom-grid">
			<!-- Revenue chart placeholder -->
			<div class="section-card bottom-chart">
				<div class="section-head">
					<div class="section-head-left">
						<div class="section-icon" style="--c:#f59e0b">
							<BarChart3 size={15} strokeWidth={2} />
						</div>
						<div>
							<h2 class="section-title">
								{m.admin_dash_revenue_chart_title?.() ?? 'Daromad grafigi'}
							</h2>
							<p class="section-sub">{m.admin_dash_revenue_chart_sub?.() ?? 'Oxirgi 6 oy'}</p>
						</div>
					</div>
					<span class="chart-badge">{m.admin_dash_revenue_growth?.() ?? "+24% o'sish"}</span>
				</div>
				<div class="chart-bars">
					{#each [42, 68, 55, 80, 73, 100] as h, i (i)}
						{@const months = [
							m.admin_dash_month_july?.() ?? 'Iyul',
							m.admin_dash_month_august?.() ?? 'Avg',
							m.admin_dash_month_september?.() ?? 'Sen',
							m.admin_dash_month_october?.() ?? 'Okt',
							m.admin_dash_month_november?.() ?? 'Noy',
							m.admin_dash_month_december?.() ?? 'Dek'
						]}
						<div class="bar-col">
							<div class="bar-fill" style="height:{h}%;animation-delay:{i * 80}ms"></div>
							<span class="bar-lbl">{months[i]}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Course progress -->
			<div class="section-card">
				<div class="section-head">
					<div class="section-head-left">
						<div class="section-icon" style="--c:#ec4899">
							<Layers size={15} strokeWidth={2} />
						</div>
						<div>
							<h2 class="section-title">{m.admin_dash_course_status_title?.() ?? 'Kurs holati'}</h2>
							<p class="section-sub">
								{m.admin_dash_course_status_sub?.() ?? 'Faol kurslar statistikasi'}
							</p>
						</div>
					</div>
				</div>
				<div class="course-rows">
					{#each [{ name: 'Tikuvchilik asoslari', pct: 78, color: '#9b1c48', students: 142 }, { name: 'Dizayn va andaza', pct: 61, color: '#0ea5e9', students: 89 }, { name: 'Professional tikuv', pct: 45, color: '#16a34a', students: 56 }, { name: 'Moda va uslub', pct: 33, color: '#f59e0b', students: 34 }] as c (c.name)}
						<div class="course-row">
							<div class="course-row-top">
								<span class="course-name">{c.name}</span>
								<span class="course-pct">{c.pct}%</span>
							</div>
							<div class="course-bar">
								<div
									class="course-bar-fill"
									style="width:{c.pct}%;background:{c.color};animation-delay:{Math.random() *
										300}ms"
								></div>
							</div>
							<span class="course-students"
								>{c.students} {m.admin_dash_student_count?.() ?? 'shogird'}</span
							>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* ── Tokens ──────────────────────────────────────── */
	.dash {
		--brand: #9b1c48;
		--brand-mid: rgba(155, 28, 72, 0.09);
		--ink-2: #3a2535;
		--muted: #8a7a82;
		--border: rgba(155, 28, 72, 0.1);
		--bg: var(--bg-main, #f7f3f0);
		--card: var(--card, #ffffff);
		--r: 20px;
		--r-sm: 12px;
		--shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(155, 28, 72, 0.05);
		--font: 'Outfit', 'DM Sans', system-ui, sans-serif;

		min-height: 100svh;
		background: var(--bg);
		font-family: var(--font);
		color: var(--ink-2);
		padding-top: 1rem; /* navbar offset */
		width: 100%;
	}

	/* ── Header ──────────────────────────────────────── */
	.dash-header {
		background: var(--card);
		border-bottom: 1px solid var(--border);
		top: 18px;
		z-index: 30;
		box-shadow: 0 4px 20px rgba(155, 28, 72, 0.04);
	}

	.dash-header-inner {
		max-width: 1600px;
		margin: 0 auto;
		padding: 0 1.75rem 1.25rem;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.greeting-label {
		font-size: 12px;
		font-weight: 600;
		color: var(--brand);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 4px;
	}

	.dash-title {
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-bottom: 3px;
	}

	.dash-sub {
		font-size: 13px;
		color: var(--muted);
		font-weight: 400;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.search-wrap {
		position: relative;
		display: none;
	}

	/* @media (min-width: 768px) {
		.search-wrap {
			display: block;
		}
	} */

	:global(.search-icon) {
		position: absolute;
		top: 50%;
		left: 13px;
		transform: translateY(-50%);
		color: var(--muted);
		pointer-events: none;
	}

	.search-input {
		width: 240px;
		height: 38px;
		padding: 0 14px 0 38px;
		border-radius: var(--r-sm);
		border: 1.5px solid var(--border);
		background: var(--bg);
		font-family: var(--font);
		font-size: 13.5px;
		color: var(--ink);
		outline: none;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.search-input::placeholder {
		color: var(--muted);
	}
	.search-input:focus {
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(155, 28, 72, 0.09);
	}

	.notif-btn {
		position: relative;
		width: 38px;
		height: 38px;
		border-radius: var(--r-sm);
		border: 1.5px solid var(--border);
		background: var(--bg);
		color: var(--ink-2);
		display: none;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.notif-btn:hover {
		border-color: var(--brand);
		background: var(--brand-mid);
		color: var(--brand);
	}

	.notif-dot {
		position: absolute;
		top: 7px;
		right: 7px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--brand);
		border: 2px solid var(--card);
	}

	.header-cta {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 38px;
		padding: 0 16px;
		border-radius: var(--r-sm);
		background: var(--brand);
		color: #fff;
		font-family: var(--font);
		font-size: 13px;
		font-weight: 700;
		text-decoration: none;
		transition:
			background 0.15s,
			transform 0.1s,
			box-shadow 0.15s;
		box-shadow: 0 4px 14px rgba(155, 28, 72, 0.25);
		white-space: nowrap;
	}

	.header-cta:hover {
		background: #7d1539;
		transform: translateY(-1px);
		box-shadow: 0 6px 18px rgba(155, 28, 72, 0.32);
	}
	.header-cta:active {
		transform: scale(0.97);
	}

	/* Alerts strip */
	.alerts-strip {
		max-width: 1600px;
		margin: 0 auto;
		padding: 0.6rem 1.75rem;
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		border-top: 1px solid var(--border);
		background: rgba(155, 28, 72, 0.02);
	}

	.alert-chip {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11.5px;
		font-weight: 600;
		padding: 4px 11px;
		border-radius: 999px;
		max-width: 100%;
	}

	.alert-chip span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.alert-chip--ok {
		background: rgba(22, 163, 74, 0.08);
		color: #166534;
	}
	.alert-chip--warn {
		background: rgba(245, 158, 11, 0.1);
		color: #92400e;
	}
	.alert-chip--info {
		background: rgba(14, 165, 233, 0.08);
		color: #075985;
	}

	/* ── Body ────────────────────────────────────────── */
	.dash-body {
		max-width: 1600px;
		margin: 0 auto;
		padding: 1.75rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* ── Stats ───────────────────────────────────────── */
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 480px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.stats-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.stat-card {
		background: var(--card);
		border: 1.5px solid var(--border);
		border-radius: var(--r);
		padding: 1.375rem 1.5rem;
		box-shadow: var(--shadow);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		transition:
			transform 0.18s,
			box-shadow 0.18s;
		position: relative;
		overflow: hidden;
	}

	.stat-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--accent);
		opacity: 0.7;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 28px rgba(155, 28, 72, 0.09);
	}

	.stat-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.stat-icon-wrap {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: var(--accent-bg);
		color: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stat-trend {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 11.5px;
		font-weight: 700;
		padding: 3px 8px;
		border-radius: 999px;
	}

	.stat-trend--up {
		background: rgba(22, 163, 74, 0.1);
		color: #16a34a;
	}
	.stat-trend--down {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
	}

	.stat-val {
		font-size: 2rem;
		font-weight: 800;
		color: var(--foreground);
		letter-spacing: -0.04em;
		line-height: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.stat-title {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--ink-2);
		margin-top: 4px;
	}

	.stat-desc {
		font-size: 11px;
		color: var(--muted);
	}

	/* Skeleton */
	.stat-card--skeleton {
		pointer-events: none;
	}
	.skel {
		border-radius: 8px;
		background: linear-gradient(
			90deg,
			rgba(155, 28, 72, 0.05) 0%,
			rgba(155, 28, 72, 0.1) 50%,
			rgba(155, 28, 72, 0.05) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}
	.skel-icon {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		margin-bottom: 0.75rem;
	}
	.skel-val {
		width: 70px;
		height: 28px;
		margin-bottom: 8px;
	}
	.skel-lbl {
		width: 100px;
		height: 14px;
	}
	.skel-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.skel-lines {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.skel-name {
		width: 120px;
		height: 13px;
	}
	.skel-phone {
		width: 90px;
		height: 11px;
	}

	.skel-icon-sm {
		width: 30px;
		height: 30px;
		border-radius: 9px;
	}
	.skel-line-sm {
		width: 100px;
		height: 12px;
	}
	.skel-line-xs {
		width: 60px;
		height: 10px;
	}

	.empty-msg {
		font-size: 13px;
		color: var(--muted);
		text-align: center;
		padding: 2rem 0;
	}

	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}

	/* ── Main 2-col ──────────────────────────────────── */
	.main-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		min-width: 0;
	}

	@media (min-width: 1280px) {
		.main-grid {
			grid-template-columns: 1fr 380px;
		}
	}

	.main-left,
	.main-right {
		min-width: 0;
	}

	.main-right {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* ── Section card ─────────────────────────────────── */
	.section-card {
		background: var(--card);
		border: 1.5px solid var(--border);
		border-radius: var(--r);
		padding: 1.5rem;
		box-shadow: var(--shadow);
		min-width: 0;
	}

	.section-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.section-head-left {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.section-icon {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--c) 12%, transparent);
		color: var(--c);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.section-title {
		font-size: 14px;
		font-weight: 700;
		color: var(--foreground);
		line-height: 1.2;
	}

	.section-sub {
		font-size: 11.5px;
		color: var(--muted);
		margin-top: 1px;
	}

	.section-link {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 12px;
		font-weight: 600;
		color: var(--brand);
		text-decoration: none;
		white-space: nowrap;
		transition: opacity 0.15s;
		flex-shrink: 0;
	}

	.section-link:hover {
		opacity: 0.7;
	}

	/* Loading */
	.loading-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 200px;
	}

	.spinner {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 2.5px solid rgba(155, 28, 72, 0.12);
		border-top-color: var(--brand);
		animation: spin 0.75s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Quick actions */
	.qa-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.qa-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 7px;
		padding: 14px 8px;
		border-radius: var(--r-sm);
		border: 1.5px solid var(--border);
		background: transparent;
		text-decoration: none;
		min-width: 0;
		transition:
			background 0.15s,
			border-color 0.15s,
			transform 0.12s;
	}

	.qa-item:hover {
		background: color-mix(in srgb, var(--qc) 8%, transparent);
		border-color: color-mix(in srgb, var(--qc) 30%, transparent);
		transform: translateY(-2px);
	}

	.qa-item:active {
		transform: scale(0.96);
	}

	.qa-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--qc) 10%, transparent);
		color: var(--qc);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;
	}

	.qa-item:hover .qa-icon {
		background: color-mix(in srgb, var(--qc) 18%, transparent);
	}

	.qa-label {
		font-size: 11px;
		font-weight: 600;
		color: var(--ink-2);
		text-align: center;
		line-height: 1.3;
	}

	/* Students */
	.student-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.student-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 6px;
		border-radius: var(--r-sm);
	}

	.student-item--link {
		text-decoration: none;
		transition: background 0.15s;
	}

	.student-item--link:hover {
		background: var(--brand-mid);
	}

	.student-av {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: var(--brand-mid);
		color: var(--brand);
		font-size: 12px;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		letter-spacing: -0.02em;
	}

	.student-info {
		flex: 1;
		min-width: 0;
	}
	.student-name {
		font-size: 13px;
		font-weight: 600;
		color: var(--foreground);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.student-meta {
		font-size: 11.5px;
		color: var(--muted);
		margin-top: 1px;
	}

	.student-score {
		font-size: 11px;
		font-weight: 700;
		color: var(--brand);
		background: var(--brand-mid);
		padding: 3px 8px;
		border-radius: 999px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* Activity */
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.act-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 6px;
		border-radius: var(--r-sm);
		transition: background 0.15s;
	}

	.act-item:hover {
		background: rgba(155, 28, 72, 0.04);
	}

	.act-icon {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: color-mix(in srgb, var(--ac) 10%, transparent);
		color: var(--ac);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.act-body {
		flex: 1;
		min-width: 0;
	}
	.act-text {
		font-size: 12px;
		font-weight: 500;
		color: var(--ink-2);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.act-name {
		font-size: 11.5px;
		color: var(--muted);
		margin-top: 1px;
	}
	.act-time {
		font-size: 10.5px;
		color: var(--muted);
		flex-shrink: 0;
	}

	/* ── Bottom grid ─────────────────────────────────── */
	.bottom-grid {
		display: none;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.bottom-grid {
			grid-template-columns: 1.4fr 1fr;
		}
	}

	/* Chart */
	.chart-badge {
		font-size: 11.5px;
		font-weight: 700;
		color: #16a34a;
		background: rgba(22, 163, 74, 0.1);
		padding: 4px 10px;
		border-radius: 999px;
	}

	.chart-bars {
		display: flex;
		align-items: flex-end;
		gap: 10px;
		height: 140px;
		padding-top: 1rem;
	}

	@media (min-width: 480px) {
		.chart-bars {
			gap: 14px;
			height: 160px;
		}
	}

	.bar-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		height: 100%;
		justify-content: flex-end;
	}

	.bar-fill {
		width: 100%;
		border-radius: 6px 6px 3px 3px;
		background: linear-gradient(180deg, var(--brand) 0%, rgba(155, 28, 72, 0.6) 100%);
		animation: barGrow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	}

	@keyframes barGrow {
		from {
			transform: scaleY(0);
			transform-origin: bottom;
		}
		to {
			transform: scaleY(1);
		}
	}

	.bar-lbl {
		font-size: 10px;
		font-weight: 600;
		color: var(--muted);
	}

	/* Course progress */
	.course-rows {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.course-row {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.course-row-top {
		display: flex;
		justify-content: space-between;
	}
	.course-name {
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-2);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: 8px;
	}
	.course-pct {
		font-size: 13px;
		font-weight: 700;
		color: var(--foreground);
	}

	.course-bar {
		height: 6px;
		border-radius: 999px;
		background: rgba(155, 28, 72, 0.07);
		overflow: hidden;
	}

	.course-bar-fill {
		height: 100%;
		border-radius: 999px;
		animation: barFill 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	}

	@keyframes barFill {
		from {
			width: 0 !important;
		}
	}

	.course-students {
		font-size: 11px;
		color: var(--muted);
	}

	/* ── Mobile tweaks ───────────────────────────────── */
	@media (max-width: 640px) {
		.dash-body {
			padding: 1rem;
		}
		.dash-header-inner {
			padding: 0 1rem 1rem;
		}
		.alerts-strip {
			padding: 0.5rem 1rem;
		}
		.stats-grid {
			gap: 0.75rem;
		}
		.stat-card {
			padding: 1rem 1.1rem;
		}
		.stat-val {
			font-size: 1.6rem;
		}
		.section-card {
			padding: 1.25rem;
		}
		.qa-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 6px;
		}
		.header-left,
		.header-right {
			flex: 1 1 100%;
		}
		.header-right {
			justify-content: flex-start;
			margin-top: 0.5rem;
		}
		.dash-header-inner {
			align-items: flex-start;
			gap: 1rem;
		}
		.section-card {
			padding: 1.1rem;
		}
		.section-head {
			flex-wrap: wrap;
			gap: 0.5rem;
		}
		.section-head-left {
			min-width: 0;
			flex: 1;
		}
		.section-title {
			font-size: 13px;
		}
	}
</style>
