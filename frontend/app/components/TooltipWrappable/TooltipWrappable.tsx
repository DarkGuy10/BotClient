'use client'
import styles from './TooltipWrappable.module.scss'
import { useState, useRef } from 'react'
import { Tooltip } from '@/components'

interface TooltipWrappableProps {
	children: React.ReactNode
	position: 'top' | 'right' | 'bottom' | 'left'
	large?: boolean
	content: string
}

export function TooltipWrappable({
	children,
	position,
	large = false,
	content,
}: TooltipWrappableProps) {
	const [hover, setHover] = useState(false)
	const parentRef = useRef(null)

	return (
		<div className={styles.wrapper}>
			<div
				className={styles.children}
				ref={parentRef}
				onMouseEnter={() => {
					setHover(true)
				}}
				onMouseLeave={() => setHover(false)}
			>
				{children}
			</div>
			{hover && (
				<Tooltip
					position={position}
					large={large}
					content={content}
					parentRef={parentRef}
				/>
			)}
		</div>
	)
}
