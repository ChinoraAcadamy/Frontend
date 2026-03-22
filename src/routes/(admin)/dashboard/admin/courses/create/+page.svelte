<script lang="ts">
    import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
    import { Play, Film, Image as ImageIcon, X, FileVideo } from 'lucide-svelte';

    // Svelte 5 State'lar
    let lessonTitle = $state('');
    let description = $state('');

    // Rasm uchun state
    let imageFile = $state<File | null>(null);
    let imagePreview = $state<string | null>(null);
    let dragoverImage = $state(false);

    // Video uchun state
    let videoFile = $state<File | null>(null);
    let videoPreview = $state<string | null>(null);
    let dragoverVideo = $state(false);

    // Rasm yuklash mantiqi
    function handleImageChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) setImage(file);
    }
    function handleImageDrop(e: DragEvent) {
        e.preventDefault();
        dragoverImage = false;
        const file = e.dataTransfer?.files[0];
        if (file && file.type.startsWith('image/')) setImage(file);
    }
    function setImage(file: File) {
        imageFile = file;
        imagePreview = URL.createObjectURL(file);
    }
    function clearImage() {
        imageFile = null;
        imagePreview = null;
    }

    // Video yuklash mantiqi
    function handleVideoChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) setVideo(file);
    }
    function handleVideoDrop(e: DragEvent) {
        e.preventDefault();
        dragoverVideo = false;
        const file = e.dataTransfer?.files[0];
        if (file && file.type.startsWith('video/')) setVideo(file);
    }
    function setVideo(file: File) {
        videoFile = file;
        videoPreview = URL.createObjectURL(file);
    }
    function clearVideo() {
        videoFile = null;
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        videoPreview = null;
    }

    // Fayl hajmini chiroyli formatlash
    function formatSize(bytes: number) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
</script>

