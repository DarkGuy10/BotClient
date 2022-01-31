import React, { Component } from 'react'
import { Login, Layout } from '..'
import Markdown from 'markdown-to-jsx'
import AlertManager, {
	popAlertHelper,
	pushAlertHelper,
} from './../AlertManager/AlertManager'
import styles from './App.module.css'
import bootloopvideo from './../../assets/images/bootloop.webm'
const { ipcRenderer } = window.require('electron')

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			token: window.localStorage.getItem('token'),
			clientUser: null,
			clientIsReady: false,
			alerts: new Map(),
			latestAlertID: -1,
		}

		this.handleLogin = token => {
			ipcRenderer.send('login', token)

			ipcRenderer.on('login', () => {
				window.localStorage.setItem('token', token)
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
		}

		/**
		 * Push an alert.
		 * @param {RawAlert} rawAlert An object containing raw alert data. NOTE : raw alert objects do not have an `alertID` property
		 * @param {Number?} popTimeout The number of milliseconds before this alert disapperas. Defaults to 3500
		 */
		this.pushAlert = (rawAlert, popTimeout) => {
			pushAlertHelper(this, rawAlert, popTimeout)
		}

		/**
		 * Pop an alert.
		 * @param {Number} alertID The `alertID` property of the alert to be popped
		 */
		this.popAlert = alertID => {
			popAlertHelper(this, alertID)
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

		this.pushAlert(
			{
				type: 'system',
				message: (
					<Markdown>{`Welcome to **BotClient v${process.env.REACT_APP_VERSION}**!<br>Need help? Join the [support server]('https://discord.com/invite/aZSrxwNUFD')<br>Want to contribute? Checkout the [github repo](${process.env.REACT_APP_REPOSITORY})`}</Markdown>
				),
			},
			6000
		)
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
