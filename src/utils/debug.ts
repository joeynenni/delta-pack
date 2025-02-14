import * as fs from 'fs'

export class DebugLogger {
	static currentTest: string = 'unknown'
	private static logs: string[] = []
	private static enabled = process.env.DEBUG === 'true'
	private static logFile = 'debug.log'
	private static logFileCreated = false

	static setCurrentTest(testName: string): void {
		this.currentTest = testName
	}

	static log(message: string, data?: any): void {
		if (!this.enabled) return

		if (!this.logFileCreated) {
			fs.writeFileSync(this.logFile, '') // Clear/create file only on first log
			this.logFileCreated = true
		}

		const timestamp = new Date().toISOString()
		const logEntry = `[${timestamp}][${this.currentTest}] ${message}${
			data ? '\n' + JSON.stringify(data, (key, value) => (typeof value === 'symbol' ? 'NO_DIFF' : value), 2) : ''
		}`

		this.logs.push(logEntry)
		fs.appendFileSync(this.logFile, logEntry + '\n')
	}

	static clear(): void {
		if (!this.enabled) return
		this.logs = []
		this.logFileCreated = false
	}
}
