module.exports = {
	name: 'messageCreate',
	async execute(client, message) {
		const sendObject = {
			...message,
			author: {
				...message.author,
				avatarURL: message.author.displayAvatarURL(),
				isVerifiedBot: message.author.flags?.has('VERIFIED_BOT'),
			},
			member: !message.member
				? null
				: {
						...message.member,
						color: message.member.displayColor,
						displayName: message.member.displayName,
				  },
			stickers: [...message.stickers.values()],
			mentions: {
				members: [...message.mentions.members].map(([id, each]) => {
					return [
						id,
						{
							...each,
							color: each.displayColor,
							displayName: each.displayName,
						},
					]
				}),
				users: [...message.mentions.users],
				roles: [...message.mentions.roles],
				everyone: message.mentions.everyone,
				channels: [...message.mentions.channels],
				me:
					message.mentions.roles.find(
						role =>
							message.guild.me.roles.botRole?.id === role.id ||
							message.guild.me.roles.cache.has(role.id)
					) || message.mentions.users.has(client.user.id),
			},
		}
		if (message.type === 'REPLY') {
			const repliesTo = await message.fetchReference()
			sendObject['repliesTo'] = {
				...repliesTo,
				author: {
					...repliesTo.author,
					avatarURL: repliesTo.author.displayAvatarURL(),
					isVerifiedBot: repliesTo.author.flags?.has('VERIFIED_BOT'),
				},
				member: !repliesTo.member
					? null
					: {
							...repliesTo.member,
							color: repliesTo.member.displayColor,
							displayName: repliesTo.member.displayName,
					  },
			}
		}
		client.transmit(this.name, sendObject)
	},
}
