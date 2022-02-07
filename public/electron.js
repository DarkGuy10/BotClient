/* eslint-disable no-unused-vars */
const path = require('path')
const Client = require('./structures/Client/Client')
const { app, BrowserWindow, shell, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const { Guild, BaseGuildTextChannel } = require('discord.js')
const Store = require('electron-store')
const appData = new Store()

/**
 * @type {BrowserWindow}
 */
let mainWindow = null
/**
 * @type {Client}
 */
let client = null

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: path.join(__dirname, 'logo.png'),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`
	)
	mainWindow.maximize()
	mainWindow.setMenu(null)

	mainWindow.webContents.on('will-navigate', (event, url) => {
		event.preventDefault()
		shell.openExternal(url)
	})

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' })
}

app.on('ready', () => {
	// Startup code if any goes here...
	console.log(process.version)
	createMainWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// IPC communications
/**
 * @type {BaseGuildTextChannel}
 */
let currentChannel
/**
 * @type {Guild}
 */
let currentGuild
// ^^ These will make things easier than sending channel and guild data for every invocations

ipcMain.on('login', async (event, token) => {
	if (client) {
		// Prevents client from getting duplicated
		client.destroy()
		client = null
	}
	client = new Client(
		{
			intents: [
				'GUILDS',
				'DIRECT_MESSAGES',
				'GUILD_MESSAGES',
				'GUILD_MEMBERS',
				'GUILD_PRESENCES',
				'GUILD_EMOJIS_AND_STICKERS',
			],
		},
		mainWindow
	)
	try {
		await client.login(token)
		if (appData.get('Storage.saveToken', true)) appData.set('token', token)
		event.reply('login', token)
		client.once('ready', () => {
			event.reply('ready', client.clientUserData)
		})
	} catch (error) {
		console.log(error)
		event.reply('error', `[${error.code}] ${error.message}`)
		if (appData.has('token')) {
			event.reply('forcedAppStateUpdate', { token: '' })
			appData.delete('token')
		}
	}
})

ipcMain.on('logout', event => {
	appData.delete('token')
	client.destroy()
	client = null
	event.reply('logout')
})

ipcMain.handle('guilds', () => {
	const guilds = [...client.guilds.cache.values()].map(guild => {
		return {
			...guild,
			iconURL: guild.iconURL(),
		}
	})
	return guilds
})

ipcMain.handle('channels', () => {
	const channels = [...currentGuild.channels.cache.values()].map(channel => {
		return {
			...channel,
			viewable: channel.viewable,
			position: channel.position,
			isPrivate: !channel
				.permissionsFor(channel.guild.roles.everyone)
				.has('VIEW_CHANNEL'),
			isRules: channel.id === channel.guild.rulesChannelID,
		}
	})
	return channels
})

ipcMain.handle('messages', async (event, limit) => {
	const promises = (
		await currentChannel.messages.fetch({
			limit: limit,
		})
	).map(async message => {
		let repliesTo
		if (message.type === 'REPLY') repliesTo = await message.fetchReference()
		return {
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
			repliesTo:
				message.type === 'REPLY'
					? {
							...repliesTo.toJSON(),
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
										displayName:
											repliesTo.member.displayName,
								  },
					  }
					: null,
		}
	})

	const messages = []
	for (const promise of promises) messages.push(await promise)
	return messages
})

ipcMain.handle('members', async () => {
	const members = [...currentChannel.members.values()].map(member => {
		return {
			...member,
			displayName: member.displayName,
			presence: member.presence,
			color: member.displayColor,
			isHoisted: member.roles.hoist ? true : false,
			isVerifiedBot: member.user.flags?.has('VERIFIED_BOT'),
			roles: {
				...member.roles,
				hoist: {
					...member.roles.hoist,
					position: member.roles.hoist?.position,
				},
			},
			avatarURL: member.user.displayAvatarURL(),
		}
	})
	return members
})

ipcMain.handle(
	'selectGuild',
	async (event, id = client.guilds.cache.first().id) => {
		try {
			currentGuild = await client.guilds.fetch(id)
			currentChannel = currentGuild.channels.cache.find(
				channel => channel.type === 'GUILD_TEXT' && channel.viewable
			)
			return {
				currentGuild: currentGuild,
				currentChannel: currentChannel,
			}
		} catch (error) {
			console.log(error)
			mainWindow.webContents.send(
				'error',
				`Requested guild [ID:${id}] could not be fetched.\n ${error.message}`
			)
		}
	}
)

ipcMain.handle('selectChannel', async (event, id) => {
	try {
		currentChannel = await client.channels.fetch(id)
		return {
			...currentChannel,
			viewable: currentChannel.viewable,
		}
	} catch (error) {
		console.log(error)
		mainWindow.webContents.send(
			'error',
			`Requested channel [ID:${id}] could not be fetched.\n ${error}`
		)
	}
})

ipcMain.on('messageCreate', async (event, messageOptions) => {
	try {
		await currentChannel.send(messageOptions)
	} catch (error) {
		console.log(error)
		event.reply('error', `[${error.code}] ${error.message}`)
	}
})

ipcMain.on('AppData', (event, method, arg) => {
	switch (method) {
		case 'set':
			appData.set(arg[0], arg[1])
			break
		case 'get':
			event.returnValue = appData.get(arg[0], arg[1])
			break
		case 'has':
			event.returnValue = appData.has(arg)
			break
		case 'delete':
			appData.delete(arg)
			break
		default:
	}
})

ipcMain.on('fetchUser', async (event, id) => {
	event.returnValue = await client.users.fetch(id)
})
