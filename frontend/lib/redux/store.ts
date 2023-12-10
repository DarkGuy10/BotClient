import { configureStore } from '@reduxjs/toolkit'

/**
 * Create a store instance per-request
 */
export const makeStore = () => {
	return configureStore({
		reducer: {},
	})
}

export type ReduxStore = ReturnType<typeof makeStore>
export type ReduxState = ReturnType<ReduxStore['getState']>
export type ReduxDispatch = ReduxState['dispatch']
