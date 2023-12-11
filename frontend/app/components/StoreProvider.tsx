'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, type ReduxStore } from '@/redux/store'

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
	const storeRef = useRef<ReduxStore>()
	if (!storeRef.current) storeRef.current = makeStore()

	return <Provider store={storeRef.current}>{children}</Provider>
}
