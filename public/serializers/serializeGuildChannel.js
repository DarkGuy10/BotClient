// eslint-disable-next-line no-unused-vars
const { GuildChannel } = require('discord.js')

/**
 *
 * @param {GuildChannel} channel
 * @returns
 */
const serializeGuildChannel = channel => {
	const { viewable, position, id, guild } = channel
	return {
		...channel,
		viewable: viewable,
		position: position,
		isPrivate: !channel
			.permissionsFor(guild.roles.everyone)
			.has('VIEW_CHANNEL'),
		isRules: id === guild.rulesChannelId,
	}
}

module.exports = serializeGuildChannel
