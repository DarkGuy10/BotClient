import { DiscordMessages } from '@skyra/discord-components-react'
import React, { Component, createRef } from 'react'
import styles from './Chat.module.css'
import { MessageElement, MessageField } from '..'
import { SVGChannels } from '../SVGHandler'
import { parseTwemojis } from '../../utils'
import MemberNav from '../MemberNav/MemberNav'
const { ipcRenderer } = window.require('electron')

const Icon = props => {
	const isPrivate = !props.currentChannel.isPrivate
	const isRules = props.currentChannel.isRules
	const svgType = isRules
		? 'RULES'
		: `${props.currentChannel.type}${isPrivate ? '_LIMITED' : ''}`
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
			const { currentChannel } = this.props
			const { loadedMessages } = this.state
			if (!currentChannel) return

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
			const { currentChannel } = this.props
			if (message.channelId === currentChannel.id && this._isMounted)
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
	}

	componentDidMount() {
		this._isMounted = true
		this.loadMessages()
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	componentDidUpdate(prevProps) {
		if (prevProps.currentChannel.id !== this.props.currentChannel.id)
			this.loadMessages()
	}

	render() {
		const { currentChannel, pushAlert } = this.props
		const { loadedMessages, replyingTo } = this.state
		return (
			<>
				<div className={styles.chat}>
					<section className={styles.titleContainer}>
						<div className={styles.children}>
							<Icon currentChannel={currentChannel} />
							<h3 className={styles.title}>
								{parseTwemojis(currentChannel.name)}
							</h3>
							{currentChannel.topic ? (
								<>
									<div className={styles.divider}></div>
									<div className={styles.topic}>
										{parseTwemojis(currentChannel.topic)}
									</div>
								</>
							) : null}
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
										replying={replyingTo?.id === message.id}
									/>
								))}
							</DiscordMessages>
							<MessageField
								currentChannel={currentChannel}
								pushAlert={pushAlert}
								handleReply={this.handleReply}
								replyingTo={replyingTo}
							/>
						</main>
						<MemberNav currentChannel={currentChannel} />
					</div>
				</div>
				{/*
			<div className={styles.main}>
				<Header channel={currentChannel} />
				
				
			</div>*/}
			</>
		)
	}
}

export default Chat
