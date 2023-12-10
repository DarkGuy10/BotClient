import { AlertManager, TooltipManager } from '@/components'
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
				<StoreProvider>
					{children}
					<TooltipManager />
					<AlertManager />
				</StoreProvider>
			</body>
		</html>
	)
}
