<script lang="ts">
	/* eslint-disable no-unused-vars */
	/** @type {import('./$types').PageData} */
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import {
		Save,
		Plus,
		Trash2,
		GripVertical,
		Calendar,
		Clock,
		Users,
		Megaphone,
		BookOpen,
		ImageIcon,
		ChevronDown,
		ChevronUp,
		Loader2,
		ExternalLink,
		Settings,
		ToggleLeft,
		ToggleRight,
		UploadCloud
	} from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { data, form: serverForm } = $props();

	// ── Local editable state ───────────────────────────
	let saving = $state(false);
	let activeSection = $state('event'); // 'event' | 'instructor' | 'benefits' | 'content' | 'registrations'
	// let previewMode = $state(false);
	let deletingBenefitIdx = $state(null);

	// Form state synced from server data
	// svelte-ignore state_referenced_locally
	let lp = $state({
		id: data?.lp?.id ?? null,
		slug: data?.lp?.slug ?? '',
		is_active: data?.lp?.is_active ?? true,
		title_line1: data?.lp?.title_line1 ?? '3 kunda',
		title_accent: data?.lp?.title_line1_italic ?? 'professional',
		title_line2: data?.lp?.title_line2 ?? 'tikuvchilik',
		title_sub: data?.lp?.title_subtitle ?? 'sirlarini oching',
		lead_text: data?.lp?.lead_text ?? '',
		banner_text: data?.lp?.banner_top ?? 'BEPUL MASTERKLASS — Tikuvchilikda professional yondashuv',
		seats_total: data?.lp?.total_seats ?? 50,
		seats_left: data?.lp?.remaining_seats ?? 50,

		// Event schedule
		event_days: data?.lp?.dates ?? '28–29–30 Noyabr',
		event_time: data?.lp?.time ?? '20:30',
		event_timezone: data?.lp?.timezone ?? 'Toshkent',
		original_price: data?.lp?.original_price ?? 999000,
		is_free: data?.lp?.is_free ?? true,

		// Countdown target
		countdown_days: data?.lp?.countdown_days ?? '28, 29, 30',
		countdown_month: data?.lp?.countdown_month ?? new Date().getMonth() + 1,
		countdown_year: data?.lp?.countdown_year ?? new Date().getFullYear(),
		countdown_hour: data?.lp?.countdown_hour ?? 20,
		countdown_minute: data?.lp?.countdown_minute ?? 30,

		// Instructor
		instructor_name: data?.lp?.instructor_name ?? 'Ibodullayeva Chinora',
		instructor_role: data?.lp?.instructor_title ?? "Asoschi va Bosh o'qituvchi",
		instructor_bio:
			data?.lp?.instructor_bio ??
			"15 yillik tajribaga ega bo'lgan mutaxassis, 1000 dan ortiq muvaffaqiyatli shogirdlar ustozi.",
		instructor_photo: data?.lp?.instructor_photo ?? '/images/hero_compressed.jpg',
		stat_students: data?.lp?.stat_students ?? '5000+',
		stat_experience: data?.lp?.stat_experience ?? '10 yil',
		stat_practical: data?.lp?.stat_practical ?? '100%',

		// Why section
		why_title: data?.lp?.why_title ?? 'Nazariya emas — tayyor tizim',
		why_desc: data?.lp?.why_description ?? '',

		// CTA
		telegram_link: data?.lp?.telegram_invite_link ?? 'https://t.me/+ZlMsl6Ool8k4Zjdi',
		eyebrow_text: data?.lp?.eyebrow_badge ?? 'Eksklyuziv masterklass',
		benefits_title: data?.lp?.benefits_section_title ?? "Masterklassda nimalarni o'rganasiz?"
	});

	// svelte-ignore state_referenced_locally
	let benefits = $state(
		data?.lp?.benefits?.map((b) => b.text) ?? [
			'Myuller metodikasi — asos andazani 0 dan professional qurish',
			'Avtorlik "Anor" assimetriya fasonini boshidan oxirigacha modellashtirish',
			"Daromadingizni 5x gacha oshirish: narx qo'yish va mijozlar jalb qilish",
			"Raqobatchilardan 10 qadam oldinga o'tadigan konstruksiya sirlari",
			"Brend uslubida libos tikish va o'z imzovingizni yaratish"
		]
	);

	let newBenefit = $state('');
	let dragIdx = $state(null);
	let dragOverIdx = $state(null);

	let photoFile = $state(null);
	let photoPreview = $state(null);

	function handlePhotoChange(e) {
		const file = e.target.files?.[0];
		if (file) {
			photoFile = file;
			photoPreview = URL.createObjectURL(file);
		}
	}

	// ── Effects ────────────────────────────────────────
	$effect(() => {
		if (serverForm?.success) {
			toast.success(serverForm.message ?? m.admin_mc_saved_success());
		} else if (serverForm?.error) {
			toast.error(serverForm.error);
		}
	});

	// ── Benefit helpers ───────────────────────────────
	function addBenefit() {
		if (!newBenefit.trim()) return;
		benefits = [...benefits, newBenefit.trim()];
		newBenefit = '';
	}

	function removeBenefit(i) {
		deletingBenefitIdx = i;
		setTimeout(() => {
			benefits = benefits.filter((_, idx) => idx !== i);
			deletingBenefitIdx = null;
		}, 200);
	}

	function moveBenefit(from, dir) {
		const to = from + dir;
		if (to < 0 || to >= benefits.length) return;
		const arr = [...benefits];
		[arr[from], arr[to]] = [arr[to], arr[from]];
		benefits = arr;
	}

	// Drag & drop
	function onDragStart(i) {
		dragIdx = i;
	}
	function onDragOver(e, i) {
		e.preventDefault();
		dragOverIdx = i;
	}
	function onDrop(i) {
		if (dragIdx === null || dragIdx === i) {
			dragIdx = null;
			dragOverIdx = null;
			return;
		}
		const arr = [...benefits];
		const [item] = arr.splice(dragIdx, 1);
		arr.splice(i, 0, item);
		benefits = arr;
		dragIdx = null;
		dragOverIdx = null;
	}
	function onDragEnd() {
		dragIdx = null;
		dragOverIdx = null;
	}

	function handleSubmit() {
		saving = true;
		return async ({ update, result }) => {
			saving = false;
			if (result.type === 'success') {
				await update();
			}
		};
	}

	function selectMasterclass(mc) {
		lp = {
			id: mc.id,
			slug: mc.slug,
			is_active: mc.is_active,
			title_line1: mc.title_line1,
			title_accent: mc.title_line1_italic,
			title_line2: mc.title_line2,
			title_sub: mc.title_subtitle,
			lead_text: mc.lead_text,
			banner_text: mc.banner_top,
			seats_total: mc.total_seats,
			seats_left: mc.remaining_seats,
			event_days: mc.dates,
			event_time: mc.time,
			event_timezone: mc.timezone,
			original_price: mc.original_price,
			is_free: mc.is_free,
			countdown_hour: mc.countdown_hour,
			countdown_minute: mc.countdown_minute,
			countdown_month: mc.countdown_month ?? new Date().getMonth() + 1,
			countdown_year: mc.countdown_year ?? new Date().getFullYear(),
			countdown_days: mc.countdown_days,
			instructor_name: mc.instructor_name,
			instructor_role: mc.instructor_title,
			instructor_bio: mc.instructor_bio,
			instructor_photo: mc.instructor_photo,
			why_title: mc.why_title,
			why_desc: mc.why_description,
			telegram_link: mc.telegram_invite_link,
			eyebrow_text: mc.eyebrow_badge,
			benefits_title: mc.benefits_section_title,
			stat_students: mc.stat_students ?? '5000+',
			stat_experience: mc.stat_experience ?? '10 yil',
			stat_practical: mc.stat_practical ?? '100%'
		};
		benefits = mc.benefits?.map((b) => b.text) ?? [];
		photoFile = null;
		photoPreview = null;
	}

	function createNew() {
		lp = {
			id: null,
			slug: '',
			is_active: true,
			title_line1: '',
			title_accent: '',
			title_line2: '',
			title_sub: '',
			lead_text: '',
			banner_text: '',
			seats_total: 50,
			seats_left: 50,
			event_days: '',
			event_time: '20:00',
			event_timezone: 'Toshkent',
			original_price: 0,
			is_free: true,
			countdown_hour: 20,
			countdown_minute: 0,
			countdown_month: new Date().getMonth() + 1,
			countdown_year: new Date().getFullYear(),
			countdown_days: '',
			instructor_name: '',
			instructor_role: '',
			instructor_bio: '',
			instructor_photo: '',
			why_title: '',
			why_desc: '',
			telegram_link: '',
			eyebrow_text: '',
			benefits_title: '',
			stat_students: '0',
			stat_experience: '0',
			stat_practical: '0'
		};
		benefits = [];
	}

	const sections = [
		{ id: 'event', label: m.admin_mc_sec_event(), icon: Calendar },
		{ id: 'instructor', label: m.admin_mc_sec_instructor(), icon: Users },
		{ id: 'benefits', label: m.admin_mc_sec_benefits(), icon: BookOpen },
		{ id: 'content', label: m.admin_mc_sec_content(), icon: Megaphone },
		{ id: 'registrations', label: m.admin_mc_sec_registrations(), icon: Settings }
	];
