import React from 'react'
import {
	DiscordAttachment,
	DiscordEmbed,
	DiscordEmbedDescription,
	DiscordEmbedField,
	DiscordEmbedFields,
	DiscordEmbedFooter,
	DiscordMessage,
	DiscordReply,
	DiscordTenorVideo,
} from '@skyra/discord-components-react'
import {
	decimalToHexColor,
	parseMarkdown,
	parseTimestamp,
} from './../../scripts'

const MessageElement = props => {
	const {
		content,
		embeds,
		type,
		author,
		member,
		createdTimestamp,
		editedTimestamp,
		repliesTo,
		stickers,
		attachments,
	} = props.message

	const allowedImageTypes = [
		'image/png',
		'image/jpeg',
		'image/gif',
		'image/webp',
	]

	const imageAttachments = [...attachments.values()].filter(attachment =>
		allowedImageTypes.includes(attachment.contentType)
	)

	return (
		<DiscordMessage
			author={member?.displayName ?? author.username}
			avatar={author.avatarURL}
			bot={author.bot}
			verified={author.isVerifiedBot}
			timestamp={parseTimestamp(createdTimestamp)}
			edited={editedTimestamp ? true : false}
			roleColor={decimalToHexColor(member?.color) || '#fff'}
		>
			{type === 'REPLY' ? (
				<DiscordReply
					slot="reply"
					author={
						repliesTo.member?.displayName ??
						repliesTo.author.username
					}
					avatar={repliesTo.author.avatarURL}
					bot={repliesTo.author.bot}
					verified={repliesTo.author.isVerifiedBot}
					edited={repliesTo.editedTimestamp ? true : false}
					roleColor={decimalToHexColor(repliesTo.member?.color)}
				>
					{shorten(repliesTo)}
				</DiscordReply>
			) : null}
			{parseMarkdown(content)}

			{stickers.map((sticker, key) => (
				<DiscordAttachment
					key={key}
					slot="attachments"
					url={sticker.URL}
					width={150}
					alt={sticker.name}
				/>
			))}

			{imageAttachments.map((item, key) => {
				const biggerSide = item.height > item.width ? 'height' : 'width'
				const allowance = biggerSide === 'height' ? 300 : 400
				let sizeOptions = {}
				sizeOptions[biggerSide] = Math.min(item[biggerSide], allowance)
				return (
					<DiscordAttachment
						key={key}
						slot="attachments"
						url={item.url}
						alt={item.name}
						{...sizeOptions}
					/>
				)
			})}

			{embeds.map((embed, key) => {
				const {
					provider,
					video,
					author,
					color,
					title,
					footer,
					image,
					url,
					timestamp,
					thumbnail,
					description,
					fields,
				} = embed
				if (provider?.name === 'Tenor') {
					const biggerSide =
						video.height > video.width ? 'height' : 'width'
					const allowance = biggerSide === 'height' ? 300 : 400
					let options = {
						slot: 'attachments',
						url: embed.video.url,
					}
					options[biggerSide] = Math.min(video[biggerSide], allowance)
					return <DiscordTenorVideo key={key} {...options} />
				}
				let options = {}
				let content = ''
				let footerOptions = { slot: 'footer' }
				options['slot'] = 'embeds'
				if (author?.name) options['authorName'] = author.name

				if (author?.iconURL) options['authorImage'] = author.iconURL

				if (author?.url) options['authorUrl'] = author.url

				if (color) options['color'] = decimalToHexColor(color)

				if (title) options['embedTitle'] = title

				if (image?.url) options['image'] = image.url

				if (url) options['url'] = embed.url

				if (timestamp)
					footerOptions['timestamp'] = parseTimestamp(timestamp)
				if (footer?.iconURL)
					footerOptions['footerImage'] = footer.iconURL

				if (video) {
					options['video'] = video.url
					options['provider'] = provider.name
					options['image'] = thumbnail.url
				} else {
					if (embed.thumbnail?.url)
						options['thumbnail'] = embed.thumbnail.url
					content = description
				}

				let lastFieldIndex = 0
				return (
					<DiscordEmbed key={key} {...options}>
						{content ? (
							<DiscordEmbedDescription slot="description">
								{parseMarkdown(content)}
							</DiscordEmbedDescription>
						) : null}
						{fields.length ? (
							<DiscordEmbedFields slot="fields">
								{fields.map((field, key) => {
									let fieldOptions = {}
									fieldOptions['fieldTitle'] = field.name
									if (field.inline) {
										fieldOptions['inline'] = true
										const index =
											!lastFieldIndex ||
											lastFieldIndex === 3
												? 1
												: lastFieldIndex + 1
										fieldOptions['inlineIndex'] = index
										lastFieldIndex = index
									} else lastFieldIndex = 0
									return (
										<DiscordEmbedField
											{...fieldOptions}
											key={key}
										>
											{field.value}
										</DiscordEmbedField>
									)
								})}
							</DiscordEmbedFields>
						) : null}

						<DiscordEmbedFooter {...footerOptions}>
							{footer?.text ?? ''}
						</DiscordEmbedFooter>
					</DiscordEmbed>
				)
			})}
		</DiscordMessage>
	)
}

const shorten = reference => {
	const allowance = 80 - reference.author.username.length
	return (
		reference.content.substring(0, allowance) +
		(reference.content.length >= allowance ? '...' : '')
	)
}

export default MessageElement
