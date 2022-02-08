import React, { Component, useState } from 'react'
import styles from './GuildNav.module.css'
const { ipcRenderer } = window.require('electron')

function ListItem(props) {
	const [hover, updateHover] = useState(false)

	return (
		<div className={styles.listItem}>
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
			{props.guild.iconURL ? (
				<img
					src={props.guild.iconURL}
					alt={props.guild.name}
					className={`${styles.icon} ${
						props.selected ? styles.selected : ''
					}`}
					onClick={() => {
						props.selectGuild(props.guild.id)
					}}
					onMouseEnter={() => updateHover(true)}
					onMouseLeave={() => updateHover(false)}
				/>
			) : (
				<div
					className={`${styles.wrapper} ${
						props.selected ? styles.selected : ''
					}`}
					onClick={() => {
						props.selectGuild(props.guild.id)
					}}
					onMouseEnter={() => updateHover(true)}
					onMouseLeave={() => updateHover(false)}
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
		const { currentGuild, selectGuild } = this.props
		return (
			<nav className={styles.guildNav}>
				<ul className={styles.tree}>
					<div className={styles.scroller}>
						<div aria-label="Servers">
							{guilds.map((guild, key) => (
								<ListItem
									key={key}
									guild={guild}
									selected={guild.id === currentGuild?.id}
									selectGuild={selectGuild}
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
