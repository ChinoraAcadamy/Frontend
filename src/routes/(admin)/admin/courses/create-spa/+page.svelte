<script lang="ts">
    import { goto } from '$app/navigation';
    import { CheckCircle2, ChevronRight, Save } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import * as m from '$lib/paraglide/messages.js';

    import CourseForm from '@/lib/components/ui/admin/forms/CourseForm.svelte';
    import ModuleForm from '@/lib/components/ui/admin/forms/ModuleForm.svelte';
    import LessonForm from '@/lib/components/ui/admin/forms/LessonForm.svelte';

    let { data } = $props();

    let step = $state(1);
    let isSubmitting = $state(false);

    // Context IDs
    let coursePk = $state(null);
    let courseTitle = $state("");
    let modulePk = $state(null);

    // Muxlislar uchun yaratilgan modullar ro'yxati
    let modules = $state([]);

    function handleCourseSubmit() {
        isSubmitting = true;
        return async ({ result, update }) => {
            isSubmitting = false;
            if (result.type === 'success' && result.data?.success) {
                toast.success(m.msg_course_created ? m.msg_course_created() : "Kurs muvaffaqiyatli yaratildi");
                coursePk = result.data.courseId;
                courseTitle = result.data.title_uz;
                step = 2; // Next step
            } else {
                toast.error(result.data?.error || "Xatolik yuz berdi");
                await update();
            }
        };
    }

    function handleModuleSubmit() {
        isSubmitting = true;
        return async ({ result, update }) => {
            isSubmitting = false;
            if (result.type === 'success' && result.data?.success) {
                toast.success(m.msg_module_created ? m.msg_module_created() : "Modul muvaffaqiyatli yaratildi");
                modulePk = result.data.module.id;
                // Add to modules list for LessonForm
                modules = [{
                    id: result.data.module.id,
                    title_uz: result.data.module.title_uz
                }];
                step = 3; // Next step
            } else {
                toast.error(result.data?.error || "Xatolik yuz berdi");
                await update();
            }
        };
    }

    function handleLessonSubmit() {
        isSubmitting = true;
        return async ({ result, update }) => {
            isSubmitting = false;
            if (result.type === 'success' && result.data?.success) {
                const lessonTitle = result.data.lesson?.title_uz || 'Dars';
                toast.success(m.msg_lesson_created ? m.msg_lesson_created({ title: lessonTitle }) : `${lessonTitle} muvaffaqiyatli yaratildi!`);
                // Barcha bosqichlar tugadi
                toast.success("Barcha bosqichlar muvaffaqiyatli yakunlandi!");
                goto('/admin/courses');
            } else {
                toast.error(result.data?.error || "Xatolik yuz berdi");
                await update();
            }
        };
    }

</script>

<div class="page-container">
    <div class="header">
        <h1 class="title">
            {#if step === 1}
                {m.admin_course_create_title ? m.admin_course_create_title() : "Yangi kurs qo'shish (Tezkor SPA)"}
            {:else if step === 2}
                <b class="text-primary">{courseTitle}</b> uchun yangi modul qo'shish
            {:else if step === 3}
                <b class="text-primary">{courseTitle}</b> kursi uchun yangi dars qo'shish
            {/if}
        </h1>
        <p class="subtitle">{m.admin_course_create_subtitle ? m.admin_course_create_subtitle() : "Platformaga yangi o'quv dasturini kiritish paneli"}</p>
    </div>

    <div class="progress-tracker">
        <div class="step active">
            <div class="step-circle">
                {#if step > 1}
                    <CheckCircle2 size={18} />
                {:else}
                    1
                {/if}
            </div>
            <span class="step-label">{m.admin_course_create_step_course ? m.admin_course_create_step_course() : "Kurs"}</span>
        </div>
        <div class="step-line {step > 1 ? 'active-line' : ''}"></div>
        <div class="step {step >= 2 ? 'active' : ''}">
            <div class="step-circle">
                {#if step > 2}
                    <CheckCircle2 size={18} />
                {:else}
                    2
                {/if}
            </div>
            <span class="step-label">{m.admin_course_create_step_module ? m.admin_course_create_step_module() : "Modul"}</span>
        </div>
        <div class="step-line {step > 2 ? 'active-line' : ''}"></div>
        <div class="step {step >= 3 ? 'active' : ''}">
            <div class="step-circle">3</div>
            <span class="step-label">{m.admin_course_create_step_lesson ? m.admin_course_create_step_lesson() : "Dars"}</span>
        </div>
    </div>

    <div class="form-card">
        {#if step === 1}
            <CourseForm 
                action="?/createCourse" 
                bind:isSubmitting 
                onSubmit={handleCourseSubmit} 
            />
        {:else if step === 2}
            <ModuleForm 
                action="?/createModule" 
                {coursePk}
                bind:isSubmitting 
                onSubmit={handleModuleSubmit} 
            />
        {:else if step === 3}
            <!-- `apiContext` is needed by LessonForm to upload video -->
            <LessonForm 
                action="?/createLesson" 
                {modules} 
                apiContext={{ apiUrl: data.apiUrl, accessToken: data.accessToken, courseId: coursePk }}
                bind:modulePk
                bind:isSubmitting 
                onSubmit={handleLessonSubmit} 
            />
        {/if}
    </div>
</div>

<style>
    @reference "tailwindcss";
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
