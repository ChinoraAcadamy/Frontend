<script lang="ts">
    import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
    import { page } from '$app/stores';
    import { FileDown, ChevronLeft, ChevronRight, BookOpen } from 'lucide-svelte';
    import { fly } from 'svelte/transition';

    let { data } = $props();

    console.log(data)
    // Client-side filter o'rniga to'g'ridan-to'g'ri serverdan kelganini ishlatamiz
    let submissions = $derived(data.submissions);
    let activeTab = $derived(data.filters.status);

    const statusConfig = {
        pending:   { label: 'Kutilmoqda', bg: '#FFF8E6', text: '#D97706', border: '#FDE68A' },
        submitted: { label: 'Kutilmoqda', bg: '#FFF8E6', text: '#D97706', border: '#FDE68A' },
        graded:    { label: 'Baholandi',  bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
        rejected:  { label: 'Rad etildi', bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' },
    };

    function getStatus(status) {
        return statusConfig[status] ?? { label: status, bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Tab o'zgarganda URL ni yangilash (Backendga yangi zapros ketadi)
    function changeTab(newStatus) {
        const url = new URL($page.url);
        url.searchParams.set('status', newStatus);
        url.searchParams.set('page', '1'); // Tab o'zgarganda doim 1-sahifaga qaytadi
        goto(resolve(url.toString()), { keepFocus: true, invalidateAll: true });
    }

    // Sahifa o'zgarganda URL ni yangilash
    function goToPage(p) {
        const url = new URL($page.url);
        url.searchParams.set('page', String(p));
        goto(resolve(url.toString()), { keepFocus: true });
    }

    const tabs = [
        { key: 'all',     label: 'Hammasi'    },
        { key: 'pending', label: 'Kutilmoqda' },
        { key: 'graded',  label: 'Baholandi'  },
    ];
</script>

<div class="grades-page">

    <div class="page-header">
        <div class="header-label">SUBMISSIONS</div>
        <h1 class="page-title">Topshiriqlar</h1>
    </div>

    <div class="tabs-row">
        {#each tabs as tab (tab.key)}
            <button
                class="tab-btn {activeTab === tab.key ? 'active' : ''}"
                onclick={() => changeTab(tab.key)}
            >
                {tab.label}
            </button>
        {/each}
    </div>

    {#if submissions.length === 0}
        <div class="empty-state">
            <div class="empty-icon-wrapper">
                <BookOpen size={48} strokeWidth={1.5} />
            </div>
            <p>Hozircha topshiriqlar mavjud emas</p>
        </div>
    {:else}
        <div class="cards-grid">
            {#each submissions as sub, i (sub.id)}
                <div
                    class="sub-card {sub.feedback || sub.score != null ? 'has-feedback' : ''}"
                    transition:fly={{ y: 20, duration: 400, delay: i * 40 }}
                >
                    {#if sub.feedback || sub.score != null}
                        <div class="feedback-card-inner">
                            <div class="score-header">
                                <span class="score-label">Natija</span>
                                <div class="score-badge">
                                    <span class="score-value">{sub.score ?? 0}</span>
                                </div>
                            </div>
                            
                            <div class="feedback-content">
                                <div class="feedback-label">O'qituvchi xulosasi</div>
                                {#if sub.feedback}
                                    <blockquote class="feedback-text">
                                        "{sub.feedback}"
                                    </blockquote>
                                {:else}
                                    <p class="feedback-empty">Xulosa yozilmagan</p>
                                {/if}
                            </div>

                            <div class="card-meta-bottom">
                                <span class="meta-course">{sub.course_title ?? ''} — {sub.assignment_title ?? ''}</span>
                            </div>
                        </div>
                    {:else}
                        {@const st = getStatus(sub.status)}
                        <div class="card-top">
                            <div class="card-titles">
                                <h3 class="card-title">
                                    {sub.course_title ?? 'Kurs'}
                                    {#if sub.assignment_title}
                                        <span class="text-muted">/ {sub.assignment_title}</span>
                                    {/if}
                                </h3>
                                <p class="card-lesson">{sub.lesson_title ?? ''}</p>
                            </div>
                            <span
                                class="status-badge"
                                style="background:{st.bg}; color:{st.text}; border-color:{st.border}"
                            >
                                {st.label}
                            </span>
                        </div>

                        <div class="card-bottom">
                            <span class="submitted-date">
                                Yuborildi: {formatDate(sub.submitted_at)}
                            </span>
                            {#if sub.file}
                                <a
                                    href={resolve(sub.file)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="file-btn"
                                    title="Faylni yuklab olish"
                                >
                                    <FileDown size={18} />
                                </a>
                            {:else}
                                <span class="file-btn file-btn-empty" title="Fayl yo'q">
                                    <FileDown size={18} />
                                </span>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    {#if data.totalCount > 10}
        <div class="pagination">
            <button
                onclick={() => goToPage(data.currentPage - 1)}
                disabled={!data.prevPage}
                class="page-btn {(!data.prevPage) ? 'disabled' : ''}"
            >
                <ChevronLeft size={16} /> Oldingi
            </button>
            <span class="page-info">
                {data.currentPage} / {Math.ceil(data.totalCount / 10)}
            </span>
            <button
                onclick={() => goToPage(data.currentPage + 1)}
                disabled={!data.nextPage}
                class="page-btn {(!data.nextPage) ? 'disabled' : ''}"
            >
                Keyingi <ChevronRight size={16} />
            </button>
        </div>
    {/if}
</div>

<style>
    .grades-page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 24px 48px;
    }

    /* Header */
    .page-header { margin-bottom: 32px; }
    .header-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
        color: #9b1c48;
        text-transform: uppercase;
        margin-bottom: 6px;
    }
    .page-title {
        font-size: 34px;
        font-weight: 800;
        color: #1a0e13;
        letter-spacing: -0.5px;
        line-height: 1;
    }

    /* Tabs */
    .tabs-row {
        display: inline-flex;
        gap: 4px;
        margin-bottom: 32px;
        background: #f8fafc;
        padding: 6px;
        border-radius: 14px;
        border: 1px solid #f1f5f9;
    }

    .tab-btn {
        padding: 10px 24px;
        border-radius: 10px;
        border: none;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        color: #64748b;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .tab-btn:hover:not(.active) { 
        color: #1a0e13; 
        background: #f1f5f9;
    }
    .tab-btn.active {
        background: linear-gradient(135deg, #9b1c48, #c43c66);
        color: white;
        box-shadow: 0 4px 12px rgba(155, 28, 72, 0.25);
    }

    /* Cards Grid */
    .cards-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    .sub-card {
        background: #ffffff;
        border: 1px solid #f1f5f9;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 140px;
        position: relative;
        overflow: hidden;
    }
    .sub-card:hover {
        box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        transform: translateY(-4px);
        border-color: #e2e8f0;
    }

    /* Feedback karta uchun maxsus holat */
    .sub-card.has-feedback {
        background: linear-gradient(to right bottom, #ffffff, #fdf2f6);
        border-color: #fce7f3;
    }
    .sub-card.has-feedback::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 4px;
        background: linear-gradient(90deg, #9b1c48, #c43c66);
    }

    .card-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 20px;
    }
    .card-titles { flex: 1; }
    .card-title {
        font-size: 17px;
        font-weight: 700;
        color: #1a0e13;
        line-height: 1.4;
        margin-bottom: 4px;
    }
    .text-muted { color: #94a3b8; font-weight: 500; }
    
    .card-lesson {
        font-size: 13px;
        color: #64748b;
        font-weight: 500;
    }

    .status-badge {
        font-size: 12px;
        font-weight: 700;
        padding: 6px 14px;
        border-radius: 99px;
        border: 1px solid;
        white-space: nowrap;
        letter-spacing: 0.3px;
    }

    .card-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px dashed #e2e8f0;
    }
    .submitted-date {
        font-size: 13px;
        color: #94a3b8;
        font-weight: 500;
    }

    .file-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: #f8fafc;
        color: #64748b;
        transition: all 0.2s;
    }
    .file-btn:not(.file-btn-empty):hover {
        background: #9b1c48;
        color: white;
        transform: scale(1.05);
    }
    .file-btn-empty { opacity: 0.3; cursor: not-allowed; }

    /* Feedback karta detallari */
    .feedback-card-inner {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .score-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }
    .score-label {
        font-size: 14px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .score-badge {
        background: white;
        padding: 4px 16px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(155, 28, 72, 0.1);
        border: 1px solid #fce7f3;
    }
    .score-value {
        font-size: 24px;
        font-weight: 800;
        background: linear-gradient(135deg, #9b1c48, #c43c66);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .feedback-content { flex: 1; }
    .feedback-label {
        font-size: 12px;
        font-weight: 700;
        color: #9b1c48;
        margin-bottom: 6px;
    }
    .feedback-text {
        font-size: 14px;
        color: #334155;
        line-height: 1.6;
        padding-left: 12px;
        border-left: 3px solid #fbcfe8;
        margin: 0;
        font-style: italic;
    }
    .feedback-empty {
        font-size: 13px;
        color: #94a3b8;
        font-style: italic;
    }

    .card-meta-bottom {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(244, 63, 94, 0.1);
    }
    .meta-course {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 600;
    }

    /* Empty State */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 80px 0;
        text-align: center;
    }
    .empty-icon-wrapper {
        width: 80px;
        height: 80px;
        background: #f8fafc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #cbd5e1;
        margin-bottom: 16px;
    }
    .empty-state p {
        color: #64748b;
        font-size: 16px;
        font-weight: 500;
    }

    /* Pagination */
    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-top: 40px;
    }
    .page-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        background: white;
        font-size: 14px;
        font-weight: 600;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s;
    }
    .page-btn:hover:not(.disabled) {
        border-color: #9b1c48;
        color: #9b1c48;
        box-shadow: 0 2px 8px rgba(155, 28, 72, 0.1);
    }
    .page-btn.disabled { 
        opacity: 0.5; 
        cursor: not-allowed; 
        background: #f8fafc; 
    }
    .page-info { 
        font-size: 14px; 
        color: #64748b; 
        font-weight: 600; 
        background: #f1f5f9;
        padding: 6px 16px;
        border-radius: 99px;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .cards-grid { grid-template-columns: 1fr; }
        .grades-page { padding: 24px 16px 40px; }
        .page-title { font-size: 28px; }
        .tabs-row { width: 100%; display: flex; overflow-x: auto; }
        .tab-btn { flex: 1; text-align: center; white-space: nowrap; }
    }
</style>