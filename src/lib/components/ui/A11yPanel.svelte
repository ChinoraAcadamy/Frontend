<script>
	import { browser } from '$app/environment';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Accessibility, RotateCcw, Sun, Palette, Contrast, Sliders, Type, Minus, Plus, AlignLeft, AlignCenter, AlignJustify, MousePointer2, Maximize2, BookOpen, Link, ImageOff, X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { a11y } from '$lib/stores/a11y.svelte.js';

	let isA11yOpen = $state(false);
	let hasMouse = $state(true);

	$effect(() => {
		if (!browser) return;
		hasMouse = window.matchMedia('(pointer: fine)').matches;
	});

	// Save whenever values change
	$effect(() => {
		if (browser && a11y.initialized) {
			a11y.save();
		}
	});

	const v = a11y.val;

	const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

	const activeCount = $derived(
		[
			v.zoomLevel !== 1, v.isGrayscale, v.isHighContrast, v.isReducedMotion,
			v.lineHeight !== 1.5, v.letterSpacing !== 0, v.wordSpacing !== 0,
			v.fontWeight !== 400, v.isDyslexiaFont, v.textAlign !== 'left',
			v.cursorSize !== 'default', v.colorBlindMode !== 'none',
			v.isLinkHighlight, v.isHideImages, v.isFocusHighlight,
			v.saturation !== 100, v.brightness !== 100
		].filter(Boolean).length
	);

	function toggle() {
		isA11yOpen = !isA11yOpen;
		if (isA11yOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}
</script>

<div class="a11y-wrap">
	<button
		class="nav-icon-btn {isA11yOpen ? 'nav-icon-btn--active' : ''}"
		onclick={toggle}
		aria-label={m.admin_a11y_label?.() ?? 'Maxsus imkoniyatlar'}
		aria-expanded={isA11yOpen}
	>
		<Accessibility size={18} strokeWidth={2.2} />
		{#if activeCount > 0}
			<span class="a11y-badge">{activeCount}</span>
		{/if}
	</button>

	{#if isA11yOpen}
		<div class="panel-backdrop" onclick={toggle} aria-hidden="true" transition:fade={{ duration: 200 }}></div>

		<div 
			class="a11y-panel" 
			transition:fly={{ y: 20, duration: 300, easing: cubicOut }} 
			role="dialog" 
			aria-label={m.admin_a11y_title?.() ?? 'Maxsus imkoniyatlar'}
		>
			<div class="panel-head">
				<div class="panel-head-left">
					<div class="panel-head-icon">
						<Accessibility size={16} strokeWidth={2.5} />
					</div>
					<div>
						<p class="panel-title">{m.admin_a11y_title?.() ?? 'Maxsus imkoniyatlar'}</p>
						<p class="panel-sub">
							{activeCount > 0 ? m.a11y_active_count?.({ count: activeCount }) ?? `${activeCount} ta yoqilgan` : m.a11y_default_settings?.() ?? 'Standart sozlamalar'}
						</p>
					</div>
				</div>
				<div class="panel-head-right">
					<button class="reset-btn" onclick={() => a11y.reset()} title={m.admin_reset?.() ?? 'Tiklash'}>
						<RotateCcw size={13} strokeWidth={2.5} />
						<span>{m.admin_reset?.() ?? 'Reset'}</span>
					</button>
					<button class="close-btn-mobile" onclick={toggle} aria-label="Yopish">
						<X size={20} />
					</button>
				</div>
			</div>

			<div class="panel-body">
				<!-- SECTION: Vision -->
				<div class="p-section">
					<p class="p-section-label"><Sun size={12} strokeWidth={2.5} /> {m.a11y_vision?.() ?? "Ko'rish"}</p>
					
					<div class="p-row">
						<span class="p-row-label">{m.a11y_brightness?.() ?? 'Yorqinlik'}</span>
						<div class="slider-wrap">
							<span class="slider-val">{v.brightness}%</span>
							<input type="range" min="60" max="140" step="5" bind:value={v.brightness} class="p-slider" />
						</div>
					</div>

					<div class="p-row">
						<span class="p-row-label">{m.a11y_saturation?.() ?? "To'yinganlik"}</span>
						<div class="slider-wrap">
							<span class="slider-val">{v.saturation}%</span>
							<input type="range" min="0" max="200" step="10" bind:value={v.saturation} class="p-slider" />
						</div>
					</div>

					<div class="toggle-grid">
						<button class="tgl-btn {v.isGrayscale ? 'tgl-btn--on' : ''}" onclick={() => v.isGrayscale = !v.isGrayscale}>
							<Palette size={15} strokeWidth={2} />
							<span>{m.admin_a11y_grayscale?.() ?? 'Oq-qora'}</span>
						</button>
						<button class="tgl-btn {v.isHighContrast ? 'tgl-btn--on' : ''}" onclick={() => v.isHighContrast = !v.isHighContrast}>
							<Contrast size={15} strokeWidth={2} />
							<span>{m.admin_a11y_high_contrast?.() ?? 'Yuqori kontrast'}</span>
						</button>
					</div>
				</div>

				<!-- SECTION: Color Blind -->
				<div class="p-section">
					<p class="p-section-label"><Sliders size={12} strokeWidth={2.5} /> {m.a11y_color_vision?.() ?? "Rang ko'rish"}</p>
					<div class="cb-grid">
						{#each [
							{ id: 'none', label: m.a11y_normal?.() ?? 'Normal' }, 
							{ id: 'protanopia', label: m.a11y_protanopia?.() ?? 'Protan' }, 
							{ id: 'deuteranopia', label: m.a11y_deuteranopia?.() ?? 'Deuteran' }, 
							{ id: 'tritanopia', label: m.a11y_tritanopia?.() ?? 'Tritan' }, 
							{ id: 'achromatopsia', label: m.a11y_achromatopsia?.() ?? 'Akromat' }
						] as cb (cb.id)}
							<button class="cb-btn {v.colorBlindMode === cb.id ? 'cb-btn--on' : ''}" onclick={() => v.colorBlindMode = cb.id}>{cb.label}</button>
						{/each}
					</div>
				</div>

				<!-- SECTION: Typography -->
				<div class="p-section">
					<p class="p-section-label"><Type size={12} strokeWidth={2.5} /> {m.a11y_text?.() ?? 'Matn'}</p>

					<div class="p-row p-row--stepper">
						<span class="p-row-label">{m.admin_a11y_text_size?.() ?? "O'lcham"}</span>
						<div class="stepper">
							<button class="step-btn" onclick={() => v.zoomLevel = clamp(v.zoomLevel - 0.1, 0.8, 1.6)}><Minus size={14} /></button>
							<span class="step-val">{Math.round(v.zoomLevel * 100)}%</span>
							<button class="step-btn" onclick={() => v.zoomLevel = clamp(v.zoomLevel + 0.1, 0.8, 1.6)}><Plus size={14} /></button>
						</div>
					</div>

					<div class="p-row p-row--stepper">
						<span class="p-row-label">{m.admin_a11y_line_height?.() ?? 'Balandlik'}</span>
						<div class="stepper">
							<button class="step-btn" onclick={() => v.lineHeight = +clamp(v.lineHeight - 0.1, 1.2, 2.2).toFixed(1)}><Minus size={14} /></button>
							<span class="step-val">{v.lineHeight.toFixed(1)}</span>
							<button class="step-btn" onclick={() => v.lineHeight = +clamp(v.lineHeight + 0.1, 1.2, 2.2).toFixed(1)}><Plus size={14} /></button>
						</div>
					</div>

					<div class="p-row p-row--stepper">
						<span class="p-row-label">{m.a11y_letter_spacing?.() ?? 'Harf orasi'}</span>
						<div class="stepper">
							<button class="step-btn" onclick={() => v.letterSpacing = +clamp(v.letterSpacing - 0.02, 0, 0.2).toFixed(2)}><Minus size={14} /></button>
							<span class="step-val">{v.letterSpacing.toFixed(2)}</span>
							<button class="step-btn" onclick={() => v.letterSpacing = +clamp(v.letterSpacing + 0.02, 0, 0.2).toFixed(2)}><Plus size={14} /></button>
						</div>
					</div>

					<div class="p-row">
						<span class="p-row-label">{m.a11y_alignment?.() ?? 'Hizalash'}</span>
						<div class="align-btns">
							{#each [{ v: 'left', Icon: AlignLeft }, { v: 'center', Icon: AlignCenter }, { v: 'justify', Icon: AlignJustify }] as a (a.v)}
								<button class="align-btn {v.textAlign === a.v ? 'align-btn--on' : ''}" onclick={() => v.textAlign = a.v}>
									<a.Icon size={15} strokeWidth={2.2} />
								</button>
							{/each}
						</div>
					</div>

					<button class="full-toggle {v.isDyslexiaFont ? 'full-toggle--on' : ''}" onclick={() => v.isDyslexiaFont = !v.isDyslexiaFont}>
						<div class="full-toggle-left">
							<Type size={15} strokeWidth={2.2} />
							<span>{m.admin_a11y_dyslexia_font?.() ?? 'Dyslexia shrift'}</span>
						</div>
						<div class="sw {v.isDyslexiaFont ? 'sw--on' : ''}"><div class="sw-thumb"></div></div>
					</button>
				</div>

				<!-- SECTION: Navigation (Only if mouse detected) -->
				{#if hasMouse}
					<div class="p-section">
						<p class="p-section-label"><MousePointer2 size={12} strokeWidth={2.5} /> {m.a11y_navigation?.() ?? 'Navigatsiya'}</p>

						<div class="p-row">
							<span class="p-row-label">{m.a11y_cursor_size?.() ?? 'Kursor'}</span>
							<div class="seg-btns">
								{#each [
									{ v: 'default', label: 'Standart' }, 
									{ v: 'large', label: 'Katta' }, 
									{ v: 'xl', label: 'XL' }
								] as c (c.v)}
									<button class="seg-btn {v.cursorSize === c.v ? 'seg-btn--on' : ''}" onclick={() => v.cursorSize = c.v}>{c.label}</button>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- SECTION: Other Features -->
				<div class="p-section p-section--last">
					<p class="p-section-label"><BookOpen size={12} strokeWidth={2.5} /> {m.a11y_reading?.() ?? "Qulayliklar"}</p>

					<button class="full-toggle {v.isLinkHighlight ? 'full-toggle--on' : ''}" onclick={() => v.isLinkHighlight = !v.isLinkHighlight}>
						<div class="full-toggle-left">
							<Link size={15} strokeWidth={2.2} />
							<span>{m.a11y_link_highlight?.() ?? "Havolalarni ajratish"}</span>
						</div>
						<div class="sw {v.isLinkHighlight ? 'sw--on' : ''}"><div class="sw-thumb"></div></div>
					</button>

					<button class="full-toggle {v.isFocusHighlight ? 'full-toggle--on' : ''}" onclick={() => v.isFocusHighlight = !v.isFocusHighlight}>
						<div class="full-toggle-left">
							<Maximize2 size={15} strokeWidth={2.2} />
							<span>{m.a11y_focus_highlight?.() ?? "Fokusni kuchaytirish"}</span>
						</div>
						<div class="sw {v.isFocusHighlight ? 'sw--on' : ''}"><div class="sw-thumb"></div></div>
					</button>

					<button class="full-toggle {v.isHideImages ? 'full-toggle--on' : ''}" onclick={() => v.isHideImages = !v.isHideImages}>
						<div class="full-toggle-left">
							<ImageOff size={15} strokeWidth={2.2} />
							<span>{m.a11y_hide_images?.() ?? 'Rasmlarni yashirish'}</span>
						</div>
						<div class="sw {v.isHideImages ? 'sw--on' : ''}"><div class="sw-thumb"></div></div>
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
.a11y-wrap {
	position: relative;
}

.nav-icon-btn {
	position: relative;
	width: 36px;
	height: 36px;
	border-radius: 10px;
	border: 1px solid var(--border-main);
	background: var(--bg-input);
	color: var(--text-muted);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
}

.nav-icon-btn:hover, .nav-icon-btn--active {
	border-color: var(--primary);
	background: var(--brand-light);
	color: var(--primary);
}

.a11y-badge {
	position: absolute;
	top: -4px;
	right: -4px;
	min-width: 16px;
	height: 16px;
	padding: 0 3px;
	border-radius: 999px;
	background: var(--primary);
	color: #fff;
	font-size: 9px;
	font-weight: 800;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1.5px solid var(--bg-sidebar);
}

.panel-backdrop {
	position: fixed;
	inset: 0;
	z-index: 1000;
	background: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(2px);
}

.a11y-panel {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1001;
	background: var(--bg-sidebar);
	border-top: 1px solid var(--border-main);
	border-radius: 24px 24px 0 0;
	box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
	max-height: 85vh;
	display: flex;
	flex-direction: column;
}

@media (min-width: 768px) {
	.a11y-panel {
		position: absolute;
		bottom: auto;
		top: calc(100% + 12px);
		right: 0;
		left: auto;
		width: 340px;
		border: 1px solid var(--border-main);
		border-radius: 20px;
		max-height: 580px;
	}
	.panel-backdrop {
		z-index: 950;
		background: transparent;
		backdrop-filter: none;
	}
}

.panel-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.5rem 1rem;
	border-bottom: 1px solid var(--border-light);
	background: var(--brand-light);
	flex-shrink: 0;
}

.panel-head-left {
	display: flex;
	align-items: center;
	gap: 12px;
}

.panel-head-icon {
	width: 32px;
	height: 32px;
	border-radius: 10px;
	background: var(--brand-mid);
	color: var(--primary);
	display: flex;
	align-items: center;
	justify-content: center;
}

.panel-title {
	font-size: 14px;
	font-weight: 700;
	color: var(--text-main);
}

.panel-sub {
	font-size: 11px;
	color: var(--text-muted);
}

.panel-head-right {
	display: flex;
	align-items: center;
	gap: 8px;
}

.reset-btn {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 11px;
	font-weight: 700;
	color: #dc2626;
	background: rgba(220, 38, 38, 0.08);
	border: none;
	border-radius: 8px;
	padding: 6px 12px;
	cursor: pointer;
}

.close-btn-mobile {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: var(--border-light);
	border: none;
	color: var(--text-muted);
	cursor: pointer;
}

@media (min-width: 768px) {
	.close-btn-mobile {
		display: none;
	}
}

.panel-body {
	flex: 1;
	overflow-y: auto;
	padding: 0 1.5rem 1.5rem;
}

.p-section {
	padding: 1.25rem 0;
	border-bottom: 1px solid var(--border-light);
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.p-section--last { border-bottom: none; }

.p-section-label {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 10px;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	color: var(--primary);
	opacity: 0.8;
}

.p-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.p-row-label {
	font-size: 13.5px;
	font-weight: 600;
	color: var(--text-main);
}

.slider-wrap {
	display: flex;
	align-items: center;
	gap: 10px;
	flex: 1;
}

.slider-val {
	font-size: 12px;
	font-weight: 700;
	color: var(--primary);
	min-width: 40px;
	text-align: right;
}

.p-slider {
	flex: 1;
	height: 6px;
	border-radius: 999px;
	background: var(--border-main);
	outline: none;
	-webkit-appearance: none;
	appearance: none;
}

.p-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: var(--primary);
	border: 3px solid var(--bg-sidebar);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	cursor: pointer;
}

.stepper {
	display: flex;
	background: var(--bg-input);
	border: 1px solid var(--border-main);
	border-radius: 12px;
	overflow: hidden;
}

.step-btn {
	width: 36px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	color: var(--text-muted);
	cursor: pointer;
}

.step-btn:hover { background: var(--border-light); color: var(--primary); }

.step-val {
	font-size: 12px;
	font-weight: 700;
	color: var(--text-main);
	min-width: 50px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
}

.toggle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.tgl-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	padding: 12px;
	border-radius: 16px;
	border: 1.5px solid var(--border-light);
	background: transparent;
	font-size: 11.5px;
	font-weight: 600;
	color: var(--text-muted);
	cursor: pointer;
	transition: all 0.2s;
}

.tgl-btn--on {
	border-color: var(--primary);
	background: var(--brand-mid);
	color: var(--primary);
}

.cb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }

