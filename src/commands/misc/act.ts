import { ChatInputCommandInteraction, Colors, SlashCommandBuilder, EmbedBuilder } from "discord.js"
import phin from "phin"

import { assert } from "../.."

const responses: Record<string, string> = {
	"kiss": "{0} поцеловал {1}",
	"highfive": "{0} дал пять {1}!",
	"bite": "{0} укусил... {1}?",
	"tickle": "{0} щекотит {1}",
	"poke": "{0} от нечего делать, начинает тыкать в {1}",
	"pat": "{0} похлопал/погладил {1}"
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("act")
		.setDescription("Interactions with users.")
		.setDescriptionLocalizations(
			{ "ru": "Взаимодействия с пользователями." }
		)
		.setDMPermission(false)
		.addStringOption(opt =>
			opt.setName("action")
				.setDescription("Interaction.")
				.setDescriptionLocalizations(
					{ "ru": "Действие." }
				)
				.addChoices(
					{ name: "Kiss", value: "kiss", name_localizations: { "ru": "Поцеловать" }  },
					{ name: "Highfive!", value: "highfive", name_localizations: { "ru": "Дай Пять!" } },
					{ name: "Bite", value: "bite", name_localizations: { "ru": "Укусить" } },
					{ name: "Tickle", value: "tickle", name_localizations: { "ru": "Пощекотать" } },
					{ name: "Poke", value: "poke", name_localizations: { "ru": "Тыкнуть" } },
					{ name: "Pat", value: "pat", name_localizations: { "ru": "Похлопать" } },
				)
				.setRequired(true))
		.addUserOption(opt =>
			opt.setName("user")
				.setDescription("User.")
				.setDescriptionLocalizations(
					{ "ru": "Пользователь." }
				)
				.setRequired(true)),
	async execute(ctx: ChatInputCommandInteraction) {
		const data = await phin({ url: `https://nekos.best/api/v2/${ctx.options.getString("action")}` })

		if (assert.truthy(data.statusCode != 200)) return

		const result = JSON.parse(data.body.toString("utf-8")).results[0]

		return await ctx.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blurple)
					.setDescription(
						responses[ctx.options.getString("action", true)]
							.replace("{0}", `<@!${ctx.user.id}>`)
							.replace("{1}", `<@!${ctx.options.getUser("user")?.id}>`))
					.setImage(result.url)
					.setFooter({ text: result.anime_name })
			]
		})
	}
}