import React from 'react'
import styles from './DMListItem.module.css'

const DMListItem = props => {
	const { selectDM, clearInput, user, fetched, disabled } = props
	return (
		<div
			className={`${styles.userItem} ${fetched ? styles.topMargin5 : ''} ${
				disabled ? styles.disabled : ''
			}`}
			onClick={async () => {
				if (disabled) return
				await selectDM(user.id)
				if (fetched) clearInput()
			}}
		>
			<div className={styles.layout}>
				<div className={styles.avatarWrapper}>
					<img
						src={user.avatarURL}
						alt={`${user.username}'s Avatar`}
						className={styles.avatar}
					/>
				</div>
				<div className={styles.content}>
					<div className={styles.nameAndDecorators}>
						<div className={styles.name}>
							<div className={styles.overflow}>{user.username}</div>
						</div>
					</div>
					<div className={styles.discriminator}>#{user.discriminator}</div>
				</div>
			</div>
		</div>
	)
}

export default DMListItem
