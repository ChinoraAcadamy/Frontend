<script>
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { User, Phone, CheckCircle2, Copy, BookOpen, FileCheck, Star, Settings, ChevronRight, LogOut } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let { data, form } = $props();

	// Use updated profile from form success or default to loaded data
	let profile = $derived(form?.profile || data.profile);
	let isSubmitting = $state(false);

	$effect(() => {
		if (form) {
			if (form.success) {
				toast.success("Muvaffaqiyatli yangilandi");
			} else if (form.error) {
				toast.error(form.error);
			}
			isSubmitting = false;
		}
	});

	const getInitials = (p) => {
		if (!p) return 'CH';
		if (p.first_name || p.last_name) {
			return `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`.toUpperCase();
		}
		return p.username?.substring(0, 2).toUpperCase() || 'CH';
	};

	const copyUsername = async () => {
		if (!profile?.username) return;
		try {
			await navigator.clipboard.writeText(profile.username);
			toast.success('Username nusxalandi');
		} catch {
			toast.error("Xatolik yuz berdi");
		}
	};
</script>

<svelte:head>
	<title>Profil | Chinora Academy</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Hero Section: Brand Identity -->
	<header class="relative h-64 w-full bg-[#FA2E69] sm:h-80 overflow-hidden">
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
		
		<!-- Floating Shapes for Aesthetic -->
		<div class="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
		<div class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/5 blur-3xl"></div>

		<div class="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
			<div in:fly={{ y: 20, duration: 600 }} class="relative">
				<div class="h-28 w-28 rounded-full border-4 border-white shadow-2xl bg-[#FA2E69] flex items-center justify-center text-3xl font-black tracking-tighter">
					{getInitials(profile)}
				</div>
				<div class="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-500 border-4 border-[#FA2E69] flex items-center justify-center shadow-lg">
					<CheckCircle2 size={14} class="text-white" />
				</div>
			</div>

			<h1 in:fly={{ y: 10, delay: 100, duration: 600 }} class="mt-4 text-3xl font-black tracking-tight sm:text-4xl uppercase">
				{profile?.first_name || ''} {profile?.last_name || ''}
				{#if !profile?.first_name && !profile?.last_name}O'quvchi{/if}
			</h1>

			<button 
				onclick={copyUsername}
				class="mt-2 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-white/20"
			>
				<span>@{profile?.username}</span>
				<Copy size={12} />
			</button>
		</div>
	</header>

	<!-- Main Content: Full Width Sections -->
	<main class="mx-auto w-full max-w-5xl">
		
		<!-- Stats Row: High Density Flat Design -->
		<div class="grid grid-cols-1 border-b border-slate-100 sm:grid-cols-3">
			<div class="flex flex-col items-center justify-center border-b border-slate-100 p-8 sm:border-b-0 sm:border-r">
				<span class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
					<Star size={14} class="text-amber-400" /> Umumiy Ball
				</span>
				<span class="mt-2 text-4xl font-black text-slate-900 tracking-tighter">{profile?.total_score || '0'}</span>
			</div>
			
			<div class="flex flex-col items-center justify-center border-b border-slate-100 p-8 sm:border-b-0 sm:border-r">
				<span class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
					<BookOpen size={14} class="text-sky-500" /> Kurslar soni
				</span>
				<span class="mt-2 text-4xl font-black text-slate-900 tracking-tighter">{profile?.courses_count || '0'}</span>
			</div>

			<div class="flex flex-col items-center justify-center p-8">
				<span class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
					<FileCheck size={14} class="text-emerald-500" /> Topshiriqlar
				</span>
				<span class="mt-2 text-4xl font-black text-slate-900 tracking-tighter">{profile?.submissions_count || '0'}</span>
			</div>
		</div>

		<!-- Settings Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
			
			<!-- Left: Navigation / Quick Info -->
			<div class="bg-slate-50/50 p-8 lg:border-r border-slate-100">
				<h2 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#FA2E69]">
					<Settings size={18} /> Sozlamalar
				</h2>
				<p class="mt-2 text-sm text-slate-500 leading-relaxed font-medium">Bu yerda siz o'zingizning shaxsiy ma'lumotlaringizni tahrirlashingiz mumkin.</p>

				<nav class="mt-8 flex flex-col gap-2">
					<div class="flex items-center justify-between rounded-lg bg-white p-4 border border-slate-200 shadow-sm cursor-pointer border-l-4 border-l-[#FA2E69]">
						<div class="flex items-center gap-3">
							<div class="rounded bg-rose-50 p-2 text-rose-500">
								<User size={18} />
							</div>
							<span class="text-sm font-bold text-slate-900 uppercase tracking-wide">Asosiy ma'lumotlar</span>
						</div>
						<ChevronRight size={18} class="text-slate-300" />
					</div>
					
					<div class="flex items-center justify-between rounded-lg bg-white/50 p-4 border border-slate-100 opacity-60">
						<div class="flex items-center gap-3">
							<div class="rounded bg-slate-100 p-2 text-slate-400">
								<Settings size={18} />
							</div>
							<span class="text-sm font-bold text-slate-400 uppercase tracking-wide">Xavfsizlik (tez kunda)</span>
						</div>
					</div>

					<form action="/auth/logout" method="POST" class="mt-4">
						<button class="flex w-full items-center gap-3 rounded-lg p-4 text-rose-600 transition-colors hover:bg-rose-50 group">
							<LogOut size={18} class="group-hover:translate-x-1 transition-transform" />
							<span class="text-xs font-black uppercase tracking-widest">Tizimdan chiqish</span>
						</button>
					</form>
				</nav>
			</div>

			<!-- Right: Form Content -->
			<div class="p-8 sm:p-12">
				<form 
					action="?/updateProfile" 
					method="POST" 
					use:enhance={() => { 
						isSubmitting = true; 
						return async ({ update }) => { 
							await update({ reset: false }); 
							isSubmitting = false; 
						} 
					}} 
					class="flex flex-col gap-8"
				>
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<!-- Input Field -->
						<div class="flex flex-col gap-3">
							<label for="first_name" class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">ISMINGIZ</label>
							<div class="group relative">
								<input 
									type="text" 
									id="first_name" 
									name="first_name" 
									value={profile?.first_name || ''} 
									class="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-bold text-slate-900 outline-none transition-colors placeholder:text-slate-300 group-hover:border-slate-300 focus:border-[#FA2E69]" 
									placeholder="Ali" 
									required 
								/>
							</div>
						</div>

						<!-- Input Field -->
						<div class="flex flex-col gap-3">
							<label for="last_name" class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">FAMILIYANGIZ</label>
							<div class="group relative">
								<input 
									type="text" 
									id="last_name" 
									name="last_name" 
									value={profile?.last_name || ''} 
									class="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-bold text-slate-900 outline-none transition-colors placeholder:text-slate-300 group-hover:border-slate-300 focus:border-[#FA2E69]" 
									placeholder="Toirov" 
									required 
								/>
							</div>
						</div>
					</div>

					<!-- Phone Field -->
					<div class="flex flex-col gap-3">
						<label for="phone_number" class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">TELEFON RAQAMINGIZ</label>
						<div class="group relative">
							<div class="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">
								<Phone size={18} />
							</div>
							<input 
								type="tel" 
								id="phone_number" 
								name="phone_number" 
								value={profile?.phone_number || ''} 
								class="w-full border-b-2 border-slate-200 bg-transparent py-3 pl-8 text-lg font-bold text-slate-900 outline-none transition-colors placeholder:text-slate-300 group-hover:border-slate-300 focus:border-[#FA2E69]" 
								placeholder="+998 90 123 45 67" 
							/>
						</div>
					</div>

					<div class="mt-6 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-10 sm:flex-row">
						<div class="flex flex-col">
							<span class="text-[10px] font-black uppercase tracking-widest text-slate-300">A'zolik sanasi</span>
							{#if profile?.created_at}
								<span class="text-sm font-bold text-slate-500">{new Date(profile.created_at).toLocaleDateString('uz', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
							{/if}
						</div>

						<button 
							type="submit" 
							disabled={isSubmitting} 
							class="w-full sm:w-auto px-12 py-4 bg-[#FA2E69] text-white text-xs font-black uppercase tracking-[0.2em] rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-600/20 disabled:opacity-50 disabled:scale-100"
						>
							{#if isSubmitting}
								<span>Kutilmoqda...</span>
							{:else}
								<span>O'zgarishlarni saqlash</span>
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</main>
</div>

<style>
	:global(body) {
		background-color: white !important;
	}
	
	/* Brand Typography Overrides */
	:global(.admin-body) {
		font-family: 'Lexend', 'Inter', system-ui, sans-serif !important;
	}
</style>
