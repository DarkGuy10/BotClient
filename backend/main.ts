import path from 'node:path'
import { app, BrowserWindow, ipcMain } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import electronIsDev from 'electron-is-dev'
import Client from './classes/Client'
import { fetchPrivilegedIntents, serializeObject } from '@/utils'
import ElectronStore from 'electron-store'
import ClientError from './classes/ClientError'
import { AppDataSchema, ClientErrorCodes } from './typings'
import Router from './classes/Router'
import {
	Awaitable,
	Channel,
	ChannelType,
	ClientEvents,
	ClientUser,
	FetchMessagesOptions,
	GuildChannel,
	MessageCreateOptions,
	MessagePayload,
} from 'discord.js'

let appWindow: BrowserWindow | null = null
let client: Client | null = null
let router: Router | null = null
const AppData = new ElectronStore<AppDataSchema>()

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
			preload: path.join(__dirname, 'preload.js'),
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
 *                                IPC Main Events: Action
 * ======================================================================================
 */

ipcMain.handle(
	'action:login',
	async (event, tokenOrId: string, withId = false) => {
		try {
			if (!appWindow) return
			if (client) {
				client.destroy()
				client = null
			}
			const token = withId
				? AppData.get('savedUsers')[tokenOrId]?.token
				: tokenOrId
			if (withId && !token)
				throw new ClientError(ClientErrorCodes.SAVED_USER_NOT_FOUND)
			const privilegedIntents = (await fetchPrivilegedIntents(token)) || []
			client = new Client({ appWindow, privilegedIntents })
			router = new Router(client)
			await client.login(token)
			await client.waitTillReady()
			const clientUser = client.user as ClientUser // typecast because client will be Client<true> after waitTillReady()
			console.log(`[ + ] Logged in as @${clientUser.username}`)
			if (AppData.get('appPreferences.tokenPersistence', true))
				AppData.set(`savedUsers.${clientUser.id}`, {
					username: clientUser.username,
					id: clientUser.id,
					avatarURL: clientUser.displayAvatarURL(),
					token,
				})
			return true
		} catch (error) {
			log.error(error)
			event.sender.send('error', serializeObject(error))
			return false
		}
	}
)

ipcMain.handle('action:logout', event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)
		client.destroy()
		client = null
		return true
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return false
	}
})

ipcMain.handle(
	'action:messageCreate',
	async (event, options: string | MessagePayload | MessageCreateOptions) => {
		try {
			if (!client?.isReady())
				throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

			if (!router?.currentChannel)
				throw new ClientError(ClientErrorCodes.NO_CURRENT_CHANNEL)

			await router.currentChannel.send(options)
			return true
		} catch (error) {
			log.error(error)
			event.sender.send('error', serializeObject(error))
			return false
		}
	}
)

ipcMain.handle('action:delete-saved-user', (event, userId: string) => {
	try {
		if (!AppData.has(`savedUsers.${userId}`))
			throw new ClientError(ClientErrorCodes.SAVED_USER_NOT_FOUND)
		AppData.delete(`savedUsers.${userId}` as keyof AppDataSchema)
		return true
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return false
	}
})

ipcMain.handle('action:messageDelete', async (event, messageId: string) => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		if (!router?.currentChannel)
			throw new ClientError(ClientErrorCodes.NO_CURRENT_CHANNEL)

		await router.currentChannel.messages.delete(messageId)
		return true
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return false
	}
})

/*
 * ======================================================================================
 *                                IPC Main Events: Resource
 * ======================================================================================
 */

ipcMain.handle('resource:saved-user-data', event => {
	try {
		const savedUsers = Object.values(AppData.get('savedUsers')).map(
			({ id, username, avatarURL }) => {
				return { id, username, avatarURL }
			}
		)
		return { data: { savedUsers }, error: false }
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return { data: { savedUsers: [] }, error: true }
	}
})

ipcMain.handle('resource:client-user-data', event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)
		const clientUser = {
			id: client.user.id,
			username: client.user.username,
			globalName: client.user.globalName,
			displayName: client.user.displayName,
			avatarURL: client.user.displayAvatarURL(),
		}
		return { data: { clientUser }, error: false }
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return { data: { clientUser: {} }, error: true }
	}
})

