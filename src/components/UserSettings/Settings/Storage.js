import React from 'react'
import { AppData } from '../../../services'
import { ToggleButton } from './../..'
import styles from './Settings.module.css'

const Storage = props => {
	const { AppState } = props
	return (
		<>
			<div>
				<h5 className={styles.title}>Token</h5>
				<div className={styles.container}>
					<div className={styles.labelRow}>
						<label htmlFor="saveToken">
							Persistant Login (save bot token in App Data).
						</label>
						<ToggleButton
							onCheck={() => {
								AppData.set('Storage.saveToken', true)
								AppData.set('token', AppState.token)
							}}
							onUncheck={() => {
								AppData.set('Storage.saveToken', false)
								AppData.delete('token')
							}}
							defaultChecked={AppData.get(
								'Storage.saveToken',
								true
							)}
							id="saveToken"
						/>
					</div>
					<div className={styles.divider}></div>
				</div>
			</div>
		</>
	)
}

export default Storage
