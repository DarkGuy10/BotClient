import React from 'react'
import { ToggleButton } from '..'
import styles from './ToggleElement.module.css'

const ToggleElement = props => {
	const { onCheck, onUncheck, label, defaultChecked, id } = props
	return (
		<div className={styles.container}>
			<div className={styles.labelRow}>
				<label htmlFor={id}>{label}</label>
				<ToggleButton
					onCheck={onCheck}
					onUncheck={onUncheck}
					defaultChecked={defaultChecked}
					id={id}
				/>
			</div>
			<div className={styles.divider}></div>
		</div>
	)
}

export default ToggleElement
