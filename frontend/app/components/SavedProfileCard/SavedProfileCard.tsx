'use client'
import {
	SVGCloseButton,
	SVGCloseButtonCircle,
	SVGTrashCan,
	SVGTrashCanWhite,
} from '@/components'
import styles from './SavedProfileCard.module.scss'

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
	return (
		<div className={styles.wrapper}>
			<div
				className={styles.card}
				onClick={() => window.Conduit.Action.loginWithId(id)}
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
