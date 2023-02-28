import { ChatInputCommandInteraction, Colors, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, TextChannel, ThreadChannel, VoiceChannel } from "discord.js"

import { assert } from "../.."

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slowmode")
		.setDescription("Sets the delay between messages.")
		.setDescriptionLocalizations(
			{ "ru": "Устанавливает задержку между сообщениями." }
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.setDMPermission(false)
		.addNumberOption(opt =>
			opt.setName("time")
				.setDescription("Time (in seconds)")
				.setDescriptionLocalizations(
					{ "ru": "Время (в секундах)" }
				)
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(21600)),
	async execute(ctx: ChatInputCommandInteraction) {
		if (!ctx.inGuild() || ctx.channel?.isThread()) return

		const duration = ctx.options.getNumber("time")!

		if (!assert.isType(ctx.channel, TextChannel) ||
			!assert.isType(ctx.channel, ThreadChannel) ||
			!assert.isType(ctx.channel, VoiceChannel)) return ctx.reply({
				content: "This type of channel does not support setting a slowmode in them.",
				ephemeral: true
			})

		await ctx.channel?.edit({ rateLimitPerUser: duration })

		return await ctx.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blurple)
					.setDescription(duration > 0
						? "As you wish. \`" + duration + "\` sec."
						: "Slowmode was disabled.")
			]
		})
	}
}