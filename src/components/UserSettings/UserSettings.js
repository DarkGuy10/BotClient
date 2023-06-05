import React, { Component } from 'react'
import Settings from './Settings'
import { SVGCloseButton } from '../SVGHandler'
import styles from './UserSettings.module.css'

const Item = props => {
	const { item, SelectedTitle, handleSelect } = props
	return (
		<div
			className={`${styles.item} ${
				item.label === SelectedTitle ? styles.selected : ''
			}`}
			onClick={() => handleSelect(item)}
		>
			{item.label}
		</div>
	)
}

class UserSettings extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selected: Settings[0].subsettings[0],
		}
		this.handleSelect = newSelected => {
			this.setState({ ...this.state, selected: newSelected })
		}
	}

	render() {
		const { closeUserSettings } = this.props
		const { selected } = this.state
		const { label: SelectedTitle, Component: SelectedSetting } = selected
		return (
			<div className={styles.userSettings}>
				<div className={styles.wrapper}>
					<div className={styles.sideBarRegion}>
						<div className={styles.sideBarRegionScroller}>
							<nav className={styles.sidebar}>
								<div className={styles.side}>
									{Settings.map(({ header, subsettings }, key) => (
										<div key={key}>
											<div className={styles.header}>{header}</div>
											{subsettings.map((item, key) => (
												<Item
													key={key}
													item={item}
													SelectedTitle={SelectedTitle}
													handleSelect={this.handleSelect}
												/>
											))}
											<div className={styles.separator}></div>
										</div>
									))}
								</div>
							</nav>
						</div>
					</div>
					<div className={styles.contentRegion}>
						<div className={styles.contentTransitionWrap}>
							<div className={styles.contentRegionScroller}>
								<main className={styles.contentColumn}>
									<div>
										<div className={styles.sectionTitle}>
											<h1 className={styles.title}>{SelectedTitle}</h1>
										</div>
										<div className={styles.children}>
											<SelectedSetting />
										</div>
									</div>
								</main>
								<div className={styles.toolsContainer}>
									<div className={styles.tools}>
										<div className={styles.container}>
											<div
												className={styles.closeButton}
												onClick={() => {
													closeUserSettings()
												}}
											>
												<SVGCloseButton />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default UserSettings
