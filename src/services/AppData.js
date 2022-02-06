const { ipcRenderer } = window.require('electron')

/**
 * SetOptions
 * @typedef {Object} SetOptions
 * @property {String} Key
 * @property {any} value Value
 */

class AppData {
	/**
	 * Set an item.
	 * @param {String} key
	 * @param {?any} value
	 */
	static set(key, value) {
		ipcRenderer.send('AppData', 'set', [key, value])
	}

	/**
	 * Get an item.
	 * @param {String} key The key of the item to get.
	 * @param {?any} defaultValue The default value to return if item does not exist.
	 * @returns {any}
	 */
	static get(key, defaultValue) {
		return ipcRenderer.sendSync('AppData', 'get', [key, defaultValue])
	}

	/**
	 * Check if an item exists.
	 * @param {String} key The key of the item to check.
	 * @returns {boolean}
	 */
	static has(key) {
		return ipcRenderer.sendSync('AppData', 'has', key)
	}

	/**
	 * Delete an item.
	 * @param {String} key The key of the item to delete.
	 */
	static delete(key) {
		ipcRenderer.send('AppData', 'delete', key)
	}
}

export default AppData
