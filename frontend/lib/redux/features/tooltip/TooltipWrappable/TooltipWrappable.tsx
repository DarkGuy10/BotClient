'use client'
import { createTooltip, destroyTooltip } from '../tooltipSlice'
import { useRef } from 'react'
import { useReduxDispatch } from '@/redux/hooks'

interface TooltipWrappableProps {
	children: React.ReactNode
	position: 'top' | 'right' | 'bottom' | 'left'
	large?: boolean
	content: string
}

export function TooltipWrappable({
	children,
	position,
	large = false,
	content,
}: TooltipWrappableProps) {
	const parentRef = useRef(null)
	const dispatch = useReduxDispatch()

	return (
		<div
			ref={parentRef}
			onMouseEnter={() =>
				dispatch(createTooltip({ position, large, content, parentRef }))
			}
			onMouseLeave={() => dispatch(destroyTooltip())}
		>
			{children}
		</div>
	)
}
