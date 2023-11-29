import { Meta, StoryObj } from '@storybook/react'
import { SavedProfileCard } from './SavedProfileCard'

const meta: Meta<typeof SavedProfileCard> = {
	component: SavedProfileCard,
	title: 'Modal/SavedProfileCard',
}

export default meta

type Story = StoryObj<typeof meta>

export const Card: Story = {
	args: {
		avatarURL:
			'https://cdn.discordapp.com/app-icons/814082523217788929/d67fe3329e375602756c7f9d48eb26b1.png?size=512',
		username: 'Lonely',
		id: 'id123',
	},
}
