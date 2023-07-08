import { GatewayIntentBits } from 'discord.js'
import { BrowserWindow } from 'electron'

export interface ClientOptions {
	appWindow: BrowserWindow
	privilegedIntents: GatewayIntentBits[]
}

export enum ClientErrorCodes {
	CLIENT_NOT_READY = 'CLIENT_NOT_READY',
}
