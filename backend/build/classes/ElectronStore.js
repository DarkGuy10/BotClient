"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_store_1 = __importDefault(require("electron-store"));
class ElectronStore extends electron_store_1.default {
    constructor(options) {
        super(options);
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
    createSlice(name) {
        // @ts-expect-error I know what I'm doing sthu typescript
        return new Proxy(this, {
            get(target, prop) {
                const _ = target[prop];
                if (typeof _ === 'function') {
                    return new Proxy(_, {
                        apply(target, thisArg, argArray) {
                            return Reflect.apply(target, `${String(name)}.${argArray.shift()}`, argArray);
                        },
                    });
                }
                return Reflect.get(target, `${String(name)}.${String(prop)}`);
            },
        });
    }
}
exports.default = ElectronStore;
