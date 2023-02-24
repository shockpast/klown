import { Events, Interaction } from "discord.js"

import { client } from ".."

module.exports = {
	data: {
		name: Events.InteractionCreate,
		once: false
	},
	execute: async(ctx: Interaction) => {
		try {
			if (ctx.isChatInputCommand()) return client.commands.get(ctx.commandName)?.execute(ctx)
		} catch(error) {
			if (!error || !(error instanceof Error) || !ctx.isRepliable()) return

			return await ctx.reply({
				content: `\`\`\`js\n${error.name}: ${error.message}\`\`\``,
				ephemeral: true
			})
		}
	}
}