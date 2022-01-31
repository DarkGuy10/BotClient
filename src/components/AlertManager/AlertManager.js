import React, { Component } from 'react'
import styles from './AlertManager.module.css'

function Alert(props) {
	return (
		<div className={`${styles.alertBox} ${styles[props.type]}`}>
			{props.message}
		</div>
	)
}

class AlertManager extends Component {
	render() {
		const alerts = [...this.props.alerts.values()]
		return (
			<div className={styles.container}>
				{alerts.map((alert, index) => (
					<Alert
						key={index}
						type={alert.type}
						message={alert.message}
						alertID={alert.alertID}
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
 */

/**
 * Push an alert.
 * Alerts are mapped with their `alertID`s in `parent.state.alerts`.
 * `parent.state.latestAlertID` should store the `alertID` of the last alert.
 * @param {Component} parent The react component this Alert Manager is connected with
 * @param {RawAlert} rawAlert An object containing raw alert data. NOTE : raw alert objects do not have an `alertID` property
 * @param {Number?} popTimeout The number of milliseconds before this alert disapperas. Defaults to 3500
 */
function pushAlertHelper(parent, rawAlert, popTimeout = 4000) {
	const alerts = parent.state.alerts
	const latestAlertID = parent.state.latestAlertID + 1
	alerts.set(latestAlertID, { ...rawAlert, alertID: latestAlertID })
	parent.setState({
		...parent.state,
		alerts: alerts,
		latestAlertID: latestAlertID,
	})
	setTimeout(popAlertHelper, popTimeout, parent, latestAlertID)
}

/**
 * Pop an alert.
 * @param {Component} parent The react component this Alert Manager is connected with
 * @param {Number} alertID The `alertID` property of the alert to be popped
 */
function popAlertHelper(parent, alertID) {
	const alerts = parent.state.alerts
	alerts.delete(alertID)
	parent.setState({
		...parent.state,
		alerts: alerts,
	})
}

export default AlertManager
export { pushAlertHelper, popAlertHelper }
