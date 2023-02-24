import fs from "node:fs"

import dotenv from "dotenv"
dotenv.config()

import { Client, GatewayIntentBits, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js"

import Utils from "./utils"
import Assert from "./assert"
import { CommandData, EventData, VoiceData } from "./types/klown"

export class Klown extends Client<boolean> {
	private restCommands: RESTPostAPIApplicationCommandsJSONBody[] = []
	public commands: Map<string, CommandData> = new Map()
	public events: Map<string, EventData> = new Map()
	public voiceManager: Map<string, VoiceData> = new Map()

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

				if (!("data" in command)) continue

				this.commands.set(command.data.name, command)
				this.restCommands.push(command.data.toJSON())
			}
		}

		const rest = new REST({ version: "10" }).setToken(process.env.KLOWN_TOKEN!)
		await rest.put(Routes.applicationCommands("1075786330321190922"), { body: this.restCommands })
	}

	private async updateEvents() {
		for (const file of fs.readdirSync("./src/events")) {
			if (!file.endsWith(".ts")) continue

			const event: EventData = await import(`./events/${file}`)

			if (!("data" in event)) continue

			this.events.set(event.data.name, event)
			event.data.once ? this.once(event.data.name, event.execute) : this.on(event.data.name, event.execute)
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
export const utils = new Utils(client)
export const assert = new Assert()