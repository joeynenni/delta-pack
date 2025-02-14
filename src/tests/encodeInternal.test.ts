import { GameState } from './.generated/schema'
import { DebugLogger } from '../utils/debug'

describe('encodeInternal', () => {
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

	test('should encode primitive values correctly', () => {
		DebugLogger.setCurrentTest('encode-internal-primitive')
		const binary = GameState.encode(sampleState)
		const decoded = GameState.decode(binary)
		expect(decoded.timeRemaining).toBe(sampleState.timeRemaining)
	})

	test('should encode nested objects correctly', () => {
		DebugLogger.setCurrentTest('encode-internal-nested')
		const binary = GameState.encode(sampleState)
		const decoded = GameState.decode(binary)
		expect(decoded.players[0].position).toEqual(sampleState.players[0].position)
	})

	test('should encode arrays correctly', () => {
		DebugLogger.setCurrentTest('encode-internal-array')
		const binary = GameState.encode(sampleState)
		const decoded = GameState.decode(binary)
		expect(decoded.players).toHaveLength(sampleState.players.length)
		expect(decoded.players[0].id).toBe(sampleState.players[0].id)
		expect(decoded.players[0].position).toEqual(sampleState.players[0].position)
		expect(decoded.players[0].health).toBe(sampleState.players[0].health)
		expect(decoded.players[0].weapon).toEqual(sampleState.players[0].weapon)
		expect(decoded.players[0].stealth).toBe(sampleState.players[0].stealth)
	})
})
