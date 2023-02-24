import { Client, Guild, GuildMember, User } from "discord.js"

import { Klown } from "."

export default class Utils {
	private client: Klown | Client | undefined

	/**
	 * Utils is necessary module, that
	 * simplifies coding in TypeScript
	 * by adding various helpful functions,
	 * they can be called as helpers.
	 */
	constructor(client?: Klown | Client) {
		this.client = client
	}

	/**
	 * Searches ID or User in specified Guild and
	 * returns GuildMember (if it's exist)
	 *
	 * @param user User Object or his ID as string.
	 * @param guild Guild ID | Object to search in.
	 * @returns {GuildMember} GuildMember or undefined in case that User doesn't exist.
	 */
	public async getMember(user: User | string, guild: { id?: string, object?: Guild }): Promise<GuildMember | undefined> {
		if (guild.object)
			return await guild.object.members.fetch({ user: user })

		if (this.client && guild.id)
			return await this.client.guilds.cache.get(guild.id)?.members.fetch({ user: user })

		return undefined
	}
}