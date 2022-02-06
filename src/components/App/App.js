import React, { Component } from 'react'
import { Login, Layout, AlertManager } from './..'
import { AppData } from './../../services/'
import Markdown from 'markdown-to-jsx'
import styles from './App.module.css'
import bootloopvideo from './../../assets/images/bootloop.webm'
const { ipcRenderer } = window.require('electron')

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			token: AppData.get('token'),
			clientUser: null,
			clientIsReady: false,
			alerts: [],
		}

		this.handleLogin = token => {
			ipcRenderer.send('login', token)
		}

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
		const { token, clientIsReady, clientUser } = this.state
		return (
			<>
				{token ? (
					clientIsReady ? (
						<Layout
							clientUser={clientUser}
							pushAlert={this.pushAlert}
							AppState={this.state}
						/>
					) : (
						<BootLoop />
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

function BootLoop() {
	return (
		<div className={styles.wrapper}>
			<video
				src={bootloopvideo}
				className={styles.video}
				autoPlay={true}
				loop={true}
			></video>
			<p className={styles.caption}>Loading BotClient...</p>
		</div>
	)
}

export default App
