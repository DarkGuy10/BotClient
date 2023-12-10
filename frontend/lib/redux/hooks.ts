import {
	useDispatch,
	useSelector,
	useStore,
	type TypedUseSelectorHook,
} from 'react-redux'
import type { ReduxState, ReduxDispatch, ReduxStore } from './store'

export const useReduxDispatch: () => ReduxDispatch = useDispatch
export const useReduxSelector: TypedUseSelectorHook<ReduxState> = useSelector
export const useReduxStore: () => ReduxStore = useStore
