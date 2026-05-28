import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

const replacements = [
	{
		from: /(['"])(?:\$|@\/)lib\/components\/ui\/home\/Footer\.svelte\1/g,
		to: '$1$lib/components/layout/Footer.svelte$1'
	},
	{
		from: /(['"])(?:\$|@\/)lib\/components\/TopLoader\.svelte\1/g,
		to: '$1$lib/components/layout/TopLoader.svelte$1'
	},
	{ from: /(['"])(?:\$|@\/)lib\/components\/ui\/admin\//g, to: '$1$lib/components/admin/' },
	{ from: /(['"])(?:\$|@\/)lib\/components\/ui\/courses\//g, to: '$1$lib/components/courses/' },
	{ from: /(['"])(?:\$|@\/)lib\/components\/ui\/home\//g, to: '$1$lib/components/home/' },
	{
		from: /(['"])(?:\$|@\/)lib\/components\/ui\/submissions\//g,
		to: '$1$lib/components/submissions/'
	},
	{ from: /(['"])(?:\$|@\/)lib\/components\/ui\/dashboard\//g, to: '$1$lib/components/dashboard/' },
	{ from: /(['"])(?:\$|@\/)lib\/components\/ui\/modal\//g, to: '$1$lib/components/ui/modals/' }
];

function processDirectory(dir) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			processDirectory(fullPath);
		} else if (file.endsWith('.svelte') || file.endsWith('.js') || file.endsWith('.ts')) {
			processFile(fullPath);
		}
	}
}

function processFile(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');
	let originalContent = content;

	for (const { from, to } of replacements) {
		content = content.replace(from, to);
	}

	if (content !== originalContent) {
		console.log(`Updated imports in: ${filePath}`);
		fs.writeFileSync(filePath, content, 'utf8');
	}
}

processDirectory(SRC_DIR);
console.log('Import refactoring complete.');