ipcMain.handle('resource:guilds-all', async event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		const guilds = [...(await client.guilds.fetch()).values()].map(guild =>
			serializeObject(guild)
		)
		return { data: { guilds }, error: false }
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return { data: { guilds: [] }, error: true }
	}
})

ipcMain.handle('resource:guild-channels-all', async event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		if (!router?.currentGuild)
			throw new ClientError(ClientErrorCodes.NOT_GUILD_CHANNEL)

		const guildChannels = [
			...(await router.currentGuild.channels.fetch()).values(),
		].map(channel => serializeObject(channel))
		return { data: { guildChannels }, error: false }
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return { data: { guildChannels: [] }, error: true }
	}
})

ipcMain.handle('resource:dm-channels-all', async event => {
	try {
		if (!client?.isReady())
			throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

		const dmChannels = [
			...client.channels.cache
				.filter(channel => channel.type === ChannelType.DM)
				.map(channel => serializeObject(channel)),
		]
		return { data: { dmChannels }, error: false }
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return { data: { dmChannels: [] }, error: true }
	}
})

ipcMain.handle(
	'resource:messages-bulk',
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

			return { data: { messages, hasReachedTop }, error: false }
		} catch (error) {
			log.error(error)
			event.sender.send('error', serializeObject(error))
			return { data: { messages: [], hasReachedTop: false }, error: true }
		}
	}
)

ipcMain.handle('resource:guild-members-all', async event => {
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
		return { data: { members }, error: false }
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return { data: { members: [] }, error: true }
	}
})

/* Events related to app data management go here*/

/*
 * ======================================================================================
 *                                IPC Main Events: Navigation
 * ======================================================================================
 */

ipcMain.handle('navigate:guild', async (event, guildId: string) => {
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

		if (!targetChannel.isTextBased())
			throw new ClientError(ClientErrorCodes.NOT_TEXT_BASED_CHANNEL)

		router?.navigateTo(targetChannel)
		return {
			data: {
				currentGuild: serializeObject(router?.currentGuild),
				currentChannel: serializeObject(router?.currentChannel),
			},
			error: false,
		}
	} catch (error) {
		log.error(error)
		event.sender.send('error', serializeObject(error))
		return { data: { currentGuild: {}, currentChannel: {} }, error: true }
	}
})

ipcMain.handle(
	'navigate:channel',
	async (event, channelOrUserId: string, isDM = false) => {
		try {
			if (!client?.isReady())
				throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)

			let targetChannel: Channel | null

			if (isDM) {
				const recipient = await client.users.fetch(channelOrUserId)

				if (!recipient)
					throw new ClientError(ClientErrorCodes.CANNOT_FETCH_USER)

				try {
					targetChannel = await recipient.createDM()
				} catch (error) {
					throw new ClientError(ClientErrorCodes.CANNOT_CREATE_DM)
				}
			} else {
				targetChannel = await client.channels.fetch(channelOrUserId)

				if (!targetChannel || !(targetChannel instanceof GuildChannel))
					throw new ClientError(ClientErrorCodes.CANNOT_FETCH_CHANNEL)

				if (!targetChannel.isTextBased())
					throw new ClientError(ClientErrorCodes.NOT_TEXT_BASED_CHANNEL)

				if (!targetChannel.viewable)
					throw new ClientError(ClientErrorCodes.MISSING_PERMISSIONS)
			}

			router?.navigateTo(targetChannel)
			return {
				data: { currentChannel: serializeObject(router?.currentChannel) },
				error: false,
			}
		} catch (error) {
			log.error(error)
			event.sender.send('error', serializeObject(error))
			return { data: { currentChannel: {} }, error: true }
		}
	}
)

/*
 * ======================================================================================
 *                                IPC Main Events: DiscordEvent Subscriptions
 * ======================================================================================
 */

ipcMain.handle(
	'discord-event:subscription',
	async <T extends keyof ClientEvents>(
		event: Electron.IpcMainInvokeEvent,
		type: 'on' | 'off',
		eventName: T,
		handler: (...args: ClientEvents[T]) => Awaitable<void>
	) => {
		try {
			if (!client?.isReady)
				throw new ClientError(ClientErrorCodes.CLIENT_NOT_READY)
			client[type](eventName, handler)
		} catch (error) {
			log.error(error)
			event.sender.send('error', serializeObject(error))
		}
	}
)
