<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { FileDown, ChevronLeft, ChevronRight, BookOpen, User, FileIcon } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { showToast } from '$lib/utils/toast';
	import GradeSubmissionModal from './GradeSubmissionModal.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let {
		submissions = [],
		totalCount = 0,
		currentPage = 1,
		nextPage = null,
		prevPage = null,
		filters = { status: 'all' },
		role = 'student',
		basePath = '/baholar'
	} = $props();

	// --- Client-side Caching & Filtering Logic ---
	let activeStatus = $state(filters.status);
	let isRefreshing = $state(false);
	let localUpdates = $state(new Map());

	// Filtered data for the current view
	let localSubmissions = $derived(
		submissions
			.map((sub) => (localUpdates.has(sub.id) ? { ...sub, ...localUpdates.get(sub.id) } : sub))
			.filter((sub) => activeStatus === 'all' || sub.status === activeStatus)
	);

	// Calculate counts based on the currently loaded 10 items (or whatever the page size is)
	// Note: totalCount remains the server-side total for the 'all' filter
	let currentCount = $derived(localSubmissions.length);

	// Status config with professional grading colors
	const getScoreColor = (score, maxScore = 10) => {
		const percentage = (score / maxScore) * 100;
		if (percentage >= 80) return { bg: 'rgba(16, 185, 129, 0.15)', text: 'var(--success, #10b981)', border: 'rgba(16, 185, 129, 0.25)' }; // Emerald
		if (percentage >= 50) return { bg: 'rgba(245, 158, 11, 0.15)', text: 'var(--secondary, #f59e0b)', border: 'rgba(245, 158, 11, 0.25)' }; // Amber
		return { bg: 'rgba(225, 29, 72, 0.15)', text: 'var(--primary, #e11d48)', border: 'rgba(225, 29, 72, 0.25)' }; // Rose
	};

	let isGradeModalOpen = $state(false);
	let selectedSubmission = $state(null);
	let isGrading = $state(false);

	let activeTab = $derived(activeStatus);

	const statusConfig = {
		pending: { label: m.status_pending(), bg: 'rgba(100, 116, 139, 0.15)', text: 'var(--text-muted)', border: 'var(--border-main)' },
		submitted: { label: m.status_submitted(), bg: 'rgba(71, 85, 105, 0.15)', text: 'var(--text-main)', border: 'var(--border-main)' },
		graded: { label: m.status_graded(), bg: 'rgba(16, 185, 129, 0.15)', text: 'var(--success, #10b981)', border: 'rgba(16, 185, 129, 0.25)' },
		rejected: { label: m.status_rejected(), bg: 'rgba(225, 29, 72, 0.15)', text: 'var(--primary, #e11d48)', border: 'rgba(225, 29, 72, 0.25)' }
	};

	function getStatusUI(sub) {
		if (sub.status === 'graded' || sub.score !== null) {
			return { ...getScoreColor(sub.score, sub.max_score || 10), label: m.status_graded() };
		}
		return (
			statusConfig[sub.status] ?? { label: sub.status, bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' }
		);
	}

	function formatDate(dateStr) {
		if (!dateStr) return '—';
		return new Date(dateStr).toLocaleDateString(getLocale() === 'uz' ? 'uz-UZ' : 'ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	async function refreshData() {
		isRefreshing = true;

		// SvelteKit's invalidateAll will trigger a fresh fetch from +page.server.js
		const { invalidateAll } = await import('$app/navigation');
		await invalidateAll();

		isRefreshing = false;
		showToast(m.refresh_success?.() || 'Ma\'lumotlar yangilandi', { type: 'success' });
	}

	function changeTab(newStatus) {
		if (newStatus === activeStatus) return;

		activeStatus = newStatus;

		// Update URL ONLY without navigation/request
		const url = new URL($page.url);
		url.searchParams.set('status', newStatus);
		// Note: We don't reset 'page' here because the user might want to stay on the same page 
		// but see filtered results. Usually, it's better to reset to 1, but we stick to client-side filter.
		url.searchParams.set('page', '1'); 
		
		window.history.replaceState({}, '', url.toString());
	}

	function goToPage(p) {
		const url = new URL($page.url);
		url.searchParams.set('page', String(p));
		// @ts-ignore
		goto(resolve(`${basePath}?${url.searchParams}`), { keepFocus: true, noScroll: true });
	}

	const tabs = [
		{ key: 'all', label: m.status_all() },
		{ key: 'pending', label: m.status_pending() },
		{ key: 'graded', label: m.status_graded() }
	];

	function openGradeModal(sub) {
		selectedSubmission = sub;
		isGradeModalOpen = true;
	}

	function handleGrading() {
		return ({ result }) => {
			isGrading = true;
			if (result.type === 'success') {
				const updated = result.data.updatedSubmission;
				localUpdates.set(updated.id, {
					...updated,
					status: 'graded'
				});

				showToast(m.grade_success(), { type: 'success' });
				isGradeModalOpen = false;
				
				// Refresh is handled by invalidateAll or manual refresh
			} else if (result.type === 'failure') {
				showToast(result.data?.error || m.error_occurred(), { type: 'error' });
			}
			isGrading = false;
		};
	}
	function ensureUrl(url) {
		if (!url) return '';
		
		// If it's already an absolute URL, return it
		if (url.startsWith('http')) return url;
		
		// Fix cases where protocol might be mangled (e.g. "ttps:/")
		if (url.startsWith('ttps:/')) return 'h' + url.replace('ttps:/', 'ttps://');
		
		// For relative paths, use SvelteKit's resolve
		return resolve(url);
	}
</script>

<div class="mb-8">
	<div class="flex items-center justify-between mb-4">
		<div>
			<div class="mb-1.5 text-[11px] font-bold tracking-[2px] text-primary uppercase">
				{m.submissions_title()}
			</div>
			<h1 class="text-[34px] leading-none font-extrabold tracking-tight text-foreground max-md:text-[28px]">
				{role === 'admin' ? m.submissions_all() : m.submissions_my()}
			</h1>
		</div>

		<button 
			onclick={refreshData}
			disabled={isRefreshing}
			class="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-bold text-muted transition-all hover:bg-muted/10 hover:text-primary active:scale-95 disabled:opacity-50"
		>
			<svg class="h-4 w-4 {isRefreshing ? 'animate-spin' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v9h-9"/></svg>
			{isRefreshing ? (m.admin_btn_refreshing ? m.admin_btn_refreshing() : 'Yuklanmoqda...') : (m.admin_btn_refresh ? m.admin_btn_refresh() : 'Yangilash')}
		</button>
	</div>

	<div
		class="no-scrollbar inline-flex gap-1 rounded-2xl border border-border bg-muted/5 p-1.5 max-md:flex max-md:w-full max-md:overflow-x-auto"
	>
		{#each tabs as tab (tab.key)}
			<button
				class="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 max-md:flex-1 max-md:text-center max-md:whitespace-nowrap
                    {activeTab === tab.key
					? 'bg-primary text-white shadow-lg shadow-primary/25'
					: 'bg-transparent text-muted hover:bg-muted/10 hover:text-foreground'}"
				onclick={() => changeTab(tab.key)}
			>
				{tab.label}
			</button>
		{/each}
	</div>
</div>

{#if localSubmissions.length === 0}
	<div class="flex flex-col items-center justify-center py-20 text-center">
		<div
			class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/10 text-muted"
		>
			<BookOpen size={48} strokeWidth={1.5} />
		</div>
		<p class="text-base font-medium text-muted">{m.submissions_empty()}</p>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
		{#each localSubmissions as sub, i (sub.id)}
			{@const st = getStatusUI(sub)}
			<div
				class="relative flex min-h-35 flex-col justify-between overflow-hidden rounded-[24px] border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                    {sub.score != null
					? 'border-border bg-linear-to-br from-surface to-muted/5'
					: 'border-border'}"
				transition:fly={{ y: 20, duration: 400, delay: Math.min(i * 40, 400) }}
			>
				
				<div class="mb-5 flex items-start justify-between gap-4">
					<div class="flex-1">
						<div class="mb-2 flex items-center gap-2">
							<span class="rounded-md bg-muted/10 px-2 py-0.5 text-[10px] font-bold text-muted uppercase tracking-wider">
								{sub.assignment_type === 'text' ? (m.type_text ? m.type_text() : 'Matn') : sub.assignment_type === 'link' ? (m.type_link ? m.type_link() : 'Havola') : (m.type_file ? m.type_file() : 'Fayl')}
							</span>
							<div class="h-1 w-1 rounded-full bg-border"></div>
							<span class="text-[11px] font-medium text-muted/60">{formatDate(sub.submitted_at)}</span>
						</div>
						
						<h3 class="mb-1 line-clamp-2 text-[17px] leading-[1.4] font-bold text-foreground">
							{sub.course_title ?? (m.breadcrumb_courses ? m.breadcrumb_courses().slice(0,-1) : 'Kurs')}
							{#if sub.assignment_title}
								<span class="font-medium text-muted">/ {sub.assignment_title}</span>
							{/if}
						</h3>
						
						<p class="line-clamp-1 text-[13px] font-medium text-muted">
							{sub.lesson_title ?? ''}
						</p>

						{#if role === 'admin'}
							<div
								class="mt-3 flex w-max items-center gap-2 rounded-xl bg-muted/10 px-3 py-1.5 text-[13px] font-bold text-foreground/80 shadow-inner"
							>
								<div class="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-primary shadow-sm">
									<User size={12} />
								</div>
								{sub.student?.first_name || ''} {sub.student?.last_name || (m.breadcrumb_students ? m.breadcrumb_students().slice(0,-3) + 'a' : 'Talaba')}
							</div>
						{/if}
					</div>
					
					<div class="flex flex-col items-end gap-2">
						<span
							class="rounded-xl border px-3.5 py-1.5 text-[11px] font-black tracking-widest uppercase transition-colors"
							style="background:{st.bg}; color:{st.text}; border-color:{st.border}"
						>
							{st.label}
						</span>
						
						{#if sub.score != null}
							<div class="flex items-center gap-1.5 rounded-2xl bg-surface border border-border px-3 py-1 shadow-sm">
								<span class="text-lg font-black text-foreground">{sub.score}</span>
								<span class="text-[10px] font-bold text-muted/40">/ {sub.max_score || 10}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Submission Content Preview -->
				<div class="mb-5 rounded-2xl bg-muted/5 p-4 border border-border/50">
					{#if sub.assignment_type === 'text' || (!sub.file && sub.text_answer)}
						<p class="line-clamp-2 text-sm font-medium leading-relaxed text-muted italic">
							"{sub.text_answer}"
						</p>
					{:else if sub.assignment_type === 'link'}
						<a href={resolve(ensureUrl(sub.text_answer))} target="_blank" class="flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4 decoration-2">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
							{m.open_link ? m.open_link() : "Havolani ochish"}
						</a>
					{:else}
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-muted/60 shadow-sm">
								<FileIcon size={20} />
							</div>
							<div>
								<span class="block text-xs font-bold text-muted/40 uppercase tracking-wider">{m.file_uploaded ? m.file_uploaded() : "Fayl yuklangan"}</span>
								<span class="text-[12px] font-medium text-muted">{sub.file ? sub.file.split('/').pop() : (m.admin_student_unknown_date ? m.admin_student_unknown_date() : 'Fayl nomi topilmadi')}</span>
							</div>
						</div>
					{/if}
				</div>

				<div
					class="flex items-center justify-between border-t border-dashed border-border pt-4"
				>
					{#if sub.feedback}
						<div class="flex flex-1 items-center gap-2 mr-4">
							<div class="h-1.5 w-1.5 rounded-full bg-muted/40"></div>
							<p class="line-clamp-1 text-[12px] font-medium text-muted/60 italic">"{sub.feedback}"</p>
						</div>
					{:else}
						<div class="flex-1"></div>
					{/if}

					<div class="flex flex-row items-center gap-2">
						{#if sub.file}
							<a
								href={resolve(ensureUrl(sub.file))}
								download={sub.file.split('/').pop()}
								target="_blank"
								rel="noopener noreferrer"
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/10 text-muted transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(155,28,72,0.4)]"
								title={m.submission_view_file()}
							>
								<FileDown size={20} />
							</a>
						{/if}

						{#if role === 'admin'}
							<button
								class="flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-[13px] font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:bg-primary-hover active:scale-95"
								onclick={() => openGradeModal(sub)}
							>
								{m.submission_grade()}
							</button>
						{/if}
					</div>
				</div>
                
                <!-- Performance indicator line -->
                {#if sub.score != null}
                    <div class="absolute bottom-0 left-0 right-0 h-1 transition-all" style="background:{st.border}; opacity: 0.3"></div>
                {/if}
			</div>
		{/each}
	</div>
{/if}

{#if totalCount > 10}
	<div class="mt-10 flex items-center justify-center gap-4">
		<button
			onclick={() => goToPage(currentPage - 1)}
			disabled={!prevPage}
			class="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-muted transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-primary/10 disabled:cursor-not-allowed disabled:bg-muted/5 disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted disabled:hover:shadow-none"
		>
			<ChevronLeft size={16} /> {m.pagination_prev()}
		</button>
		<span class="rounded-full bg-muted/10 px-4 py-1.5 text-sm font-semibold text-muted">
			{currentPage} / {Math.ceil(totalCount / 10)}
		</span>
		<button
			onclick={() => goToPage(currentPage + 1)}
			disabled={!nextPage}
			class="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-muted transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-primary/10 disabled:cursor-not-allowed disabled:bg-muted/5 disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted disabled:hover:shadow-none"
		>
			{m.pagination_next()} <ChevronRight size={16} />
		</button>
	</div>
{/if}

<GradeSubmissionModal
	isOpen={isGradeModalOpen}
	submission={selectedSubmission}
	loading={isGrading}
	enhanceAction={handleGrading}
	onClose={() => (isGradeModalOpen = false)}
/>
