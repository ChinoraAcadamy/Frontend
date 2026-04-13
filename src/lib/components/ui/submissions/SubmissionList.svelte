<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { FileDown, ChevronLeft, ChevronRight, BookOpen, User } from 'lucide-svelte';
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

	let localUpdates = $state(new Map());

	// Derived state merges original submissions with local grading updates
	let localSubmissions = $derived(
		submissions.map((sub) =>
			localUpdates.has(sub.id) ? { ...sub, ...localUpdates.get(sub.id) } : sub
		)
	);

	// Clear local updates when the submissions list changes (e.g. pagination or filtering)
	$effect(() => {
		if (submissions) localUpdates.clear();
	});

	let isGradeModalOpen = $state(false);
	let selectedSubmission = $state(null);
	let isGrading = $state(false);

	let activeTab = $derived(filters.status);

	const statusConfig = {
		pending: { label: m.status_pending(), bg: '#FFF8E6', text: '#D97706', border: '#FDE68A' },
		submitted: { label: m.status_submitted(), bg: '#FFF8E6', text: '#D97706', border: '#FDE68A' },
		graded: { label: m.status_graded(), bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
		rejected: { label: m.status_rejected(), bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' }
	};

	function getStatus(status) {
		return (
			statusConfig[status] ?? { label: status, bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' }
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

	function changeTab(newStatus) {
		const url = new URL($page.url);
		url.searchParams.set('status', newStatus);
		url.searchParams.set('page', '1');
		// @ts-ignore
		goto(resolve(`${basePath}?${url.searchParams}`), { keepFocus: true });
	}

	function goToPage(p) {
		const url = new URL($page.url);
		url.searchParams.set('page', String(p));
		// @ts-ignore
		goto(resolve(`${basePath}?${url.searchParams}`), { keepFocus: true });
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
				// Mahalliy "overlay" mapiga yangilanishni yozamiz
				localUpdates.set(updated.id, {
					...updated,
					status: 'graded'
				});

				showToast(m.grade_success(), { type: 'success' });
				isGradeModalOpen = false;
			} else if (result.type === 'failure') {
				showToast(result.data?.error || m.error_occurred(), { type: 'error' });
			}
			isGrading = false;
		};
	}
</script>

<div class="mb-8">
	<div class="mb-1.5 text-[11px] font-bold tracking-[2px] text-[#9b1c48] uppercase">
		{m.submissions_title()}
	</div>
	<h1
		class="mb-6 text-[34px] leading-none font-extrabold tracking-tight text-[#1a0e13] max-md:text-[28px]"
	>
		{role === 'admin' ? m.submissions_all() : m.submissions_my()}
	</h1>

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
			<div
				class="relative flex min-h-35 flex-col justify-between overflow-hidden rounded-[20px] border bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                    {sub.feedback || sub.score != null
					? 'border-[#fce7f3] bg-linear-to-br from-white to-[#fdf2f6]'
					: 'border-slate-100 hover:border-slate-200'}"
				transition:fly={{ y: 20, duration: 400, delay: Math.min(i * 40, 400) }}
			>
				{#if sub.feedback || sub.score != null}
					<div
						class="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-[#9b1c48] to-[#c43c66]"
					></div>

					<div class="mt-1 flex h-full flex-col">
						<div class="mb-4 flex items-center justify-between">
							<span class="text-sm font-bold tracking-[1px] text-slate-500 uppercase">{m.submission_result()}</span>
							<div
								class="rounded-xl border border-[#fce7f3] bg-white px-4 py-1 shadow-[0_2px_8px_rgba(155,28,72,0.1)]"
							>
								<span
									class="bg-linear-to-br from-[#9b1c48] to-[#c43c66] bg-clip-text text-2xl font-extrabold text-transparent"
								>
									{sub.score ?? 0}
								</span>
							</div>
						</div>

						{#if role === 'admin'}
							<div
								class="mb-3 flex items-center gap-2 rounded-lg bg-white/50 p-2 text-sm font-semibold text-slate-700"
							>
								<User size={16} class="text-slate-400" />
								{sub.student?.first_name || ''}
								{sub.student?.last_name || 'Talaba'}
							</div>
						{/if}

						<div class="flex-1">
							<div class="mb-1.5 text-[12px] font-bold text-[#9b1c48]">{m.submission_feedback()}</div>
							{#if sub.feedback}
								<blockquote
									class="m-0 border-l-[3px] border-[#fbcfe8] pl-3 text-sm leading-relaxed text-slate-700 italic"
								>
									"{sub.feedback}"
								</blockquote>
							{:else}
								<p class="text-[13px] text-slate-400 italic">{m.submission_no_feedback()}</p>
							{/if}
						</div>

						<div class="mt-4 flex items-center justify-between border-t border-[#f43f5e1a] pt-4">
							<span class="line-clamp-1 flex-1 text-[12px] font-semibold text-slate-400">
								{sub.course_title ?? ''} — {sub.assignment_title ?? ''}
							</span>
						</div>
					</div>
				{:else}
					{@const st = getStatus(sub.status)}
					<div class="mb-5 flex items-start justify-between gap-4">
						<div class="flex-1">
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
									class="mt-2.5 flex w-max items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-[13px] font-semibold text-slate-600"
								>
									<User size={14} class="text-slate-400" />
									{sub.student?.first_name || ''}
									{sub.student?.last_name || 'Talaba'}
								</div>
							{/if}
						</div>
						<span
							class="rounded-full border px-3.5 py-1.5 text-[12px] font-bold tracking-[0.3px] whitespace-nowrap"
							style="background:{st.bg}; color:{st.text}; border-color:{st.border}"
						>
							{st.label}
						</span>
					</div>

					<div
						class="mt-auto flex items-center justify-between border-t border-dashed border-slate-200 pt-4"
					>
						<span class="text-[13px] font-medium text-slate-400">
							{formatDate(sub.submitted_at)}
						</span>

						<div class="flex flex-row items-center gap-2">
							{#if sub.file}
								<a
									href={resolve(sub.file)}
									target="_blank"
									rel="noopener noreferrer"
									class="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-slate-50 text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-[#9b1c48] hover:text-white"
									title={m.submission_view_file()}
								>
									<FileDown size={18} />
								</a>
							{:else}
								<span
									class="flex h-9.5 w-9.5 cursor-not-allowed items-center justify-center rounded-[10px] bg-slate-50 text-slate-500 opacity-30"
									title={m.submission_no_file()}
								>
									<FileDown size={18} />
								</span>
							{/if}

							{#if role === 'admin'}
								<!-- Admin Baholash tugmasi bu yerga joylashtiriladi -->
								<button
									class="flex h-9.5 items-center justify-center rounded-[10px] bg-blue-50 px-4 text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
									onclick={() => openGradeModal(sub)}
								>
									{m.submission_grade()}
								</button>
							{/if}
						</div>
					</div>
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
