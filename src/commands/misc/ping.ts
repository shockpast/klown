import { ChatInputCommandInteraction, Colors, SlashCommandBuilder, EmbedBuilder } from "discord.js"

import { client } from "../.."

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Пинг-Понг!"),
	async execute(ctx: ChatInputCommandInteraction) {
		return await ctx.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blurple)
					.setDescription(`\`${client.ws.ping} ms.\``)
			],
			ephemeral: true
		})
	}
}