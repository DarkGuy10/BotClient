import './globals.scss'
import { StoreProvider } from './StoreProvider'

export const metadata = {
	title: 'Wyvern | Dashboard',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="theme-dark">
			<body>
				<StoreProvider>{children}</StoreProvider>
			</body>
		</html>
	)
}
