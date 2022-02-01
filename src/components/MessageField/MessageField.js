import React, { Component, createRef } from 'react'
import styles from './MessageField.module.css'
import { SVGUpload } from './../SVGHandler'
import UploadElement from '../UploadElement/UploadElement'
const { ipcRenderer } = window.require('electron')

class MessageField extends Component {
	constructor(props) {
		super(props)

		this.state = {
			value: '',
			files: [],
		}

		this.inputRef = createRef()
		this.uploadRef = createRef()

		this.updateField = (value = '') => {
			this.inputRef.current.value = value
		}

		this.imitateUploadClick = () => {
			this.uploadRef.current.click()
		}

		this.focusInput = () => {
			this.inputRef.current.focus()
		}

		this.handleSubmit = event => {
			event.preventDefault()
			const { value, files } = this.state
			if (!value && !files.length) return
			const attachments = files.map(({ path, filename, spoiler }) => {
				return {
					attachment: path,
					name: `${spoiler ? 'SPOILER_' : ''}${filename}`,
				}
			})
			let messageOptions = {}
			if (value) messageOptions.content = value
			if (attachments.length) messageOptions.files = attachments
			ipcRenderer.send('messageCreate', messageOptions)
			this.setState({ value: '', files: [] })
			this.updateField()
			this.focusInput()
		}

		this.handleUpload = ({ target }) => {
			const { files } = this.state
			const fileObjects = [...target.files].map(file => {
				return {
					filename: file.name,
					path: file.path,
					src: URL.createObjectURL(file),
					spoiler: false,
				}
			})
			this.setState({ ...this.state, files: [...files, ...fileObjects] })
			this.focusInput()
		}

		this.toggleSpoiler = key => {
			const { files } = this.state
			if (!files[key]) return
			const mutatedFiles = files.map((file, index) => {
				if (index === key) return { ...file, spoiler: !file.spoiler }
				return file
			})
			this.setState({ ...this.state, files: [...mutatedFiles] })
			this.focusInput()
		}

		this.removeAttachment = key => {
			const { files } = this.state
			if (!files[key]) return
			const mutatedFiles = files.filter((file, index) => index !== key)
			this.setState({ ...this.state, files: [...mutatedFiles] })
			this.focusInput()
		}
	}

	render() {
		const { currentChannel } = this.props
		const { files } = this.state
		return (
			<form
				action="#"
				className={styles.form}
				onSubmit={this.handleSubmit}
			>
				<div className={styles.channelTextArea}>
					<div className={styles.container}>
						{files.length ? (
							<>
								<ul className={styles.channelAttachmentArea}>
									{files.map(
										({ filename, src, spoiler }, key) => (
											<UploadElement
												key={key}
												index={key}
												filename={filename}
												src={src}
												spoiler={spoiler}
												toggleSpoiler={
													this.toggleSpoiler
												}
												removeAttachment={
													this.removeAttachment
												}
											/>
										)
									)}
								</ul>
								<div className="divider"></div>
							</>
						) : null}
						<div className={styles.inner}>
							<div className={styles.uploadInput}>
								<input
									className={styles.fileUpload}
									type={'file'}
									tabIndex={-1}
									multiple
									accept=""
									aria-hidden
									ref={this.uploadRef}
									onChange={this.handleUpload}
								/>
							</div>
							<div className={styles.attachWrapper}>
								<button
									className={styles.attachButton}
									type={'button'}
									onClick={this.imitateUploadClick}
								>
									<div className={styles.attachButtonInner}>
										<SVGUpload />
									</div>
								</button>
							</div>
							<div className={styles.textArea}>
								<input
									className={styles.textAreaSlate}
									placeholder={`Message in #${currentChannel.name}`}
									onInput={({ target }) => {
										this.setState({ value: target.value })
									}}
									autoFocus
									ref={this.inputRef}
								/>
							</div>
						</div>
					</div>
				</div>
			</form>
		)
	}
}

export default MessageField
