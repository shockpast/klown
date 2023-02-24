import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { utils } from "../.."

module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Выдать тайм-аут пользователю.")
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		.addUserOption(opt =>
			opt.setName("user")
				.setDescription("Пользователь.")
				.setRequired(true))
		.addNumberOption(opt =>
			opt.setName("duration")
				.setDescription("Длительность тайм-аута (в секундах)")
				.setRequired(true))
		.addStringOption(opt =>
			opt.setName("reason")
				.setDescription("Причина.")
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
						.setDescription(`<@!${user?.id}> отправлен в тайм-аут по причине \`${reason}\` на **${duration}** секунд.`)
				]
			})
		})
	}
}