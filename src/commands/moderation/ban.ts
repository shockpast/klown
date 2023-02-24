import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { utils } from "../.."

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Блокирует пользователя на сервере.")
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		.addUserOption(opt =>
			opt.setName("user")
				.setDescription("Пользователь.")
				.setRequired(true))
		.addStringOption(opt =>
			opt.setName("reason")
				.setDescription("Причина.")
				.setRequired(false)),
	async execute(ctx: ChatInputCommandInteraction) {
		const user = ctx.options.getUser("user")
		const reason = ctx.options.getString("reason") || undefined

		const member = await utils.getMember(user!, { id: ctx.guild?.id })
		const self = await utils.getMember(ctx.user, { id: ctx.guild?.id })

		if (!member?.bannable) return await ctx.reply({
			content: `<@!${user?.id}> не может быть заблокирован.`,
			ephemeral: true
		})

		if (member.roles.highest.position > self?.roles.highest.position!) return await ctx.reply({
			content: `<@!${user?.id}> имеет роль выше чем ваша, вы не сможете его заблокировать.`,
			ephemeral: true
		})

		member.ban({ reason: reason }).catch(async(e) => {
			if (e instanceof Error) {
				return await ctx.reply({
					content: `\`\`\`js\n${e.name}: ${e.message}\`\`\``,
					ephemeral: true
				})
			}
		})

		if (ctx.replied) return

		return await ctx.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blurple)
					.setDescription(`<@!${user?.id}> был заблокирован по причине **${reason}**`)
			]
		})
	}
}