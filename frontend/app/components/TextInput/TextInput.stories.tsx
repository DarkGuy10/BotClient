import TextInput from './TextInput'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof TextInput> = {
	component: TextInput,
	title: 'Modal/TextInput',
}

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {
	args: {
		placeholder: 'Paste your token here...',
	},
}

export const WithLabel: Story = {
	args: {
		placeholder: 'Inumaki Toge',
		label: 'Your Username',
	},
}
