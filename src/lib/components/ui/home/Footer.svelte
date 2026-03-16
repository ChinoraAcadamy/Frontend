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

<footer class="bg-linear-to-b from-[#E4DACD] to-[#F1EAE3] text-foreground pt-16 pb-6">
	<div class="container mx-auto px-6">
		<!-- Title Section -->
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold font-tarsk text-primary">
				{m.footer_title()}
			</h2>
			<p class="text-muted-foreground mt-2">
				{m.footer_subtitle()}
			</p>
		</div>

		<!-- Main Content - 4 Columns -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12 text-sm">
			
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
						<Users class="w-5 h-5 text-primary shrink-0" />
						<span class="text-base text-foreground">{m.footer_advantage_1()}</span>
					</li>
					<li class="flex items-center gap-3">
						<Clock class="w-5 h-5 text-primary shrink-0" />
						<span class="text-base text-foreground">{m.footer_advantage_2()}</span>
					</li>
					<li class="flex items-center gap-3">
						<Book class="w-5 h-5 text-primary shrink-0" />
						<span class="text-base text-foreground">{m.footer_advantage_3()}</span>
					</li>
					<li class="flex items-center gap-3">
						<Sparkles class="w-5 h-5 text-primary shrink-0" />
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
							class="flex items-center gap-2 hover:text-primary transition-colors"
						>
							<Instagram class="w-4 h-4 text-primary" />
							{m.footer_follow_instagram()}
						</a>
					</li>
					<li>
						<a
							href="https://t.me/+ZlMsl6Ool8k4Zjdi"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 hover:text-primary transition-colors"
						>
							<Send class="w-4 h-4 text-primary" />
							{m.footer_follow_telegram()}
						</a>
					</li>
					<li>
						<a
							href="https://youtube.com/@chinora_academy_ad?si=HEfAEVD4VtNOnxdW"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 hover:text-primary transition-colors"
						>
							<Youtube class="w-4 h-4 text-primary" />
							{m.footer_follow_youtube()}
						</a>
					</li>
					<li>
						<a
							href="https://t.me/chinora_academy"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 hover:text-primary transition-colors"
						>
							<User class="w-4 h-4 text-primary" />
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
							class="flex items-center gap-2 hover:text-primary transition-colors"
						>
							<Phone class="w-4 h-4 text-primary" />
							{m.footer_phone()}
						</a>
					</li>
					<li>
						<a
							href="https://t.me/chinora_academy"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 hover:text-primary transition-colors"
						>
							<Send class="w-4 h-4 text-primary" />
							@chinora_academy
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Subfooter -->
		<div class="border-t border-muted pt-6 text-center text-sm text-muted-foreground">
			{m.footer_copyright({ year: new Date().getFullYear() })}

			<div class="mt-3 text-xs">
				<span class="opacity-70">{m.footer_developed()} </span>
				<a
					href="https://t.me/corefold"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline font-medium"
				>
					{m.footer_developer_name()}
				</a>
			</div>
		</div>
	</div>
</footer>