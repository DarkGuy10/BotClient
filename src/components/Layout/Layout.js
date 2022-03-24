import React, { Component } from 'react'
import styles from './Layout.module.css'
import {
	GuildNav,
	ChannelNav,
	DMNav,
	Chat,
	UserSettings,
	UserSection,
} from './../'
const { ipcRenderer } = window.require('electron')

class Layout extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentGuild: null,
			currentChannel: null,
			currentDM: null,
			isUserSettingsOpen: false,
			isHomeOpen: false,
		}

		this.openUserSettings = () => {
			this.setState({ ...this.state, isUserSettingsOpen: true })
		}

		this.closeUserSettings = () => {
			this.setState({ ...this.state, isUserSettingsOpen: false })
		}

		this.openHome = () => {
			this.setState({
				...this.state,
				currentGuild: null,
				currentChannel: null,
				isHomeOpen: true,
			})
		}

		this.selectGuild = async id => {
			const { currentGuild: previousGuild } = this.state
			if (previousGuild && previousGuild.id === id) return
			const { currentGuild, currentChannel } = await ipcRenderer.invoke(
				'selectGuild',
				id
			)
			if (!currentGuild) return

			this.selectChannel(currentChannel.id, currentGuild.id)
			this.setState({
				...this.state,
				currentGuild: currentGuild,
				currentChannel: null,
				currentDM: false,
				isHomeOpen: false,
			})
		}

		this.selectChannel = async id => {
			if (this.state.currentChannel?.id === id) return
			const currentChannel = await ipcRenderer.invoke('selectChannel', id)

			const allowedChannelTypes = ['GUILD_TEXT', 'GUILD_NEWS', 'DM']

			if (!currentChannel.viewable)
				return this.props.pushAlert({
					type: 'warning',
					message: `Channel ${currentChannel.name} [ID:${currentChannel.id}] is not viewable (missing permissions).`,
				})

			if (!allowedChannelTypes.includes(currentChannel.type))
				return this.props.pushAlert({
					type: 'warning',
					message: `Channel ${currentChannel.name} [ID:${currentChannel.id}] has an unsupported type: '${currentChannel.type}'`,
				})
			this.setState({ ...this.state, currentChannel: currentChannel })
		}

		this.selectDM = async userID => {
			if (this.state.currentDM?.recipient?.id === userID) return
			if (!this.state.isHomeOpen) this.openHome()
			const currentDM = await ipcRenderer.invoke('selectDM', userID)
			if (!currentDM) return
			this.setState({
				...this.state,
				currentDM: currentDM,
			})
		}
	}

	componentDidMount() {
		this.selectGuild()
	}

	render() {
		const {
			currentChannel,
			currentGuild,
			currentDM,
			isUserSettingsOpen,
			isHomeOpen,
		} = this.state
		const { clientUser, pushAlert, createTooltip, destroyTooltip } =
			this.props

		return (
			<>
				<GuildNav
					currentGuild={currentGuild}
					selectGuild={this.selectGuild}
					pushAlert={pushAlert}
					createTooltip={createTooltip}
					destroyTooltip={destroyTooltip}
					isHomeOpen={isHomeOpen}
					openHome={this.openHome}
				/>
				<div className={styles.base}>
					<div className={styles.content}>
						<div className={styles.sidebar}>
							<div className={styles.sidebarInner}>
								{isHomeOpen ? (
									<DMNav selectDM={this.selectDM} />
								) : currentGuild && currentChannel ? (
									<ChannelNav
										currentGuild={currentGuild}
										currentChannel={currentChannel}
										selectChannel={this.selectChannel}
									/>
								) : null}
							</div>
							<UserSection
								clientUser={clientUser}
								createTooltip={createTooltip}
								destroyTooltip={destroyTooltip}
								openUserSettings={this.openUserSettings}
							/>
						</div>
						{(currentGuild && currentChannel) ||
						(isHomeOpen && currentDM) ? (
							<Chat
								channel={currentChannel || currentDM}
								createTooltip={createTooltip}
								destroyTooltip={destroyTooltip}
								pushAlert={pushAlert}
								selectDM={this.selectDM}
							/>
						) : null}
					</div>
				</div>
				{isUserSettingsOpen ? (
					<UserSettings closeUserSettings={this.closeUserSettings} />
				) : null}
			</>
		)
	}
}

export default Layout
