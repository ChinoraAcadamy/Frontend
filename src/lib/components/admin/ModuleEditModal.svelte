<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import ModuleForm from '$lib/components/admin/forms/ModuleForm.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { isOpen = $bindable(false), moduleTarget = null, coursePk = null } = $props();
	let isSubmitting = $state(false);

	function closeModal() {
		isOpen = false;
	}

	function handleSubmit() {
		isSubmitting = true;
		return async ({ update }) => {
			closeModal();
			await update();
		};
	}
</script>

<Modal
	{isOpen}
	onClose={closeModal}
	title={m.modal_edit_module_title ? m.modal_edit_module_title() : 'Modulni tahrirlash'}
	maxWidth="480px"
>
	<ModuleForm
		action="?/editModule"
		{moduleTarget}
		{coursePk}
		bind:isSubmitting
		onSubmit={handleSubmit}
	/>
</Modal>
