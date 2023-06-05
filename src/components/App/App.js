import React, { Component } from 'react'
import {
	Login,
	Layout,
	AlertManager,
	TooltipManager,
	ContextMenuManager,
	ErrorBoundary,
} from '..'
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
			contextMenu: null,
		}

		this.handleLogin = token => {
			ipcRenderer.send('login', token)
		}

		/* NOTE: This part will be redone using wrapper logic to ease with the unnecessary propagations. */

		// rawTooltip: {content: string, position: 'top'|'right'|'bottom'|'left', ref: ReactRef, listItem: ?boolean}
		this.createTooltip = rawTooltip =>
			this.setState({ ...this.state, tooltip: rawTooltip })

		this.destroyTooltip = () => this.setState({ ...this.state, tooltip: null })

		// rawContextMenuItem: {type: 'separator'}|({content: string, icons?: JSX.Element[], color: 'normal'|'danger'|'system', className?: string, onClick?: () => void} & ({type: 'button'}|{type: 'submenu', submenu: rawContextSubmenu}))
		// rawContextSubmenu: {items: rawContextMenuItem[]}
		// rawContextMenu: rawContextSubmenu & {position: ('top'|'right'|'bottom'|'left')|{top?: number, left?: number, bottom?: number, right?: number}, ref: ReactRef}
		this.createContextMenu = rawContextMenu =>
			this.setState({ ...this.state, contextMenu: rawContextMenu })

		this.destroyContextMenu = () =>
			this.setState({ ...this.state, contextMenu: null })

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
		// Window EventListeners
		window.addEventListener(
			'keyup',
			event => {
				if (event.code === 'KeyR' && event.ctrlKey) window.location.reload()
			},
			true
		)

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
		const { token, clientIsReady, clientUser, tooltip, contextMenu } =
			this.state
		return (
			<ErrorBoundary>
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
													createTooltip={this.createTooltip}
													destroyTooltip={this.destroyTooltip}
													createContextMenu={this.createContextMenu}
													destroyContextMenu={this.destroyContextMenu}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<ContextMenuManager
								menu={contextMenu}
								createContextMenu={this.createContextMenu}
								destroyContextMenu={this.destroyContextMenu}
							/>
							<TooltipManager tooltip={tooltip} />
						</div>
					) : (
						<div className={styles.bootloopWrapper}>
							<img src={bootloop} alt="" className={styles.bootloopMedia} />
							<p className={styles.bootloopCaption}>Loading BotClient</p>
						</div>
					)
				) : (
					<Login handleLogin={this.handleLogin} pushAlert={this.pushAlert} />
				)}
				<AlertManager alerts={this.state.alerts} />
			</ErrorBoundary>
		)
	}
}
export default App
