const fs = require('fs')
const Client = require('./Client.js')

const eventFiles = fs
	.readdirSync('./events')
	.filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
	const event = require(`./lib/events/${file}`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args))
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args))
	}
}
