<script>
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { X } from 'lucide-svelte';

	let { 
		isOpen = false, 
		onClose, 
		title = '', 
		maxWidth = '420px',
		noPadding = false,
		children 
	} = $props();

	// Orqa fonni qulflash (Mobil UX uchun muhim)
	$effect(() => {
		if (!browser) return;
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			if (browser) document.body.style.overflow = '';
		};
	});
</script>

{#if isOpen}
	<!-- Overlay/Backdrop -->
	<div 
		class="modal-backdrop" 
		transition:fade={{ duration: 200 }} 
		onclick={onClose} 
		aria-hidden="true"
	></div>

	<!-- Modal Container -->
	<div 
		class="modal-container" 
		transition:fly={{ y: 30, duration: 300, easing: cubicOut }} 
		role="dialog"
		aria-label={title || 'Modal'}
		style="--max-w: {maxWidth}"
	>
		{#if title}
			<div class="modal-header">
				<h3 class="modal-title">{title}</h3>
				<button class="close-btn" onclick={onClose} aria-label="Yopish">
					<X size={20} />
				</button>
			</div>
		{:else}
			<!-- Sarlavha yo'q bo'lsa ham mobil uchun yopish tugmasini o'ng burchakda berish -->
			<button class="close-btn-absolute" onclick={onClose} aria-label="Yopish">
				<X size={20} />
			</button>
		{/if}

		<div class="modal-body" style="{noPadding ? 'padding: 0;' : ''}">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}

	.modal-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1001;
		background: var(--bg-sidebar, #ffffff);
		border-top: 1px solid var(--border-light, #e5e7eb);
		border-radius: 24px 24px 0 0;
		box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 768px) {
		.modal-container {
			/* Desktopda markazlashtirish */
			bottom: 0;
			top: 0;
			left: 0;
			right: 0;
			margin: auto;
			width: calc(100% - 2rem);
			height: fit-content;
			max-width: var(--max-w);
			border: 1px solid var(--border-light, #e5e7eb);
			border-radius: 20px;
			max-height: 90vh;
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem 1rem;
		border-bottom: 1px solid var(--border-light, #e5e7eb);
		flex-shrink: 0;
	}

	.modal-title {
		font-size: 16px;
		font-weight: 700;
		color: var(--text-main, #111827);
		margin: 0;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--bg-input, #f3f4f6);
		border: none;
		color: var(--text-muted, #6b7280);
		cursor: pointer;
		transition: background 0.2s;
	}

	.close-btn:hover {
		background: var(--border-light, #e5e7eb);
	}

	.close-btn-absolute {
		position: absolute;
		top: 16px;
		right: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--bg-input, #f3f4f6);
		border: none;
		color: var(--text-muted, #6b7280);
		cursor: pointer;
		transition: background 0.2s;
		z-index: 10;
	}

	.close-btn-absolute:hover {
		background: var(--border-light, #e5e7eb);
	}

	.modal-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
	}
</style>
