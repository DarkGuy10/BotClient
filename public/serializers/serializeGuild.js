// eslint-disable-next-line no-unused-vars
const { Guild } = require('discord.js')

/**
 *
 * @param {Guild} guild
 * @returns {Object}
 */
const serializeGuild = guild => {
	return {
		...guild,
		iconURL: guild.iconURL(),
	}
}

module.exports = serializeGuild
