import { GameState } from './.generated/schema'
import { DebugLogger } from '../utils/debug'

describe('encodeDiff', () => {
	const sampleState = {
		timeRemaining: 120,
		players: [
			{
				id: 1,
				position: { x: 94.5, y: 102.3 },
				health: 100,
				weapon: { name: 'Sword', damage: 25 },
				stealth: false
			}
		]
	}

	test('should encode primitive value changes', () => {
		DebugLogger.setCurrentTest('encode-diff-primitive')
		const prevState = { timeRemaining: 120, players: sampleState.players }
		const newState = { timeRemaining: 100, players: sampleState.players }
		const binary = GameState.encode(newState, prevState)
		const decoded = GameState.decode(binary, prevState)
		expect(decoded.timeRemaining).toBe(newState.timeRemaining)
	})

	test('should encode nested object changes', () => {
		DebugLogger.setCurrentTest('encode-diff-nested')
		const prevState = sampleState
		const newState = {
			...prevState,
			players: [
				{
					...prevState.players[0],
					position: { x: 95.5, y: 103.3 }
				}
			]
		}
		const binary = GameState.encode(newState, prevState)
		const decoded = GameState.decode(binary, prevState)
		expect(decoded.players[0].position).toEqual(newState.players[0].position)
		expect(decoded.players[0].health).toBe(prevState.players[0].health)
		expect(decoded.players[0].weapon).toEqual(prevState.players[0].weapon)
		expect(decoded.players[0].stealth).toBe(prevState.players[0].stealth)
		expect(decoded.timeRemaining).toBe(prevState.timeRemaining)
	})
})
