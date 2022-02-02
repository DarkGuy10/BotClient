import React, { Component } from 'react'
import styles from './Login.module.css'
import logo from './../../assets/images/logo.png'

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			token: '',
		}

		this.handleSubmit = event => {
			event.preventDefault()
			this.props.handleLogin(this.state.token)
		}
	}

	render() {
		return (
			<div className={styles.wrapper}>
				<img src={logo} className={styles.logo} alt="" />
				<form className={styles.form} onSubmit={this.handleSubmit}>
					<input
						type="text"
						id="tokenField"
						placeholder="Enter bot token"
						required={true}
						className={styles.input}
						value={this.state.token}
						onInput={({ target }) => {
							this.setState({ token: target.value })
						}}
					/>
					<button
						className={`${styles.submit} ${
							this.state.inProgress ? styles.disabled : ''
						}`}
						type="submit"
						disabled={this.state.inProgress}
					>
						Login
					</button>
				</form>
			</div>
		)
	}
}

export default Login
