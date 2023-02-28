import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { utils } from "../.."

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kicks a member from the guild.")
		.setDescriptionLocalizations(
			{ "ru": "Выгоняет пользователя с сервера." }
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
		.addStringOption(opt =>
			opt.setName("reason")
				.setDescription("Reason.")
				.setDescriptionLocalizations(
					{ "ru": "Причина." }
				)
				.setRequired(false)),
	async execute(ctx: ChatInputCommandInteraction) {
		const user = ctx.options.getUser("user")
		const reason = ctx.options.getString("reason") || undefined

		const member = await utils.getMember(user!, { id: ctx.guild?.id })
		const self = await utils.getMember(ctx.user, { id: ctx.guild?.id })

		if (!member?.kickable) return await ctx.reply({
			content: `<@!${user?.id}> couldn't be kicked.`,
			ephemeral: true
		})

		if (member.roles.highest.position > self?.roles.highest.position!) return await ctx.reply({
			content: `<@!${user?.id}> role's position is higher than yours.`,
			ephemeral: true
		})

		member.kick(reason).catch(async(e) => {
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
					.setDescription(`<@!${user?.id}> was kicked for **${reason}**`)
			]
		})
	}
}