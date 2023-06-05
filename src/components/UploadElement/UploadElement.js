import React from 'react'
import {
	SVGMimes,
	SVGSpoilerHidden,
	SVGSpoilerVisible,
	SVGTrashCan,
} from '../SVGHandler'
import styles from './UploadElement.module.css'

const UploadElement = props => {
	const {
		spoiler,
		filename,
		src,
		mime,
		index,
		toggleSpoiler,
		removeAttachment,
	} = props

	// Render preview based on file mime type
	let preview
	if (/image\/[A-Za-z]+/.test(mime))
		preview = (
			<img
				className={`${styles.image} ${spoiler ? styles.spoiler : ''}`}
				alt=""
				aria-hidden={true}
				src={src}
			/>
		)
	else {
		let mimeProp
		if (/video\/[A-Za-z]+/.test(mime)) mimeProp = 'VIDEO'
		else if (/audio\/[A-Za-z]+/.test(mime)) mimeProp = 'AUDIO'
		else if (mime === 'text/plain') mimeProp = 'TEXT'
		else if (
			//WIP : expand mime mapping
			/text\/[A-Za-z]+/.test(mime) ||
			['application/json', 'application/x-shellscript'].includes(mime)
		)
			mimeProp = 'CODE'
		else if (mime === 'application/pdf') mimeProp = 'PDF'
		else if (mime === 'application/zip') mimeProp = 'ZIP'
		else mimeProp = 'UNKNOWN'
		preview = <>{SVGMimes[mimeProp]}</>
	}

	return (
		<li className={styles.upload}>
			<div className={styles.uploadContainer}>
				<div className={styles.imageContainer}>
					<div
						className={`${styles.spoilerContainer} ${
							spoiler ? styles.hidden : ''
						}`}
					>
						<div aria-hidden={false}>
							<div className={styles.spoilerWrapper}>
								{preview}
								<div className={styles.tag}></div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.filenameContainer}>
					<div className={styles.filename}>{filename}</div>
				</div>
				<div className={styles.actionBarContainer}>
					<div className={styles.actionBar}>
						<div className={styles.wrapper}>
							<div
								className={styles.button}
								tabIndex={0}
								onClick={() => {
									toggleSpoiler(index)
								}}
							>
								{spoiler ? <SVGSpoilerHidden /> : <SVGSpoilerVisible />}
							</div>
							<div
								className={`${styles.button} ${styles.dangerous}`}
								tabIndex={0}
								onClick={() => {
									removeAttachment(index)
								}}
							>
								<SVGTrashCan />
							</div>
						</div>
					</div>
				</div>
			</div>
		</li>
	)
}

export default UploadElement
