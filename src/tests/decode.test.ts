import { GameState } from './.generated/schema'
import { DebugLogger } from '../utils/debug'

describe('decode', () => {
	const sampleState = {
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

	test('should decode an encoded full state back to its original value', () => {
		DebugLogger.setCurrentTest('decode-full-state')
		const binary = GameState.encode(sampleState)
		const decodedState = GameState.decode(binary)
		expect(decodedState).toEqual(sampleState)
	})

	test('should merge a diff with the previous state to yield an updated state', () => {
		DebugLogger.setCurrentTest('decode-merge-diff')
		const prevState = sampleState
		const newState = {
			timeRemaining: 80, // changed
			players: [
				{
					id: 1,
					position: { x: 43.2, y: 51.1 }, // changed
					health: 85, // changed
					weapon: { name: 'Sword', damage: 25 },
					stealth: false
				},
				{
					id: 2,
					position: { x: 216.6, y: 198.1 },
					health: 75, // changed
					weapon: { name: 'Bow', damage: 15 },
					stealth: true
				}
			]
		}

		const diffBinary = GameState.encode(newState, prevState)
		const updatedState = GameState.decode(diffBinary, prevState)
		expect(updatedState).toEqual(newState)
		expect(updatedState.timeRemaining).toBe(80)
		expect(updatedState.players[0].position).toEqual({ x: 43.2, y: 51.1 })
		expect(updatedState.players[0].health).toBe(85)
		expect(updatedState.players[1].health).toBe(75)
		expect(updatedState.players[0].weapon).toEqual(prevState.players[0].weapon)
		expect(updatedState.players[0].stealth).toBe(prevState.players[0].stealth)
		expect(updatedState.players[1].position).toEqual(prevState.players[1].position)
		expect(updatedState.players[1].weapon).toEqual(prevState.players[1].weapon)
		expect(updatedState.players[1].stealth).toBe(prevState.players[1].stealth)
	})
})
