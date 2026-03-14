<script>
	import { setLocale } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
</script>

<h1>{m.nav_profile()}</h1>

<div>
	<button onclick={() => setLocale('uz')}>uz</button>
	<button onclick={() => setLocale('ru')}>ru</button>
</div>

<p>
	If you use VSCode, install the

	<a
		href="https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension"
		target="_blank">Sherlock i18n extension</a
	>

	for a better i18n experience.
</p>
