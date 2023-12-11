'use client'
import { useReduxDispatch } from '@/redux/hooks'
import { SVGCloseButton } from '../SVGHandler'
import styles from './SavedProfileCard.module.scss'
import { pushAlert } from '@/redux/features'

interface SavedProfileCardProps {
	username: string
	avatarURL: string
	id: string
	fetchSavedUserData: () => Promise<void>
}

export const SavedProfileCard = ({
	username,
	avatarURL,
	id,
	fetchSavedUserData,
}: SavedProfileCardProps) => {
	const dispatch = useReduxDispatch()

	return (
		<div className={styles.wrapper}>
			<div
				className={styles.card}
				onClick={async () => {
					if (await window.Conduit.Action.loginWithId(id)) {
						const { data, error } =
							await window.Conduit.Resource.clientUserData()
						if (!error)
							dispatch(
								pushAlert({
									type: 'success',
									message: `Successfully logged in as @${data.clientUser.username}`,
								})
							)
					}
				}}
			>
				<img
					className={styles.avatar}
					src={avatarURL}
					alt={`${username}'s avatar`}
				/>
				<div className={styles.username}>{username}</div>
				<div
					className={styles.deleteButton}
					onClick={async event => {
						event.stopPropagation()
						if (await window.Conduit.Action.deleteSavedUser(id))
							fetchSavedUserData()
					}}
				>
					<SVGCloseButton />
				</div>
			</div>
		</div>
	)
}
