<script lang="ts">
	import { enhance } from '$app/forms';
	import { Search, ChevronDown, CheckCircle2, Save } from 'lucide-svelte';

	/**
	 * @typedef {Object} Lesson
	 * @property {number|null} [pk]
	 * @property {string} [title_uz]
	 * @property {string} [title_ru]
	 * @property {string} [description_uz]
	 * @property {string} [description_ru]
	 * @property {number} [duration]
	 * @property {number} [order_index]
	 */

	let {
		action = '?/createLesson',
		lessonTarget = {},
		modules = [],
		modulePk = $bindable(null),
		isSubmitting = $bindable(false),
		onSubmit
	} = $props();
	console.log(lessonTarget);

	// Dropdown state
	let searchQuery = $state('');
	let isDropdownOpen = $state(false);

	let filteredModules = $derived(
		modules.filter((mod) => mod.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function selectModule(id) {
		modulePk = id;
		isDropdownOpen = false;
		searchQuery = '';
	}
</script>

<form method="POST" {action} use:enhance={onSubmit}>
	<div class="grid-form">
		<!-- ==================== SEARCHABLE DROPDOWN ==================== -->
		<div class="form-group full-width relative">
			<label for="module" class="text-sm font-semibold text-slate-700">Modulni tanlang</label>

			<!-- Trigger button -->
			<button
				type="button"
				onclick={() => (isDropdownOpen = !isDropdownOpen)}
				class="input flex cursor-pointer items-center justify-between"
			>
				{#if modulePk}
					{@const selected = modules.find((m) => m.id === modulePk)}
					<span class="text-slate-800">{selected?.title}</span>
					<input type="hidden" name="module_pk" value={modulePk} />
				{:else}
					<span class="text-slate-400">Modul tanlang...</span>
				{/if}
				<ChevronDown
					size={18}
					class="text-slate-400 transition-transform {isDropdownOpen ? 'rotate-180' : ''}"
				/>
			</button>

			<!-- Dropdown -->
			{#if isDropdownOpen}
				<div
					class="absolute top-20 z-50 mt-2 max-h-64 w-full overflow-auto rounded-3xl border border-slate-200 bg-white py-2 shadow-xl"
				>
					<!-- Search input inside dropdown -->
					<div class="sticky top-0 z-10 bg-white px-4 pb-2">
						<div class="relative">
							<Search size={18} class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
							<input
								bind:value={searchQuery}
								id="module"
								placeholder="Modul qidirish..."
								class="h-10 w-full rounded-2xl border border-slate-200 pr-4 pl-10 text-sm outline-none focus:border-[#ed4b72]"
								autocomplete="off"
							/>
						</div>
					</div>

					{#if filteredModules.length > 0}
						{#each filteredModules as module (module.id)}
							<button
								type="button"
								onclick={() => selectModule(module.id)}
								class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
							>
								<span class="text-sm">{module.title}</span>
								<span class="ml-auto text-xs text-slate-400"
									>({module.lessons_count || 0} ta dars)</span
								>
							</button>
						{/each}
					{:else}
						<div class="px-4 py-8 text-center text-sm text-slate-400">
							Hech qanday modul topilmadi
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- ==================== QOLGAN INPUTLAR ==================== -->
		<div class="form-group">
			<label for="les_title_uz">Dars nomi (UZ)</label>
			<input
				type="text"
				id="les_title_uz"
				name="title_uz"
				class="input"
				required
				minlength="1"
				value={lessonTarget.title_uz || lessonTarget.title}
			/>
		</div>

		<div class="form-group">
			<label for="les_title_ru">Dars nomi (RU)</label>
			<input
				type="text"
				id="les_title_ru"
				name="title_ru"
				class="input"
				required
				minlength="1"
				value={lessonTarget.title_ru || lessonTarget.title}
			/>
		</div>

		<div class="form-group full-width">
			<label for="les_desc_uz">Dars haqida (UZ)</label>
			<textarea id="les_desc_uz" name="description_uz" class="input textarea" rows="2"
				>{lessonTarget.description_uz || lessonTarget.description}</textarea
			>
		</div>

		<div class="form-group full-width">
			<label for="les_desc_ru">Dars haqida (RU)</label>
			<textarea id="les_desc_ru" name="description_ru" class="input textarea" rows="2"
				>{lessonTarget.description_ru || lessonTarget.description}</textarea
			>
		</div>

		<div class="form-group">
			<label for="les_duration">Davomiyligi (minut)</label>
			<input
				type="number"
				id="les_duration"
				name="duration"
				class="input"
				value={lessonTarget.duration || ''}
			/>
		</div>

		<div class="form-group full-width">
			<label for="les_video">Video URL</label>
			<input
				type="url"
				id="les_video"
				name="video_url"
				class="input"
				placeholder="https://youtube.com/... yoki mp4 link"
				value={lessonTarget.video_url || ''}
			/>
		</div>

		<div class="form-group">
			<label for="les_order">Tartib raqami</label>
			<input
				type="number"
				id="les_order"
				name="order_index"
				class="input"
				value={lessonTarget.order_index ?? 1}
			/>
		</div>
	</div>

	<div class="actions">
		<button type="submit" class="btn btn-success" disabled={isSubmitting}>
			{#if isSubmitting}
				Nashr qilinmoqda...
			{:else}
				Publish
				{#if action.includes('create')}
					<CheckCircle2 size={18} />
				{:else}
					<Save size={18} />
				{/if}
			{/if}
		</button>
	</div>
</form>

<style>
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

	.form-group button.input {
		text-align: left;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-main, #111827);
	}

	.input {
		width: 100%;
		padding: 12px 16px;
		border: 1.5px solid var(--border-color, #e5e7eb);
		border-radius: var(--radius-md, 12px);
		font-size: 14px;
		color: var(--text-main, #111827);
		background: var(--bg-color, #f9fafb);
		font-family: inherit;
		transition: all 0.2s ease;
	}

	.input:focus {
		border-color: var(--primary, #fa2e69);
		background: var(--card-bg, #ffffff);
		outline: none;
		box-shadow: 0 0 0 3px rgba(250, 46, 105, 0.1);
	}

	.textarea {
		resize: vertical;
		min-height: 80px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--border-color, #e5e7eb);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 28px;
		border-radius: var(--radius-md, 12px);
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
		background: var(--success, #10b981);
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: var(--success-hover, #059669);
	}

	@media (min-width: 640px) {
		.grid-form {
			grid-template-columns: 1fr 1fr;
		}
		.full-width {
			grid-column: span 2;
		}
	}
</style>
