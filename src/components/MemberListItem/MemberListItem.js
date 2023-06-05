import React from 'react'
import styles from './MemberListItem.module.css'
import { parseTwemojis } from './../../utils'
import { BotTag, StatusIndicator } from '..'

const MemberListItem = props => {
	const { member } = props
	const {
		color,
		hexColor,
		avatarURL,
		displayName,
		presence,
		isVerifiedBot,
		user,
	} = member
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
			<div className={`${styles.container} ${!presence ? styles.offline : ''}`}>
				<div className={styles.avatarWrapper}>
					<img
						src={avatarURL}
						className={styles.avatar}
						alt={`${displayName}'s avatar`}
					/>
					{presence && (
						<div className={styles.statusWrapper}>
							<StatusIndicator type={presence.status.toUpperCase()} />
						</div>
					)}
				</div>
				<div className={styles.content}>
					<div className={styles.nameAndDecorators}>
						<div className={styles.name}>
							<span
								className={styles.roleColor}
								style={{
									color: color ? hexColor : '',
								}}
							>
								{member.displayName}
							</span>
						</div>
						{user.bot ? <BotTag verified={isVerifiedBot} /> : null}
					</div>
					<div className={styles.subText}>
						{subText ? (
							<div className={styles.activity}>
								<div className={styles.activityText}>
									{parseTwemojis(subText)}
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
