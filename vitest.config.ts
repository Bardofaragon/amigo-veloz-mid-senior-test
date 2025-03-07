import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		watch: true,
		clearMocks: true,
		coverage: {
			reporter: ['text', 'json', 'html'],
		},
	},
});
