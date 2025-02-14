import { GameState } from './.generated/schema'
import { DebugLogger } from '../utils/debug'

describe('decodeInternal', () => {
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

	test('should decode primitive values correctly', () => {
		DebugLogger.setCurrentTest('decode-internal-primitive')
		const binary = GameState.encode(sampleState)
		const decoded = GameState.decode(binary)
		expect(decoded.timeRemaining).toBe(sampleState.timeRemaining)
	})

	test('should decode nested objects correctly', () => {
		DebugLogger.setCurrentTest('decode-internal-nested')
		const binary = GameState.encode(sampleState)
		const decoded = GameState.decode(binary)
		expect(decoded.players[0].position).toEqual(sampleState.players[0].position)
	})

	test('should handle floating point numbers with precision', () => {
		DebugLogger.setCurrentTest('decode-internal-floating-point')
		const binary = GameState.encode(sampleState)
		const decoded = GameState.decode(binary)
		expect(decoded.players[0].position.x).toBeCloseTo(sampleState.players[0].position.x, 3)
	})

	test('should decode arrays correctly', () => {
		DebugLogger.setCurrentTest('decode-internal-array')
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
