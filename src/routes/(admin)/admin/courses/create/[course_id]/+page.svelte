<script lang="ts">
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
    import { CheckCircle2, ChevronRight } from 'lucide-svelte';

    // Svelte 5 State'lar
    let coursePk = $state(null);
    let isSubmitting = $state(false);

    // Form submit qilinayotganda ushlab turish va keyingi bosqichga o'tkazish
    function submitStep() {
        isSubmitting = true;
        return async ({ result, update }) => {
            isSubmitting = false;
            if (result.type === 'success') {
                const currentPath = page.url.pathname;
                
                // Oxiriga /lesson qo'shamiz
                const nextPath = `${currentPath}/lesson/`;
                
                goto(resolve(nextPath));
            } else if (result.type === 'failure') {
                alert(result.data?.error || "Xatolik yuz berdi");
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
        <div class="step active">
			<div class="step-circle">
				<CheckCircle2 size={18} />
			</div>
			<span class="step-label">Kurs</span>
		</div>
		<div class="step-line active-line"></div>
		<div class="step">
			<div class="step-circle">
				2
			</div>
			<span class="step-label">Modul</span>
		</div>
		<div class="step-line"></div>
		<div class="step">
			<div class="step-circle">3</div>
			<span class="step-label">Dars</span>
		</div>
    </div>

    <div class="form-card">

            <form method="POST" action="?/createModule" use:enhance={submitStep}>
                <input type="hidden" name="course_pk" value={coursePk}>
                <div class="grid-form">
                    <div class="form-group">
                        <label for="mod_title_uz">Modul nomi (UZ)</label>
                        <input type="text" id="mod_title_uz" name="title_uz" class="input" required minlength="1">
                    </div>
                    <div class="form-group">
                        <label for="mod_title_ru">Modul nomi (RU)</label>
                        <input type="text" id="mod_title_ru" name="title_ru" class="input" required minlength="1">
                    </div>

                    <div class="form-group full-width">
                        <label for="mod_desc_uz">Modul ta'rifi (UZ)</label>
                        <textarea id="mod_desc_uz" name="description_uz" class="input textarea" rows="2"></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label for="mod_desc_ru">Modul ta'rifi (RU)</label>
                        <textarea id="mod_desc_ru" name="description_ru" class="input textarea" rows="2"></textarea>
                    </div>

                    <div class="form-group full-width">
                        <label for="mod_order">Tartib raqami</label>
                        <input type="number" id="mod_order" name="order_index" class="input" value="1">
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

    .btn-primary {
        background: var(--primary);
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: var(--primary-hover);
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