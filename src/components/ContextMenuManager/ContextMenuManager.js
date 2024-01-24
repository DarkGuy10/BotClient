import styles from './ContextMenuManager.module.css'
import { createRef, useEffect } from 'react'
//import { SVGCaret } from '../SVGHandler'

const ContextMenuManager = props => {
	const { menu, destroyContextMenu } = props

	let layerContainer = createRef(null)
	const handlePointerDown = event => {
		if (!layerContainer.current) return
		if (layerContainer.current.contains(event.target)) return
		destroyContextMenu()
	}

	const handleKeyDown = event => {
		if (event.key === 'Escape') destroyContextMenu(null)
	}

	useEffect(() => {
		window.addEventListener('mousedown', handlePointerDown)
		window.addEventListener('touchstart', handlePointerDown)
		window.addEventListener('pointerdown', handlePointerDown)
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('mousedown', handlePointerDown)
			window.removeEventListener('touchstart', handlePointerDown)
			window.removeEventListener('pointerdown', handlePointerDown)
			window.removeEventListener('keydown', handleKeyDown)
		}
	})

	if (!menu?.ref.current) {
		return <div className={styles.layerContainer} ref={layerContainer}></div>
	}

	const positionMapping = {
		top: 'menuTop',
		right: 'menuRight',
		bottom: 'menuBottom',
		left: 'menuLeft',
	}

	let inlineStyle = { position: 'absolute' }
	const reference = menu.ref.current.getBoundingClientRect()

	if (typeof menu.position === 'object') {
		if (menu.position.top) inlineStyle.top = menu.position.top
		if (menu.position.left) inlineStyle.left = menu.position.left
		if (menu.position.bottom) inlineStyle.bottom = menu.position.bottom
		if (menu.position.right) inlineStyle.right = menu.position.right
	} else {
		switch (menu.position) {
			case 'left':
				inlineStyle.top = reference.top + reference.height / 2
				inlineStyle.right = `calc(100vw - ${reference.left - 10}px)`
				inlineStyle.transform = 'translate(0, -50%)'
				break

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
	}

	function Submenu(props, ref) {
		const COLOR_CLASSES = {
			normal: styles.normal,
			danger: styles.danger,
			system: styles.brand,
		}

		const { submenu } = props

		return (
			<div
				className={`${styles.submenu} ${
					styles[positionMapping[menu.position]]
				} ${styles.menuPrimary}`}
			>
				{submenu.items.map((item, i) => {
					switch (item.type) {
						case 'separator': {
							return (
								<hr
									key={i}
									className={`${styles.separatorItem} ${item.className ?? ''}`}
								></hr>
							)
						}
						case 'button': {
							return (
								<div
									className={`${styles.buttonItem} ${
										COLOR_CLASSES[item.color ?? 'normal']
									} ${item.className ?? ''}`}
									key={i}
									onClick={item.onClick ?? null}
								>
									<span className={`${styles.buttonItemContent}`}>
										{item.content}
									</span>
									{item.icons
										? item.icons.map((icon, i) => (
												<span key={i} className={`${styles.buttonItemIcon}`}>
													{icon}
												</span>
											))
										: null}
								</div>
							)
						}
						/* Omitting out for now due to complexities
						case 'submenu': {
							let containerRef = createRef(null)
							let submenuRef = createRef(null)
							return (
								<div
									className={`${styles.buttonItem} ${
										styles.submenuItem
									} ${
										COLOR_CLASSES[item.color ?? 'normal']
									} ${item.className ?? ''}`}
									key={i}
									ref={containerRef}
									onClick={e =>
										(submenuRef.current === null ||
											!submenuRef.current.contains(
												e.target
											)) &&
										item.onClick()
									}
									onPointerOver={() => {
										if (submenuRef.current === null) return
										const rect =
											containerRef.current.getBoundingClientRect()
										const style = window.getComputedStyle(
											containerRef.current
										)

										console.log(
											style.paddingRight.substring(
												0,
												-2
											) + 5
										)
										submenuRef.current.style.left =
											rect.width +
											parseInt(
												style.paddingRight.slice(0, -2)
											) +
											5 -
											8 +
											'px'
										submenuRef.current.style.visibility =
											'visible'
									}}
									onPointerLeave={() => {
										console.log(submenuRef.current)
										if (submenuRef.current === null) return
										submenuRef.current.style.visibility =
											'hidden'
									}}
								>
									<span
										className={`${styles.buttonItemContent}`}
									>
										{item.content}
									</span>
									{item.icons
										? item.icons.map((icon, i2) => (
												<span
													key={i2}
													className={`${styles.buttonItemIcon}`}
												>
													{icon}
												</span>
										  ))
										: null}
									<span
										className={`${styles.buttonItemIcon} ${styles.submenuItemCaretIcon}`}
									>
										<SVGCaret />
									</span>

									<div
										className={styles.submenuItemSubmenu}
										ref={submenuRef}
										style={{ visibility: 'hidden' }}
									>
										<Submenu submenu={item.submenu} />
									</div>
								</div>
							)
						}
						*/

						default: {
							throw new Error(`Unrecognized submenu item type ${item.type}.`)
						}
					}
				})}
			</div>
		)
	}

	return (
		<div className={styles.layerContainer} ref={layerContainer}>
			{menu && (
				<div className={styles.layer} style={inlineStyle}>
					<Submenu submenu={menu} className={`${styles.menu}`} />
				</div>
			)}
		</div>
	)
}

export default ContextMenuManager
