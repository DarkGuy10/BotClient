import { useRef } from 'react'
import {
	SVGIDButton,
	SVGTrashCan,
	SVGReplyButton,
	SVGLinkButton,
	SVGOpenDMButton,
} from '../SVGHandler'
import styles from './MessageAction.module.css'
const { ipcRenderer } = window.require('electron')

const MessageAction = props => {
	const {
		handleReply,
		selectDM,
		createTooltip,
		destroyTooltip,
		updateHover,
		message,
		hover,
	} = props

	const { id, guildId, channelId, isDM, deletable, author } = message

	const replyRef = useRef(null)
	const openDMRef = useRef(null)
	const copyLinkRef = useRef(null)
	const copyIDRef = useRef(null)
	const deleteRef = useRef(null)

	return (
		<div className={styles.buttonContainer}>
			<div
				className={`${styles.buttons} ${hover ? styles.hover : ''}`}
				onMouseEnter={() => updateHover(true)}
				onMouseLeave={() => updateHover(false)}
			>
				<div className={styles.wrapper}>
					<div
						className={styles.button}
						onClick={() => handleReply(message)}
						ref={replyRef}
						onMouseEnter={() => {
							createTooltip({
								position: 'top',
								content: 'Reply',
								ref: replyRef,
							})
						}}
						onMouseLeave={() => {
							destroyTooltip()
						}}
					>
						<SVGReplyButton />
					</div>
					{!isDM && (
						<>
							<div
								className={styles.button}
								onClick={() => selectDM(author.id)}
								ref={openDMRef}
								onMouseEnter={() => {
									createTooltip({
										position: 'top',
										content: 'Open DM',
										ref: openDMRef,
									})
								}}
								onMouseLeave={() => {
									destroyTooltip()
								}}
							>
								<SVGOpenDMButton />
							</div>
							<div
								className={styles.button}
								onClick={() =>
									navigator.clipboard.writeText(
										`https://discord.com/channels/${guildId}/${channelId}/${id}`
									)
								}
								ref={copyLinkRef}
								onMouseEnter={() => {
									createTooltip({
										position: 'top',
										content: 'Copy Link',
										ref: copyLinkRef,
									})
								}}
								onMouseLeave={() => {
									destroyTooltip()
								}}
							>
								<SVGLinkButton />
							</div>
						</>
					)}
					<div
						className={styles.button}
						onClick={() => navigator.clipboard.writeText(id)}
						ref={copyIDRef}
						onMouseEnter={() => {
							createTooltip({
								position: 'top',
								content: 'Copy ID',
								ref: copyIDRef,
							})
						}}
						onMouseLeave={() => {
							destroyTooltip()
						}}
					>
						<SVGIDButton />
					</div>
					{deletable && (
						<div
							className={styles.button}
							onClick={() =>
								ipcRenderer.send('messageDelete', id)
							}
							ref={deleteRef}
							onMouseEnter={() => {
								createTooltip({
									position: 'top',
									content: 'Delete',
									ref: deleteRef,
								})
							}}
							onMouseLeave={() => {
								destroyTooltip()
							}}
						>
							<SVGTrashCan />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default MessageAction
