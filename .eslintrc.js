module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	ignorePatterns: [
		'.eslintrc.js',
		'**/*.js',
		'**/node_modules/**',
		'**/dist/**',
		'**/test/**',
	],
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: ['plugin:n8n-nodes-base/community'],
	rules: {
		'n8n-nodes-base/node-dirname-against-convention': 'off',
	},
};
