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
							? styles.selected
							: hover
							? styles.hover
							: ''
					}
				></span>
			</div>
			<img
				src={props.guild.iconURL}
				alt={props.guild.name}
				className={`${styles.icon} ${
					props.selected ? styles.iconSelected : ''
				}`}
				onClick={() => {
					props.selectGuild(props.guild.id)
				}}
				onMouseEnter={() => updateHover(true)}
				onMouseLeave={() => updateHover(false)}
			/>
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
			<div className={styles.guildNav}>
				{guilds.map((guild, index) => (
					<ListItem
						key={index}
						guild={guild}
						selected={guild.id === currentGuild?.id}
						selectGuild={selectGuild}
					/>
				))}
			</div>
		)
	}
}

export default GuildNav
