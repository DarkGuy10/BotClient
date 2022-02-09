import React from 'react'
import { SVGCogsThick, SVGLogout } from '../SVGHandler'
import styles from './UserSection.module.css'
const { ipcRenderer } = window.require('electron')

const UserSection = props => {
	const { clientUser, openUserSettings } = props
	return (
		<section className={styles.userSection}>
			<div className={styles.container}>
				<div className={styles.avatarWrapper}>
					<img
						src={clientUser.avatarURL}
						alt="Bot Avatar"
						className={styles.avatar}
					/>
				</div>
				<div className={styles.nameTag}>
					<div className={styles.usernameContainer}>
						<div className={styles.username}>
							{clientUser.username}
						</div>
					</div>
					<div className={styles.discriminator}>
						#{clientUser.discriminator}
					</div>
				</div>
				<div className={styles.buttons}>
					<button
						className={styles.button}
						onClick={() => ipcRenderer.send('logout')}
					>
						<div className={styles.contents}>
							<SVGLogout />
						</div>
					</button>
					<button className={styles.button}>
						<div
							className={styles.contents}
							onClick={() => openUserSettings()}
						>
							<SVGCogsThick />
						</div>
					</button>
				</div>
			</div>
		</section>
	)
}

export default UserSection
