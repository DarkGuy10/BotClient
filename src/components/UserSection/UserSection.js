import React, { createRef } from 'react'
import { StatusIndicator } from '..'
import { SVGCogsThick, SVGLogout } from '../SVGHandler'
import styles from './UserSection.module.css'
const { ipcRenderer } = window.require('electron')

const UserSection = props => {
	const { clientUser, openUserSettings, createTooltip, destroyTooltip } = props
	const logoutRef = createRef()
	const userSettingsRef = createRef()
	return (
		<section className={styles.userSection}>
			<div className={styles.container}>
				<div className={styles.avatarWrapper}>
					<img
						src={clientUser.displayAvatarURL}
						alt="Bot Avatar"
						className={styles.avatar}
					/>
					<div className={styles.statusWrapper}>
						<StatusIndicator type={clientUser.presence.status.toUpperCase()} />
					</div>
				</div>
				<div className={styles.nameTag}>
					<div className={styles.usernameContainer}>
						<div className={styles.username}>{clientUser.username}</div>
					</div>
					<div className={styles.discriminator}>
						#{clientUser.discriminator}
					</div>
				</div>
				<div className={styles.buttons}>
					<button
						className={styles.button}
						onClick={() => ipcRenderer.send('logout')}
						ref={logoutRef}
						onMouseEnter={() =>
							createTooltip({
								position: 'top',
								ref: logoutRef,
								content: 'Logout',
							})
						}
						onMouseLeave={() => destroyTooltip()}
					>
						<div className={styles.contents}>
							<SVGLogout />
						</div>
					</button>
					<button
						className={styles.button}
						onClick={() => openUserSettings()}
						ref={userSettingsRef}
						onMouseEnter={() =>
							createTooltip({
								position: 'top',
								ref: userSettingsRef,
								content: 'User Settings',
							})
						}
						onMouseLeave={() => destroyTooltip()}
					>
						<div className={styles.contents}>
							<SVGCogsThick />
						</div>
					</button>
				</div>
			</div>
		</section>
	)
}

export default UserSection
