import styles from './StatusIndicator.module.css'
import idle from './../../assets/images/status-idle.png'
import dnd from './../../assets/images/status-dnd.png'
import online from './../../assets/images/status-online.png'
import offline from './../../assets/images/status-offline.png'

const StatusIndicator = props => {
	const { type } = props

	const statusMapped = {
		IDLE: idle,
		DND: dnd,
		ONLINE: online,
		OFFLINE: offline,
		INVISIBLE: offline,
	}
	return (
		<img
			src={statusMapped[type || 'OFFLINE']}
			className={styles.statusIndicator}
			alt={`STATUS_${type || 'OFFLINE'}`}
		/>
	)
}

export default StatusIndicator
