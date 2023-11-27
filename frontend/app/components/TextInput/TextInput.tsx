'use client'
import { type Dispatch, type SetStateAction } from 'react'
import styles from './TextInput.module.scss'

interface TextInputProps {
	placeholder?: string
	label?: string
	setState?: Dispatch<SetStateAction<string>>
}

export const TextInput = ({ label, placeholder, setState }: TextInputProps) => {
	return (
		<div className={styles.wrapper}>
			{label && <div className={styles.label}>{label}</div>}
			<input
				type={'text'}
				className={styles.inputField}
				placeholder={placeholder}
				onChange={event => {
					if (setState) setState(event.target.value)
				}}
			/>
		</div>
	)
}
