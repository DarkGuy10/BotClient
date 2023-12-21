'use client'
import styles from '@/styles/dashboard.module.scss'
import { TextInput, SavedProfileCard, Button } from '@/components'
import { useState, useEffect } from 'react'
import { StrippedUserSchema } from 'ConduitAPI'
import { useReduxDispatch } from '@/redux/hooks'
import { pushAlert } from '@/redux/features'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
	let [inputToken, setInputToken] = useState('')
	let [savedUsers, setSavedUsers] = useState<StrippedUserSchema[]>([])
	const dispatch = useReduxDispatch()
	const router = useRouter()

	const fetchSavedUserData = async () => {
		const { error, data } = await window.Conduit.Resource.savedUserData()
		if (!error) setSavedUsers(data.savedUsers)
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
							onClick={async () => {
								if (!(await window.Conduit.Action.login(inputToken))) return
								const { data, error } =
									await window.Conduit.Resource.clientUserData()
								if (error) return
								dispatch(
									pushAlert({
										type: 'success',
										message: `Successfully logged in as @${data.clientUser.username}`,
									})
								)
								router.push('/webapp')
							}}
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
