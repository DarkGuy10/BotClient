// eslint-disable-next-line no-unused-vars
const { GuildMember, UserFlags } = require('discord.js')

/**
 *
 * @param {GuildMember} member
 */
const serializeGuildMember = member => {
	const {
		displayName,
		presence,
		displayColor,
		displayHexColor,
		roles,
		user,
		voice,
	} = member

	return {
		...member,
		displayName: displayName,
		presence: presence,
		color: displayColor,
		hexColor: displayHexColor,
		isHoisted: roles.hoist ? true : false,
		isVerifiedBot: user.flags?.has(UserFlags.VerifiedBot),
		roles: {
			...roles,
			hoist: {
				...roles.hoist,
				position: roles.hoist?.position,
			},
		},
		avatarURL: user.displayAvatarURL(),
		voice: {
			...voice,
			selfDeaf: voice.selfDeaf,
			selfMute: voice.selfMute,
			selfVideo: voice.selfVideo,
			serverDeaf: voice.serverDeaf,
			serverMute: voice.serverMute,
			streaming: voice.streaming,
		},
	}
}

module.exports = serializeGuildMember
