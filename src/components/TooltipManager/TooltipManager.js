import styles from './TooltipManager.module.css'

const TooltipManager = props => {
	const { tooltip } = props

	if (!tooltip?.ref.current)
		return <div className={styles.layerContainer}></div>

	const positionMapping = {
		top: 'tooltipTop',
		right: 'tooltipRight',
		bottom: 'tooltipBottom',
		left: 'tooltipLeft',
	}

	let inlineStyle = { position: 'absolute' }
	const reference = tooltip.ref.current.getBoundingClientRect()

	switch (tooltip.position) {
		case 'right':
			inlineStyle.top = reference.top + reference.height / 2
			inlineStyle.left = reference.right + 10
			inlineStyle.transform = 'translate(0, -50%)'
			break

		case 'top':
			inlineStyle.left = reference.left + reference.width / 2
			inlineStyle.bottom = window.innerHeight - reference.top + 10
			inlineStyle.transform = 'translate(-50%, 0)'
			break

		case 'bottom':
			inlineStyle.left = reference.left + reference.width / 2
			inlineStyle.top = reference.bottom + 10
			inlineStyle.transform = 'translate(-50%, 0)'
			break

		default:
	}

	return (
		<div className={styles.layerContainer}>
			{tooltip && (
				<div className={styles.layer} style={inlineStyle}>
					<div
						className={`${styles.tooltip} ${
							styles[positionMapping[tooltip.position]]
						} ${styles.tooltipPrimary} ${
							tooltip.listItem ? styles.listItemTooltip : ''
						}`}
					>
						<div className={styles.tooltipPointer}></div>
						<div className={styles.tooltipContent}>{tooltip.content}</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default TooltipManager
