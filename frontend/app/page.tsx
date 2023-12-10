'use client'
import styles from '@/styles/dashboard.module.scss'
import { TextInput, SavedProfileCard, Button } from '@/components'
import { useState, useEffect } from 'react'
import { StrippedUserSchema } from 'ConduitAPI'

export default function Dashboard() {
	let [inputToken, setInputToken] = useState('')
	let [savedUsers, setSavedUsers] = useState<StrippedUserSchema[]>([])

	const fetchSavedUserData = async () => {
		const savedUserData = await window.Conduit.Resource.savedUserData()
		setSavedUsers(savedUserData.data.savedUsers)
	}

	useEffect(() => {
		fetchSavedUserData()
	}, [])

	return (
		<div className={styles.layer}>
			<div className={styles.wrapper}>
				<div className={styles.addNewProfile}>
					<h1 className={styles.header}>Add New Profile</h1>
					<TextInput
						placeholder="Paste your token..."
						setState={setInputToken}
					/>
					<div className={styles.buttonContainer}>
						<Button
							type="primary"
							label="Login"
							onClick={() => window.Conduit.Action.login(inputToken)}
						/>
					</div>
				</div>
				<div className={styles.savedProfiles}>
					<h1 className={styles.header}>Saved Profiles</h1>
					<div className={styles.cardGrid}>
						{savedUsers &&
							savedUsers.map(user => (
								<SavedProfileCard
									{...user}
									key={user.id}
									fetchSavedUserData={fetchSavedUserData}
								/>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}
