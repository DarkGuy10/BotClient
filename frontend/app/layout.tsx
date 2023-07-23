import './globals.scss'

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
			<body>{children}</body>
		</html>
	)
}
