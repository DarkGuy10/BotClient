import React from 'react'
import { AppData } from '../../../services'
import { ToggleElement } from './../..'
import styles from './Settings.module.css'
const { ipcRenderer } = window.require('electron')

const Storage = props => {
	return (
		<>
			<div>
				<h5 className={styles.title}>Token</h5>

				<ToggleElement
					label="Persistent Login (save bot token in App Data)."
					id="saveToken"
					defaultChecked={AppData.get('Storage.saveToken', true)}
					onCheck={() => {
						AppData.set('Storage.saveToken', true)
						ipcRenderer.send('saveCurrentToken')
					}}
					onUncheck={() => {
						AppData.set('Storage.saveToken', false)
						AppData.delete('token')
					}}
				/>
			</div>
		</>
	)
}

export default Storage
