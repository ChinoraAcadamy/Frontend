<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import CourseForm from '@/lib/components/ui/admin/forms/CourseForm.svelte';
    import { CheckCircle2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

    // Svelte 5 State'lar
    let step = $state(1);
    let isSubmitting = $state(false);
    // let imgPreview = $state(null);

    // Rasm yuklash preview mantiqi
    // function handleImageChange(e) {
    //     const file = (e.target).files?.[0];
    //     if (file) {
    //         imgPreview = URL.createObjectURL(file);
    //     }
    // }

    // Form submit qilinayotganda ushlab turish va keyingi bosqichga o'tkazish
    function submitStep() {
        isSubmitting = true;
        return async ({ result, update }) => {
            isSubmitting = false;
            
            // 1. Agar serverdan redirect (303) kelsa:
            if (result.type === 'redirect') {
                // SvelteKit'ning goto() funksiyasi orqali yangi sahifaga o'tamiz
                return goto(resolve(result.location));
            } 
            // 2. Agar oddiy muvaffaqiyatli javob kelsa:
            else if (result.type === 'success') {
                if (step === 1) {
                    step = 2;
                } else if (step === 2) {
                    step = 3;
                }
            } 
            // 3. Agar xatolik bo'lsa:
            else if (result.type === 'failure') {
                console.error(result.data?.error || "Xatolik yuz berdi");
                await update(); // Xatoliklarni formaga chiqarish uchun
            }
        };
    }
</script>

<div class="page-container">
    <div class="header">
        <h1 class="title">{m.admin_course_create_title ? m.admin_course_create_title() : "Yangi kurs qo'shish"}</h1>
        <p class="subtitle">{m.admin_course_create_subtitle ? m.admin_course_create_subtitle() : "Platformaga yangi o'quv dasturini kiritish paneli"}</p>
    </div>

    <div class="progress-tracker">
        <div class="step {step >= 1 ? 'active' : ''}">
            <div class="step-circle">{step > 1 ? '' : '1'} {#if step > 1} <CheckCircle2 size={18}/> {/if}</div>
            <span class="step-label">{m.admin_course_create_step_course ? m.admin_course_create_step_course() : "Kurs"}</span>
        </div>
        <div class="step-line {step >= 2 ? 'active-line' : ''}"></div>
        <div class="step {step >= 2 ? 'active' : ''}">
            <div class="step-circle">{step > 2 ? '' : '2'} {#if step > 2} <CheckCircle2 size={18}/> {/if}</div>
            <span class="step-label">{m.admin_course_create_step_module ? m.admin_course_create_step_module() : "Modul"}</span>
        </div>
        <div class="step-line {step === 3 ? 'active-line' : ''}"></div>
        <div class="step {step === 3 ? 'active' : ''}">
            <div class="step-circle">3</div>
            <span class="step-label">{m.admin_course_create_step_lesson ? m.admin_course_create_step_lesson() : "Dars"}</span>
        </div>
    </div>

    <div class="form-card">
        <CourseForm 
            action="?/createCourse" 
            bind:isSubmitting={isSubmitting} 
            onSubmit={submitStep} 
        />
    </div>
</div>

<style>
    .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .header {
        margin-bottom: 32px;
        text-align: center;
    }

    .title {
        font-size: 32px;
        font-weight: 900;
        letter-spacing: -0.02em;
        color: var(--text-main);
        margin: 0 0 8px 0;
    }

    .subtitle {
        font-size: 15px;
        font-weight: 500;
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
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: var(--bg-surface);
        border: 2px solid var(--border-main);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        color: var(--text-muted);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .step.active .step-circle {
        border-color: var(--primary);
        background: var(--primary);
        color: white;
        box-shadow: 0 8px 16px -4px var(--primary/30);
        transform: translateY(-2px);
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
        background: var(--border-main);
        margin: 0 16px;
        transform: translateY(-12px);
        transition: all 0.3s ease;
    }

    .active-line {
        background: var(--primary);
    }

    /* Form Container styles */
    .form-card {
        background: var(--bg-card);
        border-radius: 32px;
        padding: 24px;
        border: 1px solid var(--border-main);
        box-shadow: var(--shadow-sm);
    }

    @media (min-width: 640px) {
        .form-card {
            padding: 32px;
        }
    }
</style>