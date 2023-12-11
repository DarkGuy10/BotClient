import './globals.scss'
import { AlertManager, CallbackBoundary, TooltipManager } from '@/components'
import { StoreProvider } from './StoreProvider'
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="theme-dark">
			<body>
				<StoreProvider>
					<CallbackBoundary>
						{children}
						<TooltipManager />
						<AlertManager />
					</CallbackBoundary>
				</StoreProvider>
			</body>
		</html>
	)
}
