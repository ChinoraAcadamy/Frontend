<script>
	import { enhance } from '$app/forms';
	import { Upload, File as FileIcon, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { slide, fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages.js';

	let { lesson } = $props();

	let selectedFile = $state(null);
	let isDragging = $state(false);
	let isSubmitting = $state(false);
	let currentAssignmentIndex = $state(0);

	const hasAssignments = $derived(lesson.assignments?.length > 0);
	const assignment = $derived(hasAssignments ? lesson.assignments[currentAssignmentIndex] : null);

	const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

	const handleFileSelect = (e) => {
		const file = e.target.files?.[0] || null;
		if (file && file.size > MAX_FILE_SIZE) {
			toast.error(m.assignment_file_too_large?.() ?? 'Fayl hajmi juda katta (maksimal 3MB)');
			e.target.value = ''; // Reset input
			selectedFile = null;
			return;
		}
		selectedFile = file;
	};

	const handleFileDrop = (e) => {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer.files?.[0] || null;
		if (file && file.size > MAX_FILE_SIZE) {
			toast.error(m.assignment_file_too_large?.() ?? 'Fayl hajmi juda katta (maksimal 3MB)');
			selectedFile = null;
			return;
		}
		selectedFile = file;
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		isDragging = true;
	};

	const handleDragLeave = () => {
		isDragging = false;
	};

	const submitAssignment = ({ cancel }) => {
		if (assignment.type === 'file' && selectedFile && selectedFile.size > MAX_FILE_SIZE) {
			toast.error(m.assignment_file_too_large?.() ?? 'Fayl hajmi juda katta (maksimal 3MB)');
			cancel();
			return;
		}
		isSubmitting = true;
		return async ({ result, update }) => {
			isSubmitting = false;
			if (result.type === 'success') {
				toast.success(m.success_saved ? m.success_saved() : 'Topshiriq muvaffaqiyatli yuborildi!');
				selectedFile = null;
				// Formani tozalash
				const form = document.querySelector('form[action="?/uploadAssignment"]');
				if (form) /** @type {HTMLFormElement} */ (form).reset();
			} else if (result.type === 'failure' || (result.type === 'data' && result.data?.error)) {
				const errorMsg = result.data?.error || 'Xatolik yuz berdi';
				toast.error(errorMsg);
			}
			await update();
		};
	};

	const getScoreColor = (score, maxScore) => {
		if (!maxScore) return 'text-muted';
		const percentage = (score / maxScore) * 100;
		if (percentage >= 80) return 'text-success bg-success/10 border-success/20';
		if (percentage >= 50) return 'text-warning bg-warning/10 border-warning/20';
		return 'text-error bg-error/10 border-error/20';
	};
</script>

{#if hasAssignments}
	<div class="mt-4 flex flex-col overflow-hidden rounded-3xl border border-main bg-card shadow-sm">
		{#key currentAssignmentIndex}
			<div in:fly={{ x: 20, duration: 400 }} class="flex flex-col">
				<!-- Assignment Header -->
				<div class="bg-card p-5 pb-2 sm:p-6">
					<div class="mb-4 flex items-center justify-between">
						<span class="rounded border border-main bg-muted/5 px-2 py-1 text-[11px] font-bold tracking-wider text-muted uppercase">
							{lesson.assignments.length > 1 ? `${currentAssignmentIndex + 1}-${m.assignment_title_n()}` : ''}
							{#if assignment.type === 'text'}
								{m.assignment_type_text()}
							{:else if assignment.type === 'link'}
								{m.assignment_type_link()}
							{:else}
								{m.assignment_type_file()}
							{/if}
						</span>
						<Upload size={18} class="text-muted" />
					</div>
					<h2 class="text-xl font-bold tracking-tight text-main">
						{assignment.title}
					</h2>
					<p class="mt-2 text-sm text-muted">{assignment.description}</p>

					<div class="mt-4 flex items-center gap-6 border-t border-main pt-4">
						<div class="flex flex-col">
							<span class="text-[10px] font-bold tracking-wider text-muted uppercase">{m.assignment_max_score()}</span>
							<span class="text-base font-black text-main">{assignment.max_score}</span>
						</div>
						<div class="h-8 w-px bg-main"></div>
						<div class="flex flex-col">
							<span class="text-[10px] font-bold tracking-wider text-muted uppercase">{m.assignment_attempts()}</span>
							<span class="text-base font-black text-main">{assignment.max_attempts}</span>
						</div>
					</div>
				</div>

				<!-- Assignment Form -->
				<form
					method="POST"
					action="?/uploadAssignment"
					use:enhance={submitAssignment}
					enctype="multipart/form-data"
					class="flex flex-col gap-5 bg-card p-5 sm:p-6"
				>
					<input type="hidden" name="assignment" value={assignment.id} />

					{#if assignment.type === 'file'}
						<label
							class="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors {isDragging ? 'border-primary bg-primary/5' : 'border-main bg-muted/5 hover:border-muted/50 hover:bg-muted/10'}"
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
							ondrop={handleFileDrop}
							role="presentation"
						>
							<input type="file" name="file" class="hidden" onchange={handleFileSelect} required />
							{#if selectedFile}
								<FileIcon size={24} class="mb-2 text-primary" />
								<span class="line-clamp-1 text-center text-sm font-bold text-main">{selectedFile.name}</span>
								<span class="text-xs text-muted">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
							{:else}
								<Upload size={24} class="mb-2 text-muted" />
								<span class="text-sm font-bold text-main">{m.assignment_upload_file()}</span>
								<span class="text-xs text-muted">{m.assignment_drop_file()} (Max 3MB)</span>
							{/if}
						</label>
					{:else if assignment.type === 'text'}
						<div class="flex flex-col gap-1.5">
							<label for="text_answer" class="text-xs font-bold tracking-wider text-muted uppercase">{m.assignment_type_text()}</label>
							<textarea
								id="text_answer"
								name="text_answer"
								rows="5"
								placeholder={m.assignment_placeholder_text ? m.assignment_placeholder_text() : 'Topshiriq yuzasidan batafsilroq yozing...'}
								class="w-full rounded-2xl border-none bg-muted/5 p-4 text-sm font-bold text-foreground transition-all outline-none focus:bg-card focus:ring-4 focus:ring-primary/10"
								required
							></textarea>
						</div>
					{:else if assignment.type === 'link'}
						<div class="flex flex-col gap-1.5">
							<label for="text_answer" class="text-xs font-bold tracking-wider text-muted uppercase">{m.assignment_type_link()}</label>
							<input
								type="url"
								id="text_answer"
								name="text_answer"
								placeholder="https://example.com/your-work"
								class="w-full rounded-2xl border-none bg-muted/5 p-4 text-sm font-bold transition-all outline-none focus:bg-card focus:ring-4 focus:ring-primary/10"
								required
							/>
						</div>
					{/if}

					{#if assignment.type !== 'text'}
						<div class="flex flex-col gap-1.5">
							<label for="desc_answer" class="text-xs font-bold tracking-wider text-muted uppercase">{m.assignment_desc_label()}</label>
							<textarea
								id="desc_answer"
								name="desc_answer"
								rows="2"
								placeholder={m.assignment_desc_placeholder()}
								class="w-full rounded-2xl border-none bg-muted/5 p-4 text-sm font-bold text-foreground transition-all outline-none focus:bg-card focus:ring-4 focus:ring-primary/10"
							></textarea>
						</div>
					{/if}

					<button
						type="submit"
						disabled={isSubmitting || (assignment.type === 'file' && !selectedFile)}
						class="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary/10 py-4 text-sm font-bold text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:bg-muted/5 disabled:text-muted"
					>
						{#if isSubmitting}
							<div class="h-5 w-5 animate-spin rounded-full border-2 border-muted/20 border-t-primary"></div>
							<span>{m.lesson_submitting()}</span>
						{:else}
							<span>{m.assignment_submit_btn()}</span>
							<ArrowRight size={18} />
						{/if}
					</button>
				</form>

				<!-- Submissions History -->
				{#if assignment.submissions && assignment.submissions.length > 0}
					<div class="flex flex-col border-t border-main bg-muted/5 p-5 sm:p-6">
						<h3 class="mb-4 text-sm font-bold text-main">{m.assignment_prev_attempts()}</h3>
						<div class="flex flex-col gap-3">
							{#each assignment.submissions as sub (sub.id)}
								<div class="flex flex-col gap-3 rounded-md border border-main bg-card p-4" transition:slide>
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2 text-[11px] font-medium text-muted">
											<span>{new Date(sub.submitted_at || Date.now()).toLocaleDateString('uz')}</span>
											<span class="h-1 w-1 rounded-full bg-muted/30"></span>
											<span>{new Date(sub.submitted_at || Date.now()).toLocaleTimeString('uz')}</span>
										</div>
										{#if sub.status === 'Graded' || sub.status === 'graded'}
											<span class="rounded border border-main bg-muted/10 px-2 py-1 text-[10px] font-bold tracking-wider text-muted uppercase">{m.assignment_graded()}</span>
										{:else}
											<div class="flex items-center gap-1.5 rounded border border-sky-100 bg-sky-50 px-2 py-1">
												<span class="text-[10px] font-bold tracking-wider text-sky-600 uppercase">{m.assignment_pending()}</span>
												<div class="flex gap-0.5">
													<div class="h-1 w-1 animate-ping rounded-full bg-sky-400"></div>
												</div>
											</div>
										{/if}
									</div>

									{#if sub.status === 'Graded'}
										<div class="flex items-center gap-1.5">
											<span class="text-xl font-black {getScoreColor(sub.score, assignment.max_score).split(' ')[0]}">{sub.score}</span>
											<span class="text-sm font-bold text-muted">/ {assignment.max_score}</span>
										</div>
									{/if}

									{#if sub.feedback}
										<div class="mt-1 border-l-2 border-primary bg-muted/5 p-3">
											<span class="mb-1 block text-[10px] font-bold tracking-wider text-muted uppercase">{m.assignment_mentor()}</span>
											<p class="text-[13px] font-medium text-main italic">"{sub.feedback}"</p>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/key}

		<!-- Pagination Controls -->
		{#if lesson.assignments.length > 1}
			<div class="flex items-center justify-between border-t border-main bg-card p-4">
				<button
					onclick={() => (currentAssignmentIndex = Math.max(0, currentAssignmentIndex - 1))}
					disabled={currentAssignmentIndex === 0}
					class="flex items-center gap-1 text-xs font-bold transition-colors hover:text-primary disabled:opacity-30"
				>
					<ChevronLeft size={16} />
					<span>{m.pagination_prev_short()}</span>
				</button>

				<div class="flex gap-1.5">
					{#each lesson.assignments as _, i (i)}
						<div class="h-1.5 w-1.5 rounded-full transition-colors {i === currentAssignmentIndex ? 'bg-primary' : 'bg-muted/20'}"></div>
					{/each}
				</div>

				<button
					onclick={() => (currentAssignmentIndex = Math.min(lesson.assignments.length - 1, currentAssignmentIndex + 1))}
					disabled={currentAssignmentIndex === lesson.assignments.length - 1}
					class="flex items-center gap-1 text-xs font-bold transition-colors hover:text-primary disabled:opacity-30"
				>
					<span>{m.pagination_next_short()}</span>
					<ChevronRight size={16} />
				</button>
			</div>
		{/if}
	</div>
{/if}
