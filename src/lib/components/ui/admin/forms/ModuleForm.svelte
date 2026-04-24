<script lang="ts">
    import { enhance } from '$app/forms';
    import { ChevronRight, Save } from 'lucide-svelte';
    import * as m from '$lib/paraglide/messages.js';

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
            <label for="mod_title_uz">{m.label_module_title_uz ? m.label_module_title_uz() : 'Modul nomi (UZ)'}</label>
            <input type="text" id="mod_title_uz" name="title_uz" class="input" required minlength="1" value={moduleTarget.title_uz || ''}>
        </div>
        <div class="form-group">
            <label for="mod_title_ru">{m.label_module_title_ru ? m.label_module_title_ru() : 'Modul nomi (RU)'}</label>
            <input type="text" id="mod_title_ru" name="title_ru" class="input" required minlength="1" value={moduleTarget.title_ru || ''}>
        </div>

        <div class="form-group full-width">
            <label for="mod_desc_uz">{m.label_module_desc_uz ? m.label_module_desc_uz() : 'Modul ta\'rifi (UZ)'}</label>
            <textarea id="mod_desc_uz" name="description_uz" class="input textarea" rows="2">{moduleTarget.description_uz || ''}</textarea>
        </div>
        <div class="form-group full-width">
            <label for="mod_desc_ru">{m.label_module_desc_ru ? m.label_module_desc_ru() : 'Modul ta\'rifi (RU)'}</label>
            <textarea id="mod_desc_ru" name="description_ru" class="input textarea" rows="2">{moduleTarget.description_ru || ''}</textarea>
        </div>

        <div class="form-group full-width">
            <label for="mod_order">{m.label_order_index ? m.label_order_index() : 'Tartib raqami'}</label>
            <input type="number" id="mod_order" name="order_index" class="input" value={moduleTarget.order_index ?? 1}>
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
