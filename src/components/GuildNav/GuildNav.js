import React, { Component, useState, createRef } from 'react'
import styles from './GuildNav.module.css'
import logoTransparent from './../../assets/images/logo-transparent.png'
import logoAnimated from './../../assets/images/logo-animated.gif'
const { ipcRenderer } = window.require('electron')

function ListItem(props) {
	const [hover, updateHover] = useState(false)

	const selfRef = createRef()

	return (
		<div className={styles.listItem} ref={selfRef}>
			<div className={styles.pill}>
				<span
					className={
						props.selected
							? styles.pillSelected
							: hover
							? styles.pillHover
							: ''
					}
				></span>
			</div>
			{props.home ? (
				<img
					src={
						props.selected || hover ? logoAnimated : logoTransparent
					}
					alt="Home"
					className={`${styles.icon} ${styles.home} ${
						props.selected ? styles.selected : ''
					}`}
					onClick={() => props.openHome()}
					onMouseEnter={() => {
						updateHover(true)
						props.createTooltip({
							position: 'right',
							listItem: true,
							content: 'Direct Messages',
							ref: selfRef,
						})
					}}
					onMouseLeave={() => {
						updateHover(false)
						props.destroyTooltip()
					}}
				/>
			) : props.guild.iconURL ? (
				<img
					src={props.guild.iconURL}
					alt={props.guild.name}
					className={`${styles.icon} ${
						props.selected ? styles.selected : ''
					}`}
					onClick={() => props.selectGuild(props.guild.id)}
					onMouseEnter={() => {
						updateHover(true)
						props.createTooltip({
							position: 'right',
							listItem: true,
							content: props.guild.name,
							ref: selfRef,
						})
					}}
					onMouseLeave={() => {
						updateHover(false)
						props.destroyTooltip()
					}}
				/>
			) : (
				<div
					className={`${styles.wrapper} ${
						props.selected ? styles.selected : ''
					}`}
					onClick={() => {
						props.selectGuild(props.guild.id)
					}}
					onMouseEnter={() => {
						updateHover(true)
						props.createTooltip({
							position: 'right',
							listItem: true,
							content: props.guild.name,
							ref: selfRef,
						})
					}}
					onMouseLeave={() => {
						updateHover(false)
						props.destroyTooltip()
					}}
				>
					<div className={styles.acronym}>
						{props.guild.name
							.split(/ +/)
							.map(each => each.charAt(0))}
					</div>
				</div>
			)}
		</div>
	)
}

class GuildNav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			guilds: [],
		}
	}

	async componentDidMount() {
		const guilds = await ipcRenderer.invoke('guilds')
		this.setState({ ...this.state, guilds: guilds })
	}

	render() {
		const { guilds } = this.state
		const {
			currentGuild,
			selectGuild,
			openHome,
			isHomeOpen,
			createTooltip,
			destroyTooltip,
		} = this.props
		return (
			<nav className={styles.guildNav}>
				<ul className={styles.tree}>
					<div className={styles.scroller}>
						<ListItem
							home
							openHome={openHome}
							selected={isHomeOpen}
							createTooltip={createTooltip}
							destroyTooltip={destroyTooltip}
						/>
						<div className={styles.guildSeparatorWrapper}>
							<div className={styles.guildSeperator}></div>
						</div>
						<div aria-label="Servers">
							{guilds.map((guild, key) => (
								<ListItem
									key={key}
									guild={guild}
									selected={guild.id === currentGuild?.id}
									selectGuild={selectGuild}
									createTooltip={createTooltip}
									destroyTooltip={destroyTooltip}
								/>
							))}
						</div>
					</div>
				</ul>
			</nav>
		)
	}
}

export default GuildNav
