const { version, repository } = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	trailingSlash: true,
	distDir: 'build',
	assetPrefix: '.',
	env: {
		metaVersion: version,
		metaRepositry: repository.url,
	},
}

module.exports = nextConfig
