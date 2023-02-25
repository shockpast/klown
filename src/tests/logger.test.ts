import { assert } from ".."
import { Logger } from "../libs/logger"

const logger = new Logger({
	fileDir: "./logs/",
	format: "pretty",
	maxSize: "10mb"
})

// these foo bars is not getting appended
// to logfile due to `process.exit(1)`
// it's kinda strange, but i wont fix this
logger.info("Foo Info.")
logger.warn("Foo Warn.")
logger.error("Foo Error.")
logger.fatal("Foo Fatal.")
logger.trace("Foo Trace.")

console.log("")

logger.info("lib/assert: Is 'logger' instanceof 'Logger'?")
logger.trace(assert.isInstanceOf(logger, Logger))

process.exit(1)