import { DiscordMessages } from '@skyra/discord-components-react'
import React, { Component, createRef } from 'react'
import styles from './Main.module.css'
import { MessageElement, MessageField } from './../'
import { SVGChannels } from './../SVGHandler'
import { parseTwemojis } from '../../utils'
const { ipcRenderer } = window.require('electron')

function Header(props) {
	const isPrivate = !props.channel.isPrivate
	const isRules = props.channel.isRules
	const svgType = isRules
		? 'RULES'
		: `${props.channel.type}${isPrivate ? '_LIMITED' : ''}`
	return (
		<div className={styles.header}>
			{SVGChannels[svgType]}
			<h1>{parseTwemojis(props.channel.name)}</h1>
			{props.channel.topic ? (
				<h2>{parseTwemojis(props.channel.topic)}</h2>
			) : null}
		</div>
	)
}

class Main extends Component {
	_isMounted = false

	constructor(props) {
		super(props)
		this.state = {
			loadedMessages: [],
		}

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

			if (clearPreviousMessages)
				this.setState({ ...this.state, loadedMessages: [] })

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
			// 20 pixel margin for snappy, unannoying autoscroll
			if (this.messageRef.current) {
				// for some reason, messageRef gets unmounted, causing current to become undefined
				const { clientHeight, scrollHeight, scrollTop } =
					this.messageRef.current
				if (scrollTop + clientHeight >= scrollHeight - 20)
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
		const { loadedMessages } = this.state
		return (
			<div className={styles.main}>
				<Header channel={currentChannel} />
				<DiscordMessages
					noBackground={true}
					className={styles.discordMessages}
					ref={this.messageRef}
				>
					{loadedMessages.map((message, index) => (
						<MessageElement key={index} message={message} />
					))}
				</DiscordMessages>
				<MessageField
					currentChannel={currentChannel}
					pushAlert={pushAlert}
				/>
			</div>
		)
	}
}

export default Main
