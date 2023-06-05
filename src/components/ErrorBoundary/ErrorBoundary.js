import { Component } from 'react'
import menheraTwig from './../../assets/images/menhera-twig.webp'
import styles from './ErrorBoundary.module.css'

class ErrorBoundary extends Component {
	constructor(props) {
		super(props)

		this.state = {
			error: null,
			errorInfo: null,
		}
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo,
		})
	}

	render() {
		if (this.state.errorInfo) {
			// Error path
			return (
				<div className={styles.wrapper}>
					<div className={styles.container}>
						<div className={styles.headerContainer}>
							<img
								src={menheraTwig}
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
							<button
								className={styles.reloadButton}
								onClick={() => window.location.reload()}
							>
								Reload
							</button>
						</div>
						<div className={styles.content}>
							<div className={styles.logsHeader}>Crash Report</div>
							<div className={styles.logsContainer}>
								{this.state.error && this.state.error.toString()}

								{this.state.errorInfo.componentStack}
							</div>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
