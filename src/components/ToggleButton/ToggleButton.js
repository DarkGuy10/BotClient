import React, { useState } from 'react'
import styles from './ToggleButton.module.css'
import { SVGToggleChecked, SVGToggleUnchecked } from './../SVGHandler'

const ToggleButton = props => {
	const { onCheck, onUncheck, defaultChecked, isDisabled, id } = props
	const [checked, updateChecked] = useState(defaultChecked)

	return (
		<div className={styles.control}>
			<div
				className={`${styles.container} ${
					checked ? styles.checked : styles.unchecked
				} ${isDisabled ? styles.disabled : ''}`}
			>
				{checked ? <SVGToggleChecked /> : <SVGToggleUnchecked />}
				<input
					id={id}
					className={styles.input}
					type={'checkbox'}
					defaultChecked={checked}
					tabIndex={0}
					onChange={({ target }) => {
						if (target.checked && onCheck && typeof onCheck === 'function')
							onCheck()
						else if (
							!target.checked &&
							onUncheck &&
							typeof onUncheck === 'function'
						)
							onUncheck()
						updateChecked(target.checked)
					}}
				/>
			</div>
		</div>
	)
}

export default ToggleButton
