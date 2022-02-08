const { serializeMessage } = require('../../../serializers')

module.exports = {
	name: 'messageCreate',
	async execute(client, message) {
		const serializedMessage = await serializeMessage(message)
		client.transmit(this.name, serializedMessage)
	},
}
