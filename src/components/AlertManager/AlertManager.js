import React, { Component } from 'react'
import { Alert } from './../'
import styles from './AlertManager.module.css'

class AlertManager extends Component {
	render() {
		const alerts = [...this.props.alerts.values()]
		return (
			<div className={styles.container}>
				{alerts.map(({ type, message, popTimeout }, index) => (
					<Alert
						key={index}
						type={type}
						message={message}
						popTimeout={popTimeout}
					/>
				))}
			</div>
		)
	}
}

// Helper typedefs functions for alert management

/**
 * A raw alert object
 * @typedef {Object} RawAlert
 * @property {('error'|'success'|'system'|'warning')} type The type of this alert
 * @property {String} message The alert message to display
 * @property {?Number} popTimeout Milliseconds before the alert message disappears
 */

export default AlertManager
