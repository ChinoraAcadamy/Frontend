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
		User,
		ArrowUpRight,
		Heart
	} from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<footer class="footer">
	<!-- Top accent line -->
	<div class="footer-topline" aria-hidden="true"></div>

	<div class="footer-container">
		<!-- ── Brand block ─────────────────────── -->
		<div class="footer-brand">
			<div class="brand-logo">
				<img src="/logo/chinora-secondary.png" alt="Chinora Academy" class="brand-logo-img" />
				<div class="brand-logo-text">
					<span class="brand-top">CHINORA</span>
					<span class="brand-btm">ACADEMY</span>
				</div>
			</div>
			<p class="brand-desc">{m.footer_about_text()}</p>
			<div class="social-row">
				<a
					href="https://www.instagram.com/chinora_fashion_academy?igsh=NmZhdXR3NGJsMmdy"
					target="_blank"
					rel="noopener noreferrer"
					class="social-btn"
					aria-label="Instagram"
				>
					<Instagram size={16} strokeWidth={2} />
				</a>
				<a
					href="https://t.me/+ZlMsl6Ool8k4Zjdi"
					target="_blank"
					rel="noopener noreferrer"
					class="social-btn"
					aria-label="Telegram"
				>
					<Send size={16} strokeWidth={2} />
				</a>
				<a
					href="https://youtube.com/@chinora_academy_ad?si=HEfAEVD4VtNOnxdW"
					target="_blank"
					rel="noopener noreferrer"
					class="social-btn"
					aria-label="YouTube"
				>
					<Youtube size={16} strokeWidth={2} />
				</a>
			</div>
		</div>

		<!-- ── Divider (mobile) ─────────────────── -->
		<div class="col-divider" aria-hidden="true"></div>

		<!-- ── Advantages ──────────────────────── -->
		<div class="footer-col">
			<h4 class="col-title">{m.footer_advantages_title()}</h4>
			<ul class="col-list">
				<li class="col-item">
					<span class="col-icon"><Users size={14} strokeWidth={2} /></span>
					<span>{m.footer_advantage_1()}</span>
				</li>
				<li class="col-item">
					<span class="col-icon"><Clock size={14} strokeWidth={2} /></span>
					<span>{m.footer_advantage_2()}</span>
				</li>
				<li class="col-item">
					<span class="col-icon"><Book size={14} strokeWidth={2} /></span>
					<span>{m.footer_advantage_3()}</span>
				</li>
				<li class="col-item">
					<span class="col-icon"><Sparkles size={14} strokeWidth={2} /></span>
					<span>{m.footer_advantage_4()}</span>
				</li>
			</ul>
		</div>

		<!-- ── Follow ──────────────────────────── -->
		<div class="footer-col">
			<h4 class="col-title">{m.footer_follow_title()}</h4>
			<ul class="col-list">
				<li>
					<a
						href="https://www.instagram.com/chinora_fashion_academy?igsh=NmZhdXR3NGJsMmdy"
						target="_blank"
						rel="noopener noreferrer"
						class="col-link"
					>
						<Instagram size={14} strokeWidth={2} class="link-icon" />
						<span>{m.footer_follow_instagram()}</span>
						<ArrowUpRight size={12} strokeWidth={2} class="link-arrow" />
					</a>
				</li>
				<li>
					<a
						href="https://t.me/+ZlMsl6Ool8k4Zjdi"
						target="_blank"
						rel="noopener noreferrer"
						class="col-link"
					>
						<Send size={14} strokeWidth={2} class="link-icon" />
						<span>{m.footer_follow_telegram()}</span>
						<ArrowUpRight size={12} strokeWidth={2} class="link-arrow" />
					</a>
				</li>
				<li>
					<a
						href="https://youtube.com/@chinora_academy_ad?si=HEfAEVD4VtNOnxdW"
						target="_blank"
						rel="noopener noreferrer"
						class="col-link"
					>
						<Youtube size={14} strokeWidth={2} class="link-icon" />
						<span>{m.footer_follow_youtube()}</span>
						<ArrowUpRight size={12} strokeWidth={2} class="link-arrow" />
					</a>
				</li>
				<li>
					<a
						href="https://t.me/chinora_academy"
						target="_blank"
						rel="noopener noreferrer"
						class="col-link"
					>
						<User size={14} strokeWidth={2} class="link-icon" />
						<span>{m.footer_follow_admin()}</span>
						<ArrowUpRight size={12} strokeWidth={2} class="link-arrow" />
					</a>
				</li>
			</ul>
		</div>

		<!-- ── Contact ─────────────────────────── -->
		<div class="footer-col">
			<h4 class="col-title">{m.footer_contact_title()}</h4>
			<ul class="col-list">
				<li>
					<a href="tel:+998338055505" class="col-link">
						<Phone size={14} strokeWidth={2} class="link-icon" />
						<span>{m.footer_phone()}</span>
					</a>
				</li>
				<li>
					<a
						href="https://t.me/chinora_academy"
						target="_blank"
						rel="noopener noreferrer"
						class="col-link"
					>
						<Send size={14} strokeWidth={2} class="link-icon" />
						<span>@chinora_academy</span>
						<ArrowUpRight size={12} strokeWidth={2} class="link-arrow" />
					</a>
				</li>
			</ul>
		</div>
	</div>

	<!-- ── Subfooter ───────────────────────────── -->
	<div class="subfooter">
		<div class="subfooter-inner">
			<p class="copyright">{m.footer_copyright({ year: new Date().getFullYear() })}</p>
			<div class="dev-credit">
				<Heart size={12} strokeWidth={2.5} class="dev-heart" aria-hidden="true" />
				<span>{m.footer_developed()}</span>

				<div class="dev-list">
					<a
						href="https://t.me/corefold"
						target="_blank"
						rel="noopener noreferrer"
						class="dev-item"
					>
						<span class="dev-name">Laziz</span>
						<span class="dev-role">Frontend</span>
					</a>

					<span class="dev-divider">•</span>

					<a
						href="https://t.me/maxmudov_1117"
						target="_blank"
						rel="noopener noreferrer"
						class="dev-item"
					>
						<span class="dev-name">Bekmurod</span>
						<span class="dev-role">Backend</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	/* ── Tokens ─────────────────────────────────────────── */
	.footer {
		--brand: #9b1c48;
		--brand-mid: rgba(155, 28, 72, 0.1);
		--ink: #140b0e;
		--ink-soft: #5a3a42;
		--muted: #9a8085;
		--cream: #faf6f1;
		--cream-2: #eeddd3;
		--border: rgba(155, 28, 72, 0.1);
		--white: #ffffff;

		position: relative;
		background: linear-gradient(180deg, #eddfd3 0%, #faf6f1 100%);
		padding-top: 4rem;
		font-family: 'Outfit', 'DM Sans', system-ui, sans-serif;
		color: var(--ink-soft);
	}

	/* ── Top accent line ─────────────────────────────────── */
	.footer-topline {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--brand), transparent);
		opacity: 0.5;
	}

	/* ── Container ───────────────────────────────────────── */
	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem 3rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 640px) {
		.footer-container {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 1024px) {
		.footer-container {
			grid-template-columns: 1.6fr 1fr 1fr 1fr;
			gap: 3rem;
		}
	}

	.col-divider {
		display: none;
	}

	/* ── Brand ───────────────────────────────────────────── */
	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.brand-logo {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.brand-logo-img {
		width: 46px;
		height: 46px;
		border-radius: 12px;
		object-fit: cover;
		display: block;
		flex-shrink: 0;
	}

	.brand-logo-text {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.brand-top {
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.14em;
		color: var(--ink);
	}

	.brand-btm {
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.14em;
		color: var(--brand);
	}

	.brand-desc {
		font-size: 13.5px;
		line-height: 1.7;
		color: var(--ink-soft);
		max-width: 320px;
	}

	.social-row {
		display: flex;
		gap: 8px;
	}

	.social-btn {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		border: 1.5px solid var(--border);
		background: rgba(155, 28, 72, 0.05);
		color: var(--brand);
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		transition:
			background 0.18s,
			border-color 0.18s,
			transform 0.12s;
	}

	.social-btn:hover {
		background: var(--brand);
		border-color: var(--brand);
		color: #fff;
		transform: translateY(-2px);
	}

	/* ── Columns ─────────────────────────────────────────── */
	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.col-title {
		font-size: 11px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--brand);
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border);
	}

	.col-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	/* Advantage items */
	.col-item {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--ink-soft);
	}

	.col-icon {
		width: 26px;
		height: 26px;
		border-radius: 7px;
		background: var(--brand-mid);
		color: var(--brand);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 1px;
	}

	/* Link items */
	.col-link {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13.5px;
		color: var(--ink-soft);
		text-decoration: none;
		padding: 6px 8px;
		border-radius: 8px;
		margin: -6px -8px;
		transition:
			color 0.15s,
			background 0.15s;
	}

	.col-link:hover {
		color: var(--brand);
		background: var(--brand-mid);
	}

	:global(.link-icon) {
		color: var(--brand);
		flex-shrink: 0;
	}

	:global(.link-arrow) {
		color: var(--muted);
		margin-left: auto;
		flex-shrink: 0;
		opacity: 0;
		transition:
			opacity 0.15s,
			transform 0.15s;
	}

	.col-link:hover :global(.link-arrow) {
		opacity: 1;
		transform: translate(1px, -1px);
	}

	/* ── Subfooter ───────────────────────────────────────── */
	.subfooter {
		border-top: 1px solid var(--border);
		background: rgba(155, 28, 72, 0.03);
	}

	.subfooter-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		.subfooter-inner {
			flex-direction: row;
			justify-content: space-between;
			text-align: left;
		}
	}

	.copyright {
		font-size: 12px;
		color: var(--muted);
	}

	/* ── Subfooter Dev Credits ───────────────────────────── */
	.dev-credit {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		font-size: 12px;
		color: var(--muted);
	}

	:global(.dev-heart) {
		color: var(--brand);
		flex-shrink: 0;
	}

	.dev-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-left: 2px;
	}

	.dev-item {
		display: flex;
		align-items: center;
		gap: 5px;
		text-decoration: none;
		transition: transform 0.2s ease;
	}

	.dev-item:hover {
		transform: translateY(-1px);
	}

	.dev-name {
		font-weight: 700;
		color: var(--brand);
		transition: opacity 0.2s ease;
	}

	.dev-role {
		font-size: 9.5px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		background: var(--brand-mid);
		color: var(--brand);
		padding: 3px 6px;
		border-radius: 5px;
		transition: all 0.2s ease;
	}

	/* Hover effects */
	.dev-item:hover .dev-name {
		opacity: 0.75;
	}

	.dev-item:hover .dev-role {
		background: var(--brand);
		color: var(--white);
	}

	.dev-divider {
		color: var(--brand-mid);
		font-size: 14px;
		line-height: 1;
	}
</style>
