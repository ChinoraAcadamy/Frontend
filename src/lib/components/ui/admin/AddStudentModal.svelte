<script>
	// @ts-nocheck

	import { X, Eye, EyeOff, Search } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { isOpen = false, onClose, availableCourses = [] } = $props();

	let showPassword = $state(false);
	let isSubmitting = $state(false);
	let serverError = $state('');
	let courseSearchQuery = $state('');
	let showCourseDropdown = $state(false);

	let selectedCourseIds = $state([]);
	function toggleCourse(id) {
		console.log(id, selectedCourseIds);
		selectedCourseIds = selectedCourseIds.includes(id)
			? selectedCourseIds.filter((i) => i !== id)
			: [...selectedCourseIds, id];
	}
	let filteredCourses = $derived(
		availableCourses.filter((c) => c.title.toLowerCase().includes(courseSearchQuery.toLowerCase()))
	);

	function reset() {
		selectedCourseIds = [];
		courseSearchQuery = '';
		serverError = '';
		showCourseDropdown = false;
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl"
			transition:fly={{ y: 20, duration: 300 }}
		>
			<!-- Header -->
			<div class="flex shrink-0 items-center justify-between border-b border-slate-100 p-6">
				<h2 class="text-xl font-bold text-slate-800 sm:text-2xl">Yangi Student Qo'shish</h2>
				<button
					onclick={onClose}
					class="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
				>
					<X size={24} />
				</button>
			</div>

			<!-- Form — action va enhance -->
			<form
				method="POST"
				action="?/createStudent"
				use:enhance={() => {
					isSubmitting = true;
					serverError = '';
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'failure') {
							serverError = result.data?.error ?? 'Xatolik yuz berdi.';
							return;
						}
						if (result.type === 'success') {
							console.log(result.data);
							await invalidateAll(); // Studentlar ro'yxatini yangilash
							reset();
							onClose();
						}
						await update();
					};
				}}
				class="flex flex-1 flex-col overflow-hidden"
			>
				<div class="flex-1 overflow-y-auto p-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<!-- Ism -->
						<div class="space-y-1.5">
							<label class="text-sm font-semibold text-slate-700">Ism *</label>
							<input
								name="firstName"
								type="text"
								placeholder="Ism"
								class="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 transition-all outline-none focus:border-[#ed4b72] focus:ring-4 focus:ring-[#ed4b72]/10"
							/>
						</div>

						<!-- Parol -->
						<div class="space-y-1.5">
							<label class="text-sm font-semibold text-slate-700">Parol</label>
							<div class="relative">
								<input
									name="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Parol"
									class="h-12 w-full rounded-xl border border-slate-200 bg-white pr-12 pl-4 transition-all outline-none focus:border-[#ed4b72] focus:ring-4 focus:ring-[#ed4b72]/10"
								/>
								<button
									type="button"
									onclick={() => (showPassword = !showPassword)}
									class="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400"
								>
									{#if showPassword}<Eye size={20} />{:else}<EyeOff size={20} />{/if}
								</button>
							</div>
						</div>

						<!-- Familiya -->
						<div class="space-y-1.5">
							<label class="text-sm font-semibold text-slate-700">Familiya</label>
							<input
								name="lastName"
								type="text"
								placeholder="Familiya"
								class="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 transition-all outline-none focus:border-[#ed4b72] focus:ring-4 focus:ring-[#ed4b72]/10"
							/>
						</div>

						<!-- Telefon -->
						<div class="space-y-1.5">
							<label class="text-sm font-semibold text-slate-700">Telefon *</label>
							<div
								class="flex h-12 items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-[#ed4b72] focus-within:ring-4 focus-within:ring-[#ed4b72]/10"
							>
								<span class="border-r border-slate-200 pr-2 pl-4 font-medium text-slate-600"
									>+998</span
								>
								<input
									name="phone_number"
									type="text"
									placeholder="901234567"
									class="h-full flex-1 px-3 outline-none"
								/>
							</div>
						</div>

						<!-- Username -->
						<div class="space-y-1.5">
							<label class="text-sm font-semibold text-slate-700">Username</label>
							<div
								class="flex h-12 items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-[#ed4b72] focus-within:ring-4 focus-within:ring-[#ed4b72]/10"
							>
								<span class="pr-1 pl-4 font-medium text-slate-400">@</span>
								<input
									name="username"
									type="text"
									placeholder="login"
									class="h-full flex-1 pr-4 outline-none"
								/>
							</div>
						</div>

						<!-- Kurslar -->
						<div class="relative space-y-1.5">
							<label class="text-sm font-semibold text-slate-700">Kurslarga biriktirish</label>
							<div class="relative">
								<Search
									size={18}
									class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
								/>
								<input
									type="text"
									placeholder="Kurs qidirish..."
									name="course_ids"
									bind:value={courseSearchQuery}
									onfocus={() => (showCourseDropdown = true)}
									class="h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 transition-all outline-none focus:border-[#ed4b72]"
								/>
							</div>

							{#if showCourseDropdown && filteredCourses.length > 0}
								<div
									class="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg"
								>
									{#each filteredCourses as course (course.id)}
										<label
											class="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-slate-50"
										>
											<input
												type="checkbox"
												checked={selectedCourseIds.includes(course.id)}
												onchange={() => toggleCourse(course.id)}
												class="h-4 w-4 rounded accent-[#ed4b72]"
											/>
											<span class="text-sm text-slate-700">{course.title}</span>
										</label>
									{/each}
								</div>
							{/if}

							<!-- Hidden inputs — courseIds array ni formga yuborish -->
							<!-- ✅ BU YERNI O‘ZGARTIRING -->
							{#each selectedCourseIds as id (id)}
								<input type="hidden" name="courseIds[]" value={id} />
							{/each}

							{#if selectedCourseIds.length > 0}
								<div class="mt-2 flex flex-wrap gap-2">
									{#each selectedCourseIds as id (id)}
										{@const course = availableCourses.find((c) => c.id === id)}
										<span
											class="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600"
										>
											{course?.title}
											<button type="button" onclick={() => toggleCourse(id)}><X size={14} /></button
											>
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<!-- Server xatosi -->
					{#if serverError}
						<p class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">{serverError}</p>
					{/if}
				</div>

				<!-- Footer -->
				<div
					class="flex shrink-0 justify-end gap-3 rounded-b-3xl border-t border-slate-100 bg-slate-50 p-6"
				>
					<button
						type="button"
						onclick={onClose}
						class="rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-50"
					>
						Bekor qilish
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex min-w-40 items-center justify-center rounded-xl bg-[#ed4b72] px-6 py-2.5 font-bold text-white shadow-sm shadow-rose-200 transition-all hover:bg-[#de3c61]"
					>
						{isSubmitting ? 'Yaratilmoqda...' : 'Student Yaratish'}
					</button>
				</div>
			</form>
		</div>

		{#if showCourseDropdown}
			<button
				class="fixed inset-0 z-0 cursor-default"
				onclick={() => (showCourseDropdown = false)}
				aria-label="close"
			></button>
		{/if}
	</div>
{/if}
