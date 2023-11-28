import type {
	FetchMessagesOptions,
	MessageCreateOptions,
	MessagePayload,
} from 'discord.js'

type APIStatus = boolean

interface APIResource<T> {
	data: T
	error: APIStatus
}

export interface IConduitAPI {
	Action: {
		login: (token: string) => Promise<APIStatus>
		logout: () => Promise<APIStatus>
		messageCreate: (
			options: string | MessagePayload | MessageCreateOptions
		) => Promise<APIStatus>
		messageDelete: (messageId: string) => Promise<APIStatus>
	}
	Resource: {
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
