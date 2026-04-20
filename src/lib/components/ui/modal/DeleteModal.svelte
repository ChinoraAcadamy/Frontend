<!-- src/lib/components/ui/modal/DeleteModal.svelte -->
<script>
	let { student, onConfirm, onClose } = $props();
</script>

<div
	class="modal-overlay"
	role="alertdialog"
	tabindex="0"
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	onclick={onClose}
>
	<div class="modal delete-modal">
		<h3 class="text-primary">Ishonchingiz komilmi?</h3>
		<p>
			<strong>{student.fullName}</strong>ni butunlay o‘chirib tashlamoqchimisiz?<br />
		</p>

		<div class="modal-buttons">
			<button class="cancel-btn" onclick={onClose}>Yo‘q, Bekor qilish</button>
			<button class="delete-btn bg-primary" onclick={onConfirm}>Ha, O‘chirish</button>
		</div>
	</div>
</div>

<style>
	@reference "tailwindcss";

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999999;
	}

	.delete-modal {
		background: white;
		max-width: 420px;
		padding: 32px;
		text-align: center;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.4);
		@apply rounded-lg;
	}

	h3 {
		/* color: #E11D48; */
		font-size: 22px;
		margin-bottom: 12px;
	}

	p {
		color: #374151;
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
		background: #f3f4f6;
		border: none;
		font-weight: 600;
		@apply rounded-md;
	}

	.delete-btn {
		flex: 1;
		padding: 14px;
		/* background: #E11D48; */
		color: white;
		border: none;
		font-weight: 600;

		@apply rounded-md;
	}
</style>
