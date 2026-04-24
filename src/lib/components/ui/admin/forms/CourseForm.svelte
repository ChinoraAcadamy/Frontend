<script lang="ts">
    import { enhance } from '$app/forms';
    import { UploadCloud, Save } from 'lucide-svelte';
    import * as m from '$lib/paraglide/messages.js';

    /** 
     * @typedef {Object} Course
     * @property {string} [title_uz]
     * @property {string} [title_ru]
     * @property {string} [level_uz]
     * @property {string} [level_ru]
     * @property {string} [description_uz]
     * @property {string} [description_ru]
     * @property {number} [duration]
     * @property {string} [price]
     * @property {string} [old_price]
     * @property {boolean} [is_published]
     * @property {string} [img]
     */

    let { 
        action = "?/createCourse", 
        course = {}, 
        isSubmitting = $bindable(false),
        onSubmit 
    } = $props();

    let imgPreview = $state(course?.img || null);

    // Rasm yuklash preview mantiqi
    function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            imgPreview = URL.createObjectURL(file);
        }
    }
</script>

<form method="POST" action={action} use:enhance={onSubmit} enctype="multipart/form-data">
    <div class="grid-form">
        <div class="form-group">
            <label for="title_uz">{m.label_course_title_uz ? m.label_course_title_uz() : 'Kurs nomi (UZ)'}</label>
            <input type="text" id="title_uz" name="title_uz" class="input" required minlength="1" value={course.title_uz || ''} placeholder={m.placeholder_course_title_uz ? m.placeholder_course_title_uz() : 'Masalan: Web Dasturlash'}>
        </div>
        <div class="form-group">
            <label for="title_ru">{m.label_course_title_ru ? m.label_course_title_ru() : 'Kurs nomi (RU)'}</label>
            <input type="text" id="title_ru" name="title_ru" class="input" required minlength="1" value={course.title_ru || ''} placeholder={m.placeholder_course_title_ru ? m.placeholder_course_title_ru() : 'Например: Веб Программирование'}>
        </div>

        <div class="form-group">
            <label for="level_uz">{m.label_course_level_uz ? m.label_course_level_uz() : 'Daraja (UZ)'}</label>
            <input type="text" id="level_uz" name="level_uz" class="input" value={course.level_uz || ''} placeholder={m.placeholder_course_level_uz ? m.placeholder_course_level_uz() : 'Boshlang\'ich'}>
        </div>
        <div class="form-group">
            <label for="level_ru">{m.label_course_level_ru ? m.label_course_level_ru() : 'Daraja (RU)'}</label>
            <input type="text" id="level_ru" name="level_ru" class="input" value={course.level_ru || ''} placeholder={m.placeholder_course_level_ru ? m.placeholder_course_level_ru() : 'Начальный'}>
        </div>

        <div class="form-group full-width">
            <label for="description_uz">{m.label_course_desc_uz ? m.label_course_desc_uz() : 'Ta\'rif (UZ)'}</label>
            <textarea id="description_uz" name="description_uz" class="input textarea" rows="3">{course.description_uz || ''}</textarea>
        </div>
        <div class="form-group full-width">
            <label for="description_ru">{m.label_course_desc_ru ? m.label_course_desc_ru() : 'Ta\'rif (RU)'}</label>
            <textarea id="description_ru" name="description_ru" class="input textarea" rows="3">{course.description_ru || ''}</textarea>
        </div>

        <div class="form-group">
            <label for="duration">{m.label_course_duration ? m.label_course_duration() : 'Davomiyligi (soat)'}</label>
            <input type="number" id="duration" name="duration" class="input" value={course.duration || ''}>
        </div>
        
        <div class="form-group">
            <label for="is_published">{m.label_course_status ? m.label_course_status() : 'Holati'}</label>
            <select id="is_published" name="is_published" class="input select">
                <option value="true" selected={course.is_published !== false}>
                    {m.option_course_publish ? m.option_course_publish() : 'Nashr qilish'}
                </option>
                <option value="false" selected={course.is_published === false}>
                    {m.option_course_draft ? m.option_course_draft() : 'Qoralama (Draft)'}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label for="price">{m.label_course_price ? m.label_course_price() : 'Narxi'}</label>
            <input type="number" step="0.01" id="price" name="price" class="input" value={course.price || ''} placeholder="0.00">
        </div>
        <div class="form-group">
            <label for="old_price">{m.label_course_old_price ? m.label_course_old_price() : 'Eski narxi'}</label>
            <input type="number" step="0.01" id="old_price" name="old_price" class="input" value={course.old_price || ''} placeholder="0.00">
        </div>

        <div class="form-group full-width">
            <label for="img">{m.label_course_image ? m.label_course_image() : 'Kurs muqovasi'}</label>
            <label class="file-upload {imgPreview ? 'has-image' : ''}">
                <input type="file" id="img" name="img" accept="image/*" class="hidden" onchange={handleImageChange}>
                {#if imgPreview}
                    <img src={imgPreview} alt="Preview" class="preview-img">
                {:else}
                    <UploadCloud size={32} class="upload-icon" />
                    <span>{m.text_upload_image ? m.text_upload_image() : 'Rasm yuklash yoki shu yerga tashlang'}</span>
                {/if}
            </label>
        </div>
    </div>
    
    <div class="actions">
        <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
            {#if isSubmitting}
                {m.profile_saving ? m.profile_saving() : 'Saqlanmoqda...'}
            {:else}
                {m.profile_save ? m.profile_save() : 'Saqlash'}
                <Save size={18} />
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

    .file-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 40px;
        border: 2px dashed var(--border-main);
        border-radius: 32px;
        background: var(--bg-main);
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        position: relative;
    }

    .file-upload:hover {
        border-color: var(--primary);
        background: var(--bg-card);
        transform: translateY(-2px);
    }

    .file-upload.has-image {
        padding: 0;
        border-style: solid;
        border-color: var(--border-main);
        height: 240px;
    }

    .preview-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .upload-icon {
        color: var(--text-muted);
        opacity: 0.5;
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
