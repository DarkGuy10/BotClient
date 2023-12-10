'use client'
import { useEffect } from 'react'
import styles from './Alert.module.scss'
import { useReduxDispatch } from '@/redux/hooks'
import { type AlertData, popAlert } from '../alertSlice'

export const Alert = ({ type, message, uniqueID, timeout }: AlertData) => {
	// At the end of  timeout interval, this component dispatches an action
	// to despawn itself
	const dispatch = useReduxDispatch()
	useEffect(() => {
		setTimeout(() => dispatch(popAlert(uniqueID)), timeout)
	}, [dispatch, uniqueID, timeout])

	return <div className={`${styles[type]}`}>{message}</div>
}
