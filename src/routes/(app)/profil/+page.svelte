<!-- src/routes/admin/profile/+page.svelte -->
<script>
	import { Camera, Save, Mail, Phone, MapPin, Calendar, Award } from 'lucide-svelte';

	let isEditing = false;

	// Statik ma'lumotlar (keyinchalik backenddan keladi)
	let profile = {
		name: "Ibodullayeva Chinora",
		role: "Academy Founder & Head Instructor",
		email: "chinora@chinora.uz",
		phone: "+998 33 805 55 05",
		location: "Tashkent, Uzbekistan",
		joinDate: "Mart 2022",
		bio: "8 yildan ortiq tajribaga ega tikuvchilik va dizayn ustoziman. Müller metodikasi bo‘yicha mutaxassis. Yuzlab shogirdlarni professional darajaga yetkazdim.",
		avatar: "/images/hero_compressed.jpg", // o'zgartirsa bo'ladi
		totalStudents: 248,
		coursesCreated: 14,
		rating: 4.98
	};

	let tempProfile = { ...profile };

	function toggleEdit() {
		isEditing = !isEditing;
		if (!isEditing) {
			tempProfile = { ...profile };
		}
	}

	function saveProfile() {
		profile = { ...tempProfile };
		isEditing = false;
		// Bu yerda backendga POST qilish mumkin
		alert("Profil muvaffaqiyatli yangilandi! (Backend integratsiyasi keyinroq qo'shiladi)");
	}
</script>

<div class="min-h-screen bg-linear-to-br from-[#F8F4F0] to-[#F1EAE3] py-25">
	<div class="max-w-5xl mx-auto px-6">

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

			<!-- Left Side - Avatar & Info -->
			<div class="lg:col-span-4">
				<div class="bg-white rounded-3xl shadow-sm border border-white/70 p-8 text-center sticky top-8">
					<div class="relative mx-auto w-40 h-40">
						<img
							src={profile.avatar}
							alt={profile.name}
							class="w-40 h-40 rounded-3xl object-cover object-top border-4 border-white shadow-md"
						/>
						<button
							on:click={() => alert("Avatar yuklash funksiyasi tez orada qo'shiladi")}
							class="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-2xl shadow-lg hover:bg-primary/90 transition-all"
						>
							<Camera class="w-5 h-5" />
						</button>
					</div>

					<h2 class="mt-6 text-2xl font-semibold text-foreground">{profile.name}</h2>
					<p class="text-primary font-medium">{profile.role}</p>

					<div class="flex justify-center gap-8 mt-8">
						<div class="text-center">
							<p class="text-3xl font-bold text-foreground">{profile.totalStudents}</p>
							<p class="text-xs text-muted-foreground">Shogirdlar</p>
						</div>
						<div class="text-center">
							<p class="text-3xl font-bold text-foreground">{profile.coursesCreated}</p>
							<p class="text-xs text-muted-foreground">Kurslar</p>
						</div>
						<div class="text-center">
							<p class="text-3xl font-bold text-foreground">{profile.rating}</p>
							<p class="text-xs text-muted-foreground">Reyting</p>
						</div>
					</div>

					<button
						on:click={toggleEdit}
						class="mt-10 w-full py-3.5 rounded-2xl border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all"
					>
						{isEditing ? 'Bekor qilish' : 'Profilni tahrirlash'}
					</button>
				</div>
			</div>

			<!-- Right Side - Form -->
			<div class="lg:col-span-8">
				<div class="bg-white rounded-3xl shadow-sm border border-white/70 p-10">
					
					{#if isEditing}
						<!-- Edit Mode -->
						<div class="space-y-8">
							<div>
								<label class="block text-sm font-medium text-foreground/70 mb-2">To‘liq ism</label>
								<input bind:value={tempProfile.name} type="text" class="w-full px-6 py-4 rounded-2xl border border-border focus:border-primary outline-none" />
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label class="block text-sm font-medium text-foreground/70 mb-2">Email</label>
									<input bind:value={tempProfile.email} type="email" class="w-full px-6 py-4 rounded-2xl border border-border focus:border-primary outline-none" />
								</div>
								<div>
									<label class="block text-sm font-medium text-foreground/70 mb-2">Telefon</label>
									<input bind:value={tempProfile.phone} type="tel" class="w-full px-6 py-4 rounded-2xl border border-border focus:border-primary outline-none" />
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-foreground/70 mb-2">Bio / Haqida</label>
								<textarea bind:value={tempProfile.bio} rows="5" class="w-full px-6 py-4 rounded-2xl border border-border focus:border-primary outline-none resize-y"></textarea>
							</div>

							<div class="flex gap-4 pt-6">
								<button
									on:click={saveProfile}
									class="flex-1 bg-primary text-white py-4 rounded-2xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
								>
									<Save class="w-5 h-5" />
									Saqlash
								</button>
								<button
									on:click={toggleEdit}
									class="flex-1 border border-border py-4 rounded-2xl font-medium hover:bg-muted transition-all"
								>
									Bekor qilish
								</button>
							</div>
						</div>
					{:else}
						<!-- View Mode -->
						<div class="space-y-10">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div class="flex gap-4">
									<Mail class="w-6 h-6 text-muted-foreground mt-1" />
									<div>
										<p class="text-sm text-muted-foreground">Email</p>
										<p class="font-medium">{profile.email}</p>
									</div>
								</div>
								<div class="flex gap-4">
									<Phone class="w-6 h-6 text-muted-foreground mt-1" />
									<div>
										<p class="text-sm text-muted-foreground">Telefon</p>
										<p class="font-medium">{profile.phone}</p>
									</div>
								</div>
								<div class="flex gap-4">
									<MapPin class="w-6 h-6 text-muted-foreground mt-1" />
									<div>
										<p class="text-sm text-muted-foreground">Manzil</p>
										<p class="font-medium">{profile.location}</p>
									</div>
								</div>
								<div class="flex gap-4">
									<Calendar class="w-6 h-6 text-muted-foreground mt-1" />
									<div>
										<p class="text-sm text-muted-foreground">Ro‘yxatdan o‘tgan sana</p>
										<p class="font-medium">{profile.joinDate}</p>
									</div>
								</div>
							</div>

							<div>
								<p class="text-sm text-muted-foreground mb-3">Bio</p>
								<p class="leading-relaxed text-foreground/90">
									{profile.bio}
								</p>
							</div>

							<div class="pt-8 border-t flex gap-6">
								<div class="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl">
									<Award class="w-5 h-5" />
									<span class="font-medium">Müller metodikasi bo‘yicha sertifikatlangan</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>