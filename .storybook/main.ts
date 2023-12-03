import type { StorybookConfig } from '@storybook/nextjs'
import path from 'path'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'

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
	webpackFinal: config => {
		config.resolve ??= {}
		config.resolve.plugins ??= []
		config.resolve.plugins.push(
			new TsconfigPathsPlugin({
				configFile: path.resolve(__dirname, '../frontend/tsconfig.json'),
			})
		)

		return config
	},
	docs: {
		autodocs: 'tag',
	},
	staticDirs: [{ from: '../frontend/public', to: '/' }],
}
export default config
