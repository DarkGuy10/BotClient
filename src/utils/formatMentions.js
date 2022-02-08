import reactStringReplace from 'react-string-replace'
const { DiscordMention } = require('@skyra/discord-components-react')
const { decimalToHexColor } = require('.')
const {
	GENERAL_MENTION_PATTERN,
	EVERYONE_PATTERN,
	USERS_PATTERN,
	ROLES_PATTERN,
	CHANNELS_PATTERN,
} = require('./constants')
const { ipcRenderer } = window.require('electron')

const formatMentions = (message, content = message.content) => {
	const { mentions } = message
	const channels = new Map(mentions.channels)
	const users = new Map(mentions.users)
	const members = new Map(mentions.members)
	const roles = new Map(mentions.roles)

	const matchProps = [
		[USERS_PATTERN, 'USER'],
		[ROLES_PATTERN, 'ROLE'],
		[CHANNELS_PATTERN, 'CHANNEL'],
		[EVERYONE_PATTERN, 'EVERYONE'],
	]

	let formatted = (
		<>
			{reactStringReplace(
				content,
				GENERAL_MENTION_PATTERN,
				(initialMatch, key) => {
					let match, matchType
					for (const [regex, type] of matchProps)
						if (regex.test(initialMatch)) {
							match = initialMatch.match(regex)[1]
							matchType = type
						}
					let renderedMention
					switch (matchType) {
						case 'USER':
							renderedMention = (
								<DiscordMention key={key} type={'user'}>
									{members.get(match)?.displayName ||
										users.get(match)?.username ||
										ipcRenderer.sendSync('fetchUser', match)
											?.username ||
										`<@${match}>`}
								</DiscordMention>
							)
							break
						case 'ROLE':
							const role = roles.get(match)
							renderedMention = role ? (
								<DiscordMention
									key={key}
									type={'role'}
									color={decimalToHexColor(role.color)}
								>
									{role.name}
								</DiscordMention>
							) : (
								'@deleted-role'
							)

							break
						case 'CHANNEL':
							const channel = channels.get(match)
							renderedMention = channel ? (
								<DiscordMention
									key={key}
									type={
										channel.type === 'GUILD_VOICE'
											? 'voice'
											: 'channel'
									}
								>
									{channel.name}
								</DiscordMention>
							) : (
								'#deleted-channel'
							)
							break
						case 'EVERYONE':
							renderedMention = (
								<DiscordMention key={key} type={'user'}>
									{match}
								</DiscordMention>
							)
							break
						default:
					}
					return renderedMention
				}
			)}
		</>
	)

	return formatted
}

export default formatMentions
