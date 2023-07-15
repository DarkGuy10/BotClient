/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationFlags, GatewayIntentBits } from 'discord.js'

export const serializeObject = (source: any) => {
	const sink: any = Object.assign({}, source)
	const proto = Object.getPrototypeOf(source)

	Object.entries(Object.getOwnPropertyDescriptors(proto))
		.filter(([, descriptor]) => typeof descriptor.get === 'function')
		.forEach(([key, descriptor]) => {
			if (descriptor && key[0] !== '_')
				try {
					sink[key] = source[key]
				} catch (error) {
					console.error(`Error in calling getter ${key}`, error)
				}
		})

	return sink
}

export const fetchPrivilegedIntents = async (token: string) => {
	const intents = []
	try {
		const response = await fetch(
			'https://discord.com/api/v10/applications/@me',
			{
				headers: {
					Authorization: `Bot ${token}`,
					'User-Agent': 'DiscordBot',
				},
			}
		)
		const { flags } = await response.json()

		if ((flags & (ApplicationFlags.GatewayGuildMembers | ApplicationFlags.GatewayGuildMembersLimited)) !== 0)
			intents.push(GatewayIntentBits.GuildMembers)

		if ((flags & (ApplicationFlags.GatewayPresence | ApplicationFlags.GatewayPresenceLimited)) !== 0)
			intents.push(GatewayIntentBits.GuildPresences)

		if ((flags & (ApplicationFlags.GatewayMessageContent | ApplicationFlags.GatewayMessageContentLimited)) !== 0)
			intents.push(GatewayIntentBits.MessageContent)

		return intents
	} catch (error) {
		console.error(error)
	}
}
