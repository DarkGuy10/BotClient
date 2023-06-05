import { useRef, useState } from 'react'
import logoTransparent from './../../assets/images/logo-transparent.png'
import logoAnimated from './../../assets/images/logo-animated.gif'
import styles from './GuildListItem.module.css'

const GuildListItem = props => {
	const {
		home,
		selected,
		guild,
		openHome,
		selectGuild,
		createTooltip,
		destroyTooltip,
	} = props
	const [hover, updateHover] = useState(false)
	const selfRef = useRef(null)

	return (
		<div className={styles.listItem} ref={selfRef}>
			<div className={styles.pill}>
				<span
					className={
						selected ? styles.pillSelected : hover ? styles.pillHover : ''
					}
				></span>
			</div>
			<div
				className={`${styles.wrapper} ${home ? styles.home : ''} ${
					selected ? styles.selected : ''
				}`}
				onClick={() => (home ? openHome() : selectGuild(guild.id))}
				onMouseEnter={() => {
					updateHover(true)
					createTooltip({
						position: 'right',
						listItem: true,
						content: guild?.name || 'Direct Messages',
						ref: selfRef,
					})
				}}
				onMouseLeave={() => {
					updateHover(false)
					destroyTooltip()
				}}
			>
				{home || guild?.iconURL ? (
					<img
						src={
							home
								? selected || hover
									? logoAnimated
									: logoTransparent
								: guild.iconURL
						}
						className={styles.icon}
						alt={guild?.name || 'Home'}
					/>
				) : (
					<div className={styles.acronym}>
						{guild.name.split(/ +/).map(each => each.charAt(0))}
					</div>
				)}
			</div>
		</div>
	)
}

export default GuildListItem
