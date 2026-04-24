<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { X } from 'lucide-svelte';
	import ModuleForm from '@/lib/components/ui/admin/forms/ModuleForm.svelte';
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

	// Orqa fonni qulflash (Mobil UX uchun juda muhim)
	$effect(() => {
		if (browser) {
			if (isOpen) document.body.style.overflow = 'hidden';
			else document.body.style.overflow = '';
		}
		return () => {
			if (browser) document.body.style.overflow = '';
		};
	});
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-2000 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
		transition:fade={{ duration: 200 }}
		onclick={closeModal}
	>
		<div
			class="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
			transition:scale={{ start: 0.95, duration: 200 }}
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Header -->
			<div
				class="flex shrink-0 items-center justify-between border-b border-border bg-muted/5 p-5 sm:p-6"
			>
				<h3 class="text-xl font-black text-foreground">
					{m.modal_edit_module_title ? m.modal_edit_module_title() : 'Modulni tahrirlash'}
				</h3>
				<button
					onclick={closeModal}
					class="rounded-xl p-2 text-muted transition-all hover:bg-muted/10 hover:text-foreground active:scale-95"
				>
					<X size={20} strokeWidth={2.5} />
				</button>
			</div>

			<!-- Body -->
			<div class="overflow-y-auto p-5 sm:p-6">
				<ModuleForm
					action="?/editModule"
					{moduleTarget}
					{coursePk}
					bind:isSubmitting
					onSubmit={handleSubmit}
				/>
			</div>
		</div>
	</div>
{/if}
