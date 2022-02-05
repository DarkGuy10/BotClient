const fs = require('fs')
const path = require('path')

// Load djs client events from events/ folder
const loadEvents = client => {
	const eventFiles = fs
		.readdirSync(path.join(__dirname, 'events'))
		.filter(file => file.endsWith('.js'))
	for (const file of eventFiles) {
		const event = require(`./events/${file}`)
		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args))
		} else {
			client.on(event.name, (...args) => event.execute(client, ...args))
		}
	}
}

module.exports = loadEvents
