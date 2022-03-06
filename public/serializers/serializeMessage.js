// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js')
const serializeGuildMember = require('./serializeGuildMember')

/**
 *
 * @param {Message} message
 * @returns {Object}
 */
const serializeMessage = async message => {
	const { type, author, member, stickers, embeds, mentions, guild } = message
	let repliesTo
	if (type === 'REPLY') repliesTo = await message.fetchReference()
	return {
		...message,
		author: {
			...author,
			avatarURL: author.displayAvatarURL(),
			isVerifiedBot: author.flags?.has('VERIFIED_BOT'),
		},
		member: member ? serializeGuildMember(member) : null,
		isDM: message.channel.type === 'DM',
		embeds: embeds.map(embed => {
			return {
				...embed,
				hexColor: embed.hexColor,
			}
		}),
		stickers: [
			...stickers
				.map(sticker => {
					return {
						...sticker,
						url: sticker.url,
					}
				})
				.values(),
		],
		mentions: {
			members: mentions.members
				? [
						...mentions.members.mapValues(member =>
							serializeGuildMember(member)
						),
				  ]
				: [],
			users: [...mentions.users],
			roles: [...mentions.roles],
			everyone: mentions.everyone,
			channels: [...mentions.channels],
			me:
				mentions.roles.find(
					role =>
						guild.me.roles.botRole?.id === role.id ||
						guild.me.roles.cache.has(role.id)
				) || mentions.users.has(message.client.user.id),
		},
		repliesTo:
			type === 'REPLY'
				? {
						...repliesTo,
						author: {
							...repliesTo.author,
							avatarURL: repliesTo.author.displayAvatarURL(),
							isVerifiedBot:
								repliesTo.author.flags?.has('VERIFIED_BOT'),
						},
						member: repliesTo.member
							? serializeGuildMember(repliesTo.member)
							: null,
				  }
				: null,
	}
}

module.exports = serializeMessage
