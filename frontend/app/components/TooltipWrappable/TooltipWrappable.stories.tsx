import { Meta, StoryObj } from '@storybook/react'
import { TooltipWrappable } from './TooltipWrappable'

const meta: Meta<typeof TooltipWrappable> = {
	component: TooltipWrappable,
	title: 'Wrappable/TooltipWrappable',
}

export default meta

type Story = StoryObj<typeof TooltipWrappable>

export const SmallRight: Story = {
	render: () => (
		<TooltipWrappable position="right" content="My Guild">
			<img
				src="https://avatars.githubusercontent.com/u/62807269?v=4"
				alt=""
				height={70}
			/>
		</TooltipWrappable>
	),
}

export const SmallBottom: Story = {
	render: () => (
		<TooltipWrappable position="bottom" content="My Guild">
			<img
				src="https://avatars.githubusercontent.com/u/62807269?v=4"
				alt=""
				height={70}
			/>
		</TooltipWrappable>
	),
}

export const SmallLeft: Story = {
	render: () => (
		<TooltipWrappable position="left" content="My Guild">
			<img
				src="https://avatars.githubusercontent.com/u/62807269?v=4"
				alt=""
				height={70}
			/>
		</TooltipWrappable>
	),
}

export const SmallTop: Story = {
	render: () => (
		<TooltipWrappable position="top" content="My Guild">
			<img
				src="https://avatars.githubusercontent.com/u/62807269?v=4"
				alt=""
				height={70}
			/>
		</TooltipWrappable>
	),
}

export const LargeRight: Story = {
	render: () => (
		<TooltipWrappable position="right" large content="My Guild">
			<img
				src="https://avatars.githubusercontent.com/u/62807269?v=4"
				alt=""
				height={70}
			/>
		</TooltipWrappable>
	),
}
