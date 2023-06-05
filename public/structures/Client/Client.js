/* eslint-disable no-unused-vars */
const { Client: oldClient, GatewayIntentBits } = require('discord.js')
const { BrowserWindow } = require('electron')
const loadEvents = require('./EventLoader')

class Client extends oldClient {
	/**
	 * @param {BrowserWindow} mainWindow
	 */
	constructor(clientOptions) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildVoiceStates,
			],
		})
		this.mainWindow = clientOptions.mainWindow

		loadEvents(this)
	}

	/**
	 * Transmit events to the renderer with optional arguements.
	 * @param {String} eventName Name of event to transmit
	 * @param {Array<any>} args Any arguements that need to be sent. **Must be serializable.**
	 */
	transmit(eventName, ...args) {
		this.mainWindow.webContents.send(eventName, ...args)
	}

	get clientUserData() {
		const data = {
			...this.user.toJSON(),
			presence: { ...this.user.presence },
		}
		return data
	}
}

module.exports = Client
