<script lang="ts">
	import StatCard from '@/lib/components/ui/courses/StatCard.svelte';
	import InputField from '@/lib/components/ui/InputField.svelte';
	import { Users, BookOpen, FileText, Pencil } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let { data, form: serverForm } = $props();

	/** @type {any} */
	let userData = $derived(data.user || {});
	
	// Svelte 5 state
	let profileForm = $state({
		firstName: '',
		lastName: '',
		phone: '',
		username: '',
		role: ''
	});

	// Sync data to form state safely to avoid 'state_referenced_locally' warning
	$effect(() => {
		if (userData) {
			profileForm.firstName = userData['first_name'] || '';
			profileForm.lastName = userData['last_name'] || '';
			profileForm.phone = userData['phone_number'] || '';
			profileForm.username = userData['username'] || "Noma'lum";
			profileForm.role = userData['role'] === 'admin' ? 'Administrator' : userData['role'] || 'Foydalanuvchi';
		}
	});

	let isSubmitting = $state(false);

	$effect(() => {
		if (serverForm?.success) {
			toast.success('Profil muvaffaqiyatli saqlandi!');
		} else if (serverForm?.error) {
			toast.error(serverForm.error);
		}
	});

	function handleSubmit() {
		isSubmitting = true;
		return async ({ update }) => {
			isSubmitting = false;
			await update();
		};
	}

	// Mock timeline datalari
	const activities = [
		{ id: 1, title: 'Course completed', date: 'Jan 27, 2022', points: '+20 point' },
		{ id: 2, title: 'Quiz submission', date: 'Jan 21, 2022', points: '+10 point' },
		{ id: 3, title: 'Quiz submission', date: 'Jan 27, 2022', points: '+30 point' }
	];
</script>

<div class="mx-auto min-h-screen max-w-5xl space-y-6 bg-[#f8fafc] p-4 font-sans md:p-8">
	<div class="rounded-4xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
		<h2 class="mb-8 text-xl font-bold text-slate-800">Profil Sozlamalari</h2>

		<form
			method="POST"
			action="?/updateProfile"
			use:enhance={handleSubmit}
			class="flex flex-col gap-8 md:flex-row lg:gap-12"
		>
			<div class="flex w-32 shrink-0 flex-col items-center gap-4">
				<div
					class="relative flex h-32 w-32 shrink-0 items-end justify-center overflow-hidden rounded-full border border-slate-100 bg-[#dbeafe]"
				>
					<img
						src={'https://ui-avatars.com/api/?name=' +
							encodeURIComponent(profileForm.firstName || 'U')}
						alt="Profile"
						class="h-full w-full object-cover"
						width="112"
						height="112"
					/>
					<button
						type="button"
						class="absolute right-1 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ed4b72] text-white shadow-md transition-transform hover:scale-105"
					>
						<Pencil size={14} />
					</button>
					<!-- Fayl yuklash keyinchalik qoshamiz -->
				</div>

				<p class="text-sm font-semibold text-slate-700">Profil surati</p>
			</div>

			<div class="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
				<InputField
					id="firstName"
					name="first_name"
					label="Ism"
					bind:value={profileForm.firstName}
				/>
				<InputField
					id="username"
					label="Foydalanuvchi nomi"
					bind:value={profileForm.username}
					readonly
				/>

				<InputField
					id="lastName"
					name="last_name"
					label="Familiya"
					bind:value={profileForm.lastName}
					placeholder="Familiya"
				/>
				<InputField id="role" label="Rol" bind:value={profileForm.role} readonly />

				<InputField
					id="phone"
					name="phone_number"
					label="Telefon raqam"
					bind:value={profileForm.phone}
				/>

				<div class="mt-2 flex items-end justify-end sm:col-start-2">
					<button
						type="submit"
						disabled={isSubmitting}
						class="h-11 w-full rounded-xl bg-[#ed4b72] font-bold text-white shadow-sm shadow-rose-200 transition-colors hover:bg-[#de3c61] disabled:opacity-70"
					>
						{isSubmitting ? 'Saqlanmoqda...' : "O'zgarishlarni saqlash"}
					</button>
				</div>
			</div>
		</form>
	</div>

	<div>
		<h2 class="mb-4 px-2 text-xl font-bold text-slate-800">My Stats</h2>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-2">
				<StatCard title="Total score" value="350" isPrimary={true}>
					<Users size={24} />
				</StatCard>

				<StatCard title="Courses count" value="40">
					<BookOpen size={24} strokeWidth={1.5} />
				</StatCard>

				<StatCard title="Submissions count" value="3">
					<FileText size={24} strokeWidth={1.5} />
				</StatCard>
			</div>

			<div class="h-full min-h-35 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
				<h3 class="mb-5 text-[17px] font-bold text-slate-800">Score history or activity</h3>

				<div class="relative space-y-5 pl-3">
					<div class="absolute top-2 bottom-2 left-1.25 w-0.5 rounded-full bg-slate-100"></div>

					{#each activities as item, i (item.id)}
						<div class="relative pl-5">
							<div
								class="absolute top-1.5 -left-2.5 h-2.5 w-2.5 rounded-full {i === 2
									? 'bg-[#ed4b72] ring-4 ring-rose-50'
									: 'bg-slate-300'}"
							></div>

							<div class="flex items-start justify-between gap-4">
								<div>
									<p class="text-sm font-semibold text-slate-800">{item.title}</p>
									<p class="mt-0.5 text-[13px] font-medium text-slate-400">{item.date}</p>
								</div>
								<span class="text-sm font-semibold whitespace-nowrap text-[#10b981]">
									{item.points}
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
