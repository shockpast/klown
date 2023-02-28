import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { utils } from "../.."

module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Issue a timeout to the user.")
		.setDescriptionLocalizations(
			{ "ru": "Выдать тайм-аут пользователю." }
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		.addUserOption(opt =>
			opt.setName("user")
				.setDescription("User.")
				.setDescriptionLocalizations(
					{ "ru": "Пользователь." }
				)
				.setRequired(true))
		.addNumberOption(opt =>
			opt.setName("duration")
				.setDescription("Duration of timeout (in seconds)")
				.setDescriptionLocalizations(
					{ "ru": "Длительность тайм-аута (в секундах)" }
				)
				.setRequired(true))
		.addStringOption(opt =>
			opt.setName("reason")
				.setDescription("Reason.")
				.setDescriptionLocalizations(
					{ "ru": "Причина." }
				)
				.setRequired(false)),
	async execute(ctx: ChatInputCommandInteraction) {
		const user = ctx.options.getUser("user")
		const duration = ctx.options.getNumber("duration")
		const reason = ctx.options.getString("reason") || undefined

		const member = await utils.getMember(user!, { id: ctx.guild?.id })

		await member?.timeout(duration, reason).catch(async(e) => {
			if (e) {
				return await ctx.reply({
					content: `\`\`\`js\n${e}\`\`\``,
					ephemeral: true
				})
			}
		}).then(async() => {
			if (ctx.replied) return

			return await ctx.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.Blurple)
						.setDescription(`<@!${user?.id}> were sent to think about his behavior for \`${reason}\` (**${duration}** sec.)`)
				]
			})
		})
	}
}