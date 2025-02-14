import { GameState, NO_DIFF, DeepPartial } from './.generated/schema'
import { sampleState } from './utils/helpers'
import { DebugLogger } from '../utils/debug'

describe('patch', () => {
	test('should patch primitive values', () => {
		DebugLogger.setCurrentTest('patch-primitive')
		const base = { ...sampleState }
		const diff: DeepPartial<GameState> = {
			timeRemaining: 80,
			players: NO_DIFF
		}
		const patched = GameState.patch(base, diff)
		expect(patched.timeRemaining).toBe(80)
		expect(patched.players).toEqual(base.players)
	})

	test('should patch nested object values', () => {
		DebugLogger.setCurrentTest('patch-nested')
		const base = { ...sampleState }
		const diff: DeepPartial<GameState> = {
			timeRemaining: NO_DIFF,
			players: [
				{
					id: NO_DIFF,
					position: { x: 95.5, y: 103.3 },
					health: NO_DIFF,
					weapon: NO_DIFF,
					stealth: NO_DIFF
				}
			]
		}
		const patched = GameState.patch(base, diff)
		expect(patched.players[0].position).toEqual({ x: 95.5, y: 103.3 })
	})

	test('should not modify unpatched values', () => {
		DebugLogger.setCurrentTest('patch-unmodified')
		const base = { ...sampleState }
		const originalHealth = base.players[0].health
		const diff: DeepPartial<GameState> = {
			timeRemaining: NO_DIFF,
			players: [
				{
					id: NO_DIFF,
					position: { x: 95.5, y: 103.3 },
					health: NO_DIFF,
					weapon: NO_DIFF,
					stealth: NO_DIFF
				}
			]
		}
		const patched = GameState.patch(base, diff)
		expect(patched.timeRemaining).toBe(base.timeRemaining)
		expect(patched.players[0].health).toBe(originalHealth)
		expect(patched.players[0].position).toEqual({ x: 95.5, y: 103.3 })
	})
})
