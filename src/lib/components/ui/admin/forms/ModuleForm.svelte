<script lang="ts">
    import { enhance } from '$app/forms';
    import { ChevronRight, Save } from 'lucide-svelte';

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
        action = "?/createModule", 
        moduleTarget = {}, 
        coursePk = null,
        isSubmitting = $bindable(false),
        onSubmit 
    } = $props();

</script>

<form method="POST" {action} use:enhance={onSubmit}>
    {#if coursePk}
        <input type="hidden" name="course_pk" value={coursePk}>
    {/if}
    {#if moduleTarget?.pk}
        <input type="hidden" name="module_pk" value={moduleTarget?.pk}>
    {/if}

    <div class="grid-form">
        <div class="form-group">
            <label for="mod_title_uz">Modul nomi (UZ)</label>
            <input type="text" id="mod_title_uz" name="title_uz" class="input" required minlength="1" value={moduleTarget.title_uz || ''}>
        </div>
        <div class="form-group">
            <label for="mod_title_ru">Modul nomi (RU)</label>
            <input type="text" id="mod_title_ru" name="title_ru" class="input" required minlength="1" value={moduleTarget.title_ru || ''}>
        </div>

        <div class="form-group full-width">
            <label for="mod_desc_uz">Modul ta'rifi (UZ)</label>
            <textarea id="mod_desc_uz" name="description_uz" class="input textarea" rows="2">{moduleTarget.description_uz || ''}</textarea>
        </div>
        <div class="form-group full-width">
            <label for="mod_desc_ru">Modul ta'rifi (RU)</label>
            <textarea id="mod_desc_ru" name="description_ru" class="input textarea" rows="2">{moduleTarget.description_ru || ''}</textarea>
        </div>

        <div class="form-group full-width">
            <label for="mod_order">Tartib raqami</label>
            <input type="number" id="mod_order" name="order_index" class="input" value={moduleTarget.order_index ?? 1}>
        </div>
    </div>

    <div class="actions">
        <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
            {#if isSubmitting}
                Saqlanmoqda...
            {:else}
                Saqlash
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
        font-weight: 600;
        color: var(--text-main, #111827);
    }

    .input {
        width: 100%;
        padding: 12px 16px;
        border: 1.5px solid var(--border-color, #E5E7EB);
        border-radius: var(--radius-md, 12px);
        font-size: 14px;
        color: var(--text-main, #111827);
        background: var(--bg-color, #F9FAFB);
        font-family: inherit;
        transition: all 0.2s ease;
    }

    .input:focus {
        border-color: var(--primary, #FA2E69);
        background: var(--card-bg, #FFFFFF);
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
        border-top: 1px solid var(--border-color, #E5E7EB);
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

    .btn-primary {
        background: var(--primary, #FA2E69);
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: var(--primary-hover, #D81B53);
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
