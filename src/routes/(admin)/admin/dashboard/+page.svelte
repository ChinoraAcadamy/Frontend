<!-- src/routes/admin/+page.svelte -->
<script>
	import { resolve } from '$app/paths';
	import { 
		Users, 
		BookOpen, 
		TrendingUp, 
		DollarSign, 
		Calendar, 
		Clock, 
		Award, 
		Plus, 
		Search,
		MoreHorizontal,
	} from 'lucide-svelte';

	// Statik ma'lumotlar (keyinchalik backenddan keladi)
	let stats = [
		{ title: "Jami shogirdlar", value: "248", change: "+18", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
		{ title: "Faol kurslar", value: "12", change: "+2", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
		{ title: "Bu oy daromad", value: "18.4M", change: "+12%", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-100" },
		{ title: "O‘rtacha retention", value: "87%", change: "-3%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" }
	];

	let recentStudents = [
		{ id: 1, name: "Malika Rahimova", course: "Yuqori daraja", date: "Bugun", progress: 92 },
		{ id: 2, name: "Aziza Karimova", course: "O‘rta daraja", date: "Kecha", progress: 67 },
		{ id: 3, name: "Sardor Umarov", course: "Boshlang‘ich", date: "2 kun oldin", progress: 41 },
		{ id: 4, name: "Nigora To‘rayeva", course: "Yuqori daraja", date: "3 kun oldin", progress: 95 }
	];

	let upcomingLive = [
		{ title: "Korset va Drapirovka Masterclass", time: "14:00", date: "Bugun", students: 34 },
		{ title: "Nostandart qomatlar bo‘yicha amaliyot", time: "10:00", date: "Ertaga", students: 19 }
	];
</script>

<div class="min-h-screen bg-linear-to-br from-slate-50 to-zinc-100 pt-15">
	<div class="max-w-screen-2xl mx-auto p-6 lg:p-10">

		<!-- Header -->
		<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
			<div>
				<h1 class="text-4xl font-bold font-tarsk text-foreground">Admin Dashboard</h1>
				<p class="text-muted-foreground mt-2 text-lg">CHINORA FASHION ACADEMY boshqaruvi</p>
			</div>

			<div class="flex items-center gap-4 flex-wrap">
				<div class="relative w-80">
					<Search class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
					<input 
						type="text" 
						placeholder="Shogird, kurs yoki to‘lov izlash..."
						class="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-2xl focus:outline-none focus:border-primary transition-all"
					/>
				</div>

				<a href={resolve("/courses/lesson")} class="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-medium shadow-md">
					<Plus class="w-5 h-5" />
					Yangi dars qo‘shish
				</a>
			</div>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
			{#each stats as stat (stat.title)}
				<div class="bg-white rounded-3xl p-7 shadow-sm border border-white/70">
					<div class="flex items-center justify-between">
						<div class="{stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center">
							<svelte:component this={stat.icon} class="w-6 h-6 {stat.color}" />
						</div>
						<span class="text-emerald-500 text-sm font-medium">{stat.change}</span>
					</div>
					<p class="text-4xl font-bold mt-6 text-foreground">{stat.value}</p>
					<p class="text-muted-foreground text-sm mt-1">{stat.title}</p>
				</div>
			{/each}
		</div>

		<div class="grid grid-cols-1 xl:grid-cols-12 gap-8">

			<!-- Recent Students -->
			<div class="xl:col-span-8 bg-white rounded-3xl shadow-sm border border-white/70 p-8">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-2xl font-semibold">So‘nggi ro‘yxatdan o‘tgan shogirdlar</h2>
					<a href={resolve("/admin/students")} class="text-primary hover:underline text-sm font-medium">Barchasini ko‘rish →</a>
				</div>

				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-border">
								<th class="text-left py-4 px-2 font-medium text-muted-foreground">Ism-Familiya</th>
								<th class="text-left py-4 px-2 font-medium text-muted-foreground">Kurs</th>
								<th class="text-left py-4 px-2 font-medium text-muted-foreground">Ro‘yxat sanasi</th>
								<th class="text-left py-4 px-2 font-medium text-muted-foreground">Progress</th>
								<th class="w-10"></th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border">
							{#each recentStudents as student (student.id)}
								<tr class="hover:bg-muted/30 transition-colors">
									<td class="py-5 px-2 font-medium">{student.name}</td>
									<td class="py-5 px-2 text-muted-foreground">{student.course}</td>
									<td class="py-5 px-2 text-muted-foreground">{student.date}</td>
									<td class="py-5 px-2">
										<div class="flex items-center gap-3">
											<div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
												<div class="h-full bg-primary rounded-full" style="width: {student.progress}%"></div>
											</div>
											<span class="text-sm font-medium w-10">{student.progress}%</span>
										</div>
									</td>
									<td class="py-5 px-2">
										<button class="p-2 hover:bg-muted rounded-xl transition-colors">
											<MoreHorizontal class="w-5 h-5 text-muted-foreground" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Sidebar Info -->
			<div class="xl:col-span-4 space-y-8">

				<!-- Upcoming Live -->
				<div class="bg-white rounded-3xl p-8 shadow-sm border border-white/70">
					<h3 class="font-semibold text-xl mb-6 flex items-center gap-2">
						<Calendar class="w-5 h-5" /> Yaqin live darslar
					</h3>
					{#each upcomingLive as live (live.title)}
						<div class="mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-0 border-border">
							<p class="font-medium">{live.title}</p>
							<div class="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
								<div class="flex items-center gap-1">
									<Clock class="w-4 h-4" />
									<span>{live.time}</span>
								</div>
								<span>•</span>
								<span>{live.date}</span>
								<span class="ml-auto text-emerald-600 font-medium">{live.students} ta shogird</span>
							</div>
						</div>
					{/each}
					<button class="w-full mt-4 py-3 border border-dashed border-primary text-primary rounded-2xl hover:bg-primary/5 transition-colors">
						Yangi live dars qo‘shish
					</button>
				</div>

				<!-- Quick Actions -->
				<div class="bg-white rounded-3xl p-8 shadow-sm border border-white/70">
					<h3 class="font-semibold text-xl mb-6">Tez amallar</h3>
					<div class="grid grid-cols-2 gap-4">
						<button class="flex flex-col items-center gap-3 py-6 bg-muted/30 hover:bg-muted rounded-2xl transition-all">
							<Users class="w-8 h-8 text-primary" />
							<span class="font-medium text-sm">Shogird qo‘shish</span>
						</button>
						<button class="flex flex-col items-center gap-3 py-6 bg-muted/30 hover:bg-muted rounded-2xl transition-all">
							<BookOpen class="w-8 h-8 text-primary" />
							<span class="font-medium text-sm">Kurs yaratish</span>
						</button>
						<button class="flex flex-col items-center gap-3 py-6 bg-muted/30 hover:bg-muted rounded-2xl transition-all">
							<DollarSign class="w-8 h-8 text-primary" />
							<span class="font-medium text-sm">To‘lovlar</span>
						</button>
						<button class="flex flex-col items-center gap-3 py-6 bg-muted/30 hover:bg-muted rounded-2xl transition-all">
							<Award class="w-8 h-8 text-primary" />
							<span class="font-medium text-sm">Sertifikatlar</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>