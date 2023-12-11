'use client'
import { useReduxDispatch } from '@/redux/hooks'
import { pushAlert } from '@/redux/features'
import { useEffect } from 'react'

export const CallbackBoundary = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const dispatch = useReduxDispatch()
	useEffect(() => {
		window.Conduit.Callback.error(error => {
			dispatch(
				pushAlert({ message: `${error.name}: ${error.code}`, type: 'error' })
			)
			console.log(error.stack)
		})

		return () => window.Conduit.Callback.clearAll()
	})
	return <>{children}</>
}
