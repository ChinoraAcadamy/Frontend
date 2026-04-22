<!-- src/lib/components/Footer.svelte -->
<script>
	import {
		Phone,
		Send,
		Users,
		Clock,
		Book,
		Sparkles,
		Instagram,
		Youtube,
		User
	} from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<footer class="bg-linear-to-b from-[#EADBCF] to-background pt-20 pb-8 text-foreground">
	<div class="container mx-auto px-6">
		<!-- Title Section -->
		<div class="mb-12 text-center">
			<h2 class="font-tarsk text-3xl font-bold text-primary md:text-4xl">
				{m.footer_title()}
			</h2>
			<p class="text-muted-foreground mt-2">
				{m.footer_subtitle()}
			</p>
		</div>

		<!-- Main Content - 4 Columns -->
		<div class="mb-12 grid grid-cols-1 gap-10 text-sm sm:grid-cols-2 md:grid-cols-4">
			<!-- Column 1: Biz haqimizda -->
			<div class="space-y-3">
				<h4 class="text-lg font-semibold text-primary">{m.footer_about_title()}</h4>
				<p class="leading-relaxed">
					{m.footer_about_text()}
				</p>
			</div>

			<!-- Column 2: Kurs afzalliklari -->
			<div class="space-y-3">
				<h4 class="text-lg font-semibold text-primary">{m.footer_advantages_title()}</h4>
				<ul class="space-y-3">
					<li class="flex items-center gap-3">
						<Users class="h-5 w-5 shrink-0 text-primary" />
						<span class="text-base text-foreground">{m.footer_advantage_1()}</span>
					</li>
					<li class="flex items-center gap-3">
						<Clock class="h-5 w-5 shrink-0 text-primary" />
						<span class="text-base text-foreground">{m.footer_advantage_2()}</span>
					</li>
					<li class="flex items-center gap-3">
						<Book class="h-5 w-5 shrink-0 text-primary" />
						<span class="text-base text-foreground">{m.footer_advantage_3()}</span>
					</li>
					<li class="flex items-center gap-3">
						<Sparkles class="h-5 w-5 shrink-0 text-primary" />
						<span class="text-base text-foreground">{m.footer_advantage_4()}</span>
					</li>
				</ul>
			</div>

			<!-- Column 3: Bizni kuzatib boring -->
			<div class="space-y-3">
				<h4 class="text-lg font-semibold text-primary">{m.footer_follow_title()}</h4>
				<ul class="space-y-3">
					<li>
						<a
							href="https://www.instagram.com/chinora_fashion_academy?igsh=NmZhdXR3NGJsMmdy"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-primary"
						>
							<Instagram class="h-4 w-4 text-primary" />
							{m.footer_follow_instagram()}
						</a>
					</li>
					<li>
						<a
							href="https://t.me/+ZlMsl6Ool8k4Zjdi"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-primary"
						>
							<Send class="h-4 w-4 text-primary" />
							{m.footer_follow_telegram()}
						</a>
					</li>
					<li>
						<a
							href="https://youtube.com/@chinora_academy_ad?si=HEfAEVD4VtNOnxdW"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-primary"
						>
							<Youtube class="h-4 w-4 text-primary" />
							{m.footer_follow_youtube()}
						</a>
					</li>
					<li>
						<a
							href="https://t.me/chinora_academy"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-primary"
						>
							<User class="h-4 w-4 text-primary" />
							{m.footer_follow_admin()}
						</a>
					</li>
				</ul>
			</div>

			<!-- Column 4: Aloqa -->
			<div class="space-y-3">
				<h4 class="text-lg font-semibold text-primary">{m.footer_contact_title()}</h4>
				<ul class="space-y-3">
					<li>
						<a
							href="tel:+998338055505"
							class="flex items-center gap-2 transition-colors hover:text-primary"
						>
							<Phone class="h-4 w-4 text-primary" />
							{m.footer_phone()}
						</a>
					</li>
					<li>
						<a
							href="https://t.me/chinora_academy"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-primary"
						>
							<Send class="h-4 w-4 text-primary" />
							@chinora_academy
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Subfooter -->
		<div class="text-muted-foreground border-t border-muted pt-6 text-center text-sm">
			{m.footer_copyright({ year: new Date().getFullYear() })}

			<div class="mt-3 text-xs">
				<span class="opacity-70">{m.footer_developed()} </span>
				<a
					href="https://t.me/corefold"
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium text-primary hover:underline"
				>
					{m.footer_developer_name()}
				</a>
			</div>
		</div>
	</div>
</footer>
