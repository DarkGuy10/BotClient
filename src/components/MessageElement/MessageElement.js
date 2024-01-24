import { Component } from 'react'
import { ChannelType, MessageType } from 'discord-api-types/v10'
import styles from './MessageElement.module.css'
import {
	DiscordAttachment,
	DiscordEmbed,
	DiscordEmbedDescription,
	DiscordEmbedField,
	DiscordEmbedFields,
	DiscordEmbedFooter,
	DiscordMessage,
	DiscordReply,
	DiscordSystemMessage,
	DiscordTenorVideo,
} from '@skyra/discord-components-react'
import { parseTimestamp, parseTwemojis, decimalToHexColor } from './../../utils'
import { MessageAction } from '..'
const { toHTML } = require('@darkguy10/discord-markdown')
const { ipcRenderer } = window.require('electron')
const HtmlToReactParser = require('html-to-react').Parser
const htmlToReactParser = new HtmlToReactParser()

class MessageElement extends Component {
	constructor(props) {
		super(props)

		this.state = {
			fetchedMentions: {
				memberOrUser: new Map(),
				role: new Map(),
				channel: new Map(),
			},
			hover: false,
		}

		this.updateHover = newHoverState =>
			this.setState({ ...this.state, hover: newHoverState })

		this.fetchMention = (id, type) => {
			if (this.state.fetchedMentions[type].has(id))
				return this.state.fetchedMentions[type].get(id)

			ipcRenderer.invoke('mention', id, type, this.props.message).then(res => {
				const { fetchedMentions } = this.state
				let newMentions = {
					...fetchedMentions,
				}
				newMentions[type].set(id, res)
				this.setState({
					...this.state,
					fetchedMentions: newMentions,
				})
			})
		}

		this.parseDiscordMarkdown = (
			content = this.props.message.content,
			isForEmbed = false
		) => {
			const { mentions } = this.props.message
			const channels = new Map(mentions.channels)
			const users = new Map(mentions.users)
			const members = new Map(mentions.members)
			const roles = new Map(mentions.roles)

			return htmlToReactParser.parse(
				toHTML(content, {
					embed: isForEmbed,
					discordCallback: {
						user: node => {
							const memberOrUser =
								members.get(node.id) ||
								users.get(node.id) ||
								this.fetchMention(node.id, 'memberOrUser')
							return memberOrUser
								? `<discord-mention type='user'>${escape(
										memberOrUser?.displayName || memberOrUser?.username
									)}</discord-mention>`
								: // the span tags below prevent removal of prepended '@'
									// on state updates
									`<span><discord-mention type='user'>${escape(
										node.id
									)}</discord-mention></span>`
						},
						role: node => {
							const role =
								roles.get(node.id) || this.fetchMention(node.id, 'role')
							return role
								? `<discord-mention type='role' color=${decimalToHexColor(
										role.color
									)}>${escape(role.name)}</discord-mention>`
								: '@deleted-role'
						},
						channel: node => {
							const channel =
								channels.get(node.id) || this.fetchMention(node.id, 'channel')
							return channel
								? `<discord-mention type='${
										channel.type === ChannelType.GuildVoice
											? 'voice'
											: 'channel'
									}'>${escape(channel.name)}</discord-mention>`
								: '#deleted-channel'
						},
						emoji: node =>
							`<discord-custom-emoji embed-emoji="${isForEmbed}" url="https://cdn.discordapp.com/emojis/${escape(
								node.id
							)}.${
								node.animated ? 'gif' : 'webp'
							}?size=48&quality=lossless" name="${escape(
								node.name
							)}"></discord-custom-emoji>`,
						everyone: () =>
							`<discord-mention type='user'>everyone</discord-mention>`,
						here: () => `<discord-mention type='user'>here</discord-mention>`,
					},
				})
			)
		}
	}

