import { ChatInputCommandInteraction, Colors, SlashCommandBuilder, EmbedBuilder } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("coin")
		.setDescription("Орёл или Решка."),
	execute: async(ctx: ChatInputCommandInteraction) => {
		return await ctx.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blurple)
					.setDescription(Math.random() > .5 ? "Орёл." : "Решка.")
			]
		})
	}
}