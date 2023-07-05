/* eslint-disable @typescript-eslint/no-explicit-any */
import { GatewayIntentBits } from 'discord.js'

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
}

export const fetchPrivilegedIntents = async (token: string) => {
	const privilegedIntents = []
	try {
		const response = await fetch(
			'https://discord.com/api/v10/oauth2/applications/@me',
			{ headers: { Authorization: `Bot ${token}` } }
		)
		const { flags } = await response.json()

		if ((flags & (1 << 12)) === 1 << 12 || (flags & (1 << 13)) === 1 << 13)
			privilegedIntents.push(GatewayIntentBits.GuildPresences)

		if ((flags & (1 << 14)) === 1 << 14 || (flags & (1 << 15)) === 1 << 15)
			privilegedIntents.push(GatewayIntentBits.GuildMembers)

		if ((flags & (1 << 18)) === 1 << 18 || (flags & (1 << 19)) === 1 << 19)
			privilegedIntents.push(GatewayIntentBits.MessageContent)

		return privilegedIntents
	} catch (error) {
		console.error(error)
	}
}
