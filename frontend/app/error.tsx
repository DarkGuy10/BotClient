'use client'
import styles from '@/styles/error.module.scss'
import { useEffect } from 'react'
import { Button } from '@/components'

interface ErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error(error)
	}, [error])
	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.headerContainer}>
					<img
						src="/images/menhera-twig.webp"
						alt="Menhera Twig"
						className={styles.lightFade}
					/>
					<h1 className={styles.headerText}>Something went wrong</h1>
					<div className={styles.subtext}>
						BotClient crashed unexpectedly... Yeah this is embarrassing ;-;{' '}
						<br />
						If the crashes happen repeatedly,{' '}
						<a href="https://github.com/DarkGuy10/BotClient/issues/new/choose">
							open an issue
						</a>{' '}
						alongwith the logs.
					</div>
					<Button type="primary" onClick={() => reset()} label="Reload" />
				</div>
				<div className={styles.content}>
					<div className={styles.logsHeader}>Crash Report</div>
					<div className={styles.logsContainer}>{error.stack}</div>
				</div>
			</div>
		</div>
	)
}
