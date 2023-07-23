const { version, repository } = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: 'build',
	output: 'export',
	assetPrefix: process.env.NODE_ENV === 'production' ? '.' : undefined,
	trailingSlash: true,
	env: {
		metaVersion: version,
		metaRepositry: repository.url,
	},
}

module.exports = nextConfig
