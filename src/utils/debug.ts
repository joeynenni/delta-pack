import fs from 'fs'
import path from 'path'

const DEBUG_FILE = path.join(process.cwd(), 'debug.log')

// Ensure debug directory exists
if (!fs.existsSync(path.dirname(DEBUG_FILE))) {
	fs.mkdirSync(path.dirname(DEBUG_FILE), { recursive: true })
}

export const debug = {
	log: (message: string, data?: any): void => {
		const timestamp = new Date().toISOString()
		const logMessage = `[${timestamp}] ${message}\n${data ? JSON.stringify(data, null, 2) + '\n' : ''}`
		fs.appendFileSync(DEBUG_FILE, logMessage)
	},
	clear: (): void => {
		fs.writeFileSync(DEBUG_FILE, '')
	}
}

// Clear log at start
debug.clear()
