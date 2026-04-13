<script>
	import {
		User,
		Mail,
		Phone,
		Calendar,
		Award,
		Star,
		BookOpen,
		Send,
		Save,
		X,
		Settings2,
		CheckCircle2,
		Trophy,
		GraduationCap,
		LayoutDashboard
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { data, form } = $props();
	let student = $derived(data.student);

	let isEditing = $state(false);
	let isSubmitting = $state(false);

	// Initial form state from student data
	let firstName = $state('');
	let lastName = $state('');
	let phoneNumber = $state('');

	$effect(() => {
		if (student) {
			firstName = student.first_name || '';
			lastName = student.last_name || '';
			phoneNumber = student.phone_number || '';
		}
	});

	$effect(() => {
		if (form?.success) {
			toast.success(m.success_saved());
			isEditing = false;
		} else if (form?.error) {
			toast.error(form.error);
		}
	});

	function toggleEdit() {
		if (isEditing) {
			// Restore local state if canceling
			firstName = student?.first_name || '';
			lastName = student?.last_name || '';
			phoneNumber = student?.phone_number || '';
		}
		isEditing = !isEditing;
	}

	function formatDate(dateStr) {
		if (!dateStr) return "Noma'lum";
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat(getLocale() === 'uz' ? 'uz-UZ' : 'ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}
</script>

<div class="min-h-screen bg-slate-50/50 py-20 lg:py-28">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		{#if !student && data.error}
			<div class="flex flex-col items-center justify-center py-20 text-center" in:fade>
				<div class="mb-4 rounded-full bg-red-100 p-4 text-red-600">
					<X size={40} />
				</div>
				<h2 class="text-2xl font-bold text-slate-800">{m.error_occurred()}</h2>
				<p class="mt-2 text-slate-500">{data.error}</p>
				<button
					onclick={() => window.location.reload()}
					class="mt-6 rounded-xl bg-slate-900 px-6 py-2.5 font-semibold text-white transition-all hover:bg-slate-800"
				>
					{m.retry()}
				</button>
			</div>
		{:else if student}
			<header
				class="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
			>
				<div class="space-y-1">
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ed4b72]/10 text-[#ed4b72]"
						>
							<LayoutDashboard size={22} />
						</div>
						<h1 class="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{m.profile_title()}</h1>
					</div>
					<p class="text-sm font-medium text-slate-500">
						{m.profile_subtitle()}
					</p>
				</div>

				<button
					onclick={toggleEdit}
					class="group flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition-all hover:bg-[#ed4b72] hover:text-white hover:shadow-[#ed4b72]/20 active:scale-95"
				>
					{#if isEditing}
						<X size={18} />
						<span>{m.profile_cancel()}</span>
					{:else}
						<Settings2 size={18} class="transition-transform group-hover:rotate-12" />
						<span>{m.profile_edit()}</span>
					{/if}
				</button>
			</header>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
				<!-- Left: Profile Summary Card -->
				<div class="space-y-6 lg:col-span-4">
					<div
						class="relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-sm"
						in:fly={{ y: 20, duration: 600 }}
					>
						<!-- Background glow -->
						<div
							class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#ed4b72]/5 blur-3xl"
						></div>

						<div class="relative flex flex-col items-center text-center">
							<div class="relative mb-6">
								<div
									class="h-32 w-32 overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-xl ring-4 shadow-slate-200/50 ring-white"
								>
									{#if student.picture}
										<img
											src={student.picture}
											alt={student.username}
											class="h-full w-full object-cover"
										/>
									{:else}
										<div
											class="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 text-slate-400"
										>
											<User size={48} strokeWidth={1.5} />
										</div>
									{/if}
								</div>
								<div
									class="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg ring-4 ring-white"
								>
									<CheckCircle2 size={20} />
								</div>
							</div>

							<h2 class="text-2xl font-bold text-slate-900">
								{student.first_name || student.username}
								{student.last_name || ''}
							</h2>
							<p class="font-bold text-[#ed4b72]">@{student.username}</p>

							<div class="mt-8 grid w-full grid-cols-2 gap-3">
								<div class="rounded-3xl border border-slate-100 bg-slate-50 p-4">
									<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">{m.profile_rank()}</p>
									<div class="mt-1 flex items-center justify-center gap-1.5">
										<Trophy size={16} class="text-amber-500" />
										<span class="text-lg font-black text-slate-800">{student.total_score || 0}</span
										>
									</div>
								</div>
								<div class="rounded-3xl border border-slate-100 bg-slate-50 p-4">
									<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">{m.profile_courses()}</p>
									<div class="mt-1 flex items-center justify-center gap-1.5">
										<GraduationCap size={16} class="text-indigo-500" />
										<span class="text-lg font-black text-slate-800"
											>{student.courses_count || 0}</span
										>
									</div>
								</div>
							</div>
						</div>

						<div class="mt-8 space-y-4 border-t border-slate-100 pt-8">
							<div class="group flex items-center gap-4">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#ed4b72]/10 group-hover:text-[#ed4b72]"
								>
									<Mail size={18} />
								</div>
								<div class="overflow-hidden">
									<p class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
										{m.profile_email()}
									</p>
									<p class="truncate text-sm font-semibold text-slate-700">
										{student.username}@academy.uz
									</p>
								</div>
							</div>
							<div class="group flex items-center gap-4">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#ed4b72]/10 group-hover:text-[#ed4b72]"
								>
									<Calendar size={18} />
								</div>
								<div>
									<p class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{m.profile_date()}</p>
									<p class="text-sm font-semibold text-slate-700">
										{formatDate(student.created_at)}
									</p>
								</div>
							</div>
						</div>

						<!-- Logout Button -->
						<div class="mt-8">
							<form
								method="POST"
								action="/logout"
								use:enhance={() => {
									return async ({ update }) => {
										await update();
									};
								}}
							>
								<button
									type="submit"
									class="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50/50 py-3.5 text-sm font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white active:scale-95"
								>
									<span class="rotate-180"><Settings2 size={18} /></span>
									{m.menu_logout()}
								</button>
							</form>
						</div>
					</div>

					<!-- Side Stats -->
					<div
						class="rounded-[32px] bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10"
						in:fly={{ y: 20, duration: 600, delay: 100 }}
					>
						<div class="flex items-center justify-between">
							<h3 class="text-xs font-bold tracking-widest text-slate-400 uppercase">
								{m.profile_total_submissions()}
							</h3>
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
								<Send size={16} class="text-white" />
							</div>
						</div>
						<div class="mt-4 flex items-end gap-2 text-white">
							<span class="text-4xl font-black">{student.submissions_count || 0}</span>
							<span class="mb-1 text-sm font-medium text-slate-500">{m.profile_submitted_count({ count: "" }).replace(' ta topshirilgan', '')} {m.profile_submitted_count({ count: "" })}</span>
						</div>
						<div class="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
							<div class="h-full bg-[#ed4b72]" style="width: 65%"></div>
						</div>
					</div>
				</div>

				<!-- Right: Content Area -->
				<div class="lg:col-span-8">
					<div
						class="h-full rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-sm"
						in:fly={{ x: 20, duration: 600 }}
					>
						{#if isEditing}
							<div in:fade={{ duration: 200 }}>
								<h3 class="text-2xl font-black text-slate-900">{m.profile_edit()}</h3>
								<p class="mt-1 text-sm font-medium text-slate-500">{m.profile_subtitle()}</p>

								<form
									method="POST"
									action="?/updateProfile"
									use:enhance={() => {
										isSubmitting = true;
										return async ({ update }) => {
											isSubmitting = false;
											await update();
										};
									}}
									class="mt-10 space-y-6"
								>
									<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div class="space-y-2">
											<label for="firstname" class="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase"
												>{m.profile_first_name()}</label
											>
											<input
												name="firstName"
												type="text"
												id="firstname"
												bind:value={firstName}
												class="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 text-sm font-bold text-slate-800 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/5"
												placeholder="Ismingiz"
											/>
										</div>
										<div class="space-y-2">
											<label for="lastname" class="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase"
												>{m.profile_last_name()}</label
											>
											<input
												name="lastName"
												type="text"
												id="lastname"
												bind:value={lastName}
												class="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 text-sm font-bold text-slate-800 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/5"
												placeholder="Familiyangiz"
											/>
										</div>
									</div>

									<div class="space-y-2">
										<label for="phone_number" class="ml-1 text-xs font-bold tracking-widest text-slate-400 uppercase"
											>{m.profile_phone()}</label
										>
										<div class="relative">
											<div class="absolute top-1/2 left-6 -translate-y-1/2 text-slate-400">
												<Phone size={18} />
											</div>
											<input
												name="phoneNumber"
												type="text"
												id="phone_number"
												bind:value={phoneNumber}
												class="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-6 pl-14 text-sm font-bold text-slate-800 transition-all outline-none focus:border-[#ed4b72] focus:bg-white focus:ring-4 focus:ring-[#ed4b72]/5"
												placeholder="+998 00 000 00 00"
											/>
										</div>
									</div>

									<div class="flex flex-col gap-4 pt-8 sm:flex-row">
										<button
											type="submit"
											disabled={isSubmitting}
											class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-[#ed4b72] hover:shadow-[#ed4b72]/30 active:scale-95 disabled:opacity-50"
										>
											{#if isSubmitting}
												<div
													class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
												></div>
												<span>{m.profile_saving()}</span>
											{:else}
												<Save size={20} />
												<span>{m.profile_save()}</span>
											{/if}
										</button>
										<button
											type="button"
											onclick={toggleEdit}
											class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 py-4 font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95"
										>
											{m.profile_cancel()}
										</button>
									</div>
								</form>
							</div>
						{:else}
							<div in:fade={{ duration: 200 }}>
								<div class="flex items-center justify-between">
									<h3 class="text-2xl font-black text-slate-900">{m.pricing_title().replace('<span class="text-primary">investitsiyangiz</span>', 'Asosiy ma\'lumotlar')}</h3>
									<div
										class="hidden rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-[10px] font-black tracking-widest text-emerald-600 uppercase sm:block"
									>
										{m.profile_verified()}
									</div>
								</div>

								<div class="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
									<div class="space-y-1">
										<div class="flex items-center gap-2 text-[#ed4b72]">
											<User size={16} strokeWidth={2.5} />
											<span class="text-[10px] font-black tracking-[0.2em] uppercase"
												>{m.profile_first_name()} {m.profile_last_name()}</span
											>
										</div>
										<p class="text-xl font-black text-slate-800">
											{student.first_name || '—'}
											{student.last_name || '—'}
										</p>
									</div>

									<div class="space-y-1">
										<div class="flex items-center gap-2 text-indigo-500">
											<LayoutDashboard size={16} strokeWidth={2.5} />
											<span class="text-[10px] font-black tracking-[0.2em] uppercase"
												>{m.profile_username()}</span
											>
										</div>
										<p class="text-xl font-black text-slate-800">@{student.username}</p>
									</div>

									<div class="space-y-1">
										<div class="flex items-center gap-2 text-amber-500">
											<Phone size={16} strokeWidth={2.5} />
											<span class="text-[10px] font-black tracking-[0.2em] uppercase">{m.profile_phone()}</span>
										</div>
										<p class="text-xl font-black text-slate-800">
											{student.phone_number || 'Kiritilmagan'}
										</p>
									</div>

									<div class="space-y-1">
										<div class="flex items-center gap-2 text-emerald-500">
											<Star size={16} strokeWidth={2.5} />
											<span class="text-[10px] font-black tracking-[0.2em] uppercase">Status</span>
										</div>
										<p class="text-xl font-black text-slate-800">
											{student.is_active ? m.profile_active_student() : m.profile_inactive()}
										</p>
									</div>
								</div>

								<!-- Achievement Cards -->
								<div class="mt-16">
									<div class="mb-6 flex items-center justify-between">
										<h4 class="text-lg font-black tracking-tight text-slate-900 uppercase">
											{m.profile_achievements()}
										</h4>
										<button class="text-xs font-bold text-[#ed4b72] transition-all hover:underline"
											>{m.dashboard_view_all()}</button
										>
									</div>
									<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div
											class="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-[#ed4b72]/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/20"
										>
											<div class="flex items-center gap-4">
												<div
													class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors group-hover:bg-[#ed4b72] group-hover:text-white"
												>
													<Award size={24} />
												</div>
												<div>
													<h5 class="font-bold text-slate-800">{m.profile_certificates()}</h5>
													<p class="text-xs font-medium text-slate-400">{m.profile_no_certificates()}</p>
												</div>
											</div>
										</div>
										<div
											class="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-indigo-500/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/20"
										>
											<div class="flex items-center gap-4">
												<div
													class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors group-hover:bg-indigo-500 group-hover:text-white"
												>
													<BookOpen size={24} />
												</div>
												<div>
													<h5 class="font-bold text-slate-800">{m.profile_materials()}</h5>
													<p class="text-xs font-medium text-slate-400">{m.profile_mastered({ percent: "80" })}</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		background-color: #f8fafc;
	}
</style>
