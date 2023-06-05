import { parseTwemojis } from '../../utils'
import { ChannelType } from 'discord-api-types/v10'
import { SVGChannels, SVGVoiceStates } from '../SVGHandler'
import styles from './ChannelListItem.module.css'

const ChannelListItem = props => {
	const {
		channel,
		collpasedCategoriesId,
		toggleCollapseCategory,
		selectChannel,
		selected,
	} = props
	const { isPrivate, isRules, parentId, id, viewable, type, name, members } =
		channel

	const isCategory = channel.type === ChannelType.GuildCategory
	const isParentCollapsed = collpasedCategoriesId.includes(parentId)
	const isCollapsed = collpasedCategoriesId.includes(id)
	const isViewable = viewable
	const svgType = isRules
		? 'RULES'
		: `${type}${isPrivate && !isCategory ? '_LIMITED' : ''}`
	return (
		<>
			<div
				className={`${styles.container} ${isCategory ? styles.category : ''} ${
					isCollapsed ? styles.collapsed : ''
				} ${isParentCollapsed ? styles.hidden : ''} ${
					!isViewable ? styles.muted : ''
				} ${selected ? styles.selected : ''}`}
				title={!isViewable ? 'Not Viewable' : ''}
				onClick={() =>
					isCategory ? toggleCollapseCategory(id) : selectChannel(id)
				}
			>
				{SVGChannels[svgType]}
				<div>{parseTwemojis(name)}</div>
			</div>
			{type === ChannelType.GuildVoice && members.length ? (
				<div className={styles.voiceMembersList}>
					{members.map((member, key) => (
						<div className={styles.memberContainer} key={key}>
							<img
								src={member.avatarURL}
								alt={`${member.user.username}'s Avatar`}
								className={styles.avatar}
							/>
							<div className={styles.username}>{member.displayName}</div>
							<div className={styles.icons}>
								{member.voice.serverMute ? (
									<Icon icon="serverMute" />
								) : member.voice.selfMute ? (
									<Icon icon="selfMute" />
								) : null}
								{member.voice.serverDeaf ? (
									<Icon icon="serverDeaf" />
								) : member.voice.selfDeaf ? (
									<Icon icon="selfDeaf" />
								) : null}
								{member.voice.selfVideo && <Icon icon="selfVideo" />}
								{member.voice.streaming && <Icon live />}
							</div>
						</div>
					))}
				</div>
			) : null}
		</>
	)
}

const Icon = props => {
	return (
		<div
			className={`${styles.iconSpacing} ${
				props.live ? styles.liveIconSpacing : ''
			}`}
		>
			{props.live ? (
				<div className={`${styles.liveIconSpacing} ${styles.iconSpacing}`}>
					<div className={styles.live}>Live</div>
				</div>
			) : (
				SVGVoiceStates[props.icon]
			)}
		</div>
	)
}

export default ChannelListItem
