import React from 'react'
import { SVGSpoilerHidden, SVGSpoilerVisible, SVGTrashCan } from '../SVGHandler'
import styles from './UploadElement.module.css'

const UploadElement = props => {
	const { spoiler, filename, src, index, toggleSpoiler, removeAttachment } =
		props
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
								<img
									className={`${styles.image} ${
										spoiler ? styles.spoiler : ''
									}`}
									alt=""
									aria-hidden={true}
									src={src}
								/>
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
								{spoiler ? (
									<SVGSpoilerHidden />
								) : (
									<SVGSpoilerVisible />
								)}
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
