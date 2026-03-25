<script lang="ts">
	import { X, Info, Eye, EyeOff, CheckCircle2 } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let { isOpen = false, studentName = 'Ali Karimov', onClose } = $props();

	let newPass = $state('');
	let confirmPass = $state('');
	let showPass = $state(false);
	let isSuccess = $state(false);

	// Password strength logic
	let strength = $derived.by(() => {
		if (!newPass) return 0;
		let s = 0;
		if (newPass.length >= 8) s += 25;
		if (/[A-Z]/.test(newPass)) s += 25;
		if (/[a-z]/.test(newPass)) s += 25;
		if (/[0-9]/.test(newPass)) s += 25;
		return s;
	});

	const getStrengthLabel = (s) => {
		if (s <= 25) return { label: 'Zaif', color: 'bg-red-500' };
		if (s <= 75) return { label: "O'rtacha", color: 'bg-amber-500' };
		return { label: 'Kuchli', color: 'bg-emerald-500' };
	};
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-100 flex items-center justify-center overflow-hidden p-0 sm:p-4"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
			role="button"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Escape') void onClose();
			}}
			onclick={onClose}
		></div>

		<div
			class="relative flex h-full w-full flex-col bg-white shadow-2xl sm:h-auto sm:max-w-md sm:rounded-3xl"
			transition:fly={{ y: 20, duration: 300 }}
		>
			{#if !isSuccess}
				<div class="flex items-center justify-between border-b border-slate-50 p-6">
					<div>
						<h2 class="text-xl font-bold text-slate-800">Parolni O'zgartirish</h2>
						<p class="mt-0.5 text-xs font-medium text-slate-400">{studentName} uchun</p>
					</div>
					<button
						onclick={onClose}
						class="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
						><X size={20} /></button
					>
				</div>

				<div class="flex-1 space-y-6 p-6">
					<div class="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
						<Info size={18} class="mt-0.5 text-blue-500" />
						<p class="text-xs leading-relaxed font-medium text-blue-700">
							Yangi parol student keyingi safar tizimga kirishida talab qilinadi.
						</p>
					</div>

					<div class="space-y-4">
						<div class="space-y-2">
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="ml-1 text-xs font-bold text-slate-500 uppercase">Yangi parol</label>
							<div class="relative">
								<input
									type={showPass ? 'text' : 'password'}
									bind:value={newPass}
									placeholder="Kamida 8 ta belgi"
									class="h-12 w-full rounded-xl border-2 border-transparent bg-slate-50 pr-12 pl-4 text-sm font-medium transition-all outline-none focus:border-[#FF4D8D] focus:bg-white"
								/>
								<button
									onclick={() => (showPass = !showPass)}
									class="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600"
								>
									{#if showPass}<EyeOff size={18} />{:else}<Eye size={18} />{/if}
								</button>
							</div>
							<div class="space-y-1 px-1">
								<div class="flex items-center justify-between">
									<span class="text-[10px] font-bold tracking-tighter text-slate-400 uppercase"
										>Xavfsizlik darajasi</span
									>
									<span
										class="text-[10px] font-black {getStrengthLabel(strength).color.replace(
											'bg-',
											'text-'
										)} tracking-tighter uppercase"
									>
										{getStrengthLabel(strength).label}
									</span>
								</div>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
									<div
										class="h-full {getStrengthLabel(strength).color} transition-all duration-500"
										style="width: {strength}%"
									></div>
								</div>
							</div>
						</div>

						<div class="space-y-2">
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="ml-1 text-xs font-bold text-slate-500 uppercase"
								>Parolni tasdiqlash</label
							>
							<input
								type="password"
								bind:value={confirmPass}
								placeholder="Parolni qayta kiriting"
								class="h-12 w-full rounded-xl border-2 bg-slate-50 px-4 {confirmPass &&
								newPass !== confirmPass
									? 'border-red-500 focus:border-red-500'
									: 'border-transparent focus:border-[#FF4D8D]'} text-sm font-medium transition-all outline-none focus:bg-white"
							/>
							{#if confirmPass && newPass !== confirmPass}
								<p class="ml-1 text-[10px] font-bold text-red-500">Parollar mos kelmadi</p>
							{/if}
						</div>
					</div>
				</div>

				<div class="flex gap-3 bg-slate-50/50 p-6">
					<button
						onclick={onClose}
						class="flex-1 py-3 font-bold text-slate-500 transition-all hover:text-slate-700"
						>Bekor qilish</button
					>
					<button
						disabled={strength < 50 || newPass !== confirmPass}
						onclick={() => (isSuccess = true)}
						class="flex-1 rounded-xl bg-[#FF4D8D] py-3 font-bold text-white shadow-lg shadow-pink-200 transition-all hover:shadow-pink-300 active:scale-95 disabled:opacity-50 disabled:shadow-none"
					>
						Parolni Saqlash
					</button>
				</div>
			{:else}
				<div
					class="flex flex-col items-center justify-center space-y-4 p-12 text-center"
					in:fly={{ y: 20 }}
				>
					<div
						class="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
					>
						<CheckCircle2 size={48} strokeWidth={2.5} />
					</div>
					<h2 class="text-2xl font-black text-slate-800">Tayyor!</h2>
					<p class="text-sm font-medium text-slate-500">Parol muvaffaqiyatli o'zgartirildi</p>
					<button
						onclick={onClose}
						class="mt-6 rounded-xl bg-slate-900 px-8 py-3 font-bold text-white transition-all hover:bg-slate-800"
						>Yopish</button
					>
				</div>
			{/if}
		</div>
	</div>
{/if}
