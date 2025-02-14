// Helper function to replace Symbol(NO_DIFF) with "NO_DIFF" string for easier assertions
export function replaceDiffSymbols(obj: any): any {
	return JSON.parse(JSON.stringify(obj, (key, value) => (typeof value === 'symbol' ? 'NO_DIFF' : value)))
}

// Common sample state used across tests
export const sampleState = {
	timeRemaining: 120,
	players: [
		{
			id: 1,
			position: { x: 94.5, y: 102.3 },
			health: 100,
			weapon: { name: 'Sword', damage: 25 },
			stealth: false
		},
		{
			id: 2,
			position: { x: 216.6, y: 198.1 },
			health: 100,
			weapon: { name: 'Bow', damage: 15 },
			stealth: true
		}
	]
}
