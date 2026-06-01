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
			<div class="dev-team-badge">
				<span class="dev-team-intro">
					<Heart size={12} strokeWidth={2.5} class="dev-heart-pulse" aria-hidden="true" />
					<span>{m.footer_developed()}</span>
				</span>
				<div class="dev-team-links">
					<a
						href="https://t.me/corefold"
						target="_blank"
						rel="noopener noreferrer"
						class="dev-profile-link"
					>
						<span class="dev-role-tag fe-tag">Frontend</span>
						<span class="dev-profile-name">Laziz</span>
					</a>
					<span class="dev-link-separator" aria-hidden="true"></span>
					<a
						href="https://t.me/maxmudov_1117"
						target="_blank"
						rel="noopener noreferrer"
						class="dev-profile-link"
					>
						<span class="dev-role-tag be-tag">Backend</span>
						<span class="dev-profile-name">Bekmurod</span>
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

	/* ── Modern Developer Credits ───────────────────────────── */
	.dev-team-badge {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		background: rgba(155, 28, 72, 0.03);
		border: 1px solid rgba(155, 28, 72, 0.08);
		padding: 4px 12px 4px 8px;
		border-radius: 100px;
		font-size: 12px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.dev-team-badge:hover {
		background: rgba(155, 28, 72, 0.06);
		border-color: rgba(155, 28, 72, 0.15);
		box-shadow: 0 4px 20px -5px rgba(155, 28, 72, 0.1);
	}

	.dev-team-intro {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--ink-soft);
		font-weight: 500;
		opacity: 0.85;
	}

	:global(.dev-heart-pulse) {
		color: var(--brand);
		flex-shrink: 0;
		animation: devHeartbeat 2.5s infinite ease-in-out;
	}

	@keyframes devHeartbeat {
		0%, 100% { transform: scale(1); }
		25% { transform: scale(1.15); }
		40% { transform: scale(1); }
		55% { transform: scale(1.15); }
		70% { transform: scale(1); }
	}

	.dev-team-links {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.dev-profile-link {
		display: flex;
		align-items: center;
		gap: 6px;
		text-decoration: none;
		color: var(--ink);
		font-weight: 600;
		padding: 2px 6px;
		border-radius: 6px;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.dev-role-tag {
		font-size: 9px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 5px;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.fe-tag {
		background: rgba(155, 28, 72, 0.06);
		color: var(--brand);
		border: 1px solid rgba(155, 28, 72, 0.15);
	}

	.be-tag {
		background: rgba(90, 58, 66, 0.06);
		color: var(--ink-soft);
		border: 1px solid rgba(90, 58, 66, 0.15);
	}

	.dev-profile-name {
		position: relative;
		font-size: 11.5px;
		color: var(--ink);
	}

	.dev-profile-name::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		width: 100%;
		height: 1.5px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.25s ease-out;
		opacity: 0.8;
	}

	.dev-profile-link:hover {
		transform: translateY(-0.5px);
	}

	.dev-profile-link:hover .dev-profile-name::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.dev-profile-link:hover .fe-tag {
		background: var(--brand);
		color: var(--white);
		border-color: var(--brand);
	}

	.dev-profile-link:hover .be-tag {
		background: var(--ink-soft);
		color: var(--white);
		border-color: var(--ink-soft);
	}

	.dev-link-separator {
		width: 1px;
		height: 12px;
		background: rgba(155, 28, 72, 0.15);
		display: inline-block;
	}

	/* Responsive layout for very small screens */
	@media (max-width: 480px) {
		.dev-team-badge {
			flex-direction: column;
			align-items: center;
			gap: 8px;
			padding: 8px 16px;
			border-radius: 16px;
			width: 100%;
			max-width: 320px;
		}

		.dev-link-separator {
			display: none;
		}

		.dev-team-links {
			width: 100%;
			justify-content: center;
			gap: 12px;
		}
	}
</style>
