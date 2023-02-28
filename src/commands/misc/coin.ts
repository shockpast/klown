import { ChatInputCommandInteraction, Colors, SlashCommandBuilder, EmbedBuilder } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("coin")
		.setDescription("Heads or Tails.")
		.setDescriptionLocalizations(
			{ "ru": "Орёл или Решка." }
		)
		.setDMPermission(true),
	execute: async(ctx: ChatInputCommandInteraction) => {
		return await ctx.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blurple)
					.setDescription(Math.random() > .5 ? "Heads." : "Tails.")
			]
		})
	}
}