export interface LoggerOptions {
	fileDir: string
	format: "json" | "pretty"
	maxSize: "10mb" | "5mb" | "1mb"
}

/**
 * `info` – the standard log level indicating that something happened,
 * the application entered a certain state, etc.
 *
 * `warn` – the log level that indicates that something unexpected happened in
 * the application, a problem, or a situation that might disturb one of the processes.
 *
 * `error` – the log level that should be used when the application hits an issue preventing
 * one or more functionalities from properly functioning.
 *
 * `fatal` – the log level that tells that the application encountered an event or entered
 * a state in which one of the crucial business functionality is no longer working.
 *
 * `trace` – the most fine-grained information only used in rare cases
 * where you need the full visibility of what is happening in your application
 * and inside the third-party libraries that you use.
 */
export type LoggerLevel = "info" | "warn" | "error" | "fatal" | "trace"