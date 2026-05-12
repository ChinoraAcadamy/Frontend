import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-static sozlamalari
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // SPA rejimi uchun zarur
			precompress: false,
			strict: true
		}),
		alias: {
			'@': './src'
		}
	}
};

export default config;