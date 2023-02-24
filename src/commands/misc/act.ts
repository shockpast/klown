import { ChatInputCommandInteraction, Colors, SlashCommandBuilder, EmbedBuilder } from "discord.js"
import phin from "phin"

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
		.setDescription("Взаимодействия с пользователями.")
		.addStringOption(opt =>
			opt.setName("action")
				.setDescription("Действие.")
				.addChoices(
					{ name: "Поцеловать", value: "kiss" },
					{ name: "Дай Пять!", value: "highfive" },
					{ name: "Укусить", value: "bite" },
					{ name: "Пощекотать", value: "tickle" },
					{ name: "Тыкнуть", value: "poke" },
					{ name: "Похлопать", value: "pat" },
				)
				.setRequired(true))
		.addUserOption(opt =>
			opt.setName("user")
				.setDescription("Пользователь.")
				.setRequired(true)),
	async execute(ctx: ChatInputCommandInteraction) {
		const data = await phin({ url: `https://nekos.best/api/v2/${ctx.options.getString("action")}` })
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