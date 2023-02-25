import fs from "node:fs"

import chalk from "chalk"

import { LoggerLevel, LoggerOptions } from "../types/logger"

export default class Logger {
	// incrementally increases itself in Logger#rotateLogger()
	//
	// each time logger rotates, it increases fileIndes, so
	// it's not creating some kind of collision between log
	// files, and everything is okie-dokie
	private fileIndex: number = 1

	private loggerFile: string = ""
	private loggerDirectory: string = ""
	private loggerFormat: "json" | "pretty" = "pretty"
	private loggerSize: "10mb" | "5mb" | "1mb" = "10mb"

	constructor(options: LoggerOptions) {
		this.loggerDirectory = options.fileDir
		this.loggerFormat = options.format
		this.loggerSize = options.maxSize

		this.createLogger(options, this.fileIndex)
	}

	/**
	 * Initializes logger directory with his log file.
	 *
	 * @param options Options for Logger.
	 */
	private createLogger(options: LoggerOptions, fileIndex?: number): Logger {
		const [year, month, day, hour, minute, second] = this.getTime()

		this.loggerDirectory = options.fileDir
		this.loggerFormat = options.format
		this.loggerSize = options.maxSize

		const file = `${this.loggerDirectory}${year}_${month}_${day}_${hour}_${minute}_${second}-${"".padEnd(2, "0") + fileIndex}.log`
		const fileData = this.formatLog("info", "\n")

		// synchronous writing needed for first-time
		// creating file, because creating and
		// trying to logging in the same will create
		// an error [enoent] and everything goes poo-poo
		fs.writeFileSync(file, fileData)

		this.loggerFile = file

		return this
	}

	/**
	 * If `size` will be higher than users'
	 * selected maximum size in `mb`, then
	 * log file will be rotated to new one.
	 *
	 * @param size File's Size in bytes.
	 */
	private rotateLogger(size: number): Logger | undefined {
		const options: LoggerOptions = { fileDir: this.loggerDirectory, format: this.loggerFormat, maxSize: this.loggerSize }

		if (this.loggerSize == "1mb" && size >= 1000000) return this.createLogger(options, ++this.fileIndex)
		if (this.loggerSize == "5mb" && size >= 5000000) return this.createLogger(options, ++this.fileIndex)
		if (this.loggerSize == "10mb" && size >= 10000000) return this.createLogger(options, ++this.fileIndex)

		return undefined
	}

	/**
	 * Formats the log to the `options.format` selected
	 * by user.
	 *
	 * @param level Level of the Log.
	 * @param message Content of the Log.
	 * @returns {string}
	 */
	private formatLog(level: LoggerLevel, message: any): string {
		const [_y, _m, _d, hour, minute, second] = this.getTime()

		return this.loggerFormat == "json" ?
			`{level:"${level}",text:"${message}",time:"${hour}:${minute}:${second}"}` :
			`[${level.toUpperCase()}]\t${hour}:${minute}:${second}\t${message}`
	}

	/**
	 * @returns {(string | number)[]}
	 */
	private getTime(): (string | number)[] {
		function pad(n: number) { return n < 10 ? "0" + n : n }

		let [year, month, day, hour, minute, second] = [
			pad(new Date().getUTCFullYear()),
			pad(new Date().getUTCMonth() + 1),
			pad(new Date().getUTCDate()),
			pad(new Date().getUTCHours()),
			pad(new Date().getUTCMinutes()),
			pad(new Date().getUTCSeconds())
		]

		return [year, month, day, hour, minute, second]
	}

	// todo
	// that could be done in much less lines
	// but i'm too lazy right now for that
	//
	// future me, refactor this pls
	public info(args: any): void {
		const [_y, _m, _d, h, m, s] = this.getTime()
		this.rotateLogger(fs.statSync(this.loggerFile).size)

		fs.appendFile(this.loggerFile, this.formatLog("info", args + "\n"), () => {})

		return this.loggerFormat == "json" ?
			console.log(this.formatLog("info", args)) :
			console.log(`${chalk.cyan("[INFO]")}\t${chalk.grey(`${h}:${m}:${s}`)}\t${args}`)
	}

	public warn(args: any): void {
		const [_y, _m, _d, h, m, s] = this.getTime()
		this.rotateLogger(fs.statSync(this.loggerFile).size)

		fs.appendFile(this.loggerFile, this.formatLog("warn", args + "\n"), () => {})

		return this.loggerFormat == "json" ?
			console.log(this.formatLog("warn", args)) :
			console.log(`${chalk.yellow("[WARN]")}\t${chalk.grey(`${h}:${m}:${s}`)}\t${args}`)
	}

	public error(args: any): void {
		const [_y, _m, _d, h, m, s] = this.getTime()
		this.rotateLogger(fs.statSync(this.loggerFile).size)

		fs.appendFile(this.loggerFile, this.formatLog("error", args + "\n"), () => {})

		return this.loggerFormat == "json" ?
			console.log(this.formatLog("error", args)) :
			console.log(`${chalk.red("[ERROR]")}\t${chalk.grey(`${h}:${m}:${s}`)}\t${args}`)
	}

	public fatal(args: any): void {
		const [_y, _m, _d, h, m, s] = this.getTime()
		this.rotateLogger(fs.statSync(this.loggerFile).size)

		fs.appendFile(this.loggerFile, this.formatLog("fatal", args + "\n"), () => {})

		return this.loggerFormat == "json" ?
			console.log(this.formatLog("error", args)) :
			console.log(`${chalk.redBright("[FATAL]")}\t${chalk.grey(`${h}:${m}:${s}`)}\t${args}`)
	}

	public trace(args: any): void {
		const [_y, _m, _d, h, m, s] = this.getTime()
		this.rotateLogger(fs.statSync(this.loggerFile).size)

		fs.appendFile(this.loggerFile, this.formatLog("trace", args + "\n"), () => {})

		return this.loggerFormat == "json" ?
			console.log(this.formatLog("trace", args)) :
			console.log(`[TRACE]\t${chalk.grey(`${h}:${m}:${s}`)}\t${args}`)
	}
}