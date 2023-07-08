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
	createSlice(name: string): ElectronStore<T> {
		return new Proxy(this, {
			get(target, prop: keyof ElectronStore) {
				const _ = target[prop]
				if (typeof _ === 'function') {
					return new Proxy(_, {
						apply(target, thisArg, argArray) {
							return Reflect.apply(
								target,
								`${name}.${argArray.shift()}`,
								argArray
							)
						},
					})
				}
				return Reflect.get(target, `${name}.${String(prop)}`)
			},
		})
	}

	/**
	 * Create several slices from this store.
	 * @param args List of slice names
	 * @example
	 * const [sliceA, sliceB] = store.createSlices('A', 'B')
	 */
	createMultipleSlices(...args: string[]): ElectronStore<T>[] {
		return args.map(arg => this.createSlice(arg))
	}
}
