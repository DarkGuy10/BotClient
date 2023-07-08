import { GatewayIntentBits } from 'discord.js'
import { BrowserWindow } from 'electron'

export interface ClientOptions {
	appWindow: BrowserWindow
	privilegedIntents: GatewayIntentBits[]
}

export enum ClientErrorCodes {
	CLIENT_NOT_READY = 'CLIENT_NOT_READY',
	NOT_GUILD_CHANNEL = 'NOT_GUILD_CHANNEL',
	NOT_TEXT_BASED_CHANNEL = 'NOT_TEXT_BASED_CHANNEL',
	NO_CURRENT_CHANNEL = 'NO_CURRENT_CHANNEL',
	CANNOT_FETCH_GUILD = 'CANNOT_FETCH_GUILD',
	NO_VIEWABLE_CHANNEL_IN_GUILD = 'NO_VIEWABLE_CHANNEL_IN_GUILD',
}
