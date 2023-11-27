import type { Meta, StoryObj } from '@storybook/react'
import Button from './Button'

const meta: Meta<typeof Button> = {
	component: Button,
	title: 'Modal/Button',
}

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
	args: {
		label: 'Primary',
		type: 'primary',
	},
}

export const PrimarySmall: Story = {
	args: {
		label: 'Primary Small',
		type: 'primary',
		small: true,
	},
}

export const Secondary: Story = {
	args: {
		label: 'Secondary',
		type: 'secondary',
	},
}

export const Cancel: Story = {
	args: {
		label: 'Cancel',
		type: 'cancel',
	},
}
export const Danger: Story = {
	args: {
		label: 'Danger',
		type: 'danger',
	},
}
