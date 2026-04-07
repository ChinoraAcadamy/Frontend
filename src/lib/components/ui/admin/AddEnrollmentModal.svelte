<script lang="ts">
	import { X, Search, Check, BookOpen } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { showToast } from '@/lib/utils/toast.js';

	let { isOpen = false, onClose, availableCourses = [], studentName = '', enrolledCourseIds = [] } = $props();

	let isSubmitting = $state(false);
	let searchQuery = $state('');
	let selectedCourseIds = $state([]);

	let filteredCourses = $derived(
		availableCourses.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function toggleCourse(id) {
		if (enrolledCourseIds.includes(id)) return; // already enrolled, ignore
		if (selectedCourseIds.includes(id)) {
			selectedCourseIds = selectedCourseIds.filter((cId) => cId !== id);
		} else {
			selectedCourseIds = [...selectedCourseIds, id];
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		role="dialog"
		aria-modal="true"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute inset-0" onclick={onClose}></div>

		<div
			class="relative z-10 flex h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
			transition:fly={{ y: 20, duration: 300, opacity: 0 }}
		>
			<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
				<div>
					<h2 class="text-xl font-bold text-slate-800">Kurs qo'shish</h2>
					<p class="mt-1 text-sm font-medium text-slate-500">{studentName}</p>
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
				action="?/createEnrollment"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							showToast("Kurs muvaffaqiyatli qo'shildi!", 'success');
							selectedCourseIds = [];
							searchQuery = '';
							onClose();
						} else if (result.type === 'failure') {
							const err = result.data?.createError;
							showToast(
								typeof err === 'string' ? err : 'Kurs qoshishda xatolik yuz berdi!',
								'error'
							);
						}
						await update();
					};
				}}
				class="flex flex-1 flex-col overflow-hidden p-6"
			>
				<div class="mb-4">
					<div class="relative flex items-center">
						<Search class="absolute left-4 text-slate-400" size={18} />
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Kurslarni qidirish..."
							class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm font-medium text-slate-800 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/10"
						/>
					</div>
				</div>

				<div class="custom-scrollbar flex-1 overflow-y-auto pr-2">
					{#if filteredCourses.length === 0}
						<div class="flex h-full flex-col items-center justify-center text-slate-400">
							<BookOpen size={48} class="mb-4 opacity-20" />
							<p>Kurslar topilmadi</p>
						</div>
					{:else}
						<div class="space-y-2">
							{#each filteredCourses as course (course.id)}
								{@const isEnrolled = enrolledCourseIds.includes(course.id)}
								{@const isSelected = selectedCourseIds.includes(course.id)}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="flex items-center justify-between rounded-xl border p-4 transition-all
										{isEnrolled
											? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-60'
											: isSelected
												? 'cursor-pointer border-[#ed4b72] bg-[#ed4b72]/5 shadow-sm'
												: 'cursor-pointer border-slate-100 hover:border-slate-200 hover:bg-slate-50'}"
									onclick={() => toggleCourse(course.id)}
								>
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors
												{isEnrolled
													? 'bg-emerald-100 text-emerald-600'
													: isSelected
														? 'bg-[#ed4b72] text-white'
														: 'bg-slate-100 text-slate-500'}"
										>
											{#if isEnrolled}
												<Check size={18} strokeWidth={3} />
											{:else if isSelected}
												<Check size={18} strokeWidth={3} />
											{:else}
												<BookOpen size={18} />
											{/if}
										</div>
										<div>
											<h4 class="font-bold {isEnrolled ? 'text-slate-500' : 'text-slate-800'}">{course.title}</h4>
											<p class="text-xs {isEnrolled ? 'text-emerald-600 font-semibold' : 'text-slate-500'}">
												{#if isEnrolled}
													Allaqachon biriktirilgan
												{:else}
													{course.price ? course.price.toLocaleString() + ' UZS' : 'Bepul'}
												{/if}
											</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Hidden inputs to send to action -->
				{#each selectedCourseIds as id (id)}
					<input type="hidden" name="courseIds[]" value={id} />
				{/each}

				<div class="mt-6 flex gap-3 border-t border-slate-100 pt-4">
					<button
						type="button"
						onclick={onClose}
						class="flex-1 rounded-xl bg-slate-100 py-3.5 font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95"
					>
						Bekor qilish
					</button>
					<button
						type="submit"
						disabled={isSubmitting || selectedCourseIds.length === 0}
						class="flex-1 rounded-xl bg-slate-900 py-3.5 font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-[#ed4b72] hover:shadow-[#ed4b72]/30 active:scale-95 disabled:opacity-60"
					>
						{isSubmitting ? 'Biriktirilmoqda...' : `Biriktirish (${selectedCourseIds.length})`}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: #cbd5e1;
		border-radius: 20px;
	}
</style>
