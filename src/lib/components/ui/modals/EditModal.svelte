<!-- src/lib/components/ui/modal/EditModal.svelte -->
<script>
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	let { student, onSave, onClose } = $props();
</script>

<Modal isOpen={true} onClose={onClose} maxWidth="460px">
	<div class="edit-content">
		<h3>Edit Student</h3>

		<div class="form-grid">
			<input bind:value={student.fullName} placeholder="Full Name" />
			<input bind:value={student.username} placeholder="Username" />
			<div class="col-span-1 sm:col-span-2">
				<PhoneInput bind:value={student.phone} placeholder="+998 00 000 00 00" />
			</div>
			<input bind:value={student.courses} type="number" placeholder="Courses" />
			<input bind:value={student.score} type="number" placeholder="Total Score" />
		</div>

		<div class="modal-buttons">
			<button class="cancel-btn" onclick={onClose}>Bekor qilish</button>
			<button class=" rounded-md bg-primary px-4 font-bold text-background" onclick={onSave}
				>O'zgarishlarni saqlash</button
			>
		</div>
	</div>
</Modal>

<style>
	@reference "tailwindcss";

	.edit-content {
		width: 100%;
	}

	h3 {
		font-size: 22px;
		font-weight: 700;
		margin-bottom: 24px;
		text-align: center;
		color: var(--text-main, #1a0e13);
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-bottom: 28px;
	}

	input {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid var(--border-main, #e5e7eb);
		border-radius: 0.5rem;
		font-size: 15px;
		outline: none;
		background: var(--bg-input, #ffffff);
		color: var(--text-main, #000000);
		transition: all 0.2s;

		@apply rounded-lg;
	}

	input:focus {
		border-color: var(--primary, #ff4d8d);
		box-shadow: 0 0 0 3px rgba(255, 77, 141, 0.15);
	}

	.modal-buttons {
		display: flex;
		gap: 12px;
	}

	.cancel-btn {
		flex: 1;
		padding: 14px;
		border: 1px solid var(--border-main, #e5e7eb);
		background: var(--bg-sidebar, white);
		color: var(--text-main, #000000);
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;

		@apply rounded-lg;
	}

	.cancel-btn:hover {
		background: var(--border-light, #f3f4f6);
	}
</style>
