/* eslint-disable no-unused-vars */
const path = require('path')
const Client = require('./structures/Client/Client')
const {
	serializeMessage,
	serializeGuild,
	serializeGuildChannel,
	serializeGuildMember,
} = require('./serializers')
const { app, BrowserWindow, shell, ipcMain } = require('electron')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')
const {
	Guild,
	BaseGuildTextChannel,
	DMChannel,
	ChannelType,
} = require('discord.js')
const Store = require('electron-store')
const appData = new Store()

//-----------------------------------------------------
// LOGGING
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

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
		icon: path.join(__dirname, 'icon.png'),
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
		if (
			url ===
			(isDev
				? 'http://localhost:3000/'
				: `file://${path.join(__dirname, '../build/index.html')}`)
		)
			return
		console.log(url)
		event.preventDefault()
		shell.openExternal(url)
	})

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	if (isDev) {
		const devTools = new BrowserWindow()
		mainWindow.webContents.setDevToolsWebContents(devTools.webContents)
		mainWindow.webContents.openDevTools({ mode: 'detach' })
	}
}

app.on('ready', () => {
	// Startup code if any goes here...

	log.info(`Node version: ${process.version}`)

	// This will be replaced with events in future
	autoUpdater.checkForUpdatesAndNotify()
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
/**
 * @type {DMChannel}
 */
let currentDM
// ^^ These will make things easier than sending channel and guild data for every invocations

ipcMain.on('login', async (event, token) => {
	// Early return if no token was provided
	if (!token) return
	if (client) {
		// Prevents client from getting duplicated
		client.destroy()
		client = null
	}
	client = new Client({ mainWindow: mainWindow })
	try {
		await client.login(token)
		if (appData.get('Storage.saveToken', true)) appData.set('token', token)
		event.reply('login', token)
	} catch (error) {
		log.error(error)
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
	const guilds = [...client.guilds.cache.values()].map(guild =>
		serializeGuild(guild)
	)
	return guilds
})

ipcMain.handle('channels', () => {
	const channels = [...currentGuild.channels.cache.values()].map(channel =>
		serializeGuildChannel(channel)
	)
	return channels
})

ipcMain.handle('dms', () => {
	try {
		const dms = [
			...client.channels.cache
				.filter(channel => channel.type === ChannelType.DM)
				.map(each => {
					return {
						...each,
						recipient: {
							...each.recipient,
							avatarURL: each.recipient.displayAvatarURL(),
						},
					}
				}),
		]
		return dms
	} catch (error) {
		return false
	}
})

ipcMain.handle('messages', async (event, fetchOptions) => {
	const channel = currentChannel || currentDM
	const promises = (await channel.messages.fetch(fetchOptions)).map(
		async message => serializeMessage(message)
	)

	const messages = []
	for (const promise of promises) messages.push(await promise)

	const hasReachedTop =
		messages.length < fetchOptions.limit ||
		!(
			await channel.messages.fetch({
				limit: 1,
				before: messages[messages.length - 1].id,
			})
		).size

	return { messages: messages, hasReachedTop: hasReachedTop }
})

ipcMain.handle('members', async () => {
	const members = [...currentChannel.members.values()].map(member =>
		serializeGuildMember(member)
	)
	return members
})

ipcMain.handle('selectGuild', async (event, id) => {
	try {
		currentGuild = await client.guilds.fetch(id)
		currentChannel = currentGuild.channels.cache.find(
			channel => channel.type === ChannelType.GuildText && channel.viewable
		)
		currentDM = null
		return {
			currentGuild: serializeGuild(currentGuild),
			currentChannel: serializeGuildChannel(currentChannel),
		}
	} catch (error) {
		log.error(error)
		mainWindow.webContents.send(
			'error',
			`Requested guild [ID:${id}] could not be fetched.\n ${error.message}`
		)
	}
})

ipcMain.handle('selectChannel', async (event, id) => {
	try {
		const newChannel = await client.channels.fetch(id)

		const allowedChannelTypes = [
			ChannelType.GuildText,
			ChannelType.GuildAnnouncement,
			ChannelType.DM,
		]
		if (!allowedChannelTypes.includes(newChannel.type))
			throw new Error(
				`Channel ${newChannel.name} [ID:${newChannel.id}] has an unsupported type: '${newChannel.type}'`
			)
		if (!newChannel.viewable)
			throw new Error(
				`Channel ${newChannel.name} [ID:${newChannel.id}] is not viewable (missing permissions).`
			)

		currentChannel = newChannel
		currentDM = null
		return serializeGuildChannel(currentChannel)
	} catch (error) {
		log.error(error)
		mainWindow.webContents.send('error', error.message)
	}
})

ipcMain.handle('selectDM', async (event, userID) => {
	try {
		const recipient = await client.users.fetch(userID)
		currentDM = await recipient.createDM()
		currentGuild = null
		currentChannel = null
		mainWindow.webContents.send('DMCreate')
		return {
			...currentDM,
			recipient: {
				...currentDM.recipient,
				avatarURL: currentDM.recipient.displayAvatarURL(),
			},
		}
	} catch (error) {
		log.error(error)
		mainWindow.webContents.send(
			'error',
			`Requested DM [userID:${userID}] could not be opened.\n ${error}`
		)
	}
})

ipcMain.on('messageCreate', async (event, messageOptions) => {
	try {
		if (currentChannel) await currentChannel.send(messageOptions)
		else if (currentDM) await currentDM.send(messageOptions)
		else
			throw new Error({
				code: 'NO_SELECTED_CHANNEL',
				message: 'Select a DM or GUILD_TEXT channel first',
			})
	} catch (error) {
		log.error(error)
		event.reply('error', `[${error.code}] ${error.message}`)
	}
})

ipcMain.on('messageDelete', async (event, messageId) => {
	try {
		if (currentChannel) await currentChannel.messages.delete(messageId)
		else if (currentDM) await currentDM.messages.delete(messageId)
		else
			throw new Error({
				code: 'NO_SELECTED_CHANNEL',
				message: 'Select a DM or GUILD_TEXT channel first',
			})
	} catch (error) {
		log.error(error)
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

// Specially added for saving current token
// Since it should not leak from App state
ipcMain.on('saveCurrentToken', () => {
	appData.set('token', client.token)
})

ipcMain.handle('fetchUser', async (event, id) => {
	try {
		const user = await client.users.fetch(id)
		return {
			...user,
			isClientUser: user.id === client.user.id,
			avatarURL: user.displayAvatarURL(),
		}
	} catch (error) {
		return false
	}
})

ipcMain.handle('mention', async (event, id, type, message) => {
	try {
		let fetched
		switch (type) {
			case 'channel':
				fetched = await client.channels.fetch(id)
				break

			case 'role':
				fetched = await client.guilds.cache.get(message.guildId).roles.fetch(id)
				break

			case 'memberOrUser':
				fetched = message.guildId
					? serializeGuildMember(
							await client.guilds.cache.get(message.guildId).members.fetch(id)
						) || (await client.users.fetch(id))
					: await client.users.fetch(id)
				break

			default:
				fetched = null
		}
		return fetched
	} catch (error) {
		return null
	}
})
