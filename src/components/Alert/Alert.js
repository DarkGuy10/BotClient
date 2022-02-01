import React, { Component } from 'react'
import styles from './Alert.module.css'

class Alert extends Component {
	defaultTimeout = 4000
	animationDuration = 100
	constructor(props) {
		super(props)
		this.state = {
			popped: false,
			popping: false,
		}
	}

	componentDidMount() {
		const { popTimeout } = this.props
		const timeout = popTimeout ?? this.defaultTimeout
		setTimeout(() => {
			this.setState({ ...this.state, popping: true })
		}, timeout - this.animationDuration)
		setTimeout(() => {
			this.setState({ ...this.state, popped: true })
		}, timeout)
	}

	render() {
		const { type, message } = this.props
		const { popped, popping } = this.state
		return (
			<>
				{popped ? null : (
					<div
						className={`${styles.alertBox} ${styles[type]} ${
							popping ? styles.popping : ''
						}`}
					>
						{message}
					</div>
				)}
			</>
		)
	}
}

export default Alert
