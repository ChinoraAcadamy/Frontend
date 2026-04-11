<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/stores';
    import AssignmentForm from '@/lib/components/ui/admin/forms/AssignmentForm.svelte';
    import { toast } from 'svelte-sonner';

    let { data, form } = $props();

    let isSubmitting = $state(false);
    let modulePk = $state(data.moduleId);

    $effect(() => {
        if (form?.success) {
            toast.success("Topshiriq muvaffaqiyatli qo'shildi!");
            goto(resolve(`/admin/courses/${$page.params.course_id}/lesson/${$page.params.lesson_id}?module_id=${modulePk}`));
        } else if (form?.error) {
            toast.error(form.error);
        }
    });

    function handleSubmit() {
        isSubmitting = true;
        return async ({ update }) => {
            isSubmitting = false;
            await update();
        };
    }
</script>

<div class="page-container">
    <div class="header">
        <h1 class="title">
            Yangi topshiriq qo'shish
        </h1>
        <p class="subtitle">Darsga yangi assignment yuklash paneli</p>
    </div>

    <div class="form-card">
        <AssignmentForm 
            action="?/createAssignment" 
            bind:modulePk={modulePk} 
            bind:isSubmitting={isSubmitting} 
            onSubmit={handleSubmit} 
        />
    </div>
</div>

<style>
    /* Premium Aesthetic Variables */
    :root {
        --primary: #fa2e69;
        --card-bg: #ffffff;
        --text-main: #111827;
        --text-muted: #6b7280;
        --border-color: #e5e7eb;
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

    .form-card {
        background: var(--card-bg);
        border-radius: var(--radius-lg);
        padding: 24px;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }

    @media (min-width: 640px) {
        .form-card {
            padding: 32px;
        }
    }
</style>
