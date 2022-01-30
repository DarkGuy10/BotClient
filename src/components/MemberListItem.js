import React from 'react'
import styles from './../styles/memberlistitem.module.css'
import { decimalToHexColor } from '../scripts'

const MemberListItem = props => {
	const { member } = props
	const { color, avatarURL, displayName, presence } = member
	let subText = ''
	if (presence?.activities?.length) {
		const activity = presence.activities[0]
		switch (activity.type) {
			case 'CUSTOM':
				subText = activity.state
				break

			case 'LISTENING':
				subText = (
					<>
						Listening to <strong>{activity.name}</strong>
					</>
				)
				break

			case 'PLAYING':
				subText = (
					<>
						Playing <strong>{activity.name}</strong>
					</>
				)
				break

			case 'WATCHING':
				subText = (
					<>
						Watching <strong>{activity.name}</strong>
					</>
				)
				break

			case 'STREAMING':
				subText = (
					<>
						Streaming <strong>{activity.name}</strong>
					</>
				)
				break

			default:
				break
		}
	}
	return (
		<>
			<div
				className={`${styles.container} ${
					!presence ? styles.offline : ''
				}`}
			>
				<img
					src={avatarURL}
					className={styles.avatar}
					alt={`${displayName}'s avatar`}
				/>
				<div className={styles.content}>
					<div className={styles.nameAndDecorators}>
						<div className={styles.name}>
							<span
								className={styles.roleColor}
								style={{
									color: decimalToHexColor(color),
								}}
							>
								{member.displayName}
							</span>
						</div>
					</div>
					<div className={styles.subText}>
						{subText ? (
							<div className={styles.activity}>
								<div className={styles.activityText}>
									{subText}
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</>
	)
}

export default MemberListItem
