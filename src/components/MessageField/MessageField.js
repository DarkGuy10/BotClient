import React, { Component, createRef } from 'react'
import { ImagePreview } from './../'
import styles from './MessageField.module.css'
import { SVGUpload } from './../SVGHandler'
const { ipcRenderer } = window.require('electron')

class MessageField extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: '',
			files: [],
		}

		this.inputRef = createRef()
		this.updateField = (value = '') => {
			this.inputRef.current.value = value
		}

		this.handleSubmit = event => {
			event.preventDefault()
			const { value } = this.state
			if (!value) return
			ipcRenderer.send('messageCreate', { content: value })
			this.updateField()
		}

		this.handleUpload = ({ target }) => {
			this.setState({ ...this.state, files: [...target.files] })
		}
	}

	render() {
		const { currentChannel } = this.props
		const { files } = this.state
		const imageURLs = files.map(file => URL.createObjectURL(file))
		return (
			<div className={styles.wrapper}>
				{/*<ImagePreview files={files} />*/}
				<form
					action="#"
					onSubmit={this.handleSubmit}
					className={styles.inner}
				>
					<div className={styles.uploadWrapper}>
						<div className={styles.upload}>
							<SVGUpload />
						</div>
						{/*
						<input
							type={'file'}
							multiple
							accept="image/*"
							onChange={this.handleUpload}
							title=""
							className={styles.uploadField}
						/>*/}
					</div>

					<input
						className={styles.field}
						placeholder={`Message in #${currentChannel.name}`}
						onInput={({ target }) => {
							this.setState({ value: target.value })
						}}
						autoFocus
						ref={this.inputRef}
					/>
				</form>
				<div className={styles.underGrowth}></div>
			</div>
		)
	}
}

export default MessageField
