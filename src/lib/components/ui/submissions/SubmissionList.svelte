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
		if (percentage >= 80) return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' }; // Emerald
		if (percentage >= 50) return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' }; // Amber
		return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' }; // Rose
	};

	let isGradeModalOpen = $state(false);
	let selectedSubmission = $state(null);
	let isGrading = $state(false);

	let activeTab = $derived(activeStatus);

	const statusConfig = {
		pending: { label: m.status_pending(), bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
		submitted: { label: m.status_submitted(), bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
		graded: { label: m.status_graded(), bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
		rejected: { label: m.status_rejected(), bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' }
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
			<div class="mb-1.5 text-[11px] font-bold tracking-[2px] text-[#9b1c48] uppercase">
				{m.submissions_title()}
			</div>
			<h1 class="text-[34px] leading-none font-extrabold tracking-tight text-[#1a0e13] max-md:text-[28px]">
				{role === 'admin' ? m.submissions_all() : m.submissions_my()}
			</h1>
		</div>

		<button 
			onclick={refreshData}
			disabled={isRefreshing}
			class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-[#9b1c48] active:scale-95 disabled:opacity-50"
		>
			<svg class="h-4 w-4 {isRefreshing ? 'animate-spin' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v9h-9"/></svg>
			{isRefreshing ? 'Yuklanmoqda...' : 'Yangilash'}
		</button>
	</div>

	<div
		class="no-scrollbar inline-flex gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1.5 max-md:flex max-md:w-full max-md:overflow-x-auto"
	>
		{#each tabs as tab (tab.key)}
			<button
				class="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 max-md:flex-1 max-md:text-center max-md:whitespace-nowrap
                    {activeTab === tab.key
					? 'bg-linear-to-br from-[#9b1c48] to-[#c43c66] text-white shadow-[0_4px_12px_rgba(155,28,72,0.25)]'
					: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-[#1a0e13]'}"
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
			class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300"
		>
			<BookOpen size={48} strokeWidth={1.5} />
		</div>
		<p class="text-base font-medium text-slate-500">{m.submissions_empty()}</p>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
		{#each localSubmissions as sub, i (sub.id)}
			{@const st = getStatusUI(sub)}
			<div
				class="relative flex min-h-35 flex-col justify-between overflow-hidden rounded-[24px] border bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]
                    {sub.score != null
					? 'border-slate-100 bg-linear-to-br from-white to-slate-50/50'
					: 'border-slate-100'}"
				transition:fly={{ y: 20, duration: 400, delay: Math.min(i * 40, 400) }}
			>
				
				<div class="mb-5 flex items-start justify-between gap-4">
					<div class="flex-1">
						<div class="mb-2 flex items-center gap-2">
							<span class="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
								{sub.assignment_type === 'text' ? 'Matn' : sub.assignment_type === 'link' ? 'Havola' : 'Fayl'}
							</span>
							<div class="h-1 w-1 rounded-full bg-slate-200"></div>
							<span class="text-[11px] font-medium text-slate-400">{formatDate(sub.submitted_at)}</span>
						</div>
						
						<h3 class="mb-1 line-clamp-2 text-[17px] leading-[1.4] font-bold text-[#1a0e13]">
							{sub.course_title ?? 'Kurs'}
							{#if sub.assignment_title}
								<span class="font-medium text-slate-400">/ {sub.assignment_title}</span>
							{/if}
						</h3>
						
						<p class="line-clamp-1 text-[13px] font-medium text-slate-500">
							{sub.lesson_title ?? ''}
						</p>

						{#if role === 'admin'}
							<div
								class="mt-3 flex w-max items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 text-[13px] font-bold text-slate-700 shadow-inner"
							>
								<div class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#9b1c48] shadow-sm">
									<User size={12} />
								</div>
								{sub.student?.first_name || ''} {sub.student?.last_name || 'Talaba'}
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
							<div class="flex items-center gap-1.5 rounded-2xl bg-white border border-slate-100 px-3 py-1 shadow-sm">
								<span class="text-lg font-black text-slate-900">{sub.score}</span>
								<span class="text-[10px] font-bold text-slate-300">/ {sub.max_score || 10}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Submission Content Preview -->
				<div class="mb-5 rounded-2xl bg-slate-50/80 p-4 border border-slate-100/50">
					{#if sub.assignment_type === 'text' || (!sub.file && sub.text_answer)}
						<p class="line-clamp-2 text-sm font-medium leading-relaxed text-slate-600 italic">
							"{sub.text_answer}"
						</p>
					{:else if sub.assignment_type === 'link'}
						<a href={ensureUrl(sub.text_answer)} target="_blank" class="flex items-center gap-2 text-sm font-bold text-[#9b1c48] hover:underline underline-offset-4 decoration-2">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
							Havolani ochish
						</a>
					{:else}
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
								<FileIcon size={20} />
							</div>
							<div>
								<span class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Fayl yuklangan</span>
								<span class="text-[12px] font-medium text-slate-600">{sub.file ? sub.file.split('/').pop() : 'Fayl nomi topilmadi'}</span>
							</div>
						</div>
					{/if}
				</div>

				<div
					class="flex items-center justify-between border-t border-dashed border-slate-200 pt-4"
				>
					{#if sub.feedback}
						<div class="flex flex-1 items-center gap-2 mr-4">
							<div class="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
							<p class="line-clamp-1 text-[12px] font-medium text-slate-400 italic">"{sub.feedback}"</p>
						</div>
					{:else}
						<div class="flex-1"></div>
					{/if}

					<div class="flex flex-row items-center gap-2">
						{#if sub.file}
							<a
								href={ensureUrl(sub.file)}
								download={sub.file.split('/').pop()}
								target="_blank"
								rel="noopener noreferrer"
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all duration-300 hover:scale-110 hover:bg-[#9b1c48] hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(155,28,72,0.4)]"
								title={m.submission_view_file()}
							>
								<FileDown size={20} />
							</a>
						{/if}

						{#if role === 'admin'}
							<button
								class="flex h-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 px-5 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-95"
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
			class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-[#9b1c48] hover:text-[#9b1c48] hover:shadow-[0_2px_8px_rgba(155,28,72,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:shadow-none"
		>
			<ChevronLeft size={16} /> {m.pagination_prev()}
		</button>
		<span class="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-500">
			{currentPage} / {Math.ceil(totalCount / 10)}
		</span>
		<button
			onclick={() => goToPage(currentPage + 1)}
			disabled={!nextPage}
			class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-[#9b1c48] hover:text-[#9b1c48] hover:shadow-[0_2px_8px_rgba(155,28,72,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:shadow-none"
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
