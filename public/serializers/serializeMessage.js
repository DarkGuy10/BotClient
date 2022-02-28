// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js')

/**
 *
 * @param {Message} message
 * @returns {Object}
 */
const serializeMessage = async message => {
	const { type, author, member, stickers, mentions, guild } = message
	let repliesTo
	if (type === 'REPLY') repliesTo = await message.fetchReference()
	return {
		...message,
		author: {
			...author,
			avatarURL: author.displayAvatarURL(),
			isVerifiedBot: author.flags?.has('VERIFIED_BOT'),
		},
		member: member
			? {
					...member,
					color: member.displayColor,
					displayName: member.displayName,
			  }
			: null,
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
				? [...mentions.members].map(([id, each]) => {
						return [
							id,
							{
								...each,
								color: each.displayColor,
								displayName: each.displayName,
							},
						]
				  })
				: new Map(),
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
							? {
									...repliesTo.member,
									color: repliesTo.member.displayColor,
									displayName: repliesTo.member.displayName,
							  }
							: null,
				  }
				: null,
	}
}

module.exports = serializeMessage
