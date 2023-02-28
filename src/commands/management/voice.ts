import { ChannelType, ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder, VoiceChannel } from "discord.js"

import { client } from "../.."
import type { VoiceData } from "../../types/klown"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("voice")
		.setDescription("Assistant for Voice Channel Managing.")
		.setDescriptionLocalizations(
			{ "ru": "Ассистент для голосовых каналов." }
		)
		.setDMPermission(false)
		.addSubcommand(sub =>
			sub.setName("create")
				.setDescription("Creates a Voice Channel.")
				.setDescriptionLocalizations(
					{ "ru": "Создаёт новый Голосовой Канал." }
				)
				.addStringOption(opt =>
					opt.setName("name")
						.setDescription("Name.")
						.setDescriptionLocalizations(
							{ "ru": "Название." }
						)
						.setRequired(true))
				.addBooleanOption(opt =>
					opt.setName("private")
						.setDescription("Forbids anyone but you to enter.")
						.setDescriptionLocalizations(
							{ "ru": "Запрещает входить всем, кроме вас." }
						)
						.setRequired(false)))
		.addSubcommand(sub =>
			sub.setName("modify")
				.setDescription("Modifies Voice Channel.")
				.setDescriptionLocalizations(
					{ "ru": "Модифицирование Голосового Канала." }
				)
				.addStringOption(opt =>
					opt.setName("name")
						.setDescription("Name.")
						.setDescriptionLocalizations(
							{ "ru": "Название." }
						)
						.setRequired(false))
				.addNumberOption(opt =>
					opt.setName("max_members")
						.setDescription("Maximum Members in Voice Channel.")
						.setDescriptionLocalizations(
							{ "ru": "Максимальное кол-во пользователей." }
						)
						.setRequired(false)
						.setMinValue(1)
						.setMaxValue(99))
				.addBooleanOption(opt =>
					opt.setName("private")
						.setDescription("Forbids or allows anyone but you to enter.")
						.setDescriptionLocalizations(
							{ "ru": "Запрещает или разрешает входить всем, кроме вас." }
						)
						.setRequired(false))
				.addUserOption(opt =>
					opt.setName("allowed_user")
						.setDescription("A user who will be able to connect.")
						.setDescriptionLocalizations(
							{ "ru": "Пользователь который сможет подключиться." }
						)
						.setRequired(false))
				.addUserOption(opt =>
					opt.setName("disallowed_user")
						.setDescription("A user who will not be able to connect.")
						.setDescriptionLocalizations(
							{ "ru": "Пользователь который не сможет подключиться." }
						)
						.setRequired(false)))
		.addSubcommand(sub =>
			sub.setName("delete")
				.setDescription("Annihilates Voice Channel."))
				.setDescriptionLocalizations(
					{ "ru": "Удаляет Голосовой Канал." }
				)
		.addSubcommand(sub =>
			sub.setName("list")
				.setDescription("Lists all Voice Channel(s) that were created in this Guild.")
				.setDescriptionLocalizations(
					{ "ru": "Показывает все Голосовые Каналы созданные на этом сервере." }
				)),
	async execute(ctx: ChatInputCommandInteraction) {
		const subcommand = ctx.options.getSubcommand()

		switch (subcommand) {
			case "create": {
				const name = ctx.options.getString("name")
				const _private = ctx.options.getBoolean("private")

				if (client.manager.voice.get(ctx.user.id)) return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription("You already created a Voice Channel once, you must to delete previous to create a new one.")
					],
					ephemeral: true
				})

				const parent = await client.guilds.cache.get(ctx.guild?.id!)?.channels.create({
					name: name!,
					type: ChannelType.GuildVoice,
					parent: "1076915722485235732"
				})

				if (_private) {
					parent?.permissionOverwrites.create(client.guilds.cache.get(ctx.guild?.id!)?.roles.everyone!, { Connect: false })
					parent?.permissionOverwrites.create(ctx.user, { Connect: true })
				}

				client.manager.voice.set(ctx.user.id, {
					name: name!,
					id: parent?.id!,
					private: !!_private,
					guild: {
						id: ctx.guild?.id!,
					},
					owner: {
						name: ctx.user.username,
						id: ctx.user.id,
					}
				} satisfies VoiceData)

				return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Blurple)
							.setDescription(`<#${parent?.id}> was created by <@!${ctx.user.id}>`)
					]
				})
			}

			case "modify": {
				const name = ctx.options.getString("name")
				const maxMembers = ctx.options.getNumber("max_members")
				const _private = ctx.options.getBoolean("private")
				const allowedUser = ctx.options.getUser("allowed_user")
				const disallowedUser = ctx.options.getUser("disallowed_user")

				const userChannel = client.manager.voice.get(ctx.user.id)
				const voiceChannel = client.channels.cache.get(userChannel?.id!) as VoiceChannel

				if (!voiceChannel) return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription("You didn't created any Voice Channel to modify!")
					],
					ephemeral: true
				})

				if (name) await voiceChannel.edit({ name: name })
				if (maxMembers) await voiceChannel.edit({ userLimit: maxMembers })
				if (allowedUser) await voiceChannel.permissionOverwrites.edit(allowedUser, { Connect: true })
				if (disallowedUser) await voiceChannel.permissionOverwrites.edit(disallowedUser, { Connect: false })
				if (_private) {
					await voiceChannel.permissionOverwrites.create(client.guilds.cache.get(userChannel?.guild.id!)?.roles.everyone!, { Connect: !_private })
					await voiceChannel.permissionOverwrites.edit(ctx.user, { Connect: true })
				}

				return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Blurple)
							.setDescription(`<#${userChannel?.id}> were succesfully modified.`)
							.addFields(
								{ name: "Changes", value: `\`\`\`${ctx.options.data[0].options?.map(i => `${i.name}: ${i.value}\n`)}\`\`\``.replace(",", "") }
							)
					]
				})
			}

			case "list": {
				const embed = new EmbedBuilder()
					.setColor(Colors.Blurple)

				client.manager.voice.forEach((v) => {
					if (v.guild.id == ctx.guild?.id)
						embed.addFields(
							{ name: `<#${v.id}>`, value: `<@!${v.owner.id}>`, inline: true }
						)
				})

				if (embed.data.fields && embed.data.fields.length >= 1) return await ctx.reply({
					embeds: [embed],
					ephemeral: true
				})

				return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription("*What a lot of emptiness: not a lot of pushing.*")
					],
					ephemeral: true
				})
			}

			case "delete": {
				const userChannel = client.manager.voice.get(ctx.user.id)
				const voiceChannel = client.channels.cache.get(userChannel?.id!) as VoiceChannel

				if (!voiceChannel) return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription("You didn't created any Voice Channel to delete.")
					],
					ephemeral: true
				})

				await voiceChannel.delete()
				client.manager.voice.delete(ctx.user.id)

				return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Blurple)
							.setDescription(`**${userChannel?.name}** was deleted.`)
					]
				})
			}
		}
	}
}