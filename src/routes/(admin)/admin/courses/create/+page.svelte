<script lang="ts">
    import { enhance } from '$app/forms';
    import { UploadCloud, CheckCircle2, ChevronRight } from 'lucide-svelte';

    // Svelte 5 State'lar
    let step = $state(1);
    let isSubmitting = $state(false);
    let imgPreview = $state(null);

    // Rasm yuklash preview mantiqi
    function handleImageChange(e) {
        const file = (e.target).files?.[0];
        if (file) {
            imgPreview = URL.createObjectURL(file);
        }
    }

    // Form submit qilinayotganda ushlab turish va keyingi bosqichga o'tkazish
    function submitStep() {
        isSubmitting = true;
        return async ({ result, update }) => {
            isSubmitting = false;
            
            if (result.type === 'success') {
                if (step === 1) {
                    step = 2;
                } else if (step === 2) {
                    step = 3;
                }
                // Step 3 success bo'lsa, serverni o'zi redirect qiladi
            } else if (result.type === 'failure') {
                console.log(result.data?.error || "Xatolik yuz berdi");
                await update();
            }
        };
    }
</script>

<div class="page-container">
    <div class="header">
        <h1 class="title">Yangi kurs qo'shish</h1>
        <p class="subtitle">Platformaga yangi o'quv dasturini kiritish paneli</p>
    </div>

    <div class="progress-tracker">
        <div class="step {step >= 1 ? 'active' : ''}">
            <div class="step-circle">{step > 1 ? '' : '1'} {#if step > 1} <CheckCircle2 size={18}/> {/if}</div>
            <span class="step-label">Kurs</span>
        </div>
        <div class="step-line {step >= 2 ? 'active-line' : ''}"></div>
        <div class="step {step >= 2 ? 'active' : ''}">
            <div class="step-circle">{step > 2 ? '' : '2'} {#if step > 2} <CheckCircle2 size={18}/> {/if}</div>
            <span class="step-label">Modul</span>
        </div>
        <div class="step-line {step === 3 ? 'active-line' : ''}"></div>
        <div class="step {step === 3 ? 'active' : ''}">
            <div class="step-circle">3</div>
            <span class="step-label">Dars</span>
        </div>
    </div>

    <div class="form-card">
        <form method="POST" action="?/createCourse" use:enhance={submitStep} enctype="multipart/form-data">
                <div class="grid-form">
                    <div class="form-group">
                        <label for="title_uz">Kurs nomi (UZ)</label>
                        <input type="text" id="title_uz" name="title_uz" class="input" required minlength="1" placeholder="Masalan: Web Dasturlash">
                    </div>
                    <div class="form-group">
                        <label for="title_ru">Kurs nomi (RU)</label>
                        <input type="text" id="title_ru" name="title_ru" class="input" required minlength="1" placeholder="Например: Веб Программирование">
                    </div>

                    <div class="form-group">
                        <label for="level_uz">Daraja (UZ)</label>
                        <input type="text" id="level_uz" name="level_uz" class="input" placeholder="Boshlang'ich">
                    </div>
                    <div class="form-group">
                        <label for="level_ru">Daraja (RU)</label>
                        <input type="text" id="level_ru" name="level_ru" class="input" placeholder="Начальный">
                    </div>

                    <div class="form-group full-width">
                        <label for="description_uz">Ta'rif (UZ)</label>
                        <textarea id="description_uz" name="description_uz" class="input textarea" rows="3"></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label for="description_ru">Ta'rif (RU)</label>
                        <textarea id="description_ru" name="description_ru" class="input textarea" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="duration">Davomiyligi (soat)</label>
                        <input type="number" id="duration" name="duration" class="input">
                    </div>
                    
                    <div class="form-group">
                        <label for="is_published">Holati</label>
                        <select id="is_published" name="is_published" class="input select">
                            <option value="true">Nashr qilish</option>
                            <option value="false">Qoralama (Draft)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="price">Narxi</label>
                        <input type="number" step="0.01" id="price" name="price" class="input" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label for="old_price">Eski narxi</label>
                        <input type="number" step="0.01" id="old_price" name="old_price" class="input" placeholder="0.00">
                    </div>

                    <div class="form-group full-width">
                        <label for="img">Kurs muqovasi</label>
                        <label class="file-upload {imgPreview ? 'has-image' : ''}">
                            <input type="file" id="img" name="img" accept="image/*" class="hidden" onchange={handleImageChange}>
                            {#if imgPreview}
                                <img src={imgPreview} alt="Preview" class="preview-img">
                            {:else}
                                <UploadCloud size={32} class="upload-icon" />
                                <span>Rasm yuklash yoki shu yerga tashlang</span>
                            {/if}
                        </label>
                    </div>
                </div>
                
                <div class="actions">
                    <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saqlanmoqda...' : 'Keyingisi'}
                        {#if !isSubmitting} <ChevronRight size={18} /> {/if}
                    </button>
                </div>
            </form>
    </div>
</div>

<style>
    /* Premium Aesthetic Variables */
    :root {
        --primary: #FA2E69;
        --primary-hover: #D81B53;
        --success: #10B981;
        --success-hover: #059669;
        --text-main: #111827;
        --text-muted: #6B7280;
        --bg-color: #F9FAFB;
        --border-color: #E5E7EB;
        --card-bg: #FFFFFF;
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
        --font-poppins: 'Poppins', sans-serif;
    }
</style>