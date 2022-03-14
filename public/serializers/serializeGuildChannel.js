// eslint-disable-next-line no-unused-vars
const { GuildChannel } = require('discord.js')
const serializeGuildMember = require('./serializeGuildMember')

/**
 *
 * @param {GuildChannel} channel
 * @returns
 */
const serializeGuildChannel = channel => {
	const { viewable, position, id, guild, members, type } = channel
	return {
		...channel,
		viewable: viewable,
		position: position,
		isPrivate: !channel
			.permissionsFor(guild.roles.everyone)
			.has('VIEW_CHANNEL'),
		isRules: id === guild.rulesChannelId,
		members:
			type === 'GUILD_VOICE' && members.values
				? [...members.values()].map(member =>
						serializeGuildMember(member)
				  )
				: [],
	}
}

module.exports = serializeGuildChannel
