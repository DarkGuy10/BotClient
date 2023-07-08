import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import electronIsDev from 'electron-is-dev'
import Client from '@/classes/Client'
import { fetchPrivilegedIntents, serializeObject } from '@/utils'
import ElectronStore from './classes/ElectronStore'
import ClientError from './classes/ClientError'
import { ClientErrorCodes } from './typings'
import Router from './classes/Router'
import { ChannelType, FetchMessagesOptions, GuildChannel } from 'discord.js'

let appWindow: BrowserWindow | null = null
let client: Client | null = null
let router: Router | null = null
const AppData = new ElectronStore()
const [appPreference, userStore] = AppData.createMultipleSlices(
	'appPreference',
	'savedUsers'
)

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info'
		autoUpdater.logger = log
		autoUpdater.checkForUpdatesAndNotify()
	}
}

if (electronIsDev) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('electron-debug')({
		showDevTools: true,
		devToolsMode: 'right',
	})
}

const spawnAppWindow = async () => {
	const RESOURCES_PATH = electronIsDev
		? path.join(__dirname, '../../assets')
		: path.join(process.resourcesPath, 'assets')

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths)
	}

	appWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: getAssetPath('icon.png'),
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	appWindow.loadURL(
		electronIsDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../../frontend/build/index.html')}`
	)
	appWindow.maximize()
	appWindow.setMenu(null)
	appWindow.show()
	appWindow.on('closed', () => {
		appWindow = null
	})
}

app.on('ready', () => {
	new AppUpdater()
	spawnAppWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

/*
 * ======================================================================================
 * Hours wasted: 7
 * ======================================================================================
 * Just spent the entire after afternoon trying to implement event loading from
 * separate files, and I give up...
 *
 * For anyone who tries to re-attempt this in the future and fails, please increment
 * that counter at the top of this comment.
 * ======================================================================================
 */

/*
 * ======================================================================================
 *                                IPC Main Events: Actions
 * ======================================================================================
 */

ipcMain.on('login-attempt', async (event, token) => {
	try {
		if (!appWindow) return
		if (client) {
			client.destroy()
			client = null
		}
		const privilegedIntents = (await fetchPrivilegedIntents(token)) || []
		client = new Client({ appWindow, privilegedIntents })
		router = new Router(client)
		await client.login(token)
		if (appPreference.get('tokenPersistence', true))
			client.on('ready', client => {
				userStore.set(client.user.id, {
					username: client.user.username,
					avatarUrl: client.user.displayAvatarURL(),
					token,
				})
			})
		event.reply('login-success')
	} catch (error) {
		log.error(error)
		event.reply('error', serializeObject(error))
		event.reply('login-error')
	}
})

ipcMain.on('logout-attempt', event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)
		userStore.delete(client.user.id)
		client.destroy()
		client = null
		event.reply('logout-success')
	} catch (error) {
		log.error(error)
		event.reply('error', serializeObject(error))
		event.reply('logout-error')
	}
})

/*
 * ======================================================================================
 *                                IPC Main Events: Resources
 * ======================================================================================
 */

ipcMain.handle('resource-guilds-all', async event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		const guilds = [...(await client.guilds.fetch()).values()].map(guild =>
			serializeObject(guild)
		)
		return guilds
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return []
	}
})

ipcMain.handle('resource-guild-channels-all', async event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		if (!router?.currentGuild)
			throw new ClientError(ClientErrorCodes.NOT_GUILD_CHANNEL)

		const guildChannels = [
			...(await router.currentGuild.channels.fetch()).values(),
		].map(channel => serializeObject(channel))
		return guildChannels
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return []
	}
})

ipcMain.handle('resource-dm-channels-all', async event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		const dmChannels = [
			...client.channels.cache
				.filter(channel => channel.type === ChannelType.DM)
				.map(channel => serializeObject(channel)),
		]
		return dmChannels
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return []
	}
})

ipcMain.handle(
	'resource-messages-bulk',
	async (event, fetchOptions: FetchMessagesOptions) => {
		try {
			if (!client?.isReady())
				throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

			if (!router?.currentChannel)
				throw new ClientError(ClientErrorCodes.NO_CURRENT_CHANNEL)

			if (!router.currentChannel.isTextBased())
				throw new ClientError(ClientErrorCodes.NOT_TEXT_BASED_CHANNEL)

			const messages = [
				...(await router.currentChannel.messages.fetch(fetchOptions)).values(),
			].map(message => serializeObject(message))

			const hasReachedTop =
				(fetchOptions.limit && messages.length < fetchOptions.limit) ||
				!(
					await router.currentChannel.messages.fetch({
						limit: 1,
						before: messages[messages.length - 1].id,
					})
				).size

			return { messages, hasReachedTop }
		} catch (error) {
			log.error(error)
			event.sender.send('error', serializeObject(error))
			return { messages: [], hasReachedTop: false }
		}
	}
)

ipcMain.handle('resource-guild-members-all', async event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		if (!router?.currentChannel)
			throw new ClientError(ClientErrorCodes.NO_CURRENT_CHANNEL)

		if (!(router.currentChannel instanceof GuildChannel))
			throw new ClientError(ClientErrorCodes.NOT_GUILD_CHANNEL)

		const members = [...router.currentChannel.members.values()].map(member =>
			serializeObject(member)
		)
		return members
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return []
	}
})

/*
 * ======================================================================================
 *                                IPC Main Events: Navigate
 * ======================================================================================
 */

ipcMain.handle('navigate-guild-attempt', async (event, guildId: string) => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		const targetGuild = await client.guilds.fetch(guildId)

		if (!targetGuild) throw new ClientError(ClientErrorCodes.CANNOT_FETCH_GUILD)

		const targetChannel = targetGuild.channels.cache.find(
			channel => channel.type === ChannelType.GuildText && channel.viewable
		)

		if (!targetChannel)
			throw new ClientError(ClientErrorCodes.NO_VIEWABLE_CHANNEL_IN_GUILD)

		router?.navigateTo(targetChannel)
		return {
			currentGuild: serializeObject(router?.currentGuild),
			currentChannel: serializeObject(router?.currentChannel),
		}
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		event.sender.send('navigate-guild-error')
	}
})
