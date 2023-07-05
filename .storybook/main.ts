import type { StorybookConfig } from '@storybook/nextjs'
const config: StorybookConfig = {
	stories: ['../frontend/app/**/*.stories.@(js|jsx|ts|tsx)'],
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
	staticDirs: ['../frontend/public'],
}
export default config