<div class="new-lesson-page">
    <Breadcrumb />

    <div class="header-section">
        <h1 class="page-title">Yangi dars qo‘shish</h1>
        <p class="page-subtitle">O'quvchilar uchun yuqori sifatli video darslik yuklang</p>
    </div>

    <div class="content">
        <div class="form-card">
            
            <div class="form-group">
                <label for="title">Dars nomi <span class="required">*</span></label>
                <input 
                    id="title"
                    type="text" 
                    bind:value={lessonTitle} 
                    placeholder="Masalan: Svelte 5 da yangi state boshqaruvi" 
                    class="input-field" 
                />
            </div>

            <div class="form-group">
                <label for="desc">Dars haqida (ixtiyoriy)</label>
                <textarea 
                    id="desc"
                    bind:value={description} 
                    placeholder="Bu darsda nimalar o'rgatiladi? Qisqacha ta'rif..." 
                    rows="4"
                    class="input-field"
                ></textarea>
            </div>

            <div class="form-group">
                <label>Video fayl yuklash <span class="required">*</span></label>
                <div class="upload-wrapper">
                    <label 
                        class="dropzone video-zone {dragoverVideo ? 'dragover' : ''} {videoFile ? 'has-file' : ''}"
                        ondragover={(e) => { e.preventDefault(); dragoverVideo = true; }}
                        ondragleave={() => dragoverVideo = false}
                        ondrop={handleVideoDrop}
                    >
                        <input type="file" accept="video/*" onchange={handleVideoChange} class="hidden-input" />
                        
                        {#if videoFile}
                            <div class="file-info-badge">
                                <FileVideo size={28} class="accent-icon" />
                                <div class="file-details">
                                    <span class="file-name">{videoFile.name}</span>
                                    <span class="file-size">{formatSize(videoFile.size)}</span>
                                </div>
                                <button class="remove-btn" onclick={(e) => { e.preventDefault(); clearVideo(); }}>
                                    <X size={18} />
                                </button>
                            </div>
                        {:else}
                            <div class="placeholder-content">
                                <div class="icon-circle"><Film size={28} /></div>
                                <p class="primary-text">Videoni shu yerga tashlang yoki <span>fayl tanlang</span></p>
                                <p class="secondary-text">MP4, WebM (Maks: 500MB)</p>
                            </div>
                        {/if}
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label>Dars muqovasi (Thumbnail)</label>
                <div class="upload-wrapper">
                    <label 
                        class="dropzone image-zone {dragoverImage ? 'dragover' : ''}"
                        ondragover={(e) => { e.preventDefault(); dragoverImage = true; }}
                        ondragleave={() => dragoverImage = false}
                        ondrop={handleImageDrop}
                    >
                        <input type="file" accept="image/*" onchange={handleImageChange} class="hidden-input" />
                        
                        {#if imagePreview}
                            <div class="image-preview-container">
                                <img src={imagePreview} alt="Thumbnail preview" class="preview-img" />
                                <button class="remove-btn floating" onclick={(e) => { e.preventDefault(); clearImage(); }}>
                                    <X size={16} />
                                </button>
                            </div>
                        {:else}
                            <div class="placeholder-content">
                                <div class="icon-circle"><ImageIcon size={28} /></div>
                                <p class="primary-text">Rasmni tashlang yoki <span>tanlang</span></p>
                                <p class="secondary-text">16:9 format tavsiya etiladi (JPG, PNG)</p>
                            </div>
                        {/if}
                    </label>
                </div>
            </div>

            <div class="actions">
                <button class="btn btn-secondary">Bekor qilish</button>
                <button class="btn btn-primary" disabled={!lessonTitle || !videoFile}>Darsni saqlash</button>
            </div>
        </div>

        <div class="preview-card">
            <h3 class="preview-title">Natija ko'rinishi</h3>
            <div class="preview-box">
                {#if videoPreview}
                    <video controls class="player" src={videoPreview} poster={imagePreview}></video>
                {:else if imagePreview}
                    <div class="image-only-preview">
                        <img src={imagePreview} alt="preview" />
                        <div class="play-overlay"><Play size={40} fill="currentColor"/></div>
                    </div>
                {:else}
                    <div class="empty-player">
                        <Play size={48} class="empty-icon" />
                        <span>Video qismi</span>
                    </div>
                {/if}
                
                <div class="preview-info">
                    <h4 class="preview-lesson-title">{lessonTitle || 'Dars nomi bu yerda chiqadi'}</h4>
                    <p class="preview-desc">{description || "Dars haqida qisqacha ma'lumot shu yerda joylashadi. O'quvchilar darsning asosiy mazmunini ko'rishadi."}</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* CSS o'zgaruvchilari (Luxe/Premium ranglar) */
    :root {
        --primary: #C43C66;
        --primary-hover: #9B1C48;
        --primary-light: #fdf2f6;
        --text-main: #1a0e13;
        --text-muted: #6b7280;
        --border-color: #e5e7eb;
        --bg-gray: #f9fafb;
        --danger: #ef4444;
    }

    /* Mobile First Styles (Asosiy) */
    .new-lesson-page {
        padding: 16px;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .header-section {
        margin-bottom: 24px;
    }

    .page-title {
        font-size: 24px;
        font-weight: 800;
        color: var(--text-main);
        margin: 0 0 6px 0;
    }

    .page-subtitle {
        color: var(--text-muted);
        font-size: 14px;
        margin: 0;
    }

    /* Boshida faqat bitta ustun (Mobile uchun) */
    .content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    /* Form Card */
    .form-card {
        background: #ffffff;
        border-radius: 20px;
        padding: 20px;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }

    .form-group {
        margin-bottom: 24px;
    }

    label {
        display: block;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 8px;
        color: #374151;
    }

    .required { color: var(--primary); }

    .input-field {
        width: 100%;
        padding: 14px 16px;
        border: 1.5px solid var(--border-color);
        border-radius: 12px;
        font-size: 15px;
        color: var(--text-main);
        background: var(--bg-gray);
        transition: all 0.2s ease;
        font-family: inherit;
    }

    .input-field:focus {
        border-color: var(--primary);
        background: #ffffff;
        outline: none;
        box-shadow: 0 0 0 4px rgba(196, 60, 102, 0.1);
    }

    .input-field::placeholder { color: #9ca3af; }

    /* Drag & Drop Zones */
    .upload-wrapper { width: 100%; }
    .hidden-input { display: none; }

    .dropzone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px dashed #cbd5e1;
        border-radius: 16px;
        background: var(--bg-gray);
        transition: all 0.2s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .dropzone.dragover {
        border-color: var(--primary);
        background: var(--primary-light);
    }

    /* Video qismi balandroq */
    .video-zone { min-height: 160px; padding: 24px; }
    
    /* Rasm qismi ingichkaroq */
    .image-zone { min-height: 140px; padding: 16px; }

    .dropzone.has-file { border: 1.5px solid var(--border-color); background: #ffffff; padding: 16px; }

    .placeholder-content { text-align: center; }
    
    .icon-circle {
        width: 48px; height: 48px;
        background: white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 12px auto;
        color: var(--text-muted);
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .dragover .icon-circle { color: var(--primary); }

    .primary-text { font-size: 14px; font-weight: 500; color: #4b5563; margin-bottom: 4px; }
    .primary-text span { color: var(--primary); font-weight: 600; }
    .secondary-text { font-size: 12px; color: #9ca3af; }

    /* Fayl yuklangandagi holat */
    .file-info-badge {
        display: flex; align-items: center; gap: 16px;
        width: 100%; padding: 12px 16px;
        background: var(--bg-gray); border-radius: 12px;
    }

    .accent-icon { color: var(--primary); flex-shrink: 0; }
    .file-details { flex: 1; min-width: 0; display: flex; flex-direction: column; text-align: left; }
    .file-name { font-weight: 600; font-size: 14px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .file-size { font-size: 12px; color: var(--text-muted); }

    .remove-btn {
        background: white; border: 1px solid var(--border-color);
        border-radius: 8px; width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center;
        color: var(--text-muted); cursor: pointer; transition: 0.2s;
    }
    .remove-btn:hover { background: #fee2e2; color: var(--danger); border-color: #fecaca; }

    /* Rasm preview */
    .image-preview-container { position: relative; width: 100%; display: flex; justify-content: center; }
    .preview-img { max-height: 180px; border-radius: 12px; object-fit: cover; }
    .remove-btn.floating { position: absolute; top: 8px; right: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

    /* Buttons */
    .actions { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }

    .btn {
        padding: 14px; border-radius: 12px; font-weight: 600;
        font-size: 15px; cursor: pointer; transition: 0.2s;
        text-align: center; width: 100%; border: none;
    }

    .btn-secondary { background: var(--bg-gray); color: #4b5563; border: 1px solid var(--border-color); }
    .btn-secondary:hover { background: #f3f4f6; }

    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
    .btn-primary:disabled { background: #fca5a5; cursor: not-allowed; opacity: 0.7; }

    /* O'ng qism - Preview Card */
    .preview-card {
        background: #ffffff; border-radius: 20px;
        padding: 24px; border: 1px solid var(--border-color);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        height: fit-content;
        position: sticky; top: 24px;
    }

    .preview-title { font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0 0 16px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;}

    .preview-box { display: flex; flex-direction: column; gap: 16px; }

    .empty-player {
        background: var(--bg-gray); height: 200px;
        border-radius: 16px; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        color: #9ca3af; gap: 12px; border: 1px solid var(--border-color);
    }
    .empty-icon { opacity: 0.5; }

    .player { width: 100%; border-radius: 16px; background: #000; display: block; }
    
    .image-only-preview { position: relative; width: 100%; border-radius: 16px; overflow: hidden; }
    .image-only-preview img { width: 100%; display: block; object-fit: cover; aspect-ratio: 16/9; }
    .play-overlay {
        position: absolute; inset: 0; background: rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center; color: white;
    }

    .preview-lesson-title { font-size: 18px; font-weight: 700; color: var(--text-main); margin: 0 0 8px 0; line-height: 1.4; }
    .preview-desc { font-size: 14px; color: var(--text-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

    /* Desktop yondashuvi (Ekrani kattalashganda Grid ishga tushadi) */
    @media (min-width: 1024px) {
        .new-lesson-page { padding: 24px 32px; }
        .page-title { font-size: 28px; }
        .content { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
        .actions { flex-direction: row; }
        .btn-secondary { flex: 1; }
        .btn-primary { flex: 2; }
    }
</style>