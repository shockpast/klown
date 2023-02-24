import assert from "node:assert"

import { ActivityType, Events, PresenceUpdateStatus } from "discord.js"

import { client } from ".."

module.exports = {
	data: {
		name: Events.ClientReady,
		once: true
	},
	execute: () => {
		client.user?.setStatus(PresenceUpdateStatus.Idle)
		client.user?.setPresence({ activities: [{ name: "typescript vibes", type: ActivityType.Listening }] })

		assert.ok(client.guilds.cache.size >= 1 || client.users.cache.size >= 1)
		assert.ok(client.commands.size >= 1)

		console.log("[dev:events/clientReady] online")
	}
}