// eslint-disable-next-line no-unused-vars
const { GuildChannel, ChannelType, PermissionFlagsBits } = require('discord.js')
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
			.has(PermissionFlagsBits.ViewChannel),
		isRules: id === guild.rulesChannelId,
		members:
			type === ChannelType.GuildVoice && members.values
				? [...members.values()].map(member => serializeGuildMember(member))
				: [],
	}
}

module.exports = serializeGuildChannel
