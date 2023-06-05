import { useRef } from 'react'
import {
	SVGIDButton,
	SVGMoreButton,
	SVGTrashCan,
	SVGTrashCanWhite,
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
		createContextMenu,
		destroyContextMenu,
		updateHover,
		message,
		hover,
	} = props

	const { id, guildId, channelId, isDM, deletable, author } = message

	const replyRef = useRef(null)
	const openDMRef = useRef(null)
	const moreRef = useRef(null)

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
					{!isDM && !author.bot && (
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
						</>
					)}
					<div
						className={styles.button}
						onClick={e => {
							updateHover(true) // tofix
							createContextMenu({
								position: 'left',
								items: [
									{
										type: 'button',
										content: 'Copy Message Link',
										icons: [<SVGLinkButton />],
										onClick: () =>
											destroyContextMenu() ||
											navigator.clipboard.writeText(
												`https://discord.com/channels/${guildId}/${channelId}/${id}`
											),
									},
									{
										type: 'button',
										content: 'Delete Message',
										icons: [
											<>
												<SVGTrashCan data-hide-on-hover />
												<SVGTrashCanWhite data-hide-on-unhover />
											</>,
										],
										onClick: () =>
											destroyContextMenu() ||
											(deletable && ipcRenderer.send('messageDelete', id)),

										color: 'danger',
									},
									{ type: 'separator' },
									{
										type: 'button',
										content: 'Copy Message ID',
										icons: [<SVGIDButton />],
										onClick: () =>
											destroyContextMenu() || navigator.clipboard.writeText(id),
									},
								],
								ref: moreRef,
							})
						}}
						ref={moreRef}
						onMouseEnter={() => {
							createTooltip({
								position: 'top',
								content: 'More',
								ref: moreRef,
							})
						}}
						onMouseLeave={() => {
							destroyTooltip()
						}}
					>
						<SVGMoreButton />
					</div>
				</div>
			</div>
		</div>
	)
}

export default MessageAction
