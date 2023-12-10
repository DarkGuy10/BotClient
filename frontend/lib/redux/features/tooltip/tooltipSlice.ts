import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface TooltipData {
	position: 'top' | 'right' | 'bottom' | 'left'
	large?: boolean
	content: string
	parentRef: React.MutableRefObject<any>
}

export type TooltipState = NullableState<TooltipData>

const initialState: TooltipState = {
	data: null,
}

export const tooltipSlice = createSlice({
	name: 'tooltips',
	initialState,
	reducers: {
		createTooltip: (state, action: PayloadAction<TooltipData>) => {
			state.data = { ...action.payload }
		},
		destroyTooltip: state => {
			state.data = null
		},
	},
})

export const { createTooltip, destroyTooltip } = tooltipSlice.actions