</script>

<svelte:head>
	<title>{m.admin_mc_title()} — Admin</title>
</svelte:head>

<div class="mp-root">
	<!-- ── Top bar ──────────────────────────────────────── -->
	<div class="mp-topbar">
		<div class="mp-topbar-left">
			<div class="mp-topbar-eyebrow">
				<span class="mp-eyebrow-rule"></span>
				<span>{m.admin_mc_subtitle()}</span>
			</div>
			<div class="mp-topbar-title-row">
				<h1 class="mp-topbar-title">{m.admin_mc_title()}</h1>

				{#if data.masterclasses?.length > 0}
					<div class="mp-mc-selector">
						<select
							class="mp-select"
							onchange={(e) => {
								const mc = data.masterclasses.find((m) => m.slug === e.currentTarget.value);
								if (mc) selectMasterclass(mc);
							}}
							value={lp.slug}
						>
							<option value="" disabled>{m.admin_mc_select_placeholder?.() ?? 'Tanlang...'}</option>
							{#each data.masterclasses as mc (mc.slug)}
								<option value={mc.slug}>{mc.title_line1} {mc.title_line2}</option>
							{/each}
						</select>
					</div>
				{/if}

				<button onclick={createNew} class="mp-new-btn" title="Yangi yaratish">
					<Plus size={16} />
					<span>{m.admin_mc_btn_new?.() ?? 'Yangi'}</span>
				</button>
			</div>
		</div>

		<div class="mp-topbar-actions">
			<!-- Live toggle -->
			<button
				onclick={() => (lp.is_active = !lp.is_active)}
				class="mp-toggle-btn {lp.is_active ? 'mp-toggle-btn--on' : ''}"
			>
				{#if lp.is_active}
					<ToggleRight size={20} />
					<span>{m.admin_mc_active()}</span>
				{:else}
					<ToggleLeft size={20} />
					<span>{m.admin_mc_inactive()}</span>
				{/if}
			</button>

			<!-- Preview -->
			{#if lp.slug}
				<a href={resolve(`/masterclass/${lp.slug}`)} target="_blank" class="mp-preview-btn">
					<ExternalLink size={15} />
					{m.admin_mc_view()}
				</a>
			{/if}

			<!-- Save -->
			<form
				method="POST"
				action="?/saveLanding"
				use:enhance={handleSubmit}
				enctype="multipart/form-data"
			>
				<!-- Hidden fields for all data -->
				<input type="hidden" name="lp_data" value={JSON.stringify(lp)} />
				<input type="hidden" name="benefits" value={JSON.stringify(benefits)} />

				<button type="submit" disabled={saving} class="mp-save-btn">
					{#if saving}
						<Loader2 size={15} class="spin" />
						{m.admin_mc_saving()}
					{:else}
						<Save size={15} />
						{m.admin_mc_save()}
					{/if}
				</button>
			</form>
		</div>
	</div>

	<div class="mp-body">
		<!-- ── Sidebar nav ────────────────────────────────── -->
		<nav class="mp-sidenav">
			{#each sections as sec (sec.id)}
				<button
					onclick={() => (activeSection = sec.id)}
					class="mp-navitem {activeSection === sec.id ? 'mp-navitem--active' : ''}"
				>
					<sec.icon size={16} />
					<span>{sec.label}</span>
					{#if activeSection === sec.id}
						<span class="mp-navitem-pip"></span>
					{/if}
				</button>
			{/each}
		</nav>

		<!-- ── Main editor ────────────────────────────────── -->
		<div class="mp-editor">
			<!-- ── SECTION: Event ───────────────────────────── -->
			{#if activeSection === 'event'}
				<div class="mp-section" in:fade={{ duration: 160 }}>
					<div class="mp-section-header">
						<div class="mp-section-icon"><Calendar size={16} /></div>
						<h2 class="mp-section-title">{m.admin_mc_sec_event()}</h2>
					</div>

					<!-- Banner -->
					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_banner_title()}</h3>
						<div class="mp-field">
							<label class="mp-label" for="banner_text">{m.admin_mc_banner_label()}</label>
							<input
								id="banner_text"
								class="mp-input"
								bind:value={lp.banner_text}
								placeholder={m.admin_mc_banner_label()}
							/>
						</div>
						<div class="mp-field">
							<label class="mp-label" for="eyebrow_text">{m.admin_mc_eyebrow_label()}</label>
							<input
								id="eyebrow_text"
								class="mp-input"
								bind:value={lp.eyebrow_text}
								placeholder={m.admin_mc_eyebrow_label()}
							/>
						</div>
						<div class="mp-field">
							<label class="mp-label" for="mc_slug">Slug (URL)</label>
							<input
								id="mc_slug"
								class="mp-input mp-input--slug"
								bind:value={lp.slug}
								placeholder="masterclass-slug"
								required
							/>
						</div>
					</div>

					<!-- Title -->
					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_title_section()}</h3>
						<div class="mp-preview-title">
							<span>{lp.title_line1}</span>
							<em>{lp.title_accent}</em>
							<span>{lp.title_line2}</span>
							<span class="mp-preview-sub">{lp.title_sub}</span>
						</div>
						<div class="mp-grid-2">
							<div class="mp-field">
								<label class="mp-label" for="title_line1">{m.admin_mc_line1()}</label>
								<input
									id="title_line1"
									class="mp-input"
									bind:value={lp.title_line1}
									placeholder={m.admin_mc_line1()}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="title_accent">{m.admin_mc_accent()}</label>
								<input
									id="title_accent"
									class="mp-input mp-input--accent"
									bind:value={lp.title_accent}
									placeholder={m.admin_mc_accent()}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="title_line2">{m.admin_mc_line2()}</label>
								<input
									id="title_line2"
									class="mp-input"
									bind:value={lp.title_line2}
									placeholder={m.admin_mc_line2()}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="title_sub">{m.admin_mc_sub()}</label>
								<input
									id="title_sub"
									class="mp-input"
									bind:value={lp.title_sub}
									placeholder={m.admin_mc_sub()}
								/>
							</div>
						</div>
					</div>

					<!-- Lead text -->
					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_lead_title()}</h3>
						<div class="mp-field">
							<label class="mp-label" for="lead_text">{m.admin_mc_lead_label()}</label>
							<textarea
								id="lead_text"
								class="mp-textarea"
								bind:value={lp.lead_text}
								rows={4}
								placeholder={m.admin_mc_lead_label()}
							></textarea>
							<span class="mp-hint">{m.admin_mc_lead_hint()}</span>
						</div>
					</div>

					<!-- Schedule -->
					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_schedule_title()}</h3>
						<div class="mp-grid-2">
							<div class="mp-field">
								<label class="mp-label" for="event_days">{m.admin_mc_dates_label()}</label>
								<input
									id="event_days"
									class="mp-input"
									bind:value={lp.event_days}
									placeholder={m.admin_mc_dates_label()}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="event_time">{m.admin_mc_time_label()}</label>
								<input id="event_time" class="mp-input" type="time" bind:value={lp.event_time} />
							</div>
							<div class="mp-field">
								<label class="mp-label" for="event_timezone">{m.admin_mc_timezone_label()}</label>
								<input
									id="event_timezone"
									class="mp-input"
									bind:value={lp.event_timezone}
									placeholder={m.admin_mc_timezone_label()}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="original_price">{m.admin_mc_price_label()}</label>
								<input
									id="original_price"
									class="mp-input"
									type="number"
									bind:value={lp.original_price}
									min={0}
								/>
							</div>
						</div>

						<label class="mp-checkbox-row" for="is_free">
							<input id="is_free" type="checkbox" bind:checked={lp.is_free} class="mp-checkbox" />
							<span class="mp-checkbox-label">{m.admin_mc_free_label()}</span>
						</label>
					</div>

					<!-- Countdown -->
					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_countdown_title()}</h3>
						<div class="mp-countdown-hint">
							<Clock size={14} />
							<span>{m.admin_mc_countdown_hint()}</span>
						</div>
						<div class="mp-grid-3">
							<div class="mp-field">
								<label class="mp-label" for="countdown_year">Yil</label>
								<input
									id="countdown_year"
									class="mp-input"
									type="number"
									bind:value={lp.countdown_year}
									min={2024}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="countdown_month">Oy</label>
								<select id="countdown_month" class="mp-input" bind:value={lp.countdown_month}>
									{#each Array.from({ length: 12 }, (_, i) => i + 1) as mNum (mNum)}
										<option value={mNum}>
											{new Date(2024, mNum - 1).toLocaleString('uz', { month: 'long' })}
										</option>
									{/each}
								</select>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="countdown_days">{m.admin_mc_days_list()}</label>
								<input
									id="countdown_days"
									class="mp-input"
									bind:value={lp.countdown_days}
									placeholder="28, 29, 30"
								/>
							</div>
						</div>

						<div class="mp-grid-2" style="margin-top: 0.75rem;">
							<div class="mp-field">
								<label class="mp-label" for="countdown_hour">{m.admin_mc_hour()}</label>
								<input
									id="countdown_hour"
									class="mp-input"
									type="number"
									bind:value={lp.countdown_hour}
									min={0}
									max={23}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="countdown_minute">{m.admin_mc_minute()}</label>
								<input
									id="countdown_minute"
									class="mp-input"
									type="number"
									bind:value={lp.countdown_minute}
									min={0}
									max={59}
								/>
							</div>
						</div>
					</div>

					<!-- Seats -->
					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_seats_title()}</h3>
						<div class="mp-grid-2">
							<div class="mp-field">
								<label class="mp-label" for="seats_total">{m.admin_mc_seats_total()}</label>
								<input
									id="seats_total"
									class="mp-input"
									type="number"
									bind:value={lp.seats_total}
									min={1}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="seats_left">{m.admin_mc_seats_left()}</label>
								<input
									id="seats_left"
									class="mp-input"
									type="number"
									bind:value={lp.seats_left}
									min={0}
								/>
							</div>
						</div>
						<!-- Visual seats bar -->
						<div class="mp-seats-bar-wrap">
							<div class="mp-seats-bar">
								<div
									class="mp-seats-fill"
									style="width: {Math.min(
										100,
										((lp.seats_total - lp.seats_left) / lp.seats_total) * 100
									)}%"
								></div>
							</div>
							<span class="mp-seats-label">
								{m.admin_mc_seats_booked({
									booked: lp.seats_total - lp.seats_left,
									total: lp.seats_total
								})}
							</span>
						</div>
					</div>

					<!-- Telegram link -->
					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_tg_title()}</h3>
						<div class="mp-field">
							<label class="mp-label" for="telegram_link">{m.admin_mc_tg_label()}</label>
							<input
								id="telegram_link"
								class="mp-input"
								bind:value={lp.telegram_link}
								placeholder="https://t.me/+..."
							/>
						</div>
					</div>
				</div>

				<!-- ── SECTION: Instructor ────────────────────── -->
			{:else if activeSection === 'instructor'}
				<div class="mp-section" in:fade={{ duration: 160 }}>
					<div class="mp-section-header">
						<div class="mp-section-icon"><Users size={16} /></div>
						<h2 class="mp-section-title">{m.admin_mc_instructor_title()}</h2>
					</div>

					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_instructor_main()}</h3>
						<div class="mp-grid-2">
							<div class="mp-field">
								<label class="mp-label" for="instructor_name">{m.admin_mc_instructor_name()}</label>
								<input
									id="instructor_name"
									class="mp-input"
									bind:value={lp.instructor_name}
									placeholder={m.admin_mc_instructor_name()}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="instructor_role">{m.admin_mc_instructor_role()}</label>
								<input
									id="instructor_role"
									class="mp-input"
									bind:value={lp.instructor_role}
									placeholder={m.admin_mc_instructor_role()}
								/>
							</div>
						</div>
						<div class="mp-field" style="margin-top:0.75rem">
							<label class="mp-label" for="instructor_bio">{m.admin_mc_instructor_bio()}</label>
							<textarea
								id="instructor_bio"
								class="mp-textarea"
								bind:value={lp.instructor_bio}
								rows={4}
								placeholder={m.admin_mc_instructor_bio()}
							></textarea>
						</div>
					</div>

					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_instructor_image()}</h3>
						<div class="mp-img-preview-wrap">
							{#if photoPreview || lp.instructor_photo}
								<img
									src={photoPreview || lp.instructor_photo}
									alt="Instructor"
									class="mp-img-preview"
								/>
							{:else}
								<div class="mp-img-placeholder">
									<ImageIcon size={28} />
									<span>{m.admin_mc_no_image()}</span>
								</div>
							{/if}
						</div>
						<div class="mp-field" style="margin-top:0.875rem">
							<label class="mp-label" for="instructor_photo_file"
								>{m.admin_mc_instructor_image()}</label
							>
							<label class="mp-file-upload">
								<input
									type="file"
									id="instructor_photo_file"
									name="instructor_photo"
									accept="image/*"
									class="mp-hidden-input"
									onchange={handlePhotoChange}
								/>
								<UploadCloud size={20} />
								<span>{m.admin_mc_upload_btn?.() ?? 'Rasm yuklash'}</span>
							</label>
						</div>
					</div>

					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_stats_title()}</h3>
						<div class="mp-grid-3">
							<div class="mp-field">
								<label class="mp-label" for="stat_students">{m.admin_mc_stat_students()}</label>
								<input
									id="stat_students"
									class="mp-input"
									bind:value={lp.stat_students}
									placeholder={m.admin_mc_stat_students()}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="stat_experience">{m.admin_mc_stat_experience()}</label>
								<input
									id="stat_experience"
									class="mp-input"
									bind:value={lp.stat_experience}
									placeholder={m.admin_mc_stat_experience()}
								/>
							</div>
							<div class="mp-field">
								<label class="mp-label" for="stat_practical">{m.admin_mc_stat_practical()}</label>
								<input
									id="stat_practical"
									class="mp-input"
									bind:value={lp.stat_practical}
									placeholder={m.admin_mc_stat_practical()}
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- ── SECTION: Benefits ──────────────────────── -->
			{:else if activeSection === 'benefits'}
				<div class="mp-section" in:fade={{ duration: 160 }}>
					<div class="mp-section-header">
						<div class="mp-section-icon"><BookOpen size={16} /></div>
						<h2 class="mp-section-title">{m.admin_mc_benefits_title()}</h2>
					</div>

					<div class="mp-card">
						<div class="mp-field" style="margin-bottom:0.75rem">
							<label class="mp-label" for="benefits_title">{m.admin_mc_benefits_sec_title()}</label>
							<input
								id="benefits_title"
								class="mp-input"
								bind:value={lp.benefits_title}
								placeholder={m.admin_mc_benefits_title()}
							/>
						</div>

						<h3 class="mp-card-title" style="margin-top:1.25rem">{m.admin_mc_benefits_list()}</h3>
						<p class="mp-hint" style="margin-bottom:1rem">
							{m.admin_mc_benefits_hint()}
						</p>

						<ul class="mp-benefit-list">
							{#each benefits as _benefit, i (i)}
								<li
									class="mp-benefit-item {dragOverIdx === i
										? 'mp-benefit-item--over'
										: ''} {deletingBenefitIdx === i ? 'mp-benefit-item--deleting' : ''}"
									draggable="true"
									ondragstart={() => onDragStart(i)}
									ondragover={(e) => onDragOver(e, i)}
									ondrop={() => onDrop(i)}
									ondragend={onDragEnd}
								>
									<span class="mp-grip" title="Suring">
										<GripVertical size={15} />
									</span>
									<span class="mp-benefit-num">{i + 1}</span>
									<input
										class="mp-benefit-input"
										bind:value={benefits[i]}
										placeholder={m.admin_mc_benefits_list()}
									/>
									<div class="mp-benefit-controls">
										<button
											type="button"
											onclick={() => moveBenefit(i, -1)}
											disabled={i === 0}
											class="mp-icon-btn"
											title="Yuqoriga"
										>
											<ChevronUp size={14} />
										</button>
										<button
											type="button"
											onclick={() => moveBenefit(i, 1)}
											disabled={i === benefits.length - 1}
											class="mp-icon-btn"
											title="Pastga"
										>
											<ChevronDown size={14} />
										</button>
										<button
											type="button"
											onclick={() => removeBenefit(i)}
											class="mp-icon-btn mp-icon-btn--danger"
											title="O'chirish"
										>
											<Trash2 size={14} />
										</button>
									</div>
								</li>
							{/each}
						</ul>

						<!-- Add benefit -->
						<div class="mp-add-benefit">
							<input
								class="mp-input"
								bind:value={newBenefit}
								placeholder={m.admin_mc_add_benefit_placeholder()}
								onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
							/>
							<button
								type="button"
								onclick={addBenefit}
								class="mp-add-btn"
								disabled={!newBenefit.trim()}
							>
								<Plus size={15} />
								{m.admin_mc_btn_add()}
							</button>
						</div>
					</div>
				</div>

				<!-- ── SECTION: Content ───────────────────────── -->
			{:else if activeSection === 'content'}
				<div class="mp-section" in:fade={{ duration: 160 }}>
					<div class="mp-section-header">
						<div class="mp-section-icon"><Megaphone size={16} /></div>
						<h2 class="mp-section-title">{m.admin_mc_content_title()}</h2>
					</div>

					<!-- Why section -->
					<div class="mp-card">
						<h3 class="mp-card-title">{m.admin_mc_why_section()}</h3>
						<div class="mp-field">
							<label class="mp-label" for="why_title">{m.admin_mc_why_title_label()}</label>
							<input
								id="why_title"
								class="mp-input"
								bind:value={lp.why_title}
								placeholder={m.admin_mc_why_title_label()}
							/>
						</div>
						<div class="mp-field" style="margin-top:0.75rem">
							<label class="mp-label" for="why_desc">{m.admin_mc_why_desc_label()}</label>
							<textarea
								id="why_desc"
								class="mp-textarea"
								bind:value={lp.why_desc}
								rows={5}
								placeholder={m.admin_mc_why_desc_label()}
							></textarea>
						</div>
					</div>
				</div>

				<!-- ── SECTION: Registrations ─────────────────── -->
			{:else if activeSection === 'registrations'}
				<div class="mp-section" in:fade={{ duration: 160 }}>
					<div class="mp-section-header">
						<div class="mp-section-icon"><Settings size={16} /></div>
						<h2 class="mp-section-title">{m.admin_mc_regs_title()}</h2>
					</div>

					{#await data.lazy?.registrations}
						<div class="mp-card">
							<div class="mp-reg-loading">
								<Loader2 size={22} class="spin" />
								<span>{m.admin_mc_loading()}</span>
							</div>
						</div>
					{:then registrations}
						{@const regs = registrations ?? []}

						<!-- Summary cards -->
						<div class="mp-reg-summary">
							<div class="mp-reg-stat">
								<span class="mp-reg-stat-val">{regs.length}</span>
								<span class="mp-reg-stat-lbl">{m.admin_mc_total_regs()}</span>
							</div>
							<div class="mp-reg-stat">
								<span class="mp-reg-stat-val">{lp.seats_left}</span>
								<span class="mp-reg-stat-lbl">{m.admin_mc_empty_seats()}</span>
							</div>
							<div class="mp-reg-stat">
								<span class="mp-reg-stat-val"
									>{Math.round((regs.length / Math.max(lp.seats_total, 1)) * 100)}%</span
								>
								<span class="mp-reg-stat-lbl">{m.admin_mc_fill_rate()}</span>
							</div>
						</div>

						<div class="mp-card" style="padding:0; overflow:hidden;">
							{#if regs.length === 0}
								<div class="mp-reg-empty">
									<Users size={28} />
									<p>{m.admin_mc_no_regs()}</p>
								</div>
							{:else}
								<div class="mp-reg-table-wrap">
									<table class="mp-reg-table">
										<thead>
											<tr>
												<th>{m.admin_mc_table_num()}</th>
												<th>{m.admin_mc_table_name()}</th>
												<th>{m.admin_mc_table_phone()}</th>
												<th>{m.admin_mc_table_date()}</th>
												<th>{m.admin_mc_table_status()}</th>
											</tr>
										</thead>
										<tbody>
											{#each regs as reg, i (reg.id ?? i)}
												<tr class="mp-reg-row">
													<td class="mp-reg-num">{i + 1}</td>
													<td class="mp-reg-name">{reg.name ?? '—'}</td>
													<td class="mp-reg-phone">{reg.phone ?? '—'}</td>
													<td class="mp-reg-date">
														{reg.created_at
															? new Date(reg.created_at).toLocaleDateString(getLocale(), {
																	day: 'numeric',
																	month: 'short',
																	hour: '2-digit',
																	minute: '2-digit'
																})
															: '—'}
													</td>
													<td>
														<span
															class="mp-reg-badge {reg.joined_telegram
																? 'mp-reg-badge--joined'
																: 'mp-reg-badge--pending'}"
														>
															{reg.joined_telegram
																? m.admin_mc_status_joined()
																: m.admin_mc_status_pending()}
														</span>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							{/if}
						</div>

						<!-- Export button -->
						{#if regs.length > 0}
							<form method="POST" action="?/exportCsv">
								<button type="submit" class="mp-export-btn"> {m.admin_mc_export()} </button>
							</form>
						{/if}
					{/await}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* ── Root ──────────────────────────────────────────── */
	.mp-root {
		min-height: 100vh;
		background: var(--bg-main, #f0f0ed);
		font-family: 'Instrument Sans', 'DM Sans', 'Helvetica Neue', sans-serif;
		display: flex;
		flex-direction: column;
	}

	/* ── Top bar ────────────────────────────────────────── */
	.mp-topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.125rem 2rem;
		background: var(--bg-card, #fff);
		border-bottom: 1px solid var(--border-main, #ede9e4);
		flex-wrap: wrap;
		position: sticky;
		top: 0;
		z-index: 20;
	}

	.mp-topbar-eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #9b1c48;
		margin-bottom: 3px;
	}

	.mp-eyebrow-rule {
		width: 16px;
		height: 2px;
		background: #9b1c48;
		border-radius: 2px;
	}

	.mp-topbar-title {
		font-size: 1.25rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--text-main, #1a1816);
		margin: 0;
	}

	.mp-topbar-actions {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	/* Toggle btn */
	.mp-toggle-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 38px;
		padding: 0 14px;
		border-radius: 10px;
		border: 1.5px solid var(--border-main, #ede9e4);
		background: var(--bg-card, #fff);
		font-size: 12.5px;
		font-weight: 600;
		color: var(--text-muted, #a09890);
		cursor: pointer;
		transition: all 0.15s;
		font-family: inherit;
	}

	.mp-toggle-btn--on {
		background: rgba(16, 185, 129, 0.08);
		border-color: rgba(16, 185, 129, 0.3);
		color: #10b981;
	}

	.mp-toggle-btn:hover:not(.mp-toggle-btn--on) {
		border-color: rgba(155, 28, 72, 0.2);
		color: var(--text-main, #1a1816);
	}

	/* Preview */
	.mp-preview-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 38px;
		padding: 0 14px;
		border-radius: 10px;
		border: 1.5px solid var(--border-main, #ede9e4);
		background: var(--bg-card, #fff);
		font-size: 12.5px;
		font-weight: 600;
		color: var(--text-muted, #a09890);
		text-decoration: none;
		transition: all 0.15s;
	}

	.mp-preview-btn:hover {
		border-color: rgba(155, 28, 72, 0.25);
		color: #9b1c48;
	}

	/* Save */
	.mp-save-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 38px;
		padding: 0 18px;
		border-radius: 10px;
		border: none;
		background: #9b1c48;
		color: #fff;
		font-size: 12.5px;
		font-weight: 700;
		cursor: pointer;
		transition:
			background 0.15s,
			box-shadow 0.15s,
			transform 0.1s;
		box-shadow: 0 3px 12px rgba(155, 28, 72, 0.22);
		font-family: inherit;
	}

	.mp-save-btn:hover:not(:disabled) {
		background: #841639;
		box-shadow: 0 5px 18px rgba(155, 28, 72, 0.3);
		transform: translateY(-1px);
	}

	.mp-save-btn:disabled {
		opacity: 0.65;
		cursor: not-allowed;
		box-shadow: none;
	}

	/* ── Body layout ────────────────────────────────────── */
	.mp-body {
		display: grid;
		grid-template-columns: 220px 1fr;
		flex: 1;
		min-height: 0;
	}

	@media (max-width: 768px) {
		.mp-body {
			grid-template-columns: 1fr;
		}
	}

	/* ── Side nav ───────────────────────────────────────── */
	.mp-sidenav {
		background: var(--bg-card, #fff);
		border-right: 1px solid var(--border-main, #ede9e4);
		padding: 1.25rem 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 3px;
		position: sticky;
		top: 65px;
		height: calc(100vh - 65px);
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.mp-sidenav {
			position: static;
			height: auto;
			max-height: 70px;
			flex-direction: row;
			overflow-x: auto;
			padding: 0.75rem;
			gap: 6px;
			border-right: none;
			border-bottom: 1px solid var(--border-main, #ede9e4);
		}
	}

	.mp-navitem {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 10px 12px;
		border-radius: 11px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 13px;
		font-weight: 600;
		color: var(--text-muted, #a09890);
		transition:
			background 0.13s,
			color 0.13s;
		text-align: left;
		width: 100%;
		position: relative;
		font-family: inherit;
		white-space: nowrap;
	}

	.mp-navitem:hover {
		background: var(--bg-main, #f5f4f1);
		color: var(--text-main, #1a1816);
	}

	.mp-navitem--active {
		background: rgba(155, 28, 72, 0.07);
		color: #9b1c48;
		font-weight: 700;
	}

	.mp-navitem-pip {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #9b1c48;
		margin-left: auto;
		flex-shrink: 0;
	}

	/* ── Editor area ────────────────────────────────────── */
	.mp-editor {
		padding: 2rem;
		overflow-y: auto;
	}

	@media (max-width: 640px) {
		.mp-editor {
			padding: 1.25rem;
		}
	}

	/* ── Section ────────────────────────────────────────── */
	.mp-section {
		display: flex;
		flex-direction: column;
		gap: 1.125rem;
		max-width: 820px;
	}

	.mp-section-header {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 0.25rem;
	}

	.mp-section-icon {
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: rgba(155, 28, 72, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #9b1c48;
	}

	.mp-section-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-main, #1a1816);
		margin: 0;
		letter-spacing: -0.01em;
	}

	/* ── Card ───────────────────────────────────────────── */
	.mp-card {
		background: var(--bg-card, #fff);
		border-radius: 18px;
		border: 1.5px solid var(--border-main, #ede9e4);
		padding: 1.375rem 1.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	}

	.mp-card-title {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted, #a09890);
		margin: 0 0 1.125rem;
	}

	/* ── Fields ─────────────────────────────────────────── */
	.mp-field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.mp-label {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--text-muted, #a09890);
	}

	.mp-input {
		height: 42px;
		padding: 0 13px;
		border-radius: 11px;
		border: 1.5px solid var(--border-main, #ede9e4);
		background: var(--bg-main, #faf9f7);
		font-size: 13.5px;
		font-weight: 500;
		color: var(--text-main, #1a1816);
		outline: none;
		transition:
			border-color 0.14s,
			box-shadow 0.14s,
			background 0.14s;
		font-family: inherit;
		width: 100%;
		box-sizing: border-box;
	}

	.mp-input:focus {
		border-color: #9b1c48;
		background: var(--bg-card, #fff);
		box-shadow: 0 0 0 3px rgba(155, 28, 72, 0.08);
	}

	.mp-input--accent {
		color: #9b1c48;
		font-style: italic;
		font-weight: 700;
	}

	.mp-textarea {
		padding: 11px 13px;
		border-radius: 11px;
		border: 1.5px solid var(--border-main, #ede9e4);
		background: var(--bg-main, #faf9f7);
		font-size: 13.5px;
		font-weight: 500;
		color: var(--text-main, #1a1816);
		outline: none;
		transition:
			border-color 0.14s,
			box-shadow 0.14s;
		font-family: inherit;
		resize: vertical;
		width: 100%;
		box-sizing: border-box;
		line-height: 1.6;
	}

	.mp-textarea:focus {
		border-color: #9b1c48;
		background: var(--bg-card, #fff);
		box-shadow: 0 0 0 3px rgba(155, 28, 72, 0.08);
	}

	.mp-hint {
		font-size: 11px;
		color: var(--text-muted, #a09890);
		font-style: italic;
	}

	/* Grids */
	.mp-grid-2 {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.875rem;
	}

	.mp-grid-3 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.875rem;
	}

	@media (max-width: 560px) {
		.mp-grid-2,
		.mp-grid-3 {
			grid-template-columns: 1fr;
		}
	}

	/* Checkbox */
	.mp-checkbox-row {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-top: 0.875rem;
		cursor: pointer;
		width: fit-content;
	}

	.mp-checkbox {
		width: 17px;
		height: 17px;
		accent-color: #9b1c48;
		cursor: pointer;
	}

	.mp-checkbox-label {
		font-size: 13.5px;
		font-weight: 600;
		color: var(--text-main, #1a1816);
	}

	/* Seats bar */
	.mp-seats-bar-wrap {
		margin-top: 1rem;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.mp-seats-bar {
		flex: 1;
		height: 6px;
		background: var(--bg-main, #f0ece8);
		border-radius: 999px;
		overflow: hidden;
	}

	.mp-seats-fill {
		height: 100%;
		background: #9b1c48;
		border-radius: 999px;
		transition: width 0.5s ease;
	}

	.mp-seats-label {
		font-size: 12px;
		font-weight: 600;
		color: var(--text-muted, #a09890);
		white-space: nowrap;
	}

	/* Countdown hint */
	.mp-countdown-hint {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 12.5px;
		color: var(--text-muted, #a09890);
		background: var(--bg-main, #f5f4f1);
		border-radius: 9px;
		padding: 9px 13px;
		margin-bottom: 1rem;
	}

	/* ── Title preview ──────────────────────────────────── */
	.mp-preview-title {
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding: 1rem 1.25rem;
		background: var(--bg-main, #f5f4f1);
		border-radius: 12px;
		margin-bottom: 1.125rem;
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.375rem;
		font-weight: 900;
		line-height: 1.2;
		color: var(--text-main, #1a1816);
		letter-spacing: -0.02em;
	}

	.mp-preview-title em {
		font-style: italic;
		color: #9b1c48;
	}

	.mp-preview-sub {
		opacity: 0.6;
		font-size: 1.125rem;
	}

	/* ── Instructor image preview ───────────────────────── */
	.mp-img-preview-wrap {
		width: 160px;
		height: 160px;
		border-radius: 16px;
		overflow: hidden;
		background: var(--bg-main, #f0ece8);
		border: 1.5px solid var(--border-main, #ede9e4);
	}

	.mp-img-preview {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.mp-img-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		color: var(--text-muted, #a09890);
		font-size: 12px;
	}

	/* ── Benefits list ──────────────────────────────────── */
	.mp-benefit-list {
		list-style: none;
		margin: 0 0 1rem;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.mp-benefit-item {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--bg-main, #faf9f7);
		border: 1.5px solid var(--border-main, #ede9e4);
		border-radius: 12px;
		padding: 8px 10px;
		transition:
			border-color 0.13s,
			box-shadow 0.13s,
			opacity 0.2s,
			transform 0.2s;
		cursor: grab;
	}

	.mp-benefit-item:active {
		cursor: grabbing;
	}

	.mp-benefit-item--over {
		border-color: #9b1c48;
		box-shadow: 0 0 0 3px rgba(155, 28, 72, 0.08);
	}

	.mp-benefit-item--deleting {
		opacity: 0;
		transform: translateX(-8px);
	}

	.mp-grip {
		color: var(--text-muted, #c5c0b8);
		flex-shrink: 0;
		cursor: grab;
	}

	.mp-benefit-num {
		font-size: 11px;
		font-weight: 800;
		color: #9b1c48;
		width: 18px;
		flex-shrink: 0;
		text-align: center;
	}

	.mp-benefit-input {
		flex: 1;
		height: 34px;
		border: none;
		background: transparent;
		font-size: 13px;
		font-weight: 500;
		color: var(--text-main, #1a1816);
		outline: none;
		font-family: inherit;
		min-width: 0;
	}

	.mp-benefit-controls {
		display: flex;
		align-items: center;
		gap: 3px;
		flex-shrink: 0;
	}

	.mp-icon-btn {
		width: 28px;
		height: 28px;
		border-radius: 7px;
		border: none;
		background: transparent;
		color: var(--text-muted, #a09890);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background 0.12s,
			color 0.12s;
	}

	.mp-icon-btn:hover:not(:disabled) {
		background: var(--bg-main, #f0ece8);
		color: var(--text-main, #1a1816);
	}
	.mp-icon-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	.mp-icon-btn--danger:hover:not(:disabled) {
		background: #fce8ef;
		color: #9b1c48;
	}

	.mp-add-benefit {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.mp-add-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 42px;
		padding: 0 16px;
		border-radius: 11px;
		border: none;
		background: #9b1c48;
		color: #fff;
		font-size: 12.5px;
		font-weight: 700;
		cursor: pointer;
		transition: background 0.13s;
		flex-shrink: 0;
		font-family: inherit;
	}

	.mp-add-btn:hover:not(:disabled) {
		background: #841639;
	}
	.mp-add-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.mp-file-upload {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		height: 48px;
		border: 1.5px dashed var(--border-main, #ede8e3);
		border-radius: 13px;
		background: var(--bg-main, #fcfaf8);
		cursor: pointer;
		transition: all 0.2s;
		font-size: 13px;
		font-weight: 600;
		color: var(--text-muted, #7a6e65);
	}

	.mp-file-upload:hover {
		border-color: #9b1c48;
		background: #fffafa;
		color: #9b1c48;
	}

	.mp-hidden-input {
		display: none;
	}

	/* ── Registrations ──────────────────────────────────── */
	.mp-reg-summary {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.mp-reg-stat {
		background: var(--bg-card, #fff);
		border: 1.5px solid var(--border-main, #ede9e4);
		border-radius: 16px;
		padding: 1.125rem;
		display: flex;
		flex-direction: column;
		gap: 3px;
		text-align: center;
	}

	.mp-reg-stat-val {
		font-size: 1.75rem;
		font-weight: 800;
		color: #9b1c48;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.mp-reg-stat-lbl {
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted, #a09890);
	}

	.mp-reg-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 3rem;
		color: var(--text-muted, #a09890);
		font-size: 14px;
	}

	.mp-reg-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 3rem;
		color: var(--text-muted, #a09890);
		font-size: 14px;
	}

	.mp-reg-table-wrap {
		overflow-x: auto;
	}

	.mp-reg-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}

	.mp-reg-table th {
		padding: 12px 16px;
		text-align: left;
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted, #a09890);
		background: var(--bg-main, #faf9f7);
		border-bottom: 1px solid var(--border-main, #ede9e4);
		white-space: nowrap;
	}

	.mp-reg-table td {
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-main, #ede9e4);
		vertical-align: middle;
	}

	.mp-reg-row:last-child td {
		border-bottom: none;
	}
	.mp-reg-row:hover td {
		background: var(--bg-main, #faf9f7);
	}

	.mp-reg-num {
		font-size: 12px;
		color: var(--text-muted, #a09890);
		font-weight: 600;
	}
	.mp-reg-name {
		font-weight: 700;
		color: var(--text-main, #1a1816);
	}
	.mp-reg-phone {
		font-weight: 500;
		color: var(--text-muted, #a09890);
	}
	.mp-reg-date {
		font-size: 12px;
		color: var(--text-muted, #a09890);
		white-space: nowrap;
	}

	.mp-reg-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 3px 9px;
		border-radius: 999px;
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.mp-reg-badge--joined {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}
	.mp-reg-badge--pending {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	.mp-export-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 40px;
		padding: 0 1.25rem;
		border-radius: 11px;
		border: 1.5px solid var(--border-main, #ede9e4);
		background: var(--bg-card, #fff);
		font-size: 12.5px;
		font-weight: 700;
		color: var(--text-muted, #a09890);
		cursor: pointer;
		transition: all 0.13s;
		font-family: inherit;
		margin-top: 0.875rem;
	}

	.mp-export-btn:hover {
		border-color: rgba(155, 28, 72, 0.25);
		color: #9b1c48;
	}

	/* ── Spinner ────────────────────────────────────────── */
	:global(.spin) {
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	/* ── Masterclass selection & management ──────────────── */
	.mp-topbar-title-row {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.mp-mc-selector {
		position: relative;
		min-width: 220px;
	}

	.mp-select {
		width: 100%;
		height: 40px;
		padding: 0 34px 0 14px;
		border-radius: 11px;
		border: 1.5px solid var(--border-main, #ede9e4);
		background: var(--bg-card, #fff);
		font-size: 13px;
		font-weight: 600;
		color: var(--text-main, #1a1816);
		outline: none;
		appearance: none;
		cursor: pointer;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a09890' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 10px center;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.mp-select:focus {
		border-color: #9b1c48;
		box-shadow: 0 0 0 3px rgba(155, 28, 72, 0.08);
	}

	.mp-new-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 38px;
		padding: 0 14px;
		border-radius: 9px;
		border: 1.5px solid #9b1c48;
		background: transparent;
		color: #9b1c48;
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s;
	}

	.mp-new-btn:hover {
		background: #9b1c48;
		color: #fff;
	}

	.mp-input--slug {
		font-family: monospace;
		font-size: 12px;
		color: #9b1c48;
		letter-spacing: 0.02em;
	}

	@media (max-width: 640px) {
		.mp-topbar-title-row {
			gap: 0.75rem;
		}
		.mp-mc-selector {
			min-width: 100%;
			order: 3;
		}
	}
</style>
