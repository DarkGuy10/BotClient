import type {
	Awaitable,
	ClientEvents,
	FetchMessagesOptions,
	MessageCreateOptions,
	MessagePayload,
} from 'discord.js'

export type APIStatus = boolean

export type APIResource_Invalid<T, condition = boolean> = {
	error: condition
	data: condition extends true ? {} : T
}

export type APIResource<T> =
	| {
			error: true
			data: {}
	  }
	| {
			error: false
			data: T
	  }

export interface StrippedUserSchema {
	username: string
	id: string
	avatarURL: string
}

export interface ClientUserData {
	id: string
	username: string
	globalName: string | null
	displayName: string
	avatarURL: string
}

export interface Guild {
	name: string
	id: string
	iconURL: string | null
}

export interface APIError {
	name: 'string'
	message: 'string'
	code: 'string'
	stack: 'string'
}

export interface IConduitAPI {
	Action: {
		login: (token: string) => Promise<APIStatus>
		loginWithId: (userId: string) => Promise<APIStatus>
		logout: () => Promise<APIStatus>
		deleteSavedUser: (userId: string) => Promise<APIStatus>
		messageCreate: (
			options: string | MessagePayload | MessageCreateOptions
		) => Promise<APIStatus>
		messageDelete: (messageId: string) => Promise<APIStatus>
	}
	Resource: {
		savedUserData: () => Promise<
			APIResource<{ savedUsers: StrippedUserSchema[] }>
		>
		clientUserData: () => Promise<APIResource<{ clientUser: ClientUserData }>>
		guildsAll: () => Promise<APIResource<{ guilds: Guild[] }>>
		guildChannelsAll: () => Promise<APIResource<any>>
		dmChannelsAll: () => Promise<APIResource<any>>
		messagesBulk: (
			fetchOptions: FetchMessagesOptions
		) => Promise<APIResource<any>>
		guildMembersAll: () => Promise<APIResource<any>>
	}
	Navigate: {
		guild: (guildId: string) => Promise<APIResource<any>>
		channel: (
			channelOrUserId: string,
			isDM = false
		) => Promise<APIResource<any>>
	}
	Callback: {
		error: (handleError: (error: APIError) => void) => void
		clearAll: () => void
	}
	DiscordEvent: {
		subscribe: <T extends keyof ClientEvents>(
			eventName: T,
			handler: (...args: ClientEvents[T]) => Awaitable<void>
		) => Promise<void>
		unsubscribe: <T extends keyof ClientEvents>(
			eventName: T,
			handler: (...args: ClientEvents[T]) => Awaitable<void>
		) => Promise<void>
	}
}

declare global {
	interface Window {
		Conduit: IConduitAPI
	}
}
