'use client'
import { useReduxSelector } from '@/redux/hooks'
import styles from './AlertManager.module.scss'
import { Alert } from '../Alert/Alert'

export const AlertManager = () => {
	const alerts = useReduxSelector(state => state.alerts.data)

	return (
		<div className={styles.container}>
			{alerts.map(each => (
				<Alert {...each} key={each.uniqueID} />
			))}
		</div>
	)
}
