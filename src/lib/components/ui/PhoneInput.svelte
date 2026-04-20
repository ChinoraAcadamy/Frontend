<script lang="ts">
	import { Lock } from 'lucide-svelte';

	interface Props {
		label?: string;
		id?: string;
		value?: string;
		placeholder?: string;
		readonly?: boolean;
		name?: string;
		variant?: 'default' | 'flat';
	}

	let {
		label = '',
		id = '',
		value = $bindable(''),
		placeholder = '+998 __ ___ __ __',
		readonly = false,
		name = '',
		variant = 'default'
	}: Props = $props();

	function handleInput(e) {
		const target = e.target;
		let inputVal = target.value;

		if (!inputVal || inputVal === '+') {
			value = inputVal;
			return;
		}

		// Keep only numbers
		let raw = inputVal.replace(/\D/g, '');

		// Format string
		let formatted = '';
		if (raw.length > 0) {
			formatted = '+';
		}

		if (raw.startsWith('998')) {
			formatted += '998';
			if (raw.length > 3) formatted += ' ' + raw.substring(3, 5);
			if (raw.length > 5) formatted += ' ' + raw.substring(5, 8);
			if (raw.length > 8) formatted += ' ' + raw.substring(8, 10);
			if (raw.length > 10) formatted += ' ' + raw.substring(10, 12);
		} else {
			// Other countries fallback formatting
			if (raw.length > 0) formatted += raw.substring(0, Math.min(raw.length, 3));
			if (raw.length > 3) formatted += ' ' + raw.substring(3, 6);
			if (raw.length > 6) formatted += ' ' + raw.substring(6, 15);
		}

		value = formatted;
	}

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

<div class="flex flex-col gap-1.5 {label ? 'h-18' : ''}">
	{#if label}
		<label for={id} class="text-sm font-semibold text-slate-700">
			{label}
			{#if readonly}<span class="font-normal text-slate-400">(Readonly)</span>{/if}
		</label>
	{/if}

	<div class="relative flex items-center {variant === 'flat' ? 'group' : ''}">
		<!-- Flag/Code Indicator -->
		<div
			class="absolute flex items-center justify-center transition-all duration-300
			{variant === 'default'
				? 'left-2 h-9 min-w-14 rounded-xl border border-white/40 bg-white/30 px-3 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] backdrop-blur-xl'
				: 'left-0 h-full bg-transparent px-1'}"
		>
			{#if currentCountry}
				<span class="text-[12px] font-black tracking-widest text-[#ed4b72] uppercase"
					>{currentCountry.code}</span
				>
			{:else}
				<span class="text-slate-400 opacity-70">📞</span>
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
			class="w-full text-slate-800 transition-all duration-200 outline-none
				{currentCountry
				? variant === 'default'
					? 'pl-20'
					: 'pl-16'
				: variant === 'default'
					? 'pl-11'
					: 'pl-10'}
				{variant === 'default'
				? readonly
					? 'h-11 cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100/70 px-3 text-slate-500'
					: 'h-11 rounded-xl border border-slate-200 bg-white px-3 shadow-sm hover:border-slate-300 focus:border-[#ed4b72] focus:ring-[3px] focus:ring-[#ed4b72]/15'
				: readonly
					? 'block cursor-not-allowed border-b-2 border-slate-200 bg-transparent py-3 text-lg font-bold text-slate-500 placeholder:text-slate-300'
					: 'block border-b-2 border-slate-200 bg-transparent py-3 text-lg font-bold text-slate-900 transition-colors group-hover:border-slate-300 placeholder:text-slate-300 focus:border-[#FA2E69]'}"
		/>

		{#if readonly}
			<div class="absolute right-3 text-slate-400">
				<Lock size={16} strokeWidth={2.5} />
			</div>
		{/if}
	</div>
</div>
