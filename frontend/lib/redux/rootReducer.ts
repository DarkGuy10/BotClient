import { alertSlice, tooltipSlice } from './features'

export const rootReducer = {
	tooltip: tooltipSlice.reducer,
	alerts: alertSlice.reducer,
}
