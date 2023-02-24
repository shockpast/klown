import { ChannelType, ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder, VoiceChannel } from "discord.js"

import { client } from "../.."
import { VoiceData } from "../../types/klown"

// poorly-written implementation
// todo: huge refactor
module.exports = {
	data: new SlashCommandBuilder()
		.setName("voice")
		.setDescription("Ассистент для голосовых каналов.")
		.setDMPermission(false)
		.addSubcommand(sub =>
			sub.setName("create")
				.setDescription("Создаёт новый Голосовой Канал.")
				.addStringOption(opt =>
					opt.setName("name")
						.setDescription("Название.")
						.setRequired(true))
				.addBooleanOption(opt =>
					opt.setName("private")
						.setDescription("Запрещает входить всем, кроме вас.")
						.setRequired(false)))
		.addSubcommand(sub =>
			sub.setName("modify")
				.setDescription("Модифицирование Голосового Канала.")
				.addStringOption(opt =>
					opt.setName("name")
						.setDescription("Название.")
						.setRequired(false))
				.addNumberOption(opt =>
					opt.setName("max_members")
						.setDescription("Максимальное кол-во пользователей.")
						.setRequired(false)
						.setMinValue(1)
						.setMaxValue(99))
				.addBooleanOption(opt =>
					opt.setName("private")
						.setDescription("Запрещает или разрешает входить всем, кроме вас.")
						.setRequired(false))
				.addUserOption(opt =>
					opt.setName("allowed_user")
						.setDescription("Пользователь который сможет подключиться.")
						.setRequired(false))
				.addUserOption(opt =>
					opt.setName("disallowed_user")
						.setDescription("Пользователь который не сможет подключиться.")
						.setRequired(false)))
		.addSubcommand(sub =>
			sub.setName("delete")
				.setDescription("Удаляет Голосовой Канал"))
		.addSubcommand(sub =>
			sub.setName("list")
				.setDescription("Показывает все Голосовые Каналы созданные на этом сервере.")),
	async execute(ctx: ChatInputCommandInteraction) {
		const subcommand = ctx.options.getSubcommand()

		switch (subcommand) {
			case "create": {
				const name = ctx.options.getString("name")
				const _private = ctx.options.getBoolean("private")

				if (client.voiceManager.get(ctx.user.id)) return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription("Вы уже создавали Голосовой Канал ранее, сначала удалите прошлый и попробуйте снова.")
					],
					ephemeral: true
				})

				const parent = await client.guilds.cache.get(ctx.guild?.id!)?.channels.create({
					name: name!,
					type: ChannelType.GuildVoice,
					parent: "1076915722485235732"
				})

				if (_private) {
					parent?.permissionOverwrites.create(client.guilds.cache.get(ctx.guild?.id!)?.roles.everyone!, {
						Connect: false
					})
				}

				client.voiceManager.set(ctx.user.id, {
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
							.setDescription(`<#${parent?.id}> был создан пользователем <@!${ctx.user.id}>`)
					]
				})
			}

			case "modify": {
				const name = ctx.options.getString("name")
				const maxMembers = ctx.options.getNumber("max_members")
				const _private = ctx.options.getBoolean("private")
				const allowedUser = ctx.options.getUser("allowed_user")
				const disallowedUser = ctx.options.getUser("disallowed_user")

				const userChannel = client.voiceManager.get(ctx.user.id)
				const voiceChannel = client.channels.cache.get(userChannel?.id!) as VoiceChannel

				if (!voiceChannel) return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription("Вы ещё не создавали Голосовой Канал, сначала создайте и попробуйте снова!")
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
							.setDescription(`<#${userChannel?.id}> был успешно изменён.`)
							.addFields(
								{ name: "Изменения", value: `\`\`\`${ctx.options.data[0].options?.map(i => `${i.name}: ${i.value}\n`)}\`\`\``.replace(",", "") }
							)
					]
				})
			}

			case "list": {
				const embed = new EmbedBuilder()
					.setColor(Colors.Blurple)

				client.voiceManager.forEach((v) => {
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
							.setDescription("На этом сервере, ещё не было создано ни одного голосового канала.")
					],
					ephemeral: true
				})
			}

			case "delete": {
				const userChannel = client.voiceManager.get(ctx.user.id)
				const voiceChannel = client.channels.cache.get(userChannel?.id!) as VoiceChannel

				if (!voiceChannel) return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription("Вы ещё не создавали Голосовой Канал, сначала создайте и попробуйте снова!")
					],
					ephemeral: true
				})

				await voiceChannel.delete()
				client.voiceManager.delete(ctx.user.id)

				return await ctx.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Blurple)
							.setDescription(`**${userChannel?.name}** был удалён.`)
					]
				})
			}
		}
	}
}