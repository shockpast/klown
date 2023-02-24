import { EmbedBuilder } from "@discordjs/builders"
import { ChatInputCommandInteraction, Colors, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slowmode")
		.setDescription("Устанавливает задержку между сообщениями.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addNumberOption(opt =>
			opt.setName("time")
				.setDescription("Время (в секундах)")
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(21600)),
	async execute(ctx: ChatInputCommandInteraction) {
		if (!ctx.inGuild() || ctx.channel?.isThread()) return

		const duration = ctx.options.getNumber("time")!

		await ctx.channel?.edit({ rateLimitPerUser: duration })

		return await ctx.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blurple)
					.setDescription(duration > 0
						? "Задержка между сообщениями теперь составляет \`" + duration + "\` секунд."
						: "Задержка между сообщениями была убрана.")
			]
		})
	}
}