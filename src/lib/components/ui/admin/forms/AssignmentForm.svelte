<script lang="ts">
    import { enhance } from '$app/forms';
    import { Save, Plus } from 'lucide-svelte';

    let { 
        action = "?/createAssignment", 
        assignmentTarget = {}, 
        modulePk = $bindable(null),
        isSubmitting = $bindable(false),
        onSubmit 
    } = $props();

</script>

<form method="POST" {action} use:enhance={onSubmit}>
    {#if modulePk}
        <input type="hidden" name="module_pk" value={modulePk}>
    {/if}
    <div class="grid-form">
        <div class="form-group">
            <label for="ass_title_uz">Topshiriq nomi (UZ)</label>
            <input type="text" id="ass_title_uz" name="title_uz" class="input" required minlength="1" value={assignmentTarget.title_uz || ''}>
        </div>
        <div class="form-group">
            <label for="ass_title_ru">Topshiriq nomi (RU)</label>
            <input type="text" id="ass_title_ru" name="title_ru" class="input" required minlength="1" value={assignmentTarget.title_ru || ''}>
        </div>

        <div class="form-group full-width">
            <label for="ass_desc_uz">Ta'rif (UZ)</label>
            <textarea id="ass_desc_uz" name="description_uz" class="input textarea" rows="2">{assignmentTarget.description_uz || ''}</textarea>
        </div>
        <div class="form-group full-width">
            <label for="ass_desc_ru">Ta'rif (RU)</label>
            <textarea id="ass_desc_ru" name="description_ru" class="input textarea" rows="2">{assignmentTarget.description_ru || ''}</textarea>
        </div>

        <div class="form-group">
            <label for="ass_type">Topshiriq Turi</label>
            <select id="ass_type" name="type" class="input" required>
                <!-- API Enum values lowercase ga moslaymiz -->
                <option value="file" selected={assignmentTarget.type?.toLowerCase() === 'file'}>Fayl yuklash</option>
                <option value="text" selected={assignmentTarget.type?.toLowerCase() === 'text'}>Matn kiritish</option>
                <option value="link" selected={assignmentTarget.type?.toLowerCase() === 'link'}>Link yuborish</option>
            </select>
        </div>

        <div class="form-group">
            <label for="max_attempts">Maksimal urinishlar soni</label>
            <input type="number" id="max_attempts" name="max_attempts" class="input" value={assignmentTarget.max_attempts ?? 1} required min="1">
        </div>
    </div>

    <div class="actions">
        <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
            {#if isSubmitting}
                Saqlanmoqda...
            {:else}
                Saqlash
                {#if action.includes('create')}
                    <Plus size={18} />
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
