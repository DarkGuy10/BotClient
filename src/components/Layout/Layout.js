import React, { Component } from 'react'
import styles from './Layout.module.css'
import { GuildNav, ChannelNav, Chat, UserSettings, UserSection } from './../'
const { ipcRenderer } = window.require('electron')

class Layout extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentGuild: null,
			currentChannel: null,
			isUserSettingsOpen: false,
			isHomeOpen: false,
		}

		this.openUserSettings = () => {
			this.setState({ ...this.state, isUserSettingsOpen: true })
		}

		this.closeUserSettings = () => {
			this.setState({ ...this.state, isUserSettingsOpen: false })
		}

		this.updateHome = (home = true) => {
			this.setState({
				...this.state,
				currentGuild: null,
				currentChannel: null,
				isHomeOpen: home,
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
	}

	componentDidMount() {
		this.selectGuild()
	}

	render() {
		const { currentChannel, currentGuild, isUserSettingsOpen, isHomeOpen } =
			this.state
		const { clientUser, pushAlert, AppState } = this.props

		return (
			<div className={styles.appMount}>
				<div className={styles.app}>
					<div className={styles.appInner}>
						<div className={styles.layers}>
							<div className={styles.layer}>
								<div className={styles.container}>
									<GuildNav
										currentGuild={currentGuild}
										selectGuild={this.selectGuild}
										pushAlert={pushAlert}
										isHomeOpen={isHomeOpen}
										updateHome={this.updateHome}
									/>
									<div className={styles.base}>
										<div className={styles.content}>
											<div className={styles.sidebar}>
												{isHomeOpen ? (
													<>DMNav</>
												) : currentGuild &&
												  currentChannel ? (
													<ChannelNav
														currentGuild={
															currentGuild
														}
														currentChannel={
															currentChannel
														}
														selectChannel={
															this.selectChannel
														}
													/>
												) : null}
												<UserSection
													clientUser={clientUser}
													openUserSettings={
														this.openUserSettings
													}
												/>
											</div>
											{currentGuild && currentChannel ? (
												<Chat
													currentChannel={
														currentChannel
													}
													pushAlert={pushAlert}
												/>
											) : null}
										</div>
									</div>

									{isUserSettingsOpen ? (
										<UserSettings
											closeUserSettings={
												this.closeUserSettings
											}
											AppState={AppState}
										/>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Layout
