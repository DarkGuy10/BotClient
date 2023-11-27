import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
	stories: ['../frontend/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/nextjs',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	staticDirs: [{ from: '../frontend/public', to: '/' }],
}
export default config
