import { GuildChannel, TextBasedChannel } from 'discord.js'
import Client from './Client'

export default class Router {
	private _currentChannel: TextBasedChannel | null
	client: Client

	constructor(client: Client) {
		this.client = client
		this._currentChannel = null
	}

	navigateTo(targetChannel?: TextBasedChannel) {
		this._currentChannel = targetChannel ?? null
		return this._currentChannel
	}

	get currentChannel() {
		return this._currentChannel
	}

	get currentGuild() {
		if (this._currentChannel instanceof GuildChannel)
			return this._currentChannel.guild
		return
	}
}
