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
const { ipcRenderer } = window.require('electron')

const Icon = props => {
	const isPrivate = props.channel.isPrivate
	const isRules = props.channel.isRules
	const svgType = isRules
		? 'RULES'
		: `${props.channel.type}${isPrivate ? '_LIMITED' : ''}`
	return <div className={styles.iconWrapper}>{SVGChannels[svgType]}</div>
}

class Chat extends Component {
	_isMounted = false

	constructor(props) {
		super(props)
		this.initialState = {
			loadedMessages: [],
			replyingTo: null,
		}
		this.state = { ...this.initialState }

		this.messageRef = createRef()

		this.scrollToBottom = () => {
			// To Fix : add a loadScreen till the scrolling is complete
			setTimeout(() => {
				this.messageRef.current.scrollTo({
					left: 0,
					top:
						this.messageRef.current.clientHeight +
						this.messageRef.current.scrollHeight,
				})
			}, 0.1)
		}

		this.loadMessages = async (
			limit = 100,
			clearPreviousMessages = true,
			before = null
		) => {
			const { channel } = this.props
			const { loadedMessages } = this.state
			if (!channel) return

			if (clearPreviousMessages) this.setState({ ...this.initialState })

			const messages = [
				...(await ipcRenderer.invoke('messages', limit)),
			].reverse()
			this.setState({
				...this.state,
				loadedMessages: clearPreviousMessages
					? messages
					: [...loadedMessages, ...messages],
			})
			if (clearPreviousMessages) this.scrollToBottom()
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
					loadedMessages: [...loadedMessages, message],
				})

			// Scroll to bottom *if* user is already fully scrolled *with* a
			// 50 pixel margin for snappy, unannoying autoscroll
			if (this.messageRef.current && this._isMounted) {
				// for some reason, messageRef gets unmounted, causing current to become undefined
				const { clientHeight, scrollHeight, scrollTop } =
					this.messageRef.current
				if (scrollTop + clientHeight >= scrollHeight - 50)
					this.scrollToBottom()
			}
		})

		this.githubLinkRef = createRef()
		this.discordLinkRef = createRef()
		this.helpLinkRef = createRef()
	}

	componentDidMount() {
		this._isMounted = true
		this.loadMessages()
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	componentDidUpdate(prevProps) {
		if (prevProps.channel.id !== this.props.channel.id) this.loadMessages()
	}

	render() {
		const { channel, pushAlert, createTooltip, destroyTooltip } = this.props
		const { loadedMessages, replyingTo } = this.state
		return (
			<div className={styles.chat}>
				<section className={styles.titleContainer}>
					<div className={styles.children}>
						<Icon channel={channel} />
						<h3 className={styles.title}>
							{parseTwemojis(
								channel.name || channel.recipient.username
							)}
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
						>
							{loadedMessages.map((message, index) => (
								<MessageElement
									key={index}
									message={message}
									handleReply={this.handleReply}
									createTooltip={createTooltip}
									destroyTooltip={destroyTooltip}
									replying={replyingTo?.id === message.id}
								/>
							))}
						</DiscordMessages>
						<MessageField
							channel={channel}
							pushAlert={pushAlert}
							handleReply={this.handleReply}
							replyingTo={replyingTo}
						/>
					</main>
					{channel.type !== 'DM' && (
						<MemberNav currentChannel={channel} />
					)}
				</div>
			</div>
		)
	}
}

export default Chat
