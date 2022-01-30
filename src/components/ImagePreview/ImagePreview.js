import React from 'react'
import ImagePreviewElement from './../ImagePreviewElement/ImagePreviewElement'
import styles from './ImagePreview.module.css'

const ImagePreview = props => {
	const { files } = props
	return (
		<div className={styles.wrapper}>
			{files.map(({ spoiler, name, src }, key) => (
				<ImagePreviewElement
					key={key}
					spoiler={spoiler}
					name={name}
					src={src}
				/>
			))}
		</div>
	)
}

export default ImagePreview
