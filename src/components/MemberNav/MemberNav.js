import React, { Component } from 'react'
import { parseTwemojis } from '../../utils'
import { MemberListItem } from './../'
import styles from './MemberNav.module.css'
const { ipcRenderer } = window.require('electron')

class MemberNav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			members: [],
		}

		this.fetchMembers = async () => {
			const members = await ipcRenderer.invoke('members')
			this.setState({ ...this.state, members: members })
		}
	}

	componentDidMount() {
		this.fetchMembers()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.currentChannel.id !== this.props.currentChannel.id)
			this.fetchMembers()
	}

	render() {
		const { members } = this.state
		const { hoisted, online, offline } = orderMembers(members)
		return (
			<div className={styles.memberNav}>
				<aside className={styles.membersWrap}>
					<div className={styles.members}>
						{[...hoisted].map(([role, members], key) => (
							<div key={key}>
								<h2 className={styles.header}>
									<span>
										{parseTwemojis(role.name)} — {members.length}{' '}
									</span>
								</h2>
								{members.map((member, key) => (
									<MemberListItem key={key} member={member} />
								))}
							</div>
						))}
						{online.length ? (
							<div>
								<h2 className={styles.header}>
									<span>online — {online.length}</span>
								</h2>
								{online.map((member, key) => (
									<MemberListItem key={key} member={member} />
								))}
							</div>
						) : null}
						{offline.length ? (
							<div>
								<h2 className={styles.header}>
									<span>offline — {offline.length}</span>
								</h2>
								{offline.map((member, key) => (
									<MemberListItem key={key} member={member} />
								))}
							</div>
						) : null}
					</div>
				</aside>
			</div>
		)
	}
}

/**
 *
 * @param {Array} members
 */
const orderMembers = members => {
	const offline = sortAlphabetically(members.filter(member => !member.presence))
	const online = sortAlphabetically(
		members.filter(member => member.presence && !member.isHoisted)
	)
	const hoisted = members.filter(member => member.presence && member.isHoisted)

	const uniqify = roles => {
		return roles.filter((value, index, self) => {
			return self.findIndex(role => role.id === value.id) === index
		})
	}

	const hoistedRoles = uniqify(hoisted.map(each => each.roles.hoist)).sort(
		(a, b) => b.position - a.position
	)

	const result = {
		hoisted: new Map(
			hoistedRoles.map(hoistedRole => [
				hoistedRole,
				sortAlphabetically(
					hoisted.filter(one => one.roles.hoist.id === hoistedRole.id)
				),
			])
		),
		online: online,
		offline: offline,
	}
	return result
}

const sortAlphabetically = arr => {
	return [...arr].sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export default MemberNav
