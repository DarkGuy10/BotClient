module.exports = {
	name: 'error',
	async execute(client, error) {
		client.transmit(this.name, `[${error.code}] ${error.message}`)
	},
}
