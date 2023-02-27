import fs from "node:fs"

import dotenv from "dotenv"
dotenv.config()

import { Client, GatewayIntentBits, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js"

import Utils from "./libs/utils"
import Assert from "./libs/assert"
import Logger from "./libs/logger"
import type { CommandData, EventData, VoiceData } from "./types/klown"

export class Klown extends Client<boolean> {
	private restCommands: RESTPostAPIApplicationCommandsJSONBody[] = []
	public commands: Map<string, CommandData> = new Map()
	public events: Map<string, EventData> = new Map()
	public manager: { voice: Map<string, VoiceData> } = { voice: new Map() }

	constructor() {
		super({ intents: [ GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds ] })

		this.createCache()

		this.updateCommands()
		this.updateEvents()

		this.login(process.env.KLOWN_TOKEN!)
	}

	private async updateCommands() {
		for (const folder of fs.readdirSync("./src/commands")) {
			for (const file of fs.readdirSync(`./src/commands/${folder}`)) {
				if (!file.endsWith(".ts")) continue

				const command: CommandData = await import(`./commands/${folder}/${file}`)

				if (!("data" in command.default)) continue

				this.commands.set(command.default.data.name, command)
				this.restCommands.push(command.default.data.toJSON())
			}
		}

		const rest = new REST({ version: "10" }).setToken(process.env.KLOWN_TOKEN!)
		await rest.put(Routes.applicationCommands("1075786330321190922"), { body: this.restCommands })
	}

	private async updateEvents() {
		for (const file of fs.readdirSync("./src/events")) {
			if (!file.endsWith(".ts")) continue

			const event: EventData = await import(`./events/${file}`)

			if (!("data" in event.default)) continue

			this.events.set(event.default.data.name, event)
			event.default.data.once ? this.once(event.default.data.name, event.default.execute) : this.on(event.default.data.name, event.default.execute)
		}
	}

	private async createCache() {
		this.users.cache.forEach(async(user) => {
			await user.fetch()
		})

		this.guilds.cache.forEach(async(guild) => {
			await guild.members.fetch()
		})
	}
}

export const client = new Klown()
export const assert = new Assert()
export const utils = new Utils(client)
export const logger = new Logger({
	fileDir: "./logs/",
	format: "pretty",
	maxSize: "5mb"
})