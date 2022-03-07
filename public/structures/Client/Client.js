/* eslint-disable no-unused-vars */
const { Client: oldClient, ClientOptions } = require('discord.js')
const { BrowserWindow } = require('electron')
const loadEvents = require('./EventLoader')

class Client extends oldClient {
	/**
	 *
	 * @param {ClientOptions} clientOptions
	 * @param {BrowserWindow} mainWindow
	 */
	constructor(clientOptions, mainWindow) {
		super(clientOptions)
		this.mainWindow = mainWindow

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
		}
		return data
	}
}

module.exports = Client
