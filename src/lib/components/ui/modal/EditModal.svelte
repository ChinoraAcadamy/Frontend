<!-- src/lib/components/ui/modal/EditModal.svelte -->
<script>
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';
	let { student, onSave, onClose } = $props();
</script>

<div
	class="modal-overlay"
	onclick={onClose}
	role="dialog"
	aria-modal="true"
	tabindex="0"
	onkeydown={(e) => e.key === 'Escape' && onClose()}
>
	<div
		class="modal rounded-lg"
		onclick={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && onClose()}
	>
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
		z-index: 99999999;
		animation: fadeIn 0.2s ease;
	}

	.modal {
		background: white;
		width: 100%;
		max-width: 460px;
		/* border-radius: 20px; */
		padding: 32px;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.4);
		animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

		@apply rounded-lg;
	}

	h3 {
		font-size: 22px;
		font-weight: 700;
		margin-bottom: 24px;
		text-align: center;
		color: #1a0e13;
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
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		font-size: 15px;
		outline: none;
		transition: all 0.2s;

		@apply rounded-lg;
	}

	input:focus {
		border-color: #ff4d8d;
		box-shadow: 0 0 0 3px rgba(255, 77, 141, 0.15);
	}

	.modal-buttons {
		display: flex;
		gap: 12px;
	}

	.cancel-btn {
		flex: 1;
		padding: 14px;
		border: 1px solid #e5e7eb;
		background: white;
		/* border-radius: 12px; */
		font-weight: 600;
		cursor: pointer;

		@apply rounded-lg;
	}

	.save-btn {
		flex: 1;
		padding: 14px;
		background: #ff4d8d;
		color: white;
		border: none;
		/* border-radius: 12px; */
		font-weight: 600;
		cursor: pointer;
	}

	@keyframes modalPop {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
