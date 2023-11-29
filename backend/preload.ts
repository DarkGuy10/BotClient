import type {
	FetchMessagesOptions,
	MessageCreateOptions,
	MessagePayload,
} from 'discord.js'
import { contextBridge, ipcRenderer } from 'electron'

/*
 * ======================================================================================
 *                                Conduit: ContextBridge API
 * ======================================================================================
 */

contextBridge.exposeInMainWorld('Conduit', {
	Action: {
		login: (token: string) => ipcRenderer.invoke('action:login', token),
		loginWithId: (userId: string) =>
			ipcRenderer.invoke('action:login', userId, true),
		logout: () => ipcRenderer.invoke('action:logout'),
		deleteSavedUser: (userId: string) =>
			ipcRenderer.invoke('action:delete-saved-user', userId),
		messageCreate: (options: string | MessagePayload | MessageCreateOptions) =>
			ipcRenderer.invoke('action:messageCreate', options),
		messageDelete: (messageId: string) =>
			ipcRenderer.invoke('action:messageDelete', messageId),
	},
	Resource: {
		savedUserData: () => ipcRenderer.invoke('resource:saved-user-data'),
		guildsAll: () => ipcRenderer.invoke('resource:guilds-all'),
		guildChannelsAll: () => ipcRenderer.invoke('resource:guild-channels-all'),
		dmChannelsAll: () => ipcRenderer.invoke('resource:dm-channels-all'),
		messagesBulk: (fetchOptions: FetchMessagesOptions) =>
			ipcRenderer.invoke('resource:messages-bulk', fetchOptions),
		guildMembersAll: () => ipcRenderer.invoke('resource:guild-members-all'),
	},
	Navigate: {
		guild: (guildId: string) => ipcRenderer.invoke('navigate:guild', guildId),
		channel: (channelOrUserId: string, isDM = false) =>
			ipcRenderer.invoke('navigate:channel', channelOrUserId, isDM),
	},
})
