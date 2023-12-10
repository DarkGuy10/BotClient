import alertSlice from './features/alerts/alertSlice'
import tooltipSlice from './features/tooltip/tooltipSlice'

export const rootReducer = {
	tooltip: tooltipSlice,
	alerts: alertSlice,
}
