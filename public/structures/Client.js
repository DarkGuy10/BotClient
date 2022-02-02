/* eslint-disable no-unused-vars */
const { Client: oldClient, ClientOptions } = require('discord.js')
const { BrowserWindow } = require('electron')

class Client extends oldClient {
	/**
	 *
	 * @param {ClientOptions} clientOptions
	 * @param {BrowserWindow} mainWindow
	 */
	constructor(clientOptions, mainWindow) {
		super(clientOptions)
		this.mainWindow = mainWindow

		this.on('messageCreate', async message => {
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
			}
			if (message.type === 'REPLY') {
				const repliesTo = await message.fetchReference()
				sendObject['repliesTo'] = {
					...repliesTo,
					author: {
						...repliesTo.author,
						avatarURL: repliesTo.author.displayAvatarURL(),
						isVerifiedBot:
							repliesTo.author.flags?.has('VERIFIED_BOT'),
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
			this.transmit('messageCreate', sendObject)
		})

		this.on('error', error => {
			this.transmit('error', `[${error.code}] ${error.message}`)
		})
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
			added: {
				displayAvatarURL: this.user.displayAvatarURL(),
			},
		}
		return data
	}
}

module.exports = Client
