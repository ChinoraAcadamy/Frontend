<!-- src/routes/dashboard/admin/courses/lesson/+page.svelte -->
<script>
	import { enhance } from '$app/forms';
	import { CheckCircle2, Search, ChevronDown} from 'lucide-svelte';

	let { data } = $props();

	let isSubmitting = $state(false);
	let modulePk = $state(null);

	// Searchable dropdown uchun
	let searchQuery = $state('');
	let isDropdownOpen = $state(false);

	// Filtered modules
	let filteredModules = $derived(
		data.modules.filter((mod) =>
			mod.title.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);


	function selectModule(id) {
		modulePk = id;
		isDropdownOpen = false;
		searchQuery = '';
	}
</script>

<div class="page-container">
	<div class="header">
		<h1 class="title">
			<b class="text-primary">{data.course.title}</b> kursi uchun yangi dars qo'shish
		</h1>
		<p class="subtitle">Platformaga yangi o'quv dasturini kiritish paneli</p>
	</div>

	<div class="progress-tracker">
		<div class="step active">
			<div class="step-circle"><CheckCircle2 size={18} /></div>
			<span class="step-label">Kurs</span>
		</div>
		<div class="step-line active-line"></div>
		<div class="step active">
			<div class="step-circle"><CheckCircle2 size={18} /></div>
			<span class="step-label">Modul</span>
		</div>
		<div class="step-line active-line"></div>
		<div class="step">
			<div class="step-circle">3</div>
			<span class="step-label">Dars</span>
		</div>
	</div>

	<div class="form-card">
		<form method="POST" action="?/createLesson" use:enhance>
			<div class="grid-form">
				<!-- ==================== SEARCHABLE DROPDOWN ==================== -->
				<div class="form-group relative">
					<label for="module" class="text-sm font-semibold text-slate-700">Modulni tanlang</label>

					<!-- Trigger button -->
					<button
						type="button"
						onclick={() => (isDropdownOpen = !isDropdownOpen)}
						class="input flex items-center justify-between cursor-pointer"
					>
						{#if modulePk}
							{@const selected = data.modules.find((m) => m.id === modulePk)}
							<span class="text-slate-800">{selected?.title}</span>
						{:else}
							<span class="text-slate-400">Modul tanlang...</span>
						{/if}
						<ChevronDown size={18} class="text-slate-400 transition-transform {isDropdownOpen ? 'rotate-180' : ''}" />
					</button>

					<!-- Dropdown -->
					{#if isDropdownOpen}
						<div class="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-3xl shadow-xl py-2 max-h-64 overflow-auto">
							
							<!-- Search input inside dropdown -->
							<div class="px-4 pb-2 sticky top-0 bg-white z-10">
								<div class="relative">
									<Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
									<input
										bind:value={searchQuery}
										id="module"
										placeholder="Modul qidirish..."
										class="w-full h-10 pl-10 pr-4 rounded-2xl border border-slate-200 focus:border-[#ed4b72] text-sm outline-none"
										autocomplete="off"
									/>
								</div>
							</div>

							{#if filteredModules.length > 0}
								{#each filteredModules as module (module.id)}
									<button
										type="button"
										onclick={() => selectModule(module.id)}
										class="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors"
									>
										<span class="text-sm">{module.title}</span>
										<span class="text-xs text-slate-400 ml-auto">({module.lessons_count} ta dars)</span>
									</button>
								{/each}
							{:else}
								<div class="px-4 py-8 text-center text-slate-400 text-sm">
									Hech qanday modul topilmadi
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Qolgan inputlar (o'zgarmadi) -->
				<div class="form-group">
					<label for="les_title_uz">Dars nomi (UZ)</label>
					<input type="text" id="les_title_uz" name="title_uz" class="input" required minlength="1" />
				</div>

				<div class="form-group">
					<label for="les_title_ru">Dars nomi (RU)</label>
					<input type="text" id="les_title_ru" name="title_ru" class="input" required minlength="1" />
				</div>

				<div class="form-group full-width">
					<label for="les_desc_uz">Dars haqida (UZ)</label>
					<textarea id="les_desc_uz" name="description_uz" class="input textarea" rows="2"></textarea>
				</div>

				<div class="form-group full-width">
					<label for="les_desc_ru">Dars haqida (RU)</label>
					<textarea id="les_desc_ru" name="description_ru" class="input textarea" rows="2"></textarea>
				</div>

				<div class="form-group">
					<label for="les_duration">Davomiyligi (minut)</label>
					<input type="number" id="les_duration" name="duration" class="input" />
				</div>

				<div class="form-group">
					<label for="les_order">Tartib raqami</label>
					<input type="number" id="les_order" name="order_index" class="input" value="1" />
				</div>
			</div>

			<div class="actions">
				<button type="submit" class="btn btn-success" disabled={isSubmitting}>
					{isSubmitting ? 'Nashr qilinmoqda...' : 'Publish'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	@reference "tailwindcss";
	/* Premium Aesthetic Variables */
	:root {
		--primary: #fa2e69;
		--primary-hover: #d81b53;
		--success: #10b981;
		--success-hover: #059669;
		--text-main: #111827;
		--text-muted: #6b7280;
		--bg-color: #f9fafb;
		--border-color: #e5e7eb;
		--card-bg: #ffffff;
		--radius-sm: 8px;
		--radius-md: 12px;
		--radius-lg: 16px;
		--font-poppins: 'Poppins', sans-serif;
	}

	.input {
		@apply w-full h-12 px-5 rounded-2xl border border-slate-200 focus:border-[#ed4b72] focus:ring-4 focus:ring-[#ed4b72]/10 outline-none transition-all;
	}

	.textarea {
		resize: vertical;
		min-height: 80px;
	}

	/* Dropdown styling */
	.form-group button.input {
		text-align: left;
	}

	.page-container {
		font-family: var(--font-poppins);
		max-width: 800px;
		margin: 0 auto;
		padding: 24px 16px;
	}

	.header {
		margin-bottom: 32px;
		text-align: center;
	}

	.title {
		font-size: 24px;
		font-weight: 700;
		color: var(--text-main);
		margin: 0 0 8px 0;
	}

	.subtitle {
		font-size: 14px;
		color: var(--text-muted);
		margin: 0;
	}

	/* Progress Tracker (Wizard) */
	.progress-tracker {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32px;
		padding: 0 20px;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		position: relative;
		z-index: 2;
	}

	.step-circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--card-bg);
		border: 2px solid var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: var(--text-muted);
		transition: all 0.3s ease;
	}

	.step.active .step-circle {
		border-color: var(--primary);
		background: var(--primary);
		color: white;
		box-shadow: 0 4px 12px rgba(250, 46, 105, 0.25);
	}

	.step-label {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-muted);
	}

	.step.active .step-label {
		color: var(--text-main);
		font-weight: 600;
	}

	.step-line {
		flex: 1;
		height: 2px;
		background: var(--border-color);
		margin: 0 16px;
		transform: translateY(-12px);
		transition: all 0.3s ease;
	}

	.active-line {
		background: var(--primary);
	}

	/* Forms */
	.form-card {
		background: var(--card-bg);
		border-radius: var(--radius-lg);
		padding: 24px;
		border: 1px solid var(--border-color);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
	}

	.grid-form {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-main);
	}

	.input {
		width: 100%;
		padding: 12px 16px;
		border: 1.5px solid var(--border-color);
		border-radius: var(--radius-md);
		font-size: 14px;
		color: var(--text-main);
		background: var(--bg-color);
		font-family: inherit;
		transition: all 0.2s ease;
	}

	.input:focus {
		border-color: var(--primary);
		background: var(--card-bg);
		outline: none;
		box-shadow: 0 0 0 3px rgba(250, 46, 105, 0.1);
	}

	.textarea {
		resize: vertical;
		min-height: 80px;
	}

	/* Buttons */
	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--border-color);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 28px;
		border-radius: var(--radius-md);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: 0.2s ease;
		font-family: inherit;
	}

	.btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.btn-success {
		background: var(--success);
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: var(--success-hover);
	}

	/* Desktop yondashuvi */
	@media (min-width: 640px) {
		.grid-form {
			grid-template-columns: 1fr 1fr;
		}
		.full-width {
			grid-column: span 2;
		}
		.form-card {
			padding: 32px;
		}
	}
</style>