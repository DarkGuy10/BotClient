import { DiscordMessages } from '@skyra/discord-components-react'
import React, { Component, createRef } from 'react'
import styles from './Chat.module.css'
import { MessageElement, MessageField } from '..'
import {
	SVGChannels,
	SVGGithubLogo,
	SVGDiscordLogo,
	SVGHelp,
} from '../SVGHandler'
import { parseTwemojis } from '../../utils'
import MemberNav from '../MemberNav/MemberNav'
import { ChannelType } from 'discord-api-types/v10'
const { ipcRenderer } = window.require('electron')

const ChannelIcon = props => {
	const isPrivate = props.channel.isPrivate
	const isRules = props.channel.isRules
	const svgType = isRules
		? 'RULES'
		: `${props.channel.type}${isPrivate ? '_LIMITED' : ''}`
	return SVGChannels[svgType]
}

const ChannelStart = props => {
	const { name, isPrivate, type, recipient } = props.channel
	return (
		<div className={styles.channelStartContainer}>
			{type === ChannelType.DM ? (
				<img
					src={recipient.avatarURL}
					className={styles.channelStartIcon}
					alt={`${recipient.username}'s Avatar`}
				/>
			) : (
				<div className={styles.channelStartIcon}>
					<ChannelIcon channel={props.channel} />{' '}
				</div>
			)}
			<h1 className={styles.channelStartHeader}>
				{type === ChannelType.DM ? (
					recipient.username
				) : (
					<>Welcome to #{parseTwemojis(name)}!</>
				)}
			</h1>
			<div className={styles.channelStartDescription}>
				{type === ChannelType.DM ? (
					<>
						This is the beginning of your direct message history with{' '}
						<strong>@{recipient.username}</strong>.
					</>
				) : (
					<>
						This is the start of the #{parseTwemojis(name)}{' '}
						{isPrivate && <strong>private</strong>} channel.
					</>
				)}
			</div>
		</div>
	)
}

class Chat extends Component {
	_isMounted = false

	constructor(props) {
		super(props)
		this.initialState = {
			loadedMessages: [],
			hasReachedTop: false,
			replyingTo: null,
		}
		this.state = { ...this.initialState }

		this.messageRef = createRef()

		this.scrollToBottom = () => {
			this.messageRef.current.scrollTo({
				left: 0,
				top:
					this.messageRef.current.clientHeight +
					this.messageRef.current.scrollHeight,
			})
		}

		this.loadMessages = async fetchOptions => {
			// default fetchOptions for MessageManager#fetch looks like: {limit: 50}
			const { channel } = this.props
			const { loadedMessages } = this.state
			if (!channel) return
			if (!fetchOptions?.before) this.setState({ ...this.initialState })
			const { messages, hasReachedTop } = await ipcRenderer.invoke(
				'messages',
				fetchOptions
			)
			this.setState({
				...this.state,
				hasReachedTop: hasReachedTop,
				loadedMessages: fetchOptions?.before
					? [...loadedMessages, ...messages]
					: messages,
			})
		}

		this.handleReply = (message = null) => {
			this.setState({ ...this.state, replyingTo: message })
		}

		// Add new messages to loadedMessages *if* they belong from
		// the current channel
		ipcRenderer.on('messageCreate', (event, message) => {
			const { loadedMessages } = this.state
			const { channel } = this.props
			if (message.channelId === channel.id && this._isMounted)
				this.setState({
					...this.state,
					loadedMessages: [message, ...loadedMessages],
				})

			// Scroll to bottom *if* user is already fully scrolled *with* a
			// 50 pixel margin for snappy, unannoying autoscroll
			if (this.messageRef.current && this._isMounted) {
				// for some reason, messageRef gets unmounted, causing current to become undefined
				const { clientHeight, scrollHeight, scrollTop } =
					this.messageRef.current
				if (scrollTop + clientHeight >= scrollHeight - 50) this.scrollToBottom()
			}
		})

		// Remove messages from loadedMessages *if* they belong from
		// the current channel
		ipcRenderer.on('messageDelete', (event, messageId, channelId) => {
			const { loadedMessages } = this.state
			const { channel } = this.props
			if (channelId !== channel.id || !this._isMounted) return
			this.setState({
				...this.state,
				loadedMessages: loadedMessages.filter(
					message => message.id !== messageId
				),
			})
		})

		this.githubLinkRef = createRef()
		this.discordLinkRef = createRef()
		this.helpLinkRef = createRef()
	}

