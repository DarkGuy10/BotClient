import type { GatewayIntentBits } from 'discord.js'
import type { BrowserWindow } from 'electron'

export interface ClientOptions {
	appWindow: BrowserWindow
	privilegedIntents: GatewayIntentBits[]
}
