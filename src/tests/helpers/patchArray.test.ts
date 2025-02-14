import { GameState, NO_DIFF, DeepPartial } from '../.generated/schema'
import { sampleState } from '../utils/helpers'
import { DebugLogger } from '../../utils/debug'

describe('patchArray', () => {
	test('should patch array elements individually', () => {
		DebugLogger.setCurrentTest('patch-array-elements')
		const base = [...sampleState.players]
		const diff: DeepPartial<GameState> = {
			timeRemaining: NO_DIFF,
			players: [
				{
					id: NO_DIFF,
					position: NO_DIFF,
					health: 85,
					weapon: NO_DIFF,
					stealth: NO_DIFF
				},
				NO_DIFF
			]
		}
		const patched = GameState.patch({ timeRemaining: 100, players: base }, diff).players
		expect(patched[0].health).toBe(85)
		expect(patched[0].position).toEqual(base[0].position)
		expect(patched[0].weapon).toEqual(base[0].weapon)
		expect(patched[0].stealth).toBe(base[0].stealth)
		expect(patched[1]).toEqual(base[1])
	})

	test('should handle NO_DIFF values in array', () => {
		DebugLogger.setCurrentTest('patch-array-no-diff')
		const base = [...sampleState.players]
		const diff: DeepPartial<GameState> = {
			timeRemaining: NO_DIFF,
			players: [
				NO_DIFF,
				{
					id: NO_DIFF,
					position: NO_DIFF,
					health: 75,
					weapon: NO_DIFF,
					stealth: NO_DIFF
				}
			]
		}
		const patched = GameState.patch({ timeRemaining: 100, players: base }, diff).players
		expect(patched[0].health).toBe(base[0].health)
		expect(patched[1].health).toBe(75)
	})
})
