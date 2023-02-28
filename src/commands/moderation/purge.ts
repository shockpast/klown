import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Bulk Deletion of messages in channel")
		.setDescriptionLocalizations(
			{ "ru": "Очистка сообщений." }
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDMPermission(false)
		.addNumberOption(opt =>
			opt.setName("amount")
				.setDescription("Amount of messages.")
				.setDescriptionLocalizations(
					{ "ru": "Количество сообщений." }
				)
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100)),
	async execute(ctx: ChatInputCommandInteraction) {
		(ctx.channel as TextChannel).bulkDelete(ctx.options.getNumber("amount", true))
			.then(async(m) => {
				return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Blurple)
							.setDescription(`**${m.size}** message(s) were deleted from <#${ctx.channel?.id}>`)
					],
					ephemeral: true
				})
			})
	}
}