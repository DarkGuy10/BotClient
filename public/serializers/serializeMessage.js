// eslint-disable-next-line no-unused-vars
const { Message, MessageType, ChannelType, UserFlags } = require('discord.js')
const serializeGuildMember = require('./serializeGuildMember')

/**
 *
 * @param {Message} message
 * @returns {Object}
 */
const serializeMessage = async message => {
	const { type, author, member, stickers, embeds, mentions, guild } = message

	let repliesTo = null
	try {
		if (type === MessageType.Reply) repliesTo = await message.fetchReference()
	} catch (error) {
		// Fix for #31
		// Man... I want to put an easter bug here, but idk
	}

	return {
		...message,
		author: {
			...author,
			avatarURL: author.displayAvatarURL(),
			isVerifiedBot: author.flags?.has(UserFlags.VerifiedBot),
		},
		member: member ? serializeGuildMember(member) : null,
		isDM: message.channel.type === ChannelType.DM,
		deletable: message.deletable,
		embeds: embeds.map(embed => {
			return {
				...embed.toJSON(),
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
				mentions.everyone ||
				mentions.roles.find(
					role =>
						guild.me.roles.botRole?.id === role.id ||
						guild.me.roles.cache.has(role.id)
				) ||
				mentions.users.has(message.client.user.id),
		},
		repliesTo: repliesTo
			? {
					...repliesTo,
					author: {
						...repliesTo.author,
						avatarURL: repliesTo.author.displayAvatarURL(),
						isVerifiedBot: repliesTo.author.flags?.has(UserFlags.VerifiedBot),
					},
					member: repliesTo.member
						? serializeGuildMember(repliesTo.member)
						: null,
				}
			: null,
	}
}

module.exports = serializeMessage
