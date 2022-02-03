import React from 'react'
import Twemoji from 'react-twemoji'

const parseTwemojis = content => {
	return (
		<Twemoji noWrapper={true} options={{ className: 'twemoji' }}>
			<span>{content}</span>
		</Twemoji>
	)
}

export default parseTwemojis