	componentDidMount() {
		this._isMounted = true
		this.loadMessages({ limit: 100 })
	}

	componentWillUnmount() {
		this._isMounted = false
		this.props.destroyTooltip()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.channel.id !== this.props.channel.id)
			this.loadMessages({ limit: 100 })
	}

	render() {
		const {
			channel,
			pushAlert,
			createTooltip,
			destroyTooltip,
			createContextMenu,
			destroyContextMenu,
			selectDM,
		} = this.props
		const { loadedMessages, replyingTo, hasReachedTop } = this.state

		// Prevents complete unloading during server switching
		if (!channel) return <div className={styles.chat}></div>

		return (
			<div className={styles.chat}>
				<section className={styles.titleContainer}>
					<div className={styles.children}>
						<div className={styles.iconWrapper}>
							<ChannelIcon channel={channel} />
						</div>
						<h3 className={styles.title}>
							{parseTwemojis(channel.name || channel.recipient.username)}
						</h3>
						{channel.topic ? (
							<>
								<div className={styles.divider}></div>
								<div className={styles.topic}>
									{parseTwemojis(channel.topic)}
								</div>
							</>
						) : null}
					</div>
					<div className={styles.toolbar}>
						<div
							className={`${styles.icon} ${styles.iconWrapper}`}
							ref={this.discordLinkRef}
							onMouseEnter={() => {
								createTooltip({
									position: 'bottom',
									content: 'Support Server',
									ref: this.discordLinkRef,
								})
							}}
							onMouseLeave={() => {
								destroyTooltip()
							}}
						>
							<a href="https://discord.gg/aZSrxwNUFD">
								<SVGDiscordLogo />
							</a>
						</div>
						<div
							className={`${styles.icon} ${styles.iconWrapper}`}
							ref={this.githubLinkRef}
							onMouseEnter={() => {
								createTooltip({
									position: 'bottom',
									content: 'GitHub Repo',
									ref: this.githubLinkRef,
								})
							}}
							onMouseLeave={() => {
								destroyTooltip()
							}}
						>
							<a href="https://github.com/DarkGuy10/BotClient/">
								<SVGGithubLogo />
							</a>
						</div>
						<div
							className={`${styles.icon} ${styles.iconWrapper}`}
							ref={this.helpLinkRef}
							onMouseEnter={() => {
								createTooltip({
									position: 'bottom',
									content: 'Help',
									ref: this.helpLinkRef,
								})
							}}
							onMouseLeave={() => {
								destroyTooltip()
							}}
						>
							<a href="https://github.com/DarkGuy10/BotClient#readme">
								<SVGHelp />
							</a>
						</div>
					</div>
				</section>
				<div className={styles.content}>
					<main className={styles.chatContent}>
						<DiscordMessages
							noBackground={true}
							className={styles.discordMessages}
							ref={this.messageRef}
							onScroll={({ currentTarget }) => {
								const { scrollHeight, scrollTop, clientHeight } = currentTarget
								const { loadedMessages, hasReachedTop } = this.state

								if (
									hasReachedTop ||
									clientHeight - scrollTop < scrollHeight - 10
								)
									return
								const oldestLoadedMessage =
									loadedMessages[loadedMessages.length - 1]
								if (!oldestLoadedMessage) return
								// Negative sign because column-reverse is making scrollTop
								// to give negative values
								this.loadMessages({
									limit: 50,
									before: oldestLoadedMessage.id,
								})
							}}
						>
							{loadedMessages.map(message => (
								<MessageElement
									key={message.id}
									message={message}
									handleReply={this.handleReply}
									createTooltip={createTooltip}
									destroyTooltip={destroyTooltip}
									createContextMenu={createContextMenu}
									destroyContextMenu={destroyContextMenu}
									selectDM={selectDM}
									replying={replyingTo?.id === message.id}
								/>
							))}
							{hasReachedTop && (
								<>
									<div className={styles.separator}></div>
									<ChannelStart channel={channel} />
								</>
							)}
						</DiscordMessages>
						<MessageField
							channel={channel}
							pushAlert={pushAlert}
							handleReply={this.handleReply}
							replyingTo={replyingTo}
						/>
					</main>
					{channel.type !== ChannelType.DM && (
						<MemberNav currentChannel={channel} />
					)}
				</div>
			</div>
		)
	}
}

export default Chat
