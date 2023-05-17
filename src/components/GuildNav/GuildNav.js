import React, { Component } from 'react'
import { GuildListItem } from '..'
import styles from './GuildNav.module.css'
const { ipcRenderer } = window.require('electron')

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
			createContextMenu,
			destroyContextMenu,
		} = this.props
		return (
			<nav className={styles.guildNav}>
				<ul className={styles.tree}>
					<div className={styles.scroller}>
						<GuildListItem
							home
							openHome={openHome}
							selected={isHomeOpen}
							createTooltip={createTooltip}
							destroyTooltip={destroyTooltip}
							createContextMenu={createContextMenu}
							destroyContextMenu={destroyContextMenu}
						/>
						<div className={styles.guildSeparatorWrapper}>
							<div className={styles.guildSeperator}></div>
						</div>
						<div aria-label="Servers">
							{guilds.map((guild, key) => (
								<GuildListItem
									key={key}
									guild={guild}
									selected={guild.id === currentGuild?.id}
									selectGuild={selectGuild}
									createTooltip={createTooltip}
									destroyTooltip={destroyTooltip}
									createContextMenu={createContextMenu}
									destroyContextMenu={destroyContextMenu}
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