	render() {
		const {
			message,
			handleReply,
			replying,
			selectDM,
			createTooltip,
			destroyTooltip,
			createContextMenu,
			destroyContextMenu,
		} = this.props
		const {
			embeds,
			type,
			author,
			member,
			createdTimestamp,
			editedTimestamp,
			repliesTo,
			stickers,
			attachments,
			mentions,
			system,
		} = message
		const { hover } = this.state

		const allowedImageTypes = [
			'image/png',
			'image/jpeg',
			'image/gif',
			'image/webp',
		]

		const imageAttachments = [...attachments.values()].filter(attachment =>
			allowedImageTypes.includes(attachment.contentType)
		)

		return (
			<>
				{type === MessageType.UserJoin ? (
					<DiscordSystemMessage
						type="join"
						className="base-discord-message"
						timestamp={parseTimestamp(createdTimestamp)}
					>
						A wild{' '}
						<i
							style={{
								color: member?.color ? member.hexColor : '#fff',
							}}
						>
							{member?.displayName || author.username}
						</i>{' '}
						has appeared!
					</DiscordSystemMessage>
				) : type === MessageType.GuildBoost ? (
					<DiscordSystemMessage
						type="boost"
						className="base-discord-message"
						timestamp={parseTimestamp(createdTimestamp)}
					>
						<i
							style={{
								color: member?.color ? member.hexColor : '#fff',
							}}
						>
							{member?.displayName || author.username}
						</i>{' '}
						just boosted the server!
					</DiscordSystemMessage>
				) : (
					<DiscordMessage
						author={member?.displayName || author.username}
						avatar={author.avatarURL}
						bot={author.bot}
						verified={author.isVerifiedBot}
						timestamp={parseTimestamp(createdTimestamp)}
						edited={editedTimestamp ? true : false}
						roleColor={member?.color ? member.hexColor : '#fff'}
						highlight={mentions.me}
						onMouseEnter={() => this.updateHover(true)}
						onMouseLeave={() => this.updateHover(false)}
						className={`base-discord-message ${
							hover ? styles.messageHover : ''
						} ${replying ? styles.replying : ''}`}
					>
						{type === MessageType.Reply && repliesTo ? (
							<DiscordReply
								slot="reply"
								author={
									repliesTo.member?.displayName ?? repliesTo.author.username
								}
								avatar={repliesTo.author.avatarURL}
								bot={repliesTo.author.bot}
								verified={repliesTo.author.isVerifiedBot}
								edited={repliesTo.editedTimestamp ? true : false}
								roleColor={
									repliesTo.member?.color ? repliesTo.member.hexColor : ''
								}
							>
								{parseTwemojis(shorten(repliesTo))}
							</DiscordReply>
						) : null}

						{parseTwemojis(this.parseDiscordMarkdown())}

						{stickers.map((sticker, key) => (
							<DiscordAttachment
								key={key}
								slot="attachments"
								url={sticker.url}
								width={150}
								alt={sticker.name}
							/>
						))}

						{imageAttachments.map((item, key) => {
							const biggerSide = item.height > item.width ? 'height' : 'width'
							const allowance = biggerSide === 'height' ? 300 : 400
							let sizeOptions = {}
							sizeOptions[biggerSide] = Math.min(item[biggerSide], allowance)
							return (
								<DiscordAttachment
									key={key}
									slot="attachments"
									url={item.url}
									alt={item.name}
									{...sizeOptions}
								/>
							)
						})}
						{embeds.map((embed, key) => {
							const {
								provider,
								video,
								author,
								hexColor,
								title,
								footer,
								image,
								url,
								timestamp,
								thumbnail,
								description,
								fields,
							} = embed
							if (provider?.name === 'Tenor') {
								const biggerSide =
									video.height > video.width ? 'height' : 'width'
								const allowance = biggerSide === 'height' ? 300 : 400
								let options = {
									slot: 'attachments',
									url: embed.video.url,
								}
								options[biggerSide] = Math.min(video[biggerSide], allowance)
								return <DiscordTenorVideo key={key} {...options} />
							}
							let options = {}
							let content = ''
							let footerOptions = { slot: 'footer' }
							options['slot'] = 'embeds'
							if (author?.name) options['authorName'] = author.name

							if (author?.iconURL) options['authorImage'] = author.iconURL

							if (author?.url) options['authorUrl'] = author.url

							if (hexColor) options['color'] = hexColor

							if (title) options['embedTitle'] = title

							if (image?.url) options['image'] = image.url

							if (url) options['url'] = embed.url

							if (timestamp)
								footerOptions['timestamp'] = parseTimestamp(timestamp)
							if (footer?.iconURL) footerOptions['footerImage'] = footer.iconURL

							if (video) {
								options['video'] = video.url
								if (provider?.name) options['provider'] = provider.name
								if (thumbnail?.url) options['image'] = thumbnail.url
							} else {
								if (embed.thumbnail?.url)
									options['thumbnail'] = embed.thumbnail.url
								content = description
							}

							let lastFieldIndex = 0
							return (
								<DiscordEmbed key={key} {...options}>
									{content ? (
										<DiscordEmbedDescription slot="description">
											{parseTwemojis(this.parseDiscordMarkdown(content, true))}
										</DiscordEmbedDescription>
									) : null}
									{fields?.length ? (
										<DiscordEmbedFields slot="fields">
											{fields.map((field, key) => {
												let fieldOptions = {}
												fieldOptions['fieldTitle'] = field.name
												if (field.inline) {
													fieldOptions['inline'] = true
													const index =
														!lastFieldIndex || lastFieldIndex === 3
															? 1
															: lastFieldIndex + 1
													fieldOptions['inlineIndex'] = index
													lastFieldIndex = index
												} else lastFieldIndex = 0
												return (
													<DiscordEmbedField {...fieldOptions} key={key}>
														{field.value}
													</DiscordEmbedField>
												)
											})}
										</DiscordEmbedFields>
									) : null}
									{footer?.text ? (
										<DiscordEmbedFooter {...footerOptions}>
											{footer?.text ? parseTwemojis(footer.text) : ''}
										</DiscordEmbedFooter>
									) : null}
								</DiscordEmbed>
							)
						})}
					</DiscordMessage>
				)}
				{!system && (
					<MessageAction
						message={message}
						handleReply={handleReply}
						createTooltip={createTooltip}
						destroyTooltip={destroyTooltip}
						createContextMenu={createContextMenu}
						destroyContextMenu={destroyContextMenu}
						selectDM={selectDM}
						updateHover={this.updateHover}
						hover={hover}
					/>
				)}
			</>
		)
	}
}

export default MessageElement

const escape = htmlStr => {
	return htmlStr
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

const shorten = reference => {
	const allowance = 80 - reference.author.username.length
	return (
		reference.content.substring(0, allowance) +
		(reference.content.length >= allowance ? '...' : '')
	)
}
