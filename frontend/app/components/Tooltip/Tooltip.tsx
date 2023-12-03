'use client'
import { CSSProperties, MutableRefObject } from 'react'
import styles from './Tooltip.module.scss'

interface TooltipProps {
	position: 'top' | 'right' | 'bottom' | 'left'
	large?: boolean
	content: string
	parentRef: MutableRefObject<any>
}

export function Tooltip({
	position,
	large = false,
	content,
	parentRef,
}: TooltipProps) {
	if (!parentRef.current) return <div className={styles.layerContainer}></div>

	const positionMapping = {
		top: 'tooltipTop',
		right: 'tooltipRight',
		bottom: 'tooltipBottom',
		left: 'tooltipLeft',
	}

	const dimensions = parentRef.current.getBoundingClientRect()
	let inlineStyle: CSSProperties = { position: 'absolute' }

	switch (position) {
		case 'right':
			inlineStyle.top = dimensions.height / 2
			inlineStyle.left = dimensions.width + 10
			inlineStyle.transform = 'translate(0, -50%)'
			break

		case 'top':
			inlineStyle.left = dimensions.width / 2
			inlineStyle.top = -10
			inlineStyle.transform = 'translate(-50%, -100%)'
			break

		case 'bottom':
			inlineStyle.left = dimensions.width / 2
			inlineStyle.top = dimensions.height + 10
			inlineStyle.transform = 'translate(-50%, 0)'
			break

		case 'left':
			inlineStyle.top = dimensions.height / 2
			inlineStyle.left = -10
			inlineStyle.transform = 'translate(-100%, -50%)'
			break
		default:
	}

	return (
		<div className={styles.layer} style={inlineStyle}>
			<div
				className={`${styles[positionMapping[position]]}  ${
					large ? styles.large : ''
				}`}
			>
				<div className={styles.pointer}></div>
				<div className={styles.content}>{content}</div>
			</div>
		</div>
	)
}
