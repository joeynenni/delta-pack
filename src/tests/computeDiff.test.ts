import { GameState } from './.generated/schema'
import { DebugLogger } from '../utils/debug'
import { replaceDiffSymbols } from './utils/helpers'

describe('computeDiff', () => {
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

	test('should return NO_DIFF for identical states', () => {
		DebugLogger.setCurrentTest('compute-diff-identical')
		const diff = GameState.computeDiff(sampleState, sampleState)
		const processed = replaceDiffSymbols(diff)
		expect(processed).toBe('NO_DIFF')
	})

	test('should detect primitive changes', () => {
		DebugLogger.setCurrentTest('compute-diff-primitive')
		const newState = { ...sampleState, timeRemaining: 100 }
		const diff = GameState.computeDiff(newState, sampleState)
		const processed = replaceDiffSymbols(diff)
		expect(processed.timeRemaining).toBe(100)
	})

	test('should detect nested changes', () => {
		DebugLogger.setCurrentTest('compute-diff-nested')
		const newState = {
			...sampleState,
			players: [
				{
					...sampleState.players[0],
					position: { x: 95.5, y: 103.3 }
				}
			]
		}
		const diff = GameState.computeDiff(newState, sampleState)
		const processed = replaceDiffSymbols(diff)
		expect(processed.players[0].position.x).toBe(95.5)
		expect(processed.players[0].position.y).toBe(103.3)
		expect(processed.players).toHaveLength(1)
		expect(processed.players[0].health).toBe('NO_DIFF')
		expect(processed.timeRemaining).toBe('NO_DIFF')
		expect(processed.players[0].id).toBe('NO_DIFF')
		expect(processed.players[0].weapon).toBe('NO_DIFF')
		expect(processed.players[0].stealth).toBe('NO_DIFF')
	})
})
