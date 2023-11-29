import type {
	FetchMessagesOptions,
	MessageCreateOptions,
	MessagePayload,
} from 'discord.js'

export type APIStatus = boolean

export interface APIResource<T> {
	data: T
	error: APIStatus
}

export interface StrippedUserSchema {
	username: string
	id: string
	avatarURL: string
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
		guildsAll: () => Promise<APIResource<any>>
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
}

declare global {
	interface Window {
		Conduit: IConduitAPI
	}
}
