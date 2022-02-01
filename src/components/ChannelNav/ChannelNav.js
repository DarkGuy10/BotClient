import React, { Component } from 'react'
import styles from './ChannelNav.module.css'
import { SVGCogsThick, SVGChannels } from './../SVGHandler'
const { ipcRenderer } = window.require('electron')

function ListItem(props) {
	const isPrivate = props.channel.isPrivate
	const isRules = props.channel.isRules
	const isCategory = props.channel.type === 'GUILD_CATEGORY'
	const isParentCollapsed = props.collpasedCategoriesId.includes(
		props.channel.parentId
	)
	const isCollapsed = props.collpasedCategoriesId.includes(props.channel.id)
	const isViewable = props.channel.viewable
	const svgType = isRules
		? 'RULES'
		: `${props.channel.type}${isPrivate && !isCategory ? '_LIMITED' : ''}`
	return (
		<div
			className={`${styles.listItem} ${
				isCategory ? styles.category : ''
			} ${isCollapsed ? styles.collapsed : ''} ${
				isParentCollapsed ? styles.hidden : ''
			} ${!isViewable ? styles.muted : ''} ${
				props.selected ? styles.selected : ''
			}`}
			title={!isViewable ? 'Not Viewable' : ''}
			onClick={() => {
				isCategory
					? props.toggleCollapseCategory(props.channel.id)
					: props.selectChannel(props.channel.id)
			}}
		>
			{SVGChannels[svgType]}
			<div>{props.channel.name}</div>
		</div>
	)
}

class ChannelNav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			collpasedCategoriesId: [],
			channels: [],
		}

		this.fetchChannels = async () => {
			const channels = await ipcRenderer.invoke('channels')
			this.setState({ ...this.state, channels: channels })
		}

		this.toggleCollapseCategory = id => {
			const { collpasedCategoriesId } = this.state
			this.setState({
				...this.state,
				collpasedCategoriesId: collpasedCategoriesId.includes(id)
					? collpasedCategoriesId.filter(each => each !== id)
					: [...collpasedCategoriesId, id],
			})
		}
	}

	componentDidMount() {
		this.fetchChannels()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.currentGuild.id !== this.props.currentGuild.id)
			this.fetchChannels()
	}

	render() {
		const { currentGuild, currentChannel, pushAlert } = this.props
		const channels = orderChannels(this.state.channels)
		return (
			<div className={styles.channelNav}>
				<div className={styles.header}>
					<span>{currentGuild.name}</span>
				</div>

				<div className={styles.channels}>
					{channels
						? channels.map((channel, index) => (
								<ListItem
									key={index}
									channel={channel}
									toggleCollapseCategory={
										this.toggleCollapseCategory
									}
									collpasedCategoriesId={
										this.state.collpasedCategoriesId
									}
									selected={channel.id === currentChannel.id}
									selectChannel={this.props.selectChannel}
								/>
						  ))
						: null}
				</div>

				<div className={styles.userInfo}>
					<img
						src={this.props.clientUser.added.displayAvatarURL}
						alt="Bot Avatar"
						className={styles.avatar}
					/>
					<div className={styles.tagWrapper}>
						<span className={styles.username}>
							{this.props.clientUser.username}
						</span>
						<span className={styles.discriminator}>
							#{this.props.clientUser.discriminator}
						</span>
					</div>
					<button
						className={styles.settings}
						onClick={() => {
							pushAlert({
								type: 'system',
								message: 'Feature in development, coming soon.',
							})
						}}
					>
						<SVGCogsThick />
					</button>
				</div>
			</div>
		)
	}
}

function orderChannels(channels) {
	const categories = channels
		.filter(channel => channel.type === 'GUILD_CATEGORY')
		.sort((a, b) => a.position - b.position)
	const texts = channels
		.filter(channel => ['GUILD_TEXT', 'GUILD_NEWS'].includes(channel.type))
		.sort((a, b) => a.position - b.position)
	const voices = channels
		.filter(channel => channel.type === 'GUILD_VOICE')
		.sort((a, b) => a.position - b.position)
	const result = [
		...texts.filter(channel => !channel.parentId),
		...voices.filter(channel => !channel.parentId),
		...categories.map(category => [
			category,
			...texts.filter(channel => channel.parentId === category.id),
			...voices.filter(channel => channel.parentId === category.id),
		]),
	].flat()
	return result
}

export default ChannelNav
