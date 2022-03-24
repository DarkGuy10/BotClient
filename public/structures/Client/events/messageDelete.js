module.exports = {
	name: 'messageDelete',
	async execute(client, message) {
		client.transmit(this.name, message.id, message.channelId)
	},
}
