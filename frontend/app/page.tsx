import styles from '@/styles/dashboard.module.scss'

export default function Dashboard() {
	return (
		<div className={styles.layer}>
			<div className={styles.wrapper}>
				<div className={styles.addNewProfile}>
					<h1 className={styles.header}>Add New Profile</h1>
					<input
						type="text"
						className={styles.tokenField}
						placeholder="Paste the token here..."
					/>
				</div>
			</div>
		</div>
	)
}
