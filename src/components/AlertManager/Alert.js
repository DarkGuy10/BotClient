import React, { Component } from 'react'
import styles from './AlertManager.module.css'

class Alert extends Component {
	defaultTimeout = 4000
	constructor(props) {
		super(props)
		this.state = {
			popped: false,
		}
	}

	componentDidMount() {
		const { popTimeout } = this.props
		setTimeout(() => {
			this.setState({ popped: true })
		}, popTimeout ?? this.defaultTimeout)
	}

	render() {
		const { type, message } = this.props
		const { popped } = this.state
		return (
			<>
				{popped ? null : (
					<div className={`${styles.alertBox} ${styles[type]}`}>
						{message}
					</div>
				)}
			</>
		)
	}
}

export default Alert
