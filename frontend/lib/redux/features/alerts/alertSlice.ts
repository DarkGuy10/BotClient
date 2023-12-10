import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_ALERT_TIMEOUT } from '@/constants'

export interface RawAlertData {
	type: 'error' | 'success' | 'system' | 'warning'
	message: string
	timeout?: number
}

export type AlertData = RawAlertData & { uniqueID: number }

export interface AlertState {
	data: AlertData[]
	lastUniqueID: number
}

const initialState: AlertState = {
	data: [],
	lastUniqueID: 0,
}

export const alertSlice = createSlice({
	name: 'alerts',
	initialState,
	reducers: {
		pushAlert: (state, action: PayloadAction<RawAlertData>) => {
			const uniqueID = state.lastUniqueID++
			state.data.push({
				...action.payload,
				timeout: action.payload.timeout || DEFAULT_ALERT_TIMEOUT,
				uniqueID,
			})
		},
		popAlert: (state, action: PayloadAction<number>) => {
			state.data = state.data.filter(each => each.uniqueID !== action.payload)
		},
	},
})

export const { pushAlert, popAlert } = alertSlice.actions
