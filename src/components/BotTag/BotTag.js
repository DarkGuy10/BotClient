import React from 'react'
import { SVGBotTagVerified } from '../SVGHandler'
import styles from './BotTag.module.css'

const BotTag = props => {
	const { verified } = props
	return (
		<span className={styles.botTag}>
			{verified ? <SVGBotTagVerified /> : null}
			<span className={styles.botText}>BOT</span>
		</span>
	)
}

export default BotTag
