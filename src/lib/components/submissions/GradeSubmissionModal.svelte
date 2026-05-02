<script>
	import { fade, fly } from 'svelte/transition';
	import { X, Star, MessageSquare, Send, AlertCircle } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';

	let {
		isOpen = false,
		submission = null,
		onClose = () => {},
		formAction = '?/gradeSubmission',
		loading = false,
		enhanceAction = null
	} = $props();

	let score = $state(0);
	let feedback = $state('');
	let error = $state('');

	// Update internal state when submission changes
	$effect(() => {
		if (submission) {
			score = submission.score ?? 0;
			feedback = submission.feedback ?? '';
		}
	});

	// Orqa fonni qulflash (Mobil UX uchun juda muhim)
	$effect(() => {
		if (browser) {
			if (isOpen) document.body.style.overflow = 'hidden';
			else document.body.style.overflow = '';
		}
		return () => {
			if (browser) document.body.style.overflow = '';
		};
	});

	const maxScore = $derived(submission?.max_score || 10);

	function handleClose() {
		if (!loading) {
			onClose();
			error = '';
		}
	}

	function validateScore(val) {
		if (val < 0) score = 0;
		if (val > maxScore) score = maxScore;
	}
</script>

{#if isOpen}
	<!-- Background Overlay -->
	<div
		class="fixed inset-0 z-2000 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center md:p-6"
		transition:fade={{ duration: 300 }}
		onclick={handleClose}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="presentation"
		aria-hidden="true"
	>
		<!-- Modal Content -->
		<div
			class="relative flex max-h-[90vh] w-full max-w-[550px] flex-col overflow-hidden rounded-[32px] bg-surface shadow-2xl outline-none md:rounded-[24px]"
			transition:fly={{ y: 100, duration: 400, opacity: 1 }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			aria-labelledby="modal-title"
		>
			<!-- Decorative Header Gradient -->
			<div
				class="h-2 shrink-0 bg-primary opacity-80"
			></div>

			<div class="flex flex-col overflow-hidden">
				<div class="custom-scrollbar overflow-y-auto p-8 max-md:p-6">
					<!-- Header -->
					<div class="mb-8 flex items-center justify-between">
						<div>
							<h2
								id="modal-title"
								class="mb-1 text-2xl font-extrabold tracking-tight text-foreground"
							>
								{m.submission_grade ? m.submission_grade() : 'Baholash'}
							</h2>
							<p class="text-[13px] font-bold tracking-wider text-muted uppercase">
								{submission?.student?.first_name}
								{submission?.student?.last_name}
							</p>
						</div>
						<button
							class="flex h-10 w-10 items-center justify-center rounded-full bg-muted/10 text-muted transition-all duration-200 hover:bg-muted/20 hover:text-foreground"
							onclick={handleClose}
						>
							<X size={20} />
						</button>
					</div>

					<!-- Submission Content Preview -->
					<div class="mb-8 rounded-2xl border border-border bg-muted/5 p-5">
						<span class="mb-3 block text-[10px] font-black tracking-widest text-muted/40 uppercase"
							>{m.label_submission_content
								? m.label_submission_content()
								: 'Topshiriq mazmuni'}</span
						>

						{#if submission?.assignment_type === 'text' || (!submission?.file && submission?.text_answer)}
							<div class="custom-scrollbar max-h-40 overflow-y-auto pr-2">
								<p
									class="border-l-4 border-primary/20 py-1 pl-4 text-[15px] leading-relaxed font-medium text-muted italic"
								>
									"{submission?.text_answer}"
								</p>
							</div>
						{:else if submission?.assignment_type === 'link'}
							<div class="flex flex-col gap-3">
								<p class="text-sm font-bold text-muted">
									{m.label_student_link ? m.label_student_link() : 'Talaba yuborgan havola:'}
								</p>
								<a
									href={resolve(submission?.text_answer)}
									target="_blank"
									class="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 font-bold text-primary shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
								>
									<svg
										class="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path
											d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
										/></svg
									>
									<span>{m.btn_open_link ? m.btn_open_link() : 'Havolani yangi oynada ochish'}</span
									>
								</a>
							</div>
						{:else}
							<div
								class="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm"
							>
								<div
									class="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/5 text-muted/40"
								>
									<AlertCircle size={24} />
								</div>
								<div class="flex-1 overflow-hidden">
									<span class="mb-0.5 block text-xs font-bold text-muted/40 uppercase"
										>{m.label_submitted_file ? m.label_submitted_file() : 'Yuborilgan fayl'}</span
									>
									<span class="block truncate text-sm font-bold text-muted"
										>{submission?.file?.split('/').pop()}</span
									>
								</div>
							</div>
						{/if}
					</div>

					<form method="POST" action={formAction} use:enhance={enhanceAction} class="space-y-6">
						<input type="hidden" name="id" value={submission?.id} />

						<!-- Score Input -->
						<div class="group">
							<label
								for="score"
								class="mb-2.5 ml-1 flex items-center gap-2 text-[13px] font-bold tracking-wider text-muted uppercase"
							>
								<Star size={14} class="text-primary" />
								{m.label_score_range
									? m.label_score_range({ max: maxScore })
									: `Baho (0-${maxScore})`}
							</label>
							<div class="relative">
								<input
									type="number"
									id="score"
									name="score"
									min="0"
									max={maxScore}
									step="1"
									bind:value={score}
									oninput={(e) => validateScore(Number(e.currentTarget.value))}
									class="w-full appearance-none rounded-2xl border-2 border-border bg-muted/5 px-5 py-4 text-2xl font-black text-foreground outline-hidden transition-all focus:border-primary/30 focus:bg-surface focus:ring-4 focus:ring-primary/5"
									required
								/>
								<div
									class="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 font-black text-muted/20"
								>
									/ {maxScore}
								</div>
							</div>
						</div>

						<!-- Feedback Input -->
						<div>
							<label
								for="feedback"
								class="mb-2.5 ml-1 flex items-center gap-2 text-[13px] font-bold tracking-wider text-muted uppercase"
							>
								<MessageSquare size={14} class="text-primary" />
								{m.assignment_desc_label ? m.assignment_desc_label() : 'Izoh (ixtiyoriy)'}
							</label>
							<textarea
								id="feedback"
								name="feedback"
								bind:value={feedback}
								placeholder={m.submission_feedback_placeholder
									? m.submission_feedback_placeholder()
									: 'Talaba uchun maslahat yoki xulosa yozing...'}
								class="min-h-[120px] w-full resize-none rounded-2xl border-2 border-border bg-muted/5 px-5 py-4 text-[15px] font-medium text-muted outline-hidden transition-all focus:border-primary/30 focus:bg-surface focus:ring-4 focus:ring-primary/5"
							></textarea>
						</div>

						{#if error}
							<div
								class="animate-shake flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-semibold text-primary"
								transition:fade
							>
								<AlertCircle size={18} class="mt-0.5 shrink-0" />
								<span>{error}</span>
							</div>
						{/if}

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={loading}
							class="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-primary py-4.5 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
						>
						>
							{#if loading}
								<div
									class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
								></div>
								<span>{m.lesson_submitting ? m.lesson_submitting() : 'Yuborilmoqda...'}</span>
							{:else}
								<Send size={18} />
								<span>{m.btn_confirm_grade ? m.btn_confirm_grade() : 'Baholashni tasdiqlash'}</span>
							{/if}
						</button>
					</form>
				</div>

				<!-- Bottom Note -->
				<div class="flex shrink-0 items-center gap-3 border-t border-border bg-muted/5 p-6">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface shadow-sm">
						<AlertCircle size={16} class="text-muted/40" />
					</div>
					<p class="text-[12px] leading-tight font-bold text-muted">
						{m.msg_grade_auto_status
							? m.msg_grade_auto_status()
							: "Baholashdan so'ng topshiriq holati avtomatik ravishda"}{' '}
						<span class="text-primary"
							>"{m.assignment_graded ? m.assignment_graded() : 'Baholandi'}"</span
						>{' '}
						{m.msg_grade_auto_status_suffix ? m.msg_grade_auto_status_suffix() : "ga o'zgaradi."}
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body.modal-open) {
		overflow: hidden;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	.animate-shake {
		animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	}
</style>
