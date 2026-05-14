<!-- src/lib/components/ui/modal/DeleteModal.svelte -->
<script>
	import Modal from '$lib/components/ui/Modal.svelte';

	let { student, onConfirm, onClose } = $props();
</script>

<Modal isOpen={true} onClose={onClose} maxWidth="420px">
	<div class="delete-content">
		<h3 class="text-primary">Ishonchingiz komilmi?</h3>
		<p>
			<strong>{student.fullName || student.username}</strong>ni butunlay o‘chirib tashlamoqchimisiz?<br />
		</p>

		<div class="modal-buttons">
			<button class="cancel-btn" onclick={onClose}>Yo‘q, Bekor qilish</button>
			<button class="delete-btn bg-primary" onclick={onConfirm}>Ha, O‘chirish</button>
		</div>
	</div>
</Modal>

<style>
	@reference "tailwindcss";

	.delete-content {
		text-align: center;
	}

	h3 {
		font-size: 22px;
		margin-bottom: 12px;
	}

	p {
		color: var(--text-main, #374151);
		line-height: 1.5;
		margin-bottom: 28px;
	}

	.modal-buttons {
		display: flex;
		gap: 12px;
	}

	.cancel-btn {
		flex: 1;
		padding: 14px;
		background: var(--bg-input, #f3f4f6);
		color: var(--text-main, #374151);
		border: none;
		font-weight: 600;
		@apply rounded-md;
		transition: background 0.2s;
	}
	
	.cancel-btn:hover {
		background: var(--border-light, #e5e7eb);
	}

	.delete-btn {
		flex: 1;
		padding: 14px;
		color: white;
		border: none;
		font-weight: 600;
		@apply rounded-md;
	}
</style>
