<script lang="ts">
	import { Lock, Phone } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		label = '',
		id = '',
		value = $bindable(''),
		placeholder = '+998 __ ___ __ __',
		readonly = false,
		name = ''
	} = $props();

	// Formatlash logikasi alohida funksiyaga olindi,
	// shunda komponent yuklanganda ham ishlatish mumkin bo'ladi.
	function formatPhone(inputVal) {
		if (!inputVal || inputVal === '+') return inputVal;

		let raw = inputVal.replace(/\D/g, '');
		let formatted = '';

		if (raw.length > 0) formatted = '+';

		if (raw.startsWith('998')) {
			formatted += '998';
			if (raw.length > 3) formatted += ' ' + raw.substring(3, 5);
			if (raw.length > 5) formatted += ' ' + raw.substring(5, 8);
			if (raw.length > 8) formatted += ' ' + raw.substring(8, 10);
			if (raw.length > 10) formatted += ' ' + raw.substring(10, 12);
		} else {
			if (raw.length > 0) formatted += raw.substring(0, Math.min(raw.length, 3));
			if (raw.length > 3) formatted += ' ' + raw.substring(3, 6);
			if (raw.length > 6) formatted += ' ' + raw.substring(6, 15);
		}

		return formatted;
	}

	function handleInput(e) {
		const target = e.target;
		value = formatPhone(target.value);
	}

	// Serverdan unformatted raqam kelsa, avtomatik to'g'rilaydi
	$effect(() => {
		if (value && !value.includes(' ') && value.length > 4) {
			value = formatPhone(value);
		}
	});

	let currentCountry = $derived.by(() => {
		const val = value || '';
		if (val.startsWith('+998')) return { code: 'UZ', flag: '🇺🇿' };
		if (val.startsWith('+7')) return { code: 'RU', flag: '🇷🇺' };
		if (val.startsWith('+1')) return { code: 'US', flag: '🇺🇸' };
		if (val.startsWith('+992')) return { code: 'TJ', flag: '🇹🇯' };
		if (val.startsWith('+996')) return { code: 'KG', flag: '🇰🇬' };
		if (val.startsWith('+44')) return { code: 'GB', flag: '🇬🇧' };
		if (val.startsWith('+380')) return { code: 'UA', flag: '🇺🇦' };
		if (val.startsWith('+')) return { code: 'INT', flag: '🌐' };
		return null;
	});
</script>

<div class="flex flex-col gap-2">
	{#if label}
		<label for={id} class="ml-1 text-[13px] font-bold text-main">
			{label}
			{#if readonly}<span class="ml-1 font-medium text-muted"
					>({m.readonly ? m.readonly() : "Faqat o'qish uchun"})</span
				>{/if}
		</label>
	{/if}

	<div
		class="group relative flex items-center overflow-hidden rounded-xl border border-main bg-muted/5 transition-all duration-300
               focus-within:border-primary focus-within:bg-card focus-within:shadow-sm focus-within:ring-4 focus-within:ring-primary/10
               {readonly ? 'bg-muted/10 opacity-70' : ''}"
	>
		<div
			class="flex h-[38px] min-w-[46px] shrink-0 items-center justify-center gap-2 px-3
                   text-[12px] font-bold tracking-wider text-muted transition-colors duration-300
                   group-focus-within:text-primary"
		>
			{#if currentCountry}
				<span>{currentCountry.flag}</span>
			{:else}
				<Phone size={16} strokeWidth={2.5} class="opacity-40" />
			{/if}
		</div>

		<input
			{id}
			type="tel"
			bind:value
			oninput={handleInput}
			{placeholder}
			{name}
			disabled={readonly}
			class="h-[44px] w-full border-none bg-transparent px-2 text-[15px] font-semibold tracking-wide text-foreground outline-none placeholder:font-medium placeholder:text-muted/40 disabled:cursor-not-allowed"
		/>

		{#if readonly}
			<div
				class="absolute right-4 flex items-center justify-center rounded-lg bg-muted/10 p-1.5 text-muted"
			>
				<Lock size={16} strokeWidth={2.5} />
			</div>
		{/if}
	</div>
</div>
