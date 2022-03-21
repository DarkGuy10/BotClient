import React, { Component } from 'react'
import { Login, Layout, AlertManager, TooltipManager } from '..'
import { AppData } from './../../services/'
import Markdown from 'markdown-to-jsx'
import styles from './App.module.css'
import bootloop from './../../assets/images/bootloop.gif'
const { ipcRenderer } = window.require('electron')

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			token: AppData.get('token'),
			clientUser: null,
			clientIsReady: false,
			alerts: [],
			tooltip: null,
		}

		this.handleLogin = token => {
			ipcRenderer.send('login', token)
		}

		// rawTooltios: {content: string, position: 'top'|'right'|'bottom'|'left', ref: ReactRef, listItem: ?boolean}
		this.createTooltip = rawTooltip =>
			this.setState({ ...this.state, tooltip: rawTooltip })

		this.destroyTooltip = () =>
			this.setState({ ...this.state, tooltip: null })

		/**
		 * Push an alert.
		 * @param {RawAlert} rawAlert An object containing raw alert data.
		 */
		this.pushAlert = rawAlert => {
			this.setState({
				...this.state,
				alerts: [...this.state.alerts, rawAlert],
			})
		}
	}

	componentDidMount() {
		// Handle all errors from discord client
		ipcRenderer.on('error', (event, error) => {
			this.pushAlert({
				type: 'error',
				message: error,
			})
		})

		ipcRenderer.on('forcedAppStateUpdate', (event, newStates) => {
			this.setState({ ...this.state, ...newStates })
		})

		ipcRenderer.on('login', (event, token) => {
			this.setState({ ...this.state, token: token })
		})

		ipcRenderer.on('ready', (event, clientUser) => {
			this.pushAlert({
				type: 'success',
				message: `Successfully logged in as ${clientUser.tag}`,
			})
			this.setState({
				...this.state,
				clientIsReady: true,
				clientUser: clientUser,
			})
		})

		ipcRenderer.on('logout', () => {
			this.pushAlert({
				type: 'success',
				message: 'Successfully logged out',
			})
			this.setState({
				...this.state,
				token: null,
				clientUser: null,
				clientIsReady: false,
			})
		})

		this.pushAlert({
			type: 'system',
			message: (
				<Markdown>{`Welcome to **BotClient v${process.env.REACT_APP_VERSION}**!<br>Need help? Join the [support server]('https://discord.com/invite/aZSrxwNUFD')<br>Want to contribute? Checkout the [github repo](${process.env.REACT_APP_REPOSITORY})`}</Markdown>
			),
			popTimeout: 6000,
		})
		if (this.state.token) this.handleLogin(this.state.token)
	}

	render() {
		const { token, clientIsReady, clientUser, tooltip } = this.state
		return (
			<>
				{token ? (
					clientIsReady ? (
						<div className={styles.appMount}>
							<div className={styles.app}>
								<div className={styles.appInner}>
									<div className={styles.layers}>
										<div className={styles.layer}>
											<div className={styles.container}>
												<Layout
													clientUser={clientUser}
													pushAlert={this.pushAlert}
													createTooltip={
														this.createTooltip
													}
													destroyTooltip={
														this.destroyTooltip
													}
												/>
											</div>
										</div>
									</div>
								</div>
								<TooltipManager tooltip={tooltip} />
							</div>
						</div>
					) : (
						<div className={styles.bootloopWrapper}>
							<img
								src={bootloop}
								alt=""
								className={styles.bootloopMedia}
							/>
							<p className={styles.bootloopCaption}>
								Loading BotClient
							</p>
						</div>
					)
				) : (
					<Login
						handleLogin={this.handleLogin}
						pushAlert={this.pushAlert}
					/>
				)}
				<AlertManager alerts={this.state.alerts} />
			</>
		)
	}
}
export default App
