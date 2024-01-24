import React, { Component, createRef } from 'react'
import { SVGCloseButton } from '../SVGHandler'
import { DMListItem } from '..'
import styles from './DMNav.module.css'
const { ipcRenderer } = window.require('electron')

class DMNav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			openDMs: [],
			fetchedUser: null,
			searchValue: '',
		}

		this.DMCreateEventRef = null
		this.inputRef = createRef()
		this.updateInput = (value = '') => {
			this.inputRef.current.value = ''
		}

		this.clearInput = () => {
			this.setState({
				...this.state,
				fetchedUser: null,
				searchValue: '',
			})
			this.updateInput()
		}

		this.handleInput = async ({ target }) => {
			const value = target.value.trim()
			let fetched
			if (/\d{17,19}/.test(value))
				fetched = await ipcRenderer.invoke('fetchUser', value)

			this.setState({
				...this.state,
				searchValue: value,
				fetchedUser: fetched,
			})
		}

		this.fetchDMs = async () => {
			const dms = await ipcRenderer.invoke('dms')
			this.setState({ ...this.state, openDMs: dms })
		}
	}

	componentDidMount() {
		this.fetchDMs()

		this.DMCreateEventRef = ipcRenderer.on('DMCreate', () => {
			this.fetchDMs()
		})
	}

	componentWillUnmount() {
		if (this.DMCreateEventRef)
			this.DMCreateEventRef.removeAllListeners('DMCreate')
	}

	render() {
		const { fetchedUser, searchValue, openDMs } = this.state

		return (
			<nav className={styles.DMNav}>
				<div className={styles.searchBar}>
					<input
						className={styles.input}
						placeholder="Enter UserID to search"
						spellCheck={false}
						ref={this.inputRef}
						onInput={this.handleInput}
					/>
					{searchValue && (
						<div className={styles.closeButton} onClick={this.clearInput}>
							<SVGCloseButton />
						</div>
					)}
				</div>
				{(fetchedUser || searchValue) && (
					<div className={styles.searchLabel}>
						{fetchedUser
							? fetchedUser.isClientUser
								? "You can't DM Yourself"
								: fetchedUser.bot
									? "You can't DM a Bot"
									: 'Click to Open DMs'
							: searchValue
								? 'No Result'
								: ''}
					</div>
				)}

				{fetchedUser && (
					<DMListItem
						user={fetchedUser}
						selectDM={this.props.selectDM}
						clearInput={this.clearInput}
						disabled={fetchedUser.bot}
						fetched
					/>
				)}
				<h2 className={styles.privateChannelsHeaderContainer}>
					<span className={styles.headerText}>Open Direct Messages</span>
				</h2>
				{openDMs.map(({ recipient }, key) => (
					<DMListItem
						key={key}
						user={recipient}
						selectDM={this.props.selectDM}
						clearInput={this.clearInput}
					/>
				))}
			</nav>
		)
	}
}

export default DMNav
