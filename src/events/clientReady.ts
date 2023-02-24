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

		console.log("[dev:events/clientReady] online")
	}
}