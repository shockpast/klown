import { ChatInputCommandInteraction, Colors, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, TextChannel, ThreadChannel, VoiceChannel } from "discord.js"

import { assert } from "../.."

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slowmode")
		.setDescription("Устанавливает задержку между сообщениями.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.setDMPermission(false)
		.addNumberOption(opt =>
			opt.setName("time")
				.setDescription("Время (в секундах)")
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(21600)),
	async execute(ctx: ChatInputCommandInteraction) {
		if (!ctx.inGuild() || ctx.channel?.isThread()) return

		const duration = ctx.options.getNumber("time")!

		if (!assert.isType(ctx.channel, TextChannel) ||
			!assert.isType(ctx.channel, ThreadChannel) ||
			!assert.isType(ctx.channel, VoiceChannel)) return ctx.reply({
				content: "Этот тип каналов не поддерживает возможность задержки между сообщениями.",
				ephemeral: true
			})

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