// eslint-disable-next-line no-unused-vars
const { GuildMember } = require('discord.js')

/**
 *
 * @param {GuildMember} member
 */
const serializeGuildMember = member => {
	const { displayName, presence, displayColor, roles, user } = member
	return {
		...member,
		displayName: displayName,
		presence: presence,
		color: displayColor,
		isHoisted: roles.hoist ? true : false,
		isVerifiedBot: user.flags?.has('VERIFIED_BOT'),
		roles: {
			...roles,
			hoist: {
				...roles.hoist,
				position: roles.hoist?.position,
			},
		},
		avatarURL: user.displayAvatarURL(),
	}
}

module.exports = serializeGuildMember
