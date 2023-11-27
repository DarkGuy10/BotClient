'use client'
import styles from './Button.module.scss'
import type { MouseEventHandler } from 'react'

type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger'

interface ButtonProps {
	label: string
	type: ButtonType
	small?: boolean
	onClick?: MouseEventHandler<HTMLButtonElement>
}

export const Button = ({ type, label, small, onClick }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={`${styles[type]} ${small ? styles.small : ''}`}
		>
			<div className={styles.content}>{label}</div>
		</button>
	)
}
