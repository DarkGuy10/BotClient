import path from 'path'
import { app, BrowserWindow } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import electronIsDev from 'electron-is-dev'
import ElectronStore from 'electron-store'

let appWindow: BrowserWindow | null = null
const store = new ElectronStore()

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info'
		autoUpdater.logger = log
		autoUpdater.checkForUpdatesAndNotify()
	}
}

if (electronIsDev) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('electron-debug')({
		showDevTools: true,
		devToolsMode: 'right',
	})
}

const installExtensions = async () => {
	/**
	 * NOTE:
	 * As of writing this comment, Electron does not support the `scripting` API,
	 * which causes errors in the REACT_DEVELOPER_TOOLS extension.
	 * A possible workaround could be to downgrade the extension but you're on your own with that.
	 */
	const {
		default: installExtension,
		//REACT_DEVELOPER_TOOLS,
		REDUX_DEVTOOLS,
		// eslint-disable-next-line @typescript-eslint/no-var-requires
	} = require('electron-devtools-installer')
	installExtension([REDUX_DEVTOOLS]).catch(console.log)
}

const spawnAppWindow = async () => {
	if (electronIsDev) await installExtensions()

	const RESOURCES_PATH = electronIsDev
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets')

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths)
	}

	appWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: getAssetPath('icon.png'),
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	appWindow.loadURL(
		electronIsDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../../frontend/build/index.html')}`
	)
	appWindow.maximize()
	appWindow.setMenu(null)
	appWindow.show()
	appWindow.on('closed', () => {
		appWindow = null
	})
}

app.on('ready', () => {
	new AppUpdater()
	spawnAppWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
