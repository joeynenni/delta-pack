import { patchOptional } from '../.generated/schema'
import { DebugLogger } from '../../utils/debug'

describe('patchOptional', () => {
	test('should handle undefined patch', () => {
		DebugLogger.setCurrentTest('patch-optional-undefined')
		const base = { x: 1, y: 2 }
		const result = patchOptional(base, undefined, (a, b) => ({ ...a, ...b }) as { x: number; y: number })
		expect(result).toBeUndefined()
	})

	test('should handle undefined base', () => {
		DebugLogger.setCurrentTest('patch-optional-undefined-base')
		const patch = { x: 1, y: 2 }
		const result = patchOptional<{ x: number; y: number }>(undefined, patch, (a, b) => ({
			x: typeof b.x === 'number' ? b.x : a.x,
			y: typeof b.y === 'number' ? b.y : a.y
		}))
		expect(result).toEqual(patch)
	})

	test('should patch when both values exist', () => {
		DebugLogger.setCurrentTest('patch-optional-both-exist')
		const base = { x: 1, y: 2 }
		const patch = { y: 3 }
		const result = patchOptional(base, patch, (a, b) => ({
			x: typeof b.x === 'number' ? b.x : a.x,
			y: typeof b.y === 'number' ? b.y : a.y
		})) as { x: number; y: number }
		expect(result).toEqual({ x: 1, y: 3 })
	})
})
