import { SlashCommandBuilder } from "discord.js"

export type CommandData = {
	data: SlashCommandBuilder
	execute: any // explicitly it's function
}

export type EventData = {
	data: {
		name: string
		once: boolean
	}
	execute: any // explicitly it's function
}

export type VoiceData = {
	name: string
	id: string,
	private: boolean
	owner: {
		name: string
		id: string
	}
	guild: {
		id: string
	}
}