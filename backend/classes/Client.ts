import { serializeObject } from '@/utils'
import { Client as BaseClient, GatewayIntentBits, Events } from 'discord.js'
import { type BrowserWindow } from 'electron'
import type { ClientOptions } from '@/typings'

export class Client extends BaseClient {
	appWindow: BrowserWindow

	constructor(clientOptions: ClientOptions) {
		const intents = [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildEmojisAndStickers,
			GatewayIntentBits.GuildVoiceStates,
			...clientOptions.privilegedIntents,
		]
		super({ intents })

		this.appWindow = clientOptions.appWindow

		this._patchEvents()
	}

	private _patchEvents() {
		Object.keys(Events).forEach(event => {
			this.on(event, (...args) => {
				const serializedArguements = args.map(each => serializeObject(each))
				this.appWindow.webContents.send(event, ...serializedArguements)
			})
		})
	}
}
