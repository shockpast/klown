import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Очистка сообщений.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDMPermission(false)
		.addNumberOption(opt =>
			opt.setName("amount")
				.setDescription("Количество сообщений.")
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
							.setDescription(`**${m.size}** сообщения было удалено из <#${ctx.channel?.id}>`)
					]
				})
			})
	}
}