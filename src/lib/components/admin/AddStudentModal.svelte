<script>
	// @ts-nocheck

	import { browser } from '$app/environment';
	import { X, Eye, EyeOff, Search, Check, BookOpen } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import PhoneInput from '@/lib/components/ui/PhoneInput.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { isOpen = false, onClose, availableCourses = [] } = $props();

	let showPassword = $state(false);
	let isSubmitting = $state(false);
	let serverError = $state('');
	let courseSearchQuery = $state('');
	let showCourseDropdown = $state(false);
	let selectedCourseIds = $state([]);

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

	let filteredCourses = $derived(
		availableCourses.filter((c) => c.title.toLowerCase().includes(courseSearchQuery.toLowerCase()))
	);

	function toggleCourse(id) {
		selectedCourseIds = selectedCourseIds.includes(id)
			? selectedCourseIds.filter((i) => i !== id)
			: [...selectedCourseIds, id];
	}

	function reset() {
		selectedCourseIds = [];
		courseSearchQuery = '';
		serverError = '';
		showCourseDropdown = false;
		showPassword = false;
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-9999 flex items-end justify-center bg-slate-900/50 p-2 backdrop-blur-sm sm:items-center sm:p-6"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="flex max-h-[95vh] w-full max-w-2xl flex-col rounded-4xl border border-main bg-card shadow-2xl sm:max-h-[90vh]"
			transition:fly={{ y: 50, duration: 300, opacity: 0 }}
		>
			<div class="flex shrink-0 items-center justify-between border-b border-main p-5 sm:p-6">
				<h2 class="text-xl font-extrabold text-main sm:text-2xl">
					{m.modal_add_student_title ? m.modal_add_student_title() : 'Yangi Student'}
				</h2>
				<button
					type="button"
					onclick={onClose}
					class="rounded-full border border-main bg-card p-2 text-muted transition-colors hover:bg-muted/10 active:scale-95"
				>
					<X size={20} strokeWidth={2.5} />
				</button>
			</div>

			<form
				method="POST"
				action="?/createStudent"
				use:enhance={() => {
					isSubmitting = true;
					serverError = '';
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'failure') {
							serverError =
								result.data?.error ??
								(m.error_occurred ? m.error_occurred() : 'Xatolik yuz berdi.');
							return;
						}
						if (result.type === 'success') {
							await invalidateAll();
							reset();
							onClose();
						}
						await update();
					};
				}}
				class="flex flex-1 flex-col overflow-hidden"
			>
				<div class="custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-6">
					{#if serverError}
						<div
							class="mb-5 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm font-medium text-primary"
						>
							{serverError}
						</div>
					{/if}

					<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
						<div class="space-y-1.5">
							<label for="firstName" class="text-sm font-bold text-main"
								>{m.admin_student_first_name ? m.admin_student_first_name() : 'Ism'}
								<span class="text-primary">*</span></label
							>
							<input
								name="firstName"
								id="firstName"
								type="text"
								placeholder={m.placeholder_first_name
									? m.placeholder_first_name()
									: 'Masalan: Alisher'}
								class="h-12 w-full rounded-xl border border-main bg-muted/5 px-4 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="lastName" class="text-sm font-bold text-main">
								{m.admin_student_last_name ? m.admin_student_last_name() : 'Familiya'}
							</label>
							<input
								name="lastName"
								id="lastName"
								type="text"
								placeholder={m.placeholder_last_name
									? m.placeholder_last_name()
									: 'Masalan: Navoiy'}
								class="h-12 w-full rounded-xl border border-main bg-muted/5 px-4 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="phone_number" class="text-sm font-bold text-main"
								>{m.admin_student_phone ? m.admin_student_phone() : 'Telefon'}
								<span class="text-primary">*</span></label
							>
							<PhoneInput
								name="phone_number"
								id="phone_number"
								placeholder={m.placeholder_phone ? m.placeholder_phone() : '+998 90 123 45 67'}
							/>
						</div>

						<div class="space-y-1.5">
							<label for="username" class="text-sm font-bold text-main">
								{m.profile_username ? m.profile_username() : 'Username'}
							</label>
							<div
								class="flex h-12 items-center overflow-hidden rounded-xl border border-main bg-muted/5 transition-all focus-within:border-primary focus-within:bg-card focus-within:ring-4 focus-within:ring-primary/10"
							>
								<span class="pr-1 pl-4 text-sm font-bold text-muted">@</span>
								<input
									id="username"
									name="username"
									type="text"
									placeholder={m.placeholder_username ? m.placeholder_username() : 'login'}
									autocomplete="off"
									class="h-full flex-1 bg-transparent pr-4 text-sm font-medium text-main outline-none"
								/>
							</div>
						</div>

						<div class="space-y-1.5 md:col-span-2">
							<label for="password" class="text-sm font-bold text-main">
								{m.login_password_label ? m.login_password_label() : 'Parol'}
							</label>
							<div class="relative">
								<input
									name="password"
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder={m.placeholder_password ? m.placeholder_password() : 'Yashirin parol'}
									class="h-12 w-full rounded-xl border border-main bg-muted/5 pr-12 pl-4 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
								/>
								<button
									type="button"
									onclick={() => (showPassword = !showPassword)}
									class="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-muted transition-colors hover:bg-muted/10 hover:text-main"
								>
									{#if showPassword}<Eye size={18} />{:else}<EyeOff size={18} />{/if}
								</button>
							</div>
						</div>

						<div class="relative space-y-1.5 md:col-span-2">
							<label for="biriktirish" class="text-sm font-bold text-main">
								{m.label_attach_courses ? m.label_attach_courses() : 'Kurslarga biriktirish'}
							</label>

							<div class="relative">
								<Search
									size={18}
									strokeWidth={2.5}
									class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
								/>
								<input
									id="biriktirish"
									type="text"
									placeholder={m.placeholder_search_courses
										? m.placeholder_search_courses()
										: 'Kurs qidirish...'}
									autocomplete="off"
									bind:value={courseSearchQuery}
									onfocus={() => (showCourseDropdown = true)}
									onblur={() => (showCourseDropdown = false)}
									class="h-12 w-full rounded-xl border border-main bg-muted/5 pr-4 pl-11 text-sm font-medium text-main transition-all outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
								/>
							</div>

							{#if showCourseDropdown && filteredCourses.length > 0}
								<div
									class="custom-scrollbar absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-main bg-card p-2 shadow-2xl"
									tabindex="0"
									role="listbox"
									onkeydown={(e) => e.key === 'Escape' && (showCourseDropdown = false)}
									onmousedown={(e) => e.preventDefault()}
								>
									<div class="space-y-1">
										{#each filteredCourses as course (course.id)}
											{@const isSelected = selectedCourseIds.includes(course.id)}
											<button
												type="button"
												class="flex w-full cursor-pointer items-center justify-between rounded-xl border p-2.5 text-left transition-all
                                                    {isSelected
													? 'border-primary bg-primary/5'
													: 'border-transparent hover:bg-muted/5'}"
												onclick={() => toggleCourse(course.id)}
											>
												<div class="flex items-center gap-3">
													<div
														class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {isSelected
															? 'bg-primary text-white'
															: 'bg-muted/10 text-muted'}"
													>
														{#if isSelected}
															<Check size={16} strokeWidth={3} />
														{:else}
															<BookOpen size={16} />
														{/if}
													</div>
													<div>
														<h4 class="text-sm font-bold text-main">{course.title}</h4>
														<p class="text-xs font-medium text-muted">
															{course.price
																? course.price.toLocaleString() + ' UZS'
																: m.course_free
																	? m.course_free()
																	: 'Bepul'}
														</p>
													</div>
												</div>
											</button>
										{/each}
									</div>
								</div>
							{/if}

							{#each selectedCourseIds as id (id)}
								<input type="hidden" name="courseIds[]" value={id} />
							{/each}

							{#if selectedCourseIds.length > 0}
								<div class="mt-3 flex flex-wrap gap-2">
									{#each selectedCourseIds as id (id)}
										{@const course = availableCourses.find((c) => c.id === id)}
										{#if course}
											<span
												class="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
											>
												{course.title}
												<button
													type="button"
													onclick={() => toggleCourse(id)}
													class="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-primary/20 active:scale-90"
												>
													<X size={14} strokeWidth={2.5} />
												</button>
											</span>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div
					class="flex shrink-0 flex-col-reverse justify-end gap-3 rounded-b-4xl border-t border-main bg-muted/5 p-5 sm:flex-row sm:p-6"
				>
					<button
						type="button"
						onclick={onClose}
						class="w-full rounded-xl border border-main bg-card py-3.5 text-sm font-bold text-muted transition-colors hover:bg-muted/10 sm:w-auto sm:px-6"
					>
						{m.admin_btn_cancel ? m.admin_btn_cancel() : 'Bekor qilish'}
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-70 sm:w-auto sm:min-w-[160px]"
					>
						{isSubmitting
							? m.btn_creating
								? m.btn_creating()
								: 'Yaratilmoqda...'
							: m.btn_create_student
								? m.btn_create_student()
								: 'Student Yaratish'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	/* Chiroyli va ixcham scrollbar */
	.custom-scrollbar::-webkit-scrollbar {
		width: 5px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: var(--border-main);
		border-radius: 20px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background-color: var(--text-muted);
	}
</style>
