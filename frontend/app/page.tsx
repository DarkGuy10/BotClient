import styles from './page.module.css'

export default function Home() {
	return (
		<div className={styles.wrapper}>
			<main className={styles.main}>
				<div className={styles.header}>
					<h1 className={styles.headerText}>NextJS + Electron Boilerplate</h1>
					<h4 className={styles.headerSubText}>
						That one boilerplate you couldn{"'"}t find, until now.
					</h4>
				</div>
				<img className={styles.menhera} src="/menhera.png" alt="menhera" />
				<div className={styles.note}>
					<img src="/edit.svg" alt="edit" />
					Get started by editting frontend/app/page.tsx
				</div>
				<footer className={styles.footer}>
					{'<'}/{'>'} with ♥
				</footer>
			</main>
		</div>
	)
}
