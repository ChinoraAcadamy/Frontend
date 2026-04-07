<script lang="ts">
	import { X } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';

	let { isOpen = false, student = null, onClose } = $props();

	let isSubmitting = $state(false);

	// Form qiymatlarini mahalliy holatda ($state) saqlaymiz.
	// $derived ishlatsak, inputda yozganda muammo bo'lishi mumkin edi.
	let firstName = $state('');
	let lastName = $state('');
	let phoneNumber = $state('');
	let isActive = $state(true);

	// Qachonki modal ochilsa va student props kelsa, qiymatlarni to'ldiramiz.
	$effect(() => {
		if (isOpen && student) {
			firstName = student.first_name ?? '';
			lastName = student.last_name ?? '';
			phoneNumber = student.phone_number ?? student.phone ?? '';
			isActive = student.is_active ?? true;
		}
	});
</script>

{#if isOpen && student}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl"
			transition:fly={{ y: 20, duration: 300, opacity: 0 }}
		>
			<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
				<div>
					<h2 class="text-xl font-bold text-slate-800">Ma'lumotlarni yangilash</h2>
					<p class="mt-1 text-sm font-medium text-slate-500">@{student.username}</p>
				</div>
				<button
					onclick={onClose}
					class="rounded-full border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition-all hover:border-slate-300 hover:text-slate-600 active:scale-90"
				>
					<X size={18} strokeWidth={2.5} />
				</button>
			</div>

			<form
				method="POST"
				action="?/updateStudent"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="space-y-5 p-6"
			>
				<input type="hidden" name="studentId" value={student.id} />

				<input type="hidden" name="isActive" value={isActive.toString()} />

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<label class="ml-1 text-xs font-bold tracking-wide text-slate-500 uppercase">Ism</label>
						<input
							name="firstName"
							type="text"
							bind:value={firstName}
							placeholder="Ism kiriting"
							class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/10"
						/>
					</div>

					<div class="space-y-2">
						<label class="ml-1 text-xs font-bold tracking-wide text-slate-500 uppercase"
							>Familiya</label
						>
						<input
							name="lastName"
							type="text"
							bind:value={lastName}
							placeholder="Familiya"
							class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/10"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label class="ml-1 text-xs font-bold tracking-wide text-slate-500 uppercase"
						>Telefon raqam</label
					>
					<input
						name="phoneNumber"
						type="text"
						bind:value={phoneNumber}
						placeholder="+998901234567"
						class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/10"
					/>
				</div>

				<div class="flex gap-3 border-t border-slate-100 pt-4">
					<button
						type="button"
						onclick={onClose}
						class="flex-1 rounded-xl bg-slate-100 py-3.5 font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95"
					>
						Bekor qilish
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex-1 rounded-xl bg-slate-900 py-3.5 font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-[#ed4b72] hover:shadow-[#ed4b72]/30 active:scale-95 disabled:opacity-60"
					>
						{isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
