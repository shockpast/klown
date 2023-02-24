import type { SlashCommandBuilder } from "discord.js"

export type CommandData = {
	default: {
		data: SlashCommandBuilder
		execute: any // explicitly it's function
	}
}

export type EventData = {
	default: {
		data: {
			name: string
			once: boolean
		}
		execute: any // explicitly it's function
	}
}

export type VoiceData = {
	name: string
	id: string
	private: boolean
	owner: {
		name: string
		id: string
	}
	guild: {
		id: string
	}
}