'use client'
import { CSSProperties } from 'react'
import { useReduxSelector } from '@/redux/hooks'
import styles from './TooltipManager.module.scss'

export const TooltipManager = () => {
	const tooltipData = useReduxSelector(state => state.tooltip.data)
	if (!tooltipData?.parentRef.current)
		return <div className={styles.layerContainer}></div>

	const { parentRef, position, content, large } = tooltipData

	const positionMapping = {
		top: 'tooltipTop',
		right: 'tooltipRight',
		bottom: 'tooltipBottom',
		left: 'tooltipLeft',
	}

	const dimensions = parentRef.current.getBoundingClientRect() as DOMRect
	let inlineStyle: CSSProperties = { position: 'absolute' }

	switch (position) {
		case 'right':
			inlineStyle.top = dimensions.top + dimensions.height / 2
			inlineStyle.left = dimensions.left + dimensions.width + 15
			inlineStyle.transform = 'translate(0, -50%)'
			break

		case 'left':
			inlineStyle.top = dimensions.top + dimensions.height / 2
			inlineStyle.left = dimensions.left - 15
			inlineStyle.transform = 'translate(-100%, -50%)'
			break

		case 'top':
			inlineStyle.left = dimensions.left + dimensions.width / 2
			inlineStyle.top = dimensions.top - 15
			inlineStyle.transform = 'translate(-50%, -100%)'
			break

		case 'bottom':
			inlineStyle.left = dimensions.left + dimensions.width / 2
			inlineStyle.top = dimensions.top + dimensions.height + 15
			inlineStyle.transform = 'translate(-50%, 0)'
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
