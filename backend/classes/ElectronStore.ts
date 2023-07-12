import BaseElectronStore from 'electron-store'

export default class ElectronStore<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Record<string, any> = Record<string, unknown>,
> extends BaseElectronStore<T> {
	constructor(options?: BaseElectronStore.Options<T>) {
		super(options)
	}

	/**
	 * Create a slice from the parent store. Use this to separately handle the different sub-stores.
	 * @param name Name of this slice
	 * @param store Parent store
	 * @example
	 * const store = new ElectronStore()
	 * const themeStore = createSlice('theme')
	 * const catpuccinMocha = themeStore.get('catpucchinMocha') // same as store.get('theme.catpucchinMocha')
	 */
	createSlice<K extends keyof T>(name: K): ElectronStore<T[K]> {
		// @ts-expect-error I know what I'm doing sthu typescript
		return new Proxy(this, {
			get(target, prop: keyof ElectronStore) {
				const _ = target[prop]
				if (typeof _ === 'function') {
					return new Proxy(_, {
						apply(target, thisArg, argArray) {
							return Reflect.apply(
								target,
								`${String(name)}.${argArray.shift()}`,
								argArray
							)
						},
					})
				}
				return Reflect.get(target, `${String(name)}.${String(prop)}`)
			},
		})
	}
}