.cb-btn {
	padding: 8px 4px;
	border-radius: 10px;
	border: 1.5px solid var(--border-light);
	background: transparent;
	font-size: 10.5px;
	font-weight: 600;
	color: var(--text-muted);
	cursor: pointer;
	transition: all 0.15s;
}

.cb-btn--on {
	border-color: var(--primary);
	background: var(--brand-light);
	color: var(--primary);
}

.align-btns { display: flex; border-radius: 12px; border: 1.5px solid var(--border-light); overflow: hidden; }

.align-btn {
	flex: 1;
	height: 34px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	color: var(--text-muted);
	cursor: pointer;
}

.align-btn--on { background: var(--brand-mid); color: var(--primary); }

.seg-btns { display: flex; border-radius: 12px; border: 1.5px solid var(--border-light); overflow: hidden; }

.seg-btn {
	flex: 1;
	padding: 8px;
	border: none;
	background: transparent;
	font-size: 11px;
	font-weight: 600;
	color: var(--text-muted);
	cursor: pointer;
}

.seg-btn--on { background: var(--brand-mid); color: var(--primary); }

.full-toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 12px 14px;
	border-radius: 16px;
	border: 1.5px solid var(--border-light);
	background: transparent;
	cursor: pointer;
}

.full-toggle--on { border-color: var(--primary); background: var(--brand-light); }

.full-toggle-left { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 600; color: var(--text-main); }

.sw { width: 36px; height: 20px; border-radius: 999px; background: var(--border-main); position: relative; transition: background 0.2s; }

.sw--on { background: var(--primary); }

.sw-thumb {
	position: absolute;
	top: 3px;
	left: 3px;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	background: #fff;
	transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sw--on .sw-thumb { transform: translateX(16px); }
</style>
