<script lang="ts">
	import { enhance } from '$app/forms';
	import { ChevronRight, Save, Sparkles } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { toast } from 'svelte-sonner';

	/**
	 * @typedef {Object} Module
	 * @property {number|null} [pk]
	 * @property {string} [title_uz]
	 * @property {string} [title_ru]
	 * @property {string} [description_uz]
	 * @property {string} [description_ru]
	 * @property {number} [order_index]
	 */

	let {
		action = '?/createModule',
		moduleTarget = {},
		coursePk = null,
		isSubmitting = $bindable(false),
		onSubmit
	} = $props();

	// Svelte 5 state variables for input fields
	// svelte-ignore state_referenced_locally
	let titleUz = $state(moduleTarget.title_uz || '');
	// svelte-ignore state_referenced_locally
	let titleRu = $state(moduleTarget.title_ru || '');
	// svelte-ignore state_referenced_locally
	let descriptionUz = $state(moduleTarget.description_uz || '');
	// svelte-ignore state_referenced_locally
	let descriptionRu = $state(moduleTarget.description_ru || '');

	// Translating states
	let isTranslatingTitle = $state(false);
	let isTranslatingDesc = $state(false);

	// AI Translation Handler
	async function handleTranslate(sourceText, targetKey) {
		if (!sourceText || sourceText.trim() === '') {
			toast.error("O'zbekcha maydon bo'sh! Avval uni to'ldiring.");
			return;
		}

		if (targetKey === 'title') isTranslatingTitle = true;
		if (targetKey === 'desc') isTranslatingDesc = true;

		try {
			const res = await fetch('/api/translate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: sourceText })
			});

			const data = await res.json();
			if (data.translation) {
				if (targetKey === 'title') titleRu = data.translation;
				if (targetKey === 'desc') descriptionRu = data.translation;
				toast.success('Tarjima muvaffaqiyatli bajarildi! ✨');
			} else {
				toast.error(data.error || 'Tarjimada xatolik yuz berdi');
			}
		} catch (err) {
			console.error(err);
			toast.error("Tarjima xizmati bilan bog'lanib bo'lmadi");
		} finally {
			if (targetKey === 'title') isTranslatingTitle = false;
			if (targetKey === 'desc') isTranslatingDesc = false;
		}
	}
</script>

<form method="POST" {action} use:enhance={onSubmit}>
	{#if coursePk}
		<input type="hidden" name="course_pk" value={coursePk} />
	{/if}
	{#if moduleTarget?.pk}
		<input type="hidden" name="module_pk" value={moduleTarget?.pk} />
	{/if}

	<div class="grid-form">
		<div class="form-group">
			<label for="mod_title_uz"
				>{m.label_module_title_uz ? m.label_module_title_uz() : 'Modul nomi (UZ)'}</label
			>
			<input
				type="text"
				id="mod_title_uz"
				name="title_uz"
				class="input"
				required
				minlength="1"
				bind:value={titleUz}
			/>
		</div>
		<div class="form-group">
			<div class="label-container">
				<label for="mod_title_ru"
					>{m.label_module_title_ru ? m.label_module_title_ru() : 'Modul nomi (RU)'}</label
				>
				<button
					type="button"
					class="ai-translate-btn"
					onclick={() => handleTranslate(titleUz, 'title')}
					disabled={isTranslatingTitle}
				>
					{#if isTranslatingTitle}
						<div class="spinner"></div>
					{:else}
						<Sparkles size={11} />
						<span>AI Tarjima</span>
					{/if}
				</button>
			</div>
			<input
				type="text"
				id="mod_title_ru"
				name="title_ru"
				class="input"
				required
				minlength="1"
				bind:value={titleRu}
			/>
		</div>

		<div class="form-group full-width">
			<label for="mod_desc_uz"
				>{m.label_module_desc_uz ? m.label_module_desc_uz() : "Modul ta'rifi (UZ)"}</label
			>
			<textarea
				id="mod_desc_uz"
				name="description_uz"
				class="input textarea"
				rows="2"
				bind:value={descriptionUz}
			></textarea>
		</div>
		<div class="form-group full-width">
			<div class="label-container">
				<label for="mod_desc_ru"
					>{m.label_module_desc_ru ? m.label_module_desc_ru() : "Modul ta'rifi (RU)"}</label
				>
				<button
					type="button"
					class="ai-translate-btn"
					onclick={() => handleTranslate(descriptionUz, 'desc')}
					disabled={isTranslatingDesc}
				>
					{#if isTranslatingDesc}
						<div class="spinner"></div>
					{:else}
						<Sparkles size={11} />
						<span>AI Tarjima</span>
					{/if}
				</button>
			</div>
			<textarea
				id="mod_desc_ru"
				name="description_ru"
				class="input textarea"
				rows="2"
				bind:value={descriptionRu}
			></textarea>
		</div>

		<div class="form-group full-width">
			<label for="mod_order">{m.label_order_index ? m.label_order_index() : 'Tartib raqami'}</label>
			<input
				type="number"
				id="mod_order"
				name="order_index"
				class="input"
				value={moduleTarget.order_index ?? 1}
			/>
		</div>
	</div>

	<div class="actions">
		<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
			{#if isSubmitting}
				{m.profile_saving ? m.profile_saving() : 'Saqlanmoqda...'}
			{:else}
				{m.profile_save ? m.profile_save() : 'Saqlash'}
				{#if action.includes('create')}
					<ChevronRight size={18} />
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

	label {
		font-size: 13px;
		font-weight: 700;
		color: var(--text-muted);
		margin-left: 2px;
	}

	.input {
		width: 100%;
		padding: 14px 18px;
		border: 1.5px solid var(--border-main);
		border-radius: 20px;
		font-size: 14px;
		font-weight: 500;
		color: var(--text-main);
		background: var(--bg-main);
		font-family: inherit;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.input:focus {
		border-color: var(--primary);
		background: var(--bg-card);
		outline: none;
		box-shadow: 0 0 0 4px var(--primary/10);
	}

	.textarea {
		resize: vertical;
		min-height: 80px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 40px;
		padding-top: 24px;
		border-top: 1px solid var(--border-main);
	}

	/* AI Tarjima dizayni */
	.label-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 2px;
	}

	.ai-translate-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: linear-gradient(135deg, rgba(155, 28, 72, 0.08) 0%, rgba(244, 63, 94, 0.08) 100%);
		border: 1px solid rgba(155, 28, 72, 0.2);
		color: var(--primary);
		padding: 5px 12px;
		border-radius: 12px;
		font-size: 11px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.ai-translate-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, rgba(155, 28, 72, 0.16) 0%, rgba(244, 63, 94, 0.16) 100%);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(155, 28, 72, 0.08);
	}

	.ai-translate-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		width: 11px;
		height: 11px;
		border: 2px solid var(--primary);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 16px 32px;
		border-radius: 20px;
		font-size: 15px;
		font-weight: 800;
		cursor: pointer;
		border: none;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: inherit;
	}

	.btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
		box-shadow: 0 10px 20px -10px var(--primary/40);
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--primary-hover);
		transform: translateY(-2px);
		box-shadow: 0 12px 24px -10px var(--primary/50);
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
