import { ClientErrorCodes } from '@/typings'

export default class ClientError<T extends ClientErrorCodes> extends Error {
	constructor(name: T, options?: ErrorOptions) {
		super(String(name), options)
	}
}
