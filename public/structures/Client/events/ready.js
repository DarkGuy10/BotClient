module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		client.transmit(this.name, client.clientUserData)
	},
}
