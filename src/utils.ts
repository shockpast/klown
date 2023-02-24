import { Client, Guild, GuildMember, User } from "discord.js"

import { Klown } from "."

export class Utils {
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

	/**
	 * Checks if `type` is equals `expected_type`
	 *
	 * @param type Actual type that is.
	 * @param expected_type Type that was expected to be.
	 * @returns
	 */
	public isType(type: any, expected_type: any): boolean {
		return typeof(type) == expected_type
	}

	/**
	 * Checks if `instance` is instanceof
	 * `expected_instance`
	 *
	 * @param instance Actual instance that is.
	 * @param expected_instance Instance that was expected to be.
	 * @returns
	 */
	public isInstanceOf(instance: any, expected_instance: any): boolean {
		return instance instanceof expected_instance
	}

	/**
	 * Checks if `arg1` equals to `expected_arg2`
	 *
	 * @param arg1 Actual value that is.
	 * @param expected_arg2 Value that was expected to be.
	 * @returns
	 */
	public is(arg1: any, expected_arg2: any): boolean {
		return arg1 == expected_arg2
	}

	/**
	 * Checks if `arg` equals true.
	 *
	 * @param arg Argument that must be true.
	 * @returns
	 */
	public true(arg: any): boolean {
		return arg == true
	}

	/**
	 * Checks if `arg` equals false.
	 *
	 * @param arg Argument that must be false.
	 * @returns
	 */
	public false(arg: any): boolean {
		return arg == false
	}
}