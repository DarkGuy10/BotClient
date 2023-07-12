import { ClientErrorCodes, ClientErrorMessages } from '@/typings'

export default class ClientError extends Error {
	code: ClientErrorCodes
	constructor(code: ClientErrorCodes) {
		super(`[${code}] ${ClientErrorMessages[code]}`)
		this.code = code
		this.name = 'ClientError'
	}
}
