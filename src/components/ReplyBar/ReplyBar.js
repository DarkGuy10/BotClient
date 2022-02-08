import React from 'react'
import { decimalToHexColor } from '../../utils'
import { SVGCloseButtonCircle } from '../SVGHandler'
import styles from './ReplyBar.module.css'

const ReplyBar = props => {
	const { replyingTo, handleReply } = props
	return (
		<div className={styles.attachedBars}>
			<div>
				<div className={styles.clipContainer}>
					<div className={styles.inner}>
						<div className={styles.replyBar}>
							<div>
								<div className={styles.replyLabel}>
									Replying to{' '}
									<span
										className={styles.name}
										style={{
											color: decimalToHexColor(
												replyingTo.member?.color
											),
										}}
									>
										{' '}
										{replyingTo.member?.displayName ||
											replyingTo.author.username}
									</span>
								</div>
							</div>
							<div className={styles.actions}>
								<div
									className={styles.closeButton}
									onClick={() => handleReply()}
								>
									<SVGCloseButtonCircle />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReplyBar
