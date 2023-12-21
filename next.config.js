const { version, repository } = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: 'build',
	output: 'export',
	assetPrefix: process.env.NODE_ENV === 'production' ? '.' : undefined,
	trailingSlash: true,
	env: {
		META_APP_NAME: 'BotClient',
		META_APP_VERSION: version,
		META_REPOSITORY_URL: repository.url,
		META_SUPPORT_SERVER_INVITE: 'https://discord.com/invite/aZSrxwNUFD',
	},
	// Configure SVGR
	webpack(config) {
		const fileLoaderRule = config.module.rules.find(rule =>
			rule.test?.test?.('.svg')
		)
		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/,
			},
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
				use: ['@svgr/webpack'],
			}
		)
		fileLoaderRule.exclude = /\.svg$/i
		return config
	},
}

module.exports = nextConfig
