import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

/**
 * Create a store instance per-request
 */
export const makeStore = () => {
	return configureStore({
		reducer: rootReducer,
	})
}

export type ReduxStore = ReturnType<typeof makeStore>
export type ReduxState = ReturnType<ReduxStore['getState']>
export type ReduxDispatch = ReduxStore['dispatch']
